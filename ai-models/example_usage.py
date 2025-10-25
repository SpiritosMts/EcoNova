"""
Example Usage of EcoNova AI Models

This script demonstrates how to use both pollution detection and sensor prediction models.
"""

from pollution_detector import PollutionDetector
from sensor_predictor import SensorPredictor, generate_synthetic_sensor_data
import pandas as pd
import numpy as np


def example_pollution_detection():
    """Example: Training and using pollution detection model"""
    print("="*70)
    print("EXAMPLE 1: POLLUTION DETECTION MODEL")
    print("="*70)
    
    # Initialize detector
    print("\n1. Initializing Pollution Detector...")
    detector = PollutionDetector(img_size=(224, 224), num_classes=3)
    
    # Build model
    print("2. Building model with transfer learning...")
    detector.build_model(pretrained=True)
    detector.compile_model(learning_rate=0.001)
    
    # Print summary
    print("\n3. Model Architecture:")
    detector.get_model_summary()
    
    print("\n" + "-"*70)
    print("TRAINING REQUIREMENTS:")
    print("-"*70)
    print("To train this model, you need:")
    print("  • Training images organized in directories:")
    print("    - data/train/air_pollution/")
    print("    - data/train/water_pollution/")
    print("    - data/train/waste_pollution/")
    print("  • Validation images in:")
    print("    - data/validation/air_pollution/")
    print("    - data/validation/water_pollution/")
    print("    - data/validation/waste_pollution/")
    print("\nThen run:")
    print("  python train_pollution_detector.py \\")
    print("      --train_dir data/train \\")
    print("      --val_dir data/validation \\")
    print("      --epochs 50")
    
    print("\n" + "-"*70)
    print("INFERENCE EXAMPLE:")
    print("-"*70)
    print("After training, predict pollution type:")
    print("  python predict_pollution.py \\")
    print("      --model_path pollution_detector_model.h5 \\")
    print("      --input image.jpg")
    
    print("\n" + "-"*70)
    print("PYTHON API EXAMPLE:")
    print("-"*70)
    print("""
# Load trained model
detector = PollutionDetector()
detector.load_model('pollution_detector_model.h5')

# Predict single image
result = detector.predict_image('pollution_image.jpg')
print(f"Type: {result['predicted_class']}")
print(f"Confidence: {result['confidence']:.2%}")

# Batch prediction
images = ['img1.jpg', 'img2.jpg', 'img3.jpg']
results = detector.predict_batch(images)
for r in results:
    print(f"{r['image_path']}: {r['predicted_class']}")
    """)


def example_sensor_prediction():
    """Example: Training and using sensor prediction model"""
    print("\n\n" + "="*70)
    print("EXAMPLE 2: SENSOR PREDICTION MODEL")
    print("="*70)
    
    # Generate synthetic data for demonstration
    print("\n1. Generating synthetic sensor data...")
    sensor_data = generate_synthetic_sensor_data(n_samples=500, n_features=5)
    print(f"   Generated {len(sensor_data)} timesteps")
    print(f"   Sensors: {', '.join(sensor_data.columns)}")
    
    # Initialize predictor
    print("\n2. Initializing Sensor Predictor...")
    predictor = SensorPredictor(
        sequence_length=24,  # Use 24 hours of history
        prediction_horizon=12,  # Predict 12 hours ahead
        num_features=5
    )
    
    # Build model
    print("3. Building LSTM model with attention...")
    predictor.build_model(lstm_units=[128, 64], attention=True)
    predictor.compile_model(learning_rate=0.001)
    
    # Print summary
    print("\n4. Model Architecture:")
    predictor.get_model_summary()
    
    # Prepare data
    print("\n5. Preparing training data...")
    X, y = predictor.prepare_data(sensor_data, scale=True)
    print(f"   Input shape: {X.shape}")
    print(f"   Output shape: {y.shape}")
    
    # Split data
    train_size = int(len(X) * 0.8)
    X_train, X_val = X[:train_size], X[train_size:]
    y_train, y_val = y[:train_size], y[train_size:]
    print(f"   Training samples: {len(X_train)}")
    print(f"   Validation samples: {len(X_val)}")
    
    print("\n" + "-"*70)
    print("TRAINING INSTRUCTIONS:")
    print("-"*70)
    print("To train with your own sensor data:")
    print("\n1. Prepare CSV file with format:")
    print("   timestamp,temperature,humidity,co2,pm25,pressure")
    print("   2024-01-01 00:00:00,22.5,45.3,400,12.3,1013.2")
    print("   ...")
    print("\n2. Run training:")
    print("   python train_sensor_predictor.py \\")
    print("       --data_path sensor_data.csv \\")
    print("       --sequence_length 24 \\")
    print("       --prediction_horizon 12 \\")
    print("       --epochs 100")
    
    print("\n" + "-"*70)
    print("INFERENCE EXAMPLE:")
    print("-"*70)
    print("After training, predict future sensor readings:")
    print("   python predict_sensors.py \\")
    print("       --model_path sensor_predictor_model.h5 \\")
    print("       --data_path recent_sensor_data.csv \\")
    print("       --steps_ahead 24")
    
    print("\n" + "-"*70)
    print("PYTHON API EXAMPLE:")
    print("-"*70)
    print("""
# Load trained model
predictor = SensorPredictor()
predictor.load_model(
    model_path='sensor_predictor_model.h5',
    scaler_path='sensor_scaler.pkl',
    config_path='sensor_config.json'
)

# Load recent data
recent_data = pd.read_csv('recent_data.csv', 
                         parse_dates=['timestamp'],
                         index_col='timestamp')

# Predict future values
predictions = predictor.predict_with_timestamps(
    recent_data=recent_data.tail(24),
    timestamps=recent_data.tail(24).index,
    future_steps=12
)

print("Future predictions:")
print(predictions)
    """)
    
    # Example prediction (if we had trained model)
    print("\n" + "-"*70)
    print("DEMO PREDICTION:")
    print("-"*70)
    print("Making a prediction with the current (untrained) model...")
    print("Note: This is just for demonstration - predictions won't be accurate")
    print("      until the model is properly trained!")
    
    try:
        # Get recent data
        recent_data = sensor_data.tail(predictor.sequence_length)
        
        # Make prediction
        predictions = predictor.predict_future(recent_data, steps_ahead=6)
        
        print("\nPredicted next 6 timesteps:")
        pred_df = pd.DataFrame(
            predictions,
            columns=predictor.feature_names
        )
        print(pred_df.to_string())
        
    except Exception as e:
        print(f"Could not make demo prediction: {e}")


