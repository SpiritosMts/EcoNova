"""
Inference script for Factory Sensor Prediction Model
Predict future sensor readings from historical data
"""

import os
import sys
import argparse
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
from sensor_predictor import SensorPredictor


def plot_predictions(historical_data, predictions_df, sensor_name=None, save_path=None):
    """
    Plot historical data and predictions
    
    Args:
        historical_data: DataFrame with historical sensor data
        predictions_df: DataFrame with predicted sensor data
        sensor_name: Specific sensor to plot (None = plot all)
        save_path: Path to save plot
    """
    if sensor_name:
        sensors = [sensor_name]
    else:
        sensors = predictions_df.columns.tolist()
    
    n_sensors = len(sensors)
    fig, axes = plt.subplots(n_sensors, 1, figsize=(14, 4*n_sensors))
    
    if n_sensors == 1:
        axes = [axes]
    
    for i, sensor in enumerate(sensors):
        # Plot historical data
        axes[i].plot(historical_data.index, historical_data[sensor],
                    label='Historical', linewidth=2, marker='o', markersize=3,
                    color='#2E86AB', alpha=0.8)
        
        # Plot predictions
        axes[i].plot(predictions_df.index, predictions_df[sensor],
                    label='Predicted', linewidth=2, marker='s', markersize=4,
                    color='#A23B72', linestyle='--')
        
        # Add vertical line to separate historical and predicted
        axes[i].axvline(x=historical_data.index[-1], color='red', 
                       linestyle=':', linewidth=2, alpha=0.5, label='Prediction Start')
        
        axes[i].set_title(f'{sensor} - Historical & Predicted Values', 
                         fontsize=13, fontweight='bold')
        axes[i].set_xlabel('Timestamp', fontsize=11)
        axes[i].set_ylabel('Value', fontsize=11)
        axes[i].legend(fontsize=10, loc='best')
        axes[i].grid(True, alpha=0.3)
        
        # Rotate x-axis labels
        plt.setp(axes[i].xaxis.get_majorticklabels(), rotation=45, ha='right')
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"\nPrediction plot saved to: {save_path}")
    else:
        plt.show()
    
    plt.close()


def load_sensor_data(data_path):
    """Load sensor data from CSV or JSON file"""
    if data_path.endswith('.csv'):
        df = pd.read_csv(data_path)
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df.set_index('timestamp', inplace=True)
    elif data_path.endswith('.json'):
        df = pd.read_json(data_path)
        if 'timestamp' in df.columns:
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df.set_index('timestamp', inplace=True)
    else:
        raise ValueError("Data file must be CSV or JSON format")
    
    return df


