"""
Factory Sensor Data Prediction Model
Predicts future sensor readings using LSTM neural networks
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
import pickle
import json
from datetime import datetime, timedelta


class SensorPredictor:
    """
    LSTM-based time series model for predicting factory sensor data
    Supports multiple sensor types: temperature, humidity, CO2, particulate matter, etc.
    """
    
    def __init__(self, sequence_length=24, prediction_horizon=12, num_features=None):
        """
        Args:
            sequence_length: Number of historical timesteps to use (e.g., 24 hours)
            prediction_horizon: Number of future timesteps to predict (e.g., 12 hours)
            num_features: Number of sensor features (auto-detected from data if None)
        """
        self.sequence_length = sequence_length
        self.prediction_horizon = prediction_horizon
        self.num_features = num_features
        self.model = None
        self.scaler = None
        self.feature_names = []
        
    def build_model(self, lstm_units=[128, 64], dropout_rate=0.2, attention=True):
        """
        Build LSTM model for time series prediction
        
        Args:
            lstm_units: List of units for each LSTM layer
            dropout_rate: Dropout rate for regularization
            attention: Whether to use attention mechanism
        """
        if self.num_features is None:
            raise ValueError("num_features must be set before building model")
        
        inputs = layers.Input(shape=(self.sequence_length, self.num_features))
        x = inputs
        
        # Stacked LSTM layers
        for i, units in enumerate(lstm_units):
            return_sequences = (i < len(lstm_units) - 1) or attention
            x = layers.LSTM(units, return_sequences=return_sequences, dropout=dropout_rate)(x)
            x = layers.BatchNormalization()(x)
        
        # Optional attention mechanism
        if attention:
            attention_scores = layers.Dense(1, activation='tanh')(x)
            attention_weights = layers.Softmax(axis=1)(attention_scores)
            x = layers.Multiply()([x, attention_weights])
            x = layers.Lambda(lambda x: tf.reduce_sum(x, axis=1))(x)
        
        # Dense layers for prediction
        x = layers.Dense(256, activation='relu')(x)
        x = layers.Dropout(dropout_rate)(x)
        x = layers.Dense(128, activation='relu')(x)
        x = layers.Dropout(dropout_rate)(x)
        
        # Output layer: predict multiple timesteps for each feature
        outputs = layers.Dense(self.prediction_horizon * self.num_features)(x)
        outputs = layers.Reshape((self.prediction_horizon, self.num_features))(outputs)
        
        self.model = models.Model(inputs=inputs, outputs=outputs)
        return self.model
    
    def compile_model(self, learning_rate=0.001):
        """Compile the model"""
        if self.model is None:
            raise ValueError("Model must be built before compiling")
        
        self.model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
            loss='mse',
            metrics=['mae', 'mse']
        )
    
    def prepare_data(self, data, feature_columns=None, scale=True):
        """
        Prepare sensor data for training
        
        Args:
            data: DataFrame with sensor readings (rows=timestamps, cols=sensors)
            feature_columns: List of column names to use (None = use all numeric)
            scale: Whether to scale the data
            
        Returns:
            X, y arrays ready for training
        """
        if isinstance(data, pd.DataFrame):
            if feature_columns is None:
                feature_columns = data.select_dtypes(include=[np.number]).columns.tolist()
            
            self.feature_names = feature_columns
            data_array = data[feature_columns].values
        else:
            data_array = data
            if feature_columns:
                self.feature_names = feature_columns
        
        # Set num_features if not already set
        if self.num_features is None:
            self.num_features = data_array.shape[1]
        
        # Scale the data
        if scale:
            self.scaler = StandardScaler()
            data_scaled = self.scaler.fit_transform(data_array)
        else:
            data_scaled = data_array
        
        # Create sequences
        X, y = [], []
        for i in range(len(data_scaled) - self.sequence_length - self.prediction_horizon + 1):
            X.append(data_scaled[i:i + self.sequence_length])
            y.append(data_scaled[i + self.sequence_length:i + self.sequence_length + self.prediction_horizon])
        
        return np.array(X), np.array(y)
    
    def train(self, X_train, y_train, X_val, y_val, epochs=100, batch_size=32, callbacks=None):
        """Train the model"""
        if self.model is None:
            raise ValueError("Model must be built and compiled before training")
        
        if callbacks is None:
            callbacks = [
                keras.callbacks.EarlyStopping(
                    monitor='val_loss',
                    patience=15,
                    restore_best_weights=True
                ),
                keras.callbacks.ReduceLROnPlateau(
                    monitor='val_loss',
                    factor=0.5,
                    patience=7,
                    min_lr=1e-7
                ),
                keras.callbacks.ModelCheckpoint(
                    'sensor_predictor_best.h5',
                    monitor='val_loss',
                    save_best_only=True,
                    mode='min'
                )
            ]
        
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=1
        )
        
        return history
    
    def predict_future(self, recent_data, steps_ahead=None):
        """
        Predict future sensor readings
        
        Args:
            recent_data: Recent sensor data (last sequence_length timesteps)
            steps_ahead: Number of steps to predict (uses prediction_horizon if None)
            
        Returns:
            Predicted sensor readings
        """
        if self.model is None:
            raise ValueError("Model must be loaded before prediction")
        
        if steps_ahead is None:
            steps_ahead = self.prediction_horizon
        
        # Prepare input data
        if isinstance(recent_data, pd.DataFrame):
            recent_data = recent_data[self.feature_names].values
        
        if len(recent_data) < self.sequence_length:
            raise ValueError(f"Need at least {self.sequence_length} timesteps of recent data")
        
        # Take last sequence_length timesteps
        recent_data = recent_data[-self.sequence_length:]
        
        # Scale if scaler is available
        if self.scaler is not None:
            recent_data_scaled = self.scaler.transform(recent_data)
        else:
            recent_data_scaled = recent_data
        
        # Reshape for prediction
        input_data = np.expand_dims(recent_data_scaled, axis=0)
        
        # Make prediction
        predictions_scaled = self.model.predict(input_data, verbose=0)[0]
        
        # Inverse transform predictions
        if self.scaler is not None:
            predictions = self.scaler.inverse_transform(predictions_scaled)
        else:
            predictions = predictions_scaled
        
        # Return only requested steps
        return predictions[:steps_ahead]
    
    def predict_with_timestamps(self, recent_data, timestamps, future_steps=None):
        """
        Predict with timestamp information
        
        Args:
            recent_data: Recent sensor data
            timestamps: Timestamps for recent_data
            future_steps: Number of future steps to predict
            
        Returns:
            DataFrame with predictions and timestamps
        """
        predictions = self.predict_future(recent_data, future_steps)
        
        # Generate future timestamps
        last_timestamp = pd.to_datetime(timestamps[-1])
        time_delta = pd.to_datetime(timestamps[-1]) - pd.to_datetime(timestamps[-2])
        
        future_timestamps = [
            last_timestamp + (i + 1) * time_delta 
            for i in range(len(predictions))
        ]
        
        # Create DataFrame
        predictions_df = pd.DataFrame(
            predictions,
            columns=self.feature_names,
            index=future_timestamps
        )
        predictions_df.index.name = 'timestamp'
        
        return predictions_df
    
    def evaluate(self, X_test, y_test):
        """Evaluate model performance"""
        if self.model is None:
            raise ValueError("Model must be loaded before evaluation")
        
        metrics = self.model.evaluate(X_test, y_test, verbose=0)
        
        results = {
            'loss': metrics[0],
            'mae': metrics[1],
            'mse': metrics[2],
            'rmse': np.sqrt(metrics[2])
        }
        
        return results
    
    def save_model(self, model_path='sensor_predictor_model.h5', 
                   scaler_path='sensor_scaler.pkl',
                   config_path='sensor_config.json'):
        """Save model, scaler, and configuration"""
        if self.model is None:
            raise ValueError("No model to save")
        
        # Save model
        self.model.save(model_path)
        
        # Save scaler
        if self.scaler is not None:
            with open(scaler_path, 'wb') as f:
                pickle.dump(self.scaler, f)
        
        # Save configuration
        config = {
            'sequence_length': self.sequence_length,
            'prediction_horizon': self.prediction_horizon,
            'num_features': self.num_features,
            'feature_names': self.feature_names
        }
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"Model saved to {model_path}")
        print(f"Scaler saved to {scaler_path}")
        print(f"Config saved to {config_path}")
    
    def load_model(self, model_path='sensor_predictor_model.h5',
                   scaler_path='sensor_scaler.pkl',
                   config_path='sensor_config.json'):
        """Load model, scaler, and configuration"""
        # Load configuration
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        self.sequence_length = config['sequence_length']
        self.prediction_horizon = config['prediction_horizon']
        self.num_features = config['num_features']
        self.feature_names = config['feature_names']
        
        # Load model
        self.model = keras.models.load_model(model_path)
        
        # Load scaler
        try:
            with open(scaler_path, 'rb') as f:
                self.scaler = pickle.load(f)
        except FileNotFoundError:
            print("Warning: Scaler file not found")
        
        print(f"Model loaded from {model_path}")
    
    def get_model_summary(self):
        """Print model architecture summary"""
        if self.model is None:
            raise ValueError("Model must be built first")
        return self.model.summary()


# Utility function for creating synthetic sensor data (for testing)
def generate_synthetic_sensor_data(n_samples=1000, n_features=5, noise_level=0.1):
    """
    Generate synthetic factory sensor data for testing
    
    Args:
        n_samples: Number of timesteps
        n_features: Number of sensors
        noise_level: Amount of random noise
        
    Returns:
        DataFrame with synthetic sensor data
    """
    timestamps = pd.date_range(start='2024-01-01', periods=n_samples, freq='H')
    
    data = {}
    feature_names = ['temperature', 'humidity', 'co2', 'pm25', 'pressure'][:n_features]
    
    for i, feature in enumerate(feature_names):
        # Create base signal with trend and seasonality
        trend = np.linspace(20 + i*5, 25 + i*5, n_samples)
        seasonality = 5 * np.sin(2 * np.pi * np.arange(n_samples) / 24)
        noise = noise_level * np.random.randn(n_samples)
        
        data[feature] = trend + seasonality + noise
    
    df = pd.DataFrame(data, index=timestamps)
    return df


# Example usage
if __name__ == "__main__":
    print("="*60)
    print("Factory Sensor Prediction Model")
    print("="*60)
    
    # Generate synthetic data for demonstration
    print("\n1. Generating synthetic sensor data...")
    sensor_data = generate_synthetic_sensor_data(n_samples=1000, n_features=5)
    print(f"Generated {len(sensor_data)} timesteps with {sensor_data.shape[1]} sensors")
    print(f"Sensors: {', '.join(sensor_data.columns)}")
    
    # Initialize predictor
    print("\n2. Initializing sensor predictor...")
    predictor = SensorPredictor(
        sequence_length=24,  # Use 24 hours of history
        prediction_horizon=12,  # Predict 12 hours ahead
        num_features=5
    )
    
    # Build model
    print("\n3. Building LSTM model...")
    predictor.build_model(lstm_units=[128, 64], attention=True)
    predictor.compile_model(learning_rate=0.001)
    
    # Print model summary
    print("\n4. Model Architecture:")
    predictor.get_model_summary()
    
    print("\n" + "="*60)
    print("Model ready for training!")
    print("Expected input: Time series sensor data")
    print("Output: Future sensor readings prediction")
    print("="*60)
