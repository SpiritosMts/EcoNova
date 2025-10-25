"""
Training script for Factory Sensor Prediction Model
"""

import os
import sys
import argparse
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
from sensor_predictor import SensorPredictor, generate_synthetic_sensor_data


def plot_training_history(history, save_path='sensor_training_history.png'):
    """Plot and save training metrics"""
    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    
    # Loss
    axes[0].plot(history.history['loss'], label='Train Loss', linewidth=2)
    axes[0].plot(history.history['val_loss'], label='Val Loss', linewidth=2)
    axes[0].set_title('Model Loss (MSE)', fontsize=14, fontweight='bold')
    axes[0].set_xlabel('Epoch', fontsize=12)
    axes[0].set_ylabel('Loss', fontsize=12)
    axes[0].legend(fontsize=10)
    axes[0].grid(True, alpha=0.3)
    
    # MAE
    axes[1].plot(history.history['mae'], label='Train MAE', linewidth=2)
    axes[1].plot(history.history['val_mae'], label='Val MAE', linewidth=2)
    axes[1].set_title('Mean Absolute Error', fontsize=14, fontweight='bold')
    axes[1].set_xlabel('Epoch', fontsize=12)
    axes[1].set_ylabel('MAE', fontsize=12)
    axes[1].legend(fontsize=10)
    axes[1].grid(True, alpha=0.3)
    
    # MSE
    axes[2].plot(history.history['mse'], label='Train MSE', linewidth=2)
    axes[2].plot(history.history['val_mse'], label='Val MSE', linewidth=2)
    axes[2].set_title('Mean Squared Error', fontsize=14, fontweight='bold')
    axes[2].set_xlabel('Epoch', fontsize=12)
    axes[2].set_ylabel('MSE', fontsize=12)
    axes[2].legend(fontsize=10)
    axes[2].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"Training history plot saved to {save_path}")
    plt.close()


def plot_predictions(y_true, y_pred, feature_names, save_path='predictions_sample.png'):
    """Plot sample predictions vs actual values"""
    n_features = y_true.shape[2]
    n_timesteps = y_true.shape[1]
    
    fig, axes = plt.subplots(n_features, 1, figsize=(14, 3*n_features))
    if n_features == 1:
        axes = [axes]
    
    # Plot first sample from test set
    sample_idx = 0
    timesteps = range(n_timesteps)
    
    for i, feature_name in enumerate(feature_names):
        axes[i].plot(timesteps, y_true[sample_idx, :, i], 
                    marker='o', label='Actual', linewidth=2, markersize=6)
        axes[i].plot(timesteps, y_pred[sample_idx, :, i], 
                    marker='s', label='Predicted', linewidth=2, markersize=6)
        axes[i].set_title(f'{feature_name} - Prediction vs Actual', 
                         fontsize=12, fontweight='bold')
        axes[i].set_xlabel('Timestep', fontsize=10)
        axes[i].set_ylabel('Value', fontsize=10)
        axes[i].legend(fontsize=9)
        axes[i].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"Predictions plot saved to {save_path}")
    plt.close()


def load_sensor_data(data_path):
    """Load sensor data from CSV file"""
    if data_path.endswith('.csv'):
        df = pd.read_csv(data_path, parse_dates=['timestamp'], index_col='timestamp')
    elif data_path.endswith('.json'):
        df = pd.read_json(data_path)
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df.set_index('timestamp', inplace=True)
    else:
        raise ValueError("Data file must be CSV or JSON format")
    
    return df


