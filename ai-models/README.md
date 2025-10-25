# EcoNova AI Models

This directory contains AI/ML models for the EcoNova platform, focusing on environmental monitoring and prediction.

## 📋 Overview

Two main AI models are provided:

1. **Pollution Detection Model** - CNN-based image classifier that identifies pollution types
2. **Sensor Prediction Model** - LSTM-based time series predictor for factory sensor data

---

## 🚀 Quick Start

### Installation

```bash
# Install required dependencies
pip install -r requirements.txt
```

### Requirements

- Python 3.8+
- TensorFlow 2.13+
- See `requirements.txt` for full list

---

## 🖼️ Pollution Detection Model

### Description

A Convolutional Neural Network (CNN) that classifies images into three pollution types:
- **Air Pollution** - Smog, smoke, emissions
- **Water Pollution** - Contaminated water bodies
- **Waste Pollution** - Garbage, landfills, litter

### Architecture

- Base: MobileNetV2 (pre-trained on ImageNet) for transfer learning
- Custom classification head with dropout and batch normalization
- Input: 224x224 RGB images
- Output: 3 classes with softmax activation

### Training

#### Data Structure

Organize your training data as follows:

```
data/
├── train/
│   ├── air_pollution/
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
│   ├── water_pollution/
│   │   └── ...
│   └── waste_pollution/
│       └── ...
└── validation/
    ├── air_pollution/
    ├── water_pollution/
    └── waste_pollution/
```

#### Train the Model

```bash
python train_pollution_detector.py \
    --train_dir ./data/train \
    --val_dir ./data/validation \
    --epochs 50 \
    --batch_size 32 \
    --learning_rate 0.001
```

#### Training Options

```bash
--train_dir          # Path to training data directory (required)
--val_dir            # Path to validation data directory (required)
--epochs             # Number of training epochs (default: 50)
--batch_size         # Batch size (default: 32)
--learning_rate      # Learning rate (default: 0.001)
--img_size           # Image size in pixels (default: 224)
--pretrained         # Use pretrained weights (default: True)
--no_pretrained      # Train from scratch
```

### Inference

#### Single Image Prediction

```bash
python predict_pollution.py \
    --model_path pollution_detector_model.h5 \
    --input image.jpg
```

#### Batch Prediction

```bash
python predict_pollution.py \
    --model_path pollution_detector_model.h5 \
    --input ./images_directory/
```

#### Prediction Options

```bash
--model_path             # Path to trained model (default: pollution_detector_model.h5)
--input                  # Image file or directory (required)
--confidence_threshold   # Minimum confidence (default: 0.6)
--save_results          # Save to JSON (default: True)
--no_save               # Don't save results
```

### Python API

```python
from pollution_detector import PollutionDetector

# Initialize and load model
detector = PollutionDetector()
detector.load_model('pollution_detector_model.h5')

# Predict single image
result = detector.predict_image('image.jpg')
print(f"Predicted: {result['predicted_class']}")
print(f"Confidence: {result['confidence']:.2%}")

# Batch prediction
results = detector.predict_batch(['img1.jpg', 'img2.jpg'])
```

---

## 📊 Sensor Prediction Model

### Description

An LSTM-based time series model that predicts future factory sensor readings. Supports multiple sensor types:
- Temperature
- Humidity
- CO2 levels
- Particulate Matter (PM2.5)
- Pressure
- Custom sensors

### Architecture

- Stacked LSTM layers with attention mechanism
- Batch normalization and dropout for regularization
- Dense output layers for multi-step prediction
- StandardScaler for data normalization

### Training

#### Data Format

Sensor data should be in CSV or JSON format:

**CSV Format:**
```csv
timestamp,temperature,humidity,co2,pm25,pressure
2024-01-01 00:00:00,22.5,45.3,400,12.3,1013.2
2024-01-01 01:00:00,22.8,44.1,405,11.8,1013.5
...
```

**JSON Format:**
```json
{
  "timestamp": ["2024-01-01 00:00:00", "2024-01-01 01:00:00", ...],
  "temperature": [22.5, 22.8, ...],
  "humidity": [45.3, 44.1, ...],
  ...
}
```

#### Train the Model

