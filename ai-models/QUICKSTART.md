# Quick Start Guide - EcoNova AI Models

Get started with EcoNova AI models in 5 minutes!

## 📦 Installation

```bash
# Navigate to ai-models directory
cd ai-models

# Install dependencies
pip install -r requirements.txt
```

## 🚀 Quick Start

### Option 1: Try with Synthetic Data (Recommended for Testing)

```bash
# 1. Generate synthetic sensor data
python prepare_data.py --task sensors

# 2. Train sensor prediction model
python train_sensor_predictor.py --epochs 20 --synthetic_samples 1000

# 3. Make predictions
python predict_sensors.py --data_path synthetic_sensor_data.csv
```

### Option 2: See Examples

```bash
# Run the example script to see how models work
python example_usage.py
```

## 🖼️ Pollution Detection - Quick Start

### Step 1: Prepare Dataset

```bash
# Create directory structure
python prepare_data.py --task pollution
```

This creates:
```
pollution_dataset/
├── train/
│   ├── air_pollution/
│   ├── water_pollution/
│   └── waste_pollution/
└── validation/
    ├── air_pollution/
    ├── water_pollution/
    └── waste_pollution/
```

### Step 2: Add Your Images

Place images in the appropriate folders:
- Air pollution images → `train/air_pollution/` and `validation/air_pollution/`
- Water pollution images → `train/water_pollution/` and `validation/water_pollution/`
- Waste pollution images → `train/waste_pollution/` and `validation/waste_pollution/`

Aim for:
- At least 100 images per class
- 80% in train, 20% in validation

### Step 3: Train Model

```bash
python train_pollution_detector.py \
    --train_dir pollution_dataset/train \
    --val_dir pollution_dataset/validation \
    --epochs 30
```

### Step 4: Make Predictions

```bash
# Single image
python predict_pollution.py \
    --model_path pollution_detector_model.h5 \
    --input test_image.jpg

# Multiple images
python predict_pollution.py \
    --model_path pollution_detector_model.h5 \
    --input ./test_images/
```

## 📊 Sensor Prediction - Quick Start

### Step 1: Prepare Your Data

Create a CSV file with sensor readings:

```csv
timestamp,temperature,humidity,co2,pm25,pressure
2024-01-01 00:00:00,22.5,45.3,400,12.3,1013.2
2024-01-01 01:00:00,22.8,44.1,405,11.8,1013.5
2024-01-01 02:00:00,23.1,43.5,408,12.0,1013.8
...
```

**OR** use synthetic data:

```bash
python prepare_data.py --task sensors --samples 2000
```

### Step 2: Train Model

```bash
python train_sensor_predictor.py \
    --data_path sensor_data.csv \
    --sequence_length 24 \
    --prediction_horizon 12 \
    --epochs 50
```

Parameters:
- `sequence_length`: Hours of history to use (24 = 1 day)
- `prediction_horizon`: Hours to predict ahead (12 = half day)

### Step 3: Make Predictions

```bash
python predict_sensors.py \
    --model_path sensor_predictor_model.h5 \
    --data_path recent_sensor_data.csv \
    --steps_ahead 24
```

## 🐍 Python API

### Pollution Detection

```python
from pollution_detector import PollutionDetector

# Load model
detector = PollutionDetector()
detector.load_model('pollution_detector_model.h5')

# Predict
result = detector.predict_image('image.jpg')
print(f"{result['predicted_class']}: {result['confidence']:.2%}")
```

### Sensor Prediction

```python
from sensor_predictor import SensorPredictor
import pandas as pd

# Load model
predictor = SensorPredictor()
predictor.load_model(
    model_path='sensor_predictor_model.h5',
    scaler_path='sensor_scaler.pkl',
    config_path='sensor_config.json'
)

# Load recent data (last 24 hours)
df = pd.read_csv('recent_data.csv', parse_dates=['timestamp'], index_col='timestamp')

# Predict next 12 hours
predictions = predictor.predict_with_timestamps(
    recent_data=df.tail(24),
    timestamps=df.tail(24).index,
    future_steps=12
)

print(predictions)
```

## 📁 Key Files

After training, you'll have:

**Pollution Detection:**
- `pollution_detector_model.h5` - Trained model
- `pollution_detector_best.h5` - Best checkpoint
- `pollution_detector_training_history.png` - Training plots

**Sensor Prediction:**
- `sensor_predictor_model.h5` - Trained model
- `sensor_scaler.pkl` - Data scaler
- `sensor_config.json` - Model configuration
- `sensor_predictor_best.h5` - Best checkpoint
- `sensor_training_history.png` - Training plots

## ⚙️ Common Parameters

### Training

```bash
--epochs 50              # Number of training iterations
--batch_size 32          # Samples per batch
--learning_rate 0.001    # Learning rate
```

### Pollution Detector

```bash
--img_size 224           # Image size (224x224)
--pretrained             # Use transfer learning (recommended)
--no_pretrained          # Train from scratch
```

### Sensor Predictor

```bash
--sequence_length 24     # Historical timesteps
--prediction_horizon 12  # Future timesteps to predict
--lstm_units 128,64      # LSTM layer sizes
--attention              # Use attention mechanism (recommended)
```

## 🔧 Troubleshooting

**Out of Memory?**
```bash
--batch_size 16  # Reduce batch size
--img_size 128   # Smaller images (pollution detector)
```

**Poor Accuracy?**
- Add more training data
- Increase `--epochs`
- Try different `--learning_rate` (0.0001 or 0.01)

**Model not loading?**
- Check file paths
- Ensure all files exist (model, scaler, config)
- Verify TensorFlow version: `pip install tensorflow==2.13.0`

## 📚 Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Run [example_usage.py](example_usage.py) to see integration examples
3. Check model architectures in the source files
4. Customize hyperparameters for your use case

## 💡 Tips

- **Start Small**: Test with synthetic data first
- **Monitor Training**: Watch for overfitting (val_loss increases)
- **Save Checkpoints**: Models auto-save best weights
- **Visualize**: Check generated plots to understand performance
- **Iterate**: Adjust parameters based on results

## 🆘 Need Help?

- Check error messages carefully
- Review the full README.md
- Ensure data format is correct
- Verify all dependencies are installed

---

Happy training! 🚀
