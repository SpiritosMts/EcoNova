"""
Pollution Type Detection Model
Detects pollution type (water, waste, or air) from images using CNN
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
from PIL import Image
import os


class PollutionDetector:
    """
    CNN-based image classifier for detecting pollution types:
    - Water Pollution
    - Waste Pollution
    - Air Pollution
    """
    
    def __init__(self, img_size=(224, 224), num_classes=3):
        self.img_size = img_size
        self.num_classes = num_classes
        self.class_names = ['air_pollution', 'waste_pollution', 'water_pollution']
        self.model = None
        
    def build_model(self, pretrained=True):
        """
        Build CNN model using MobileNetV2 as base with transfer learning
        """
        if pretrained:
            # Use MobileNetV2 as base model (pre-trained on ImageNet)
            base_model = MobileNetV2(
                input_shape=(*self.img_size, 3),
                include_top=False,
                weights='imagenet'
            )
            base_model.trainable = False  # Freeze base model initially
            
            # Add custom classification head
            model = models.Sequential([
                base_model,
                layers.GlobalAveragePooling2D(),
                layers.Dropout(0.3),
                layers.Dense(256, activation='relu'),
                layers.BatchNormalization(),
                layers.Dropout(0.4),
                layers.Dense(128, activation='relu'),
                layers.BatchNormalization(),
                layers.Dropout(0.3),
                layers.Dense(self.num_classes, activation='softmax')
            ])
        else:
            # Build custom CNN from scratch
            model = models.Sequential([
                layers.Input(shape=(*self.img_size, 3)),
                
                # Block 1
                layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
                layers.BatchNormalization(),
                layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
                layers.MaxPooling2D((2, 2)),
                layers.Dropout(0.25),
                
                # Block 2
                layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
                layers.BatchNormalization(),
                layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
                layers.MaxPooling2D((2, 2)),
                layers.Dropout(0.25),
                
                # Block 3
                layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
                layers.BatchNormalization(),
                layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
                layers.MaxPooling2D((2, 2)),
                layers.Dropout(0.25),
                
                # Block 4
                layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
                layers.BatchNormalization(),
                layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
                layers.GlobalAveragePooling2D(),
                layers.Dropout(0.5),
                
                # Dense layers
                layers.Dense(512, activation='relu'),
                layers.BatchNormalization(),
                layers.Dropout(0.5),
                layers.Dense(self.num_classes, activation='softmax')
            ])
        
        self.model = model
        return model
    
    def compile_model(self, learning_rate=0.001):
        """Compile the model with optimizer and loss function"""
        if self.model is None:
            raise ValueError("Model must be built before compiling")
        
        self.model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
            loss='categorical_crossentropy',
            metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
        )
    
    def get_data_generators(self, train_dir, val_dir, batch_size=32):
        """
        Create data generators for training and validation
        
        Expected directory structure:
        train_dir/
            air_pollution/
            waste_pollution/
            water_pollution/
        val_dir/
            air_pollution/
            waste_pollution/
            water_pollution/
        """
        # Data augmentation for training
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            horizontal_flip=True,
            zoom_range=0.2,
            shear_range=0.2,
            fill_mode='nearest'
        )
        
        # Only rescaling for validation
        val_datagen = ImageDataGenerator(rescale=1./255)
        
        train_generator = train_datagen.flow_from_directory(
            train_dir,
            target_size=self.img_size,
            batch_size=batch_size,
            class_mode='categorical',
            shuffle=True
        )
        
        val_generator = val_datagen.flow_from_directory(
            val_dir,
            target_size=self.img_size,
            batch_size=batch_size,
            class_mode='categorical',
            shuffle=False
        )
        
        return train_generator, val_generator
    
    def train(self, train_generator, val_generator, epochs=50, callbacks=None):
        """Train the model"""
        if self.model is None:
            raise ValueError("Model must be built and compiled before training")
        
        if callbacks is None:
            callbacks = [
                keras.callbacks.EarlyStopping(
                    monitor='val_loss',
                    patience=10,
                    restore_best_weights=True
                ),
                keras.callbacks.ReduceLROnPlateau(
                    monitor='val_loss',
                    factor=0.5,
                    patience=5,
                    min_lr=1e-7
                ),
                keras.callbacks.ModelCheckpoint(
                    'pollution_detector_best.h5',
                    monitor='val_accuracy',
                    save_best_only=True,
                    mode='max'
                )
            ]
        
        history = self.model.fit(
            train_generator,
            epochs=epochs,
            validation_data=val_generator,
            callbacks=callbacks
        )
        
        return history
    
    def predict_image(self, image_path, confidence_threshold=0.6):
        """
        Predict pollution type from a single image
        
        Args:
            image_path: Path to image file
            confidence_threshold: Minimum confidence for prediction
            
        Returns:
            dict with prediction results
        """
        if self.model is None:
            raise ValueError("Model must be loaded before prediction")
        
        # Load and preprocess image
        img = Image.open(image_path).convert('RGB')
        img = img.resize(self.img_size)
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Make prediction
        predictions = self.model.predict(img_array, verbose=0)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = predictions[0][predicted_class_idx]
        
        result = {
            'predicted_class': self.class_names[predicted_class_idx],
            'confidence': float(confidence),
            'all_probabilities': {
                class_name: float(prob) 
                for class_name, prob in zip(self.class_names, predictions[0])
            }
        }
        
        if confidence < confidence_threshold:
            result['warning'] = f'Low confidence prediction ({confidence:.2%})'
        
        return result
    
    def predict_batch(self, image_paths):
        """Predict pollution types for multiple images"""
        results = []
        for image_path in image_paths:
            try:
                result = self.predict_image(image_path)
                result['image_path'] = image_path
                results.append(result)
            except Exception as e:
                results.append({
                    'image_path': image_path,
                    'error': str(e)
                })
        return results
    
    def save_model(self, filepath='pollution_detector_model.h5'):
        """Save the trained model"""
        if self.model is None:
            raise ValueError("No model to save")
        self.model.save(filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='pollution_detector_model.h5'):
        """Load a pre-trained model"""
        self.model = keras.models.load_model(filepath)
        print(f"Model loaded from {filepath}")
    
    def get_model_summary(self):
        """Print model architecture summary"""
        if self.model is None:
            raise ValueError("Model must be built first")
        return self.model.summary()


# Example usage
if __name__ == "__main__":
    # Initialize detector
    detector = PollutionDetector(img_size=(224, 224), num_classes=3)
    
    # Build model with transfer learning
    detector.build_model(pretrained=True)
    detector.compile_model(learning_rate=0.001)
    
    # Print model summary
    print("Pollution Detection Model Architecture:")
    detector.get_model_summary()
    
    print("\n" + "="*50)
    print("Model ready for training!")
    print("Expected classes: air_pollution, waste_pollution, water_pollution")
    print("="*50)