```bash
# Train with real data
python train_sensor_predictor.py \
    --data_path sensor_data.csv \
    --sequence_length 24 \
    --prediction_horizon 12 \
    --epochs 100 \
    --batch_size 32

# Train with synthetic data (for testing)
python train_sensor_predictor.py \
    --sequence_length 24 \
    --prediction_horizon 12 \
    --synthetic_samples 2000 \
    --synthetic_features 5
```

#### Training Options

```bash
--data_path              # Path to sensor data CSV/JSON
--sequence_length        # Historical timesteps to use (default: 24)
--prediction_horizon     # Future timesteps to predict (default: 12)
--epochs                 # Training epochs (default: 100)
--batch_size            # Batch size (default: 32)
--learning_rate         # Learning rate (default: 0.001)
--lstm_units            # LSTM units per layer (default: 128,64)
--dropout               # Dropout rate (default: 0.2)
--attention             # Use attention mechanism (default: True)
--no_attention          # Disable attention
--train_split           # Train/val split ratio (default: 0.8)
--synthetic_samples     # Synthetic data samples (default: 2000)
--synthetic_features    # Synthetic features count (default: 5)
```

### Inference

```bash
python predict_sensors.py \
    --model_path sensor_predictor_model.h5 \
    --scaler_path sensor_scaler.pkl \
    --config_path sensor_config.json \
    --data_path recent_sensor_data.csv \
    --steps_ahead 24
```

#### Prediction Options

```bash
--model_path     # Path to trained model (default: sensor_predictor_model.h5)
--scaler_path    # Path to scaler file (default: sensor_scaler.pkl)
--config_path    # Path to config file (default: sensor_config.json)
--data_path      # Recent sensor data CSV/JSON (required)
--steps_ahead    # Timesteps to predict (default: model's prediction_horizon)
--save_results   # Save results to files (default: True)
--no_save        # Don't save results
--plot           # Generate prediction plot (default: True)
--no_plot        # Don't generate plot
--plot_sensor    # Specific sensor to plot (default: all)
```

### Python API

```python
from sensor_predictor import SensorPredictor
import pandas as pd

# Initialize and load model
predictor = SensorPredictor()
predictor.load_model(
    model_path='sensor_predictor_model.h5',
    scaler_path='sensor_scaler.pkl',
    config_path='sensor_config.json'
)

# Load recent data
recent_data = pd.read_csv('recent_sensor_data.csv', 
                         parse_dates=['timestamp'], 
                         index_col='timestamp')

# Predict future values
predictions = predictor.predict_with_timestamps(
    recent_data=recent_data.tail(24),
    timestamps=recent_data.tail(24).index,
    future_steps=12
)

print(predictions)
```

---

## 📁 File Structure

```
ai-models/
├── README.md                          # This file
├── requirements.txt                   # Python dependencies
│
├── pollution_detector.py              # Pollution detection model class
├── train_pollution_detector.py        # Training script for pollution detector
├── predict_pollution.py               # Inference script for pollution detector
│
├── sensor_predictor.py                # Sensor prediction model class
├── train_sensor_predictor.py          # Training script for sensor predictor
├── predict_sensors.py                 # Inference script for sensor predictor
│
└── [Generated files]
    ├── pollution_detector_model.h5    # Trained pollution model
    ├── sensor_predictor_model.h5      # Trained sensor model
    ├── sensor_scaler.pkl              # Data scaler for sensors
    ├── sensor_config.json             # Sensor model config
    └── *.png                          # Training plots & predictions
```

---

## 🔧 Model Configuration

### Pollution Detector

```python
PollutionDetector(
    img_size=(224, 224),  # Input image dimensions
    num_classes=3          # Number of pollution types
)
```

### Sensor Predictor

```python
SensorPredictor(
    sequence_length=24,      # Use 24 hours of history
    prediction_horizon=12,   # Predict 12 hours ahead
    num_features=5           # Number of sensor types
)
```

---

## 📈 Model Performance Tips

### Pollution Detection

1. **Data Quality**: Use clear, well-lit images with visible pollution
2. **Data Augmentation**: Built-in augmentation helps model generalization
3. **Class Balance**: Ensure roughly equal samples per class
4. **Fine-tuning**: Start with pretrained weights, then fine-tune
5. **Validation**: Use separate validation set from different sources

### Sensor Prediction