def main(args):
    """Main training function"""
    print("="*70)
    print("FACTORY SENSOR PREDICTION MODEL - TRAINING")
    print("="*70)
    print(f"\nTraining Parameters:")
    print(f"  - Data Source: {args.data_path if args.data_path else 'Synthetic Data'}")
    print(f"  - Sequence Length: {args.sequence_length}")
    print(f"  - Prediction Horizon: {args.prediction_horizon}")
    print(f"  - Epochs: {args.epochs}")
    print(f"  - Batch Size: {args.batch_size}")
    print(f"  - Learning Rate: {args.learning_rate}")
    print(f"  - LSTM Units: {args.lstm_units}")
    print(f"  - Attention: {args.attention}")
    print()
    
    # Load or generate data
    if args.data_path and os.path.exists(args.data_path):
        print(f"Loading sensor data from {args.data_path}...")
        sensor_data = load_sensor_data(args.data_path)
    else:
        if args.data_path:
            print(f"WARNING: Data file not found: {args.data_path}")
        print("Generating synthetic sensor data for demonstration...")
        sensor_data = generate_synthetic_sensor_data(
            n_samples=args.synthetic_samples,
            n_features=args.synthetic_features
        )
    
    print(f"\nData loaded:")
    print(f"  - Total timesteps: {len(sensor_data)}")
    print(f"  - Number of sensors: {sensor_data.shape[1]}")
    print(f"  - Sensors: {', '.join(sensor_data.columns)}")
    print(f"  - Date range: {sensor_data.index[0]} to {sensor_data.index[-1]}")
    print(f"\nData preview:")
    print(sensor_data.head())
    print(f"\nData statistics:")
    print(sensor_data.describe())
    
    # Initialize predictor
    print("\n" + "-"*70)
    print("Initializing Sensor Predictor...")
    predictor = SensorPredictor(
        sequence_length=args.sequence_length,
        prediction_horizon=args.prediction_horizon,
        num_features=sensor_data.shape[1]
    )
    
    # Prepare data
    print("Preparing training data...")
    X, y = predictor.prepare_data(sensor_data, scale=True)
    print(f"  - Input shape: {X.shape}")
    print(f"  - Output shape: {y.shape}")
    
    # Split data
    train_size = int(len(X) * args.train_split)
    X_train, X_val = X[:train_size], X[train_size:]
    y_train, y_val = y[:train_size], y[train_size:]
    
    print(f"\nData split:")
    print(f"  - Training samples: {len(X_train)}")
    print(f"  - Validation samples: {len(X_val)}")
    
    # Build model
    print("\nBuilding LSTM model...")
    lstm_units = [int(x) for x in args.lstm_units.split(',')]
    predictor.build_model(
        lstm_units=lstm_units,
        dropout_rate=args.dropout,
        attention=args.attention
    )
    predictor.compile_model(learning_rate=args.learning_rate)
    
    # Print model summary
    print("\nModel Architecture:")
    predictor.get_model_summary()
    
    # Start training
    print("\n" + "="*70)
    print("STARTING TRAINING...")
    print("="*70 + "\n")
    
    start_time = datetime.now()
    
    history = predictor.train(
        X_train, y_train,
        X_val, y_val,
        epochs=args.epochs,
        batch_size=args.batch_size
    )
    
    end_time = datetime.now()
    training_duration = end_time - start_time
    
    print("\n" + "="*70)
    print("TRAINING COMPLETED")
    print("="*70)
    print(f"Training Duration: {training_duration}")
    
    # Print final metrics
    final_train_loss = history.history['loss'][-1]
    final_val_loss = history.history['val_loss'][-1]
    final_train_mae = history.history['mae'][-1]
    final_val_mae = history.history['val_mae'][-1]
    
    print(f"\nFinal Metrics:")
    print(f"  - Training Loss (MSE): {final_train_loss:.6f}")
    print(f"  - Validation Loss (MSE): {final_val_loss:.6f}")
    print(f"  - Training MAE: {final_train_mae:.6f}")
    print(f"  - Validation MAE: {final_val_mae:.6f}")
    print(f"  - RMSE: {np.sqrt(final_val_loss):.6f}")
    
    # Evaluate on validation set
    print("\nEvaluating on validation set...")
    eval_results = predictor.evaluate(X_val, y_val)
    print(f"  - Loss: {eval_results['loss']:.6f}")
    print(f"  - MAE: {eval_results['mae']:.6f}")
    print(f"  - RMSE: {eval_results['rmse']:.6f}")
    
    # Generate predictions for visualization
    print("\nGenerating sample predictions...")
    y_pred = predictor.model.predict(X_val[:10])
    plot_predictions(y_val[:10], y_pred, predictor.feature_names,
                    save_path='sensor_predictions_sample.png')
    
    # Save model
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    model_filename = f"sensor_predictor_{timestamp}.h5"
    scaler_filename = f"sensor_scaler_{timestamp}.pkl"
    config_filename = f"sensor_config_{timestamp}.json"
    
    print(f"\nSaving model...")
    predictor.save_model(
        model_path=model_filename,
        scaler_path=scaler_filename,
        config_path=config_filename
    )
    
    # Plot training history
    print("Generating training history plots...")
    plot_training_history(history, save_path='sensor_training_history.png')
    
    print("\n" + "="*70)
    print("ALL DONE!")
    print("="*70)
    print(f"\nFiles saved:")
    print(f"  - Model: {model_filename}")
    print(f"  - Scaler: {scaler_filename}")
    print(f"  - Config: {config_filename}")
    print(f"  - Best model: sensor_predictor_best.h5")
    print(f"  - Training plot: sensor_training_history.png")
    print(f"  - Predictions plot: sensor_predictions_sample.png")
    print()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Train Factory Sensor Prediction Model')
    
    parser.add_argument(
        '--data_path',
        type=str,
        default=None,
        help='Path to sensor data CSV or JSON file'
    )
    
    parser.add_argument(
        '--sequence_length',
        type=int,
        default=24,
        help='Number of historical timesteps to use (default: 24)'
    )
    
    parser.add_argument(
        '--prediction_horizon',
        type=int,
        default=12,
        help='Number of future timesteps to predict (default: 12)'
    )
    
    parser.add_argument(
        '--epochs',
        type=int,
        default=100,
        help='Number of training epochs (default: 100)'
    )
    
    parser.add_argument(
        '--batch_size',
        type=int,
        default=32,
        help='Batch size for training (default: 32)'
    )
    
    parser.add_argument(
        '--learning_rate',
        type=float,
        default=0.001,
        help='Learning rate (default: 0.001)'
    )
    
    parser.add_argument(
        '--lstm_units',
        type=str,
        default='128,64',
        help='LSTM units per layer, comma-separated (default: 128,64)'
    )
    
    parser.add_argument(
        '--dropout',
        type=float,
        default=0.2,
        help='Dropout rate (default: 0.2)'
    )
    
    parser.add_argument(
        '--attention',
        action='store_true',
        default=True,
        help='Use attention mechanism (default: True)'
    )
    
    parser.add_argument(
        '--no_attention',
        dest='attention',
        action='store_false',
        help='Disable attention mechanism'
    )
    
    parser.add_argument(
        '--train_split',
        type=float,
        default=0.8,
        help='Training data split ratio (default: 0.8)'
    )
    
    parser.add_argument(
        '--synthetic_samples',
        type=int,
        default=2000,
        help='Number of synthetic samples to generate if no data file (default: 2000)'
    )
    
    parser.add_argument(
        '--synthetic_features',
        type=int,
        default=5,
        help='Number of synthetic features to generate if no data file (default: 5)'
    )
    
    args = parser.parse_args()
    main(args)