def main(args):
    """Main prediction function"""
    print("="*70)
    print("FACTORY SENSOR PREDICTION - INFERENCE")
    print("="*70)
    
    # Check if model files exist
    if not os.path.exists(args.model_path):
        print(f"\nERROR: Model file not found: {args.model_path}")
        sys.exit(1)
    if not os.path.exists(args.config_path):
        print(f"\nERROR: Config file not found: {args.config_path}")
        sys.exit(1)
    
    # Load predictor
    print(f"\nLoading model...")
    print(f"  - Model: {args.model_path}")
    print(f"  - Scaler: {args.scaler_path}")
    print(f"  - Config: {args.config_path}")
    
    predictor = SensorPredictor()
    predictor.load_model(
        model_path=args.model_path,
        scaler_path=args.scaler_path,
        config_path=args.config_path
    )
    
    print("\n✓ Model loaded successfully!")
    print(f"\nModel Configuration:")
    print(f"  - Sequence Length: {predictor.sequence_length} timesteps")
    print(f"  - Prediction Horizon: {predictor.prediction_horizon} timesteps")
    print(f"  - Number of Features: {predictor.num_features}")
    print(f"  - Features: {', '.join(predictor.feature_names)}")
    
    # Load recent sensor data
    print(f"\nLoading recent sensor data from: {args.data_path}")
    sensor_data = load_sensor_data(args.data_path)
    
    print(f"\nData loaded:")
    print(f"  - Total timesteps: {len(sensor_data)}")
    print(f"  - Sensors: {', '.join(sensor_data.columns)}")
    print(f"  - Date range: {sensor_data.index[0]} to {sensor_data.index[-1]}")
    
    # Check if we have enough data
    if len(sensor_data) < predictor.sequence_length:
        print(f"\nERROR: Insufficient data!")
        print(f"Need at least {predictor.sequence_length} timesteps, but got {len(sensor_data)}")
        sys.exit(1)
    
    # Use last N timesteps for prediction
    recent_data = sensor_data.tail(predictor.sequence_length)
    
    print(f"\nUsing last {predictor.sequence_length} timesteps for prediction:")
    print(f"  From: {recent_data.index[0]}")
    print(f"  To: {recent_data.index[-1]}")
    
    # Make prediction
    print(f"\nPredicting next {args.steps_ahead or predictor.prediction_horizon} timesteps...")
    
    predictions_df = predictor.predict_with_timestamps(
        recent_data=recent_data,
        timestamps=recent_data.index,
        future_steps=args.steps_ahead
    )
    
    print("\n✓ Prediction complete!")
    print("\nPredicted Values:")
    print("-" * 70)
    print(predictions_df.to_string())
    
    # Print statistics
    print("\nPrediction Statistics:")
    print("-" * 70)
    print(predictions_df.describe())
    
    # Save predictions
    if args.save_results:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Save as CSV
        csv_file = f"sensor_predictions_{timestamp}.csv"
        predictions_df.to_csv(csv_file)
        print(f"\nPredictions saved to: {csv_file}")
        
        # Save as JSON
        json_file = f"sensor_predictions_{timestamp}.json"
        predictions_dict = {
            'prediction_timestamp': timestamp,
            'model_info': {
                'sequence_length': predictor.sequence_length,
                'prediction_horizon': predictor.prediction_horizon,
                'features': predictor.feature_names
            },
            'historical_period': {
                'start': str(recent_data.index[0]),
                'end': str(recent_data.index[-1])
            },
            'prediction_period': {
                'start': str(predictions_df.index[0]),
                'end': str(predictions_df.index[-1])
            },
            'predictions': predictions_df.to_dict(orient='index')
        }
        
        with open(json_file, 'w') as f:
            json.dump(predictions_dict, f, indent=2, default=str)
        
        print(f"Predictions saved to: {json_file}")
    
    # Generate plot
    if args.plot:
        print("\nGenerating prediction plot...")
        plot_path = f"sensor_predictions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        plot_predictions(
            historical_data=recent_data,
            predictions_df=predictions_df,
            sensor_name=args.plot_sensor,
            save_path=plot_path
        )
    
    # Print summary
    print("\n" + "="*70)
    print("PREDICTION COMPLETE!")
    print("="*70)
    
    # Show trends
    print("\nTrend Analysis:")
    print("-" * 70)
    for feature in predictor.feature_names:
        last_actual = recent_data[feature].iloc[-1]
        first_pred = predictions_df[feature].iloc[0]
        last_pred = predictions_df[feature].iloc[-1]
        
        trend = "↑" if last_pred > last_actual else "↓" if last_pred < last_actual else "→"
        change = ((last_pred - last_actual) / last_actual) * 100
        
        print(f"{feature:20s}: {last_actual:8.2f} → {last_pred:8.2f} {trend} ({change:+.2f}%)")
    
    print()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Predict future factory sensor readings',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Basic prediction
  python predict_sensors.py --data sensor_data.csv
  
  # Predict 24 steps ahead with custom model
  python predict_sensors.py --data sensor_data.csv --model my_model.h5 --steps 24
  
  # Generate plot
  python predict_sensors.py --data sensor_data.csv --plot
        """
    )
    
    parser.add_argument(
        '--model_path',
        type=str,
        default='sensor_predictor_model.h5',
        help='Path to trained model file (default: sensor_predictor_model.h5)'
    )
    
    parser.add_argument(
        '--scaler_path',
        type=str,
        default='sensor_scaler.pkl',
        help='Path to scaler file (default: sensor_scaler.pkl)'
    )
    
    parser.add_argument(
        '--config_path',
        type=str,
        default='sensor_config.json',
        help='Path to config file (default: sensor_config.json)'
    )
    
    parser.add_argument(
        '--data_path',
        type=str,
        required=True,
        help='Path to recent sensor data CSV or JSON file'
    )
    
    parser.add_argument(
        '--steps_ahead',
        type=int,
        default=None,
        help='Number of timesteps to predict (default: use model prediction_horizon)'
    )
    
    parser.add_argument(
        '--save_results',
        action='store_true',
        default=True,
        help='Save prediction results to files (default: True)'
    )
    
    parser.add_argument(
        '--no_save',
        dest='save_results',
        action='store_false',
        help='Do not save prediction results'
    )
    
    parser.add_argument(
        '--plot',
        action='store_true',
        default=True,
        help='Generate prediction plot (default: True)'
    )
    
    parser.add_argument(
        '--no_plot',
        dest='plot',
        action='store_false',
        help='Do not generate plot'
    )
    
    parser.add_argument(
        '--plot_sensor',
        type=str,
        default=None,
        help='Specific sensor to plot (default: plot all)'
    )
    
    args = parser.parse_args()
    main(args)