1. **Data Consistency**: Ensure regular time intervals (hourly, daily, etc.)
2. **Missing Values**: Handle missing data before training
3. **Sequence Length**: Longer sequences capture more patterns but increase computation
4. **Scaling**: Always use StandardScaler for time series data
5. **Early Stopping**: Use patience=10-15 to prevent overfitting

---

## 🎯 Use Cases

### Pollution Detection

- **Mobile App**: Citizens report pollution by uploading photos
- **Factory Monitoring**: Automated detection from surveillance cameras
- **Compliance**: Track pollution types over time
- **Alert System**: Trigger alerts when specific pollution detected

### Sensor Prediction

- **Preventive Maintenance**: Predict sensor anomalies before failure
- **Resource Planning**: Forecast future environmental conditions
- **Compliance Forecasting**: Predict when thresholds will be exceeded
- **Optimization**: Adjust factory operations based on predictions

---

## 🔬 Technical Details

### Technologies Used

- **TensorFlow/Keras**: Deep learning framework
- **MobileNetV2**: Efficient CNN architecture for image classification
- **LSTM**: Long Short-Term Memory networks for time series
- **Attention Mechanism**: Improves long-range dependencies in sequences
- **StandardScaler**: Data normalization for stable training

### Model Architectures

**Pollution Detector:**
- Transfer learning with MobileNetV2
- Global Average Pooling
- Dense layers with Dropout (0.3, 0.4, 0.3)
- Batch Normalization
- Softmax output (3 classes)

**Sensor Predictor:**
- Stacked LSTM layers (128, 64 units)
- Attention mechanism
- Batch Normalization after each LSTM
- Dense layers (256, 128 units)
- Multi-step output (prediction_horizon × num_features)

---

## 📝 Output Examples

### Pollution Detection Output

```json
{
  "predicted_class": "air_pollution",
  "confidence": 0.89,
  "all_probabilities": {
    "air_pollution": 0.89,
    "water_pollution": 0.08,
    "waste_pollution": 0.03
  }
}
```

### Sensor Prediction Output

```
timestamp            temperature  humidity  co2    pm25   pressure
2024-10-26 00:00:00  23.45       46.2      410.5  12.1   1013.8
2024-10-26 01:00:00  23.52       45.8      412.3  11.9   1014.1
2024-10-26 02:00:00  23.48       45.5      411.7  12.0   1014.3
...
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Out of Memory**
- Reduce batch_size
- Use smaller image size for pollution detector
- Reduce sequence_length for sensor predictor

**Issue: Poor Accuracy**
- Increase training data
- Try data augmentation
- Adjust learning rate
- Increase epochs
- Check data quality and labels

**Issue: Overfitting**
- Increase dropout rates
- Add more data augmentation
- Reduce model complexity
- Use early stopping

**Issue: Model Not Loading**
- Check file paths
- Ensure all files (model, scaler, config) are present
- Verify TensorFlow version compatibility

---

## 📚 Additional Resources

- [TensorFlow Documentation](https://www.tensorflow.org/)
- [Keras Guide](https://keras.io/guides/)
- [Time Series Forecasting Guide](https://www.tensorflow.org/tutorials/structured_data/time_series)
- [Transfer Learning Tutorial](https://www.tensorflow.org/tutorials/images/transfer_learning)

---

## 🤝 Contributing

To improve these models:

1. Collect more diverse training data
2. Experiment with different architectures
3. Tune hyperparameters
4. Add more preprocessing steps
5. Implement ensemble methods

---

## 📄 License

Part of the EcoNova platform.

---

## 💡 Tips for Best Results

### Data Collection

- **Pollution Images**: Include various lighting, angles, and distances
- **Sensor Data**: Maintain consistent sampling intervals
- **Labeling**: Use clear, consistent labels
- **Volume**: More data = better results (aim for 1000+ images, 2000+ timesteps)

### Training

- Start with pretrained weights when available
- Monitor validation metrics to detect overfitting
- Save checkpoints regularly
- Use early stopping to save time
- Plot training curves to diagnose issues

### Deployment

- Test models on new data before production
- Set appropriate confidence thresholds
- Monitor predictions for drift
- Retrain periodically with new data
- Keep backup models

---

## 📞 Support

For issues or questions about these models, refer to the EcoNova project documentation or create an issue in the project repository.

---

**Last Updated:** October 2024  
**Version:** 1.0.0