def example_integration():
    """Example: How to integrate models into your application"""
    print("\n\n" + "="*70)
    print("EXAMPLE 3: INTEGRATION INTO APPLICATION")
    print("="*70)
    
    print("""
# Example Flask API endpoint for pollution detection
from flask import Flask, request, jsonify
from pollution_detector import PollutionDetector

app = Flask(__name__)
detector = PollutionDetector()
detector.load_model('pollution_detector_model.h5')

@app.route('/api/detect-pollution', methods=['POST'])
def detect_pollution():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image_file = request.files['image']
    image_path = f'/tmp/{image_file.filename}'
    image_file.save(image_path)
    
    result = detector.predict_image(image_path)
    
    return jsonify({
        'pollution_type': result['predicted_class'],
        'confidence': result['confidence'],
        'probabilities': result['all_probabilities']
    })

# Example sensor prediction endpoint
from sensor_predictor import SensorPredictor
import pandas as pd

predictor = SensorPredictor()
predictor.load_model(
    model_path='sensor_predictor_model.h5',
    scaler_path='sensor_scaler.pkl',
    config_path='sensor_config.json'
)

@app.route('/api/predict-sensors', methods=['POST'])
def predict_sensors():
    data = request.get_json()
    
    # Convert JSON to DataFrame
    df = pd.DataFrame(data['sensor_readings'])
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.set_index('timestamp', inplace=True)
    
    # Make prediction
    predictions = predictor.predict_with_timestamps(
        recent_data=df.tail(predictor.sequence_length),
        timestamps=df.tail(predictor.sequence_length).index,
        future_steps=data.get('steps_ahead', 12)
    )
    
    return jsonify({
        'predictions': predictions.to_dict(orient='index')
    })

if __name__ == '__main__':
    app.run(debug=True)
    """)


def main():
    """Run all examples"""
    print("\n")
    print("="*70)
    print(" "*15 + "ECONOVA AI MODELS - EXAMPLES")
    print("="*70)
    print("\nThis script demonstrates how to use the EcoNova AI models.")
    print("Follow along to learn about:")
    print("  1. Pollution Detection Model (Image Classification)")
    print("  2. Sensor Prediction Model (Time Series Forecasting)")
    print("  3. Integration into Applications")
    print()
    
    try:
        # Example 1: Pollution Detection
        example_pollution_detection()
        
        # Example 2: Sensor Prediction
        example_sensor_prediction()
        
        # Example 3: Integration
        example_integration()
        
        # Summary
        print("\n\n" + "="*70)
        print("SUMMARY")
        print("="*70)
        print("""
Key Takeaways:

1. Pollution Detection:
   ✓ CNN-based image classifier
   ✓ Detects air, water, and waste pollution
   ✓ Uses transfer learning with MobileNetV2
   ✓ Easy to train and deploy

2. Sensor Prediction:
   ✓ LSTM-based time series forecaster
   ✓ Predicts future sensor readings
   ✓ Uses attention mechanism for better accuracy
   ✓ Handles multiple sensors simultaneously

3. Quick Start:
   ✓ Install: pip install -r requirements.txt
   ✓ Prepare data: python prepare_data.py
   ✓ Train models: python train_*.py
   ✓ Make predictions: python predict_*.py

4. Production Use:
   ✓ Models can be integrated into Flask/FastAPI
   ✓ Support batch and real-time predictions
   ✓ Easy to deploy with Docker

For more details, see README.md
        """)
        
    except Exception as e:
        print(f"\nError running examples: {e}")
        print("Make sure all dependencies are installed:")
        print("  pip install -r requirements.txt")


if __name__ == "__main__":
    main()
