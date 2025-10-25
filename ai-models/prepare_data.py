"""
Data Preparation Utilities for EcoNova AI Models

This script helps prepare data for both pollution detection and sensor prediction models.
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import shutil
from pathlib import Path


class DataPreparator:
    """Utility class for preparing training data"""
    
    @staticmethod
    def create_pollution_dataset_structure(base_dir='pollution_dataset'):
        """
        Create directory structure for pollution detection dataset
        
        Args:
            base_dir: Root directory for the dataset
            
        Returns:
            Dictionary with paths to train and validation directories
        """
        print(f"Creating pollution detection dataset structure in: {base_dir}")
        
        # Create directories
        dirs = {
            'train': {
                'air_pollution': os.path.join(base_dir, 'train', 'air_pollution'),
                'water_pollution': os.path.join(base_dir, 'train', 'water_pollution'),
                'waste_pollution': os.path.join(base_dir, 'train', 'waste_pollution')
            },
            'validation': {
                'air_pollution': os.path.join(base_dir, 'validation', 'air_pollution'),
                'water_pollution': os.path.join(base_dir, 'validation', 'water_pollution'),
                'waste_pollution': os.path.join(base_dir, 'validation', 'waste_pollution')
            }
        }
        
        for split in dirs:
            for category in dirs[split]:
                os.makedirs(dirs[split][category], exist_ok=True)
        
        print("\n✓ Directory structure created!")
        print("\nPlease organize your images as follows:")
        print(f"{base_dir}/")
        print("├── train/")
        print("│   ├── air_pollution/")
        print("│   ├── water_pollution/")
        print("│   └── waste_pollution/")
        print("└── validation/")
        print("    ├── air_pollution/")
        print("    ├── water_pollution/")
        print("    └── waste_pollution/")
        
        return dirs
    
    @staticmethod
    def split_images_train_val(source_dir, dest_dir, val_split=0.2, seed=42):
        """
        Split images into train and validation sets
        
        Args:
            source_dir: Directory containing subdirectories for each class
            dest_dir: Destination directory for split dataset
            val_split: Fraction of data for validation (default: 0.2)
            seed: Random seed for reproducibility
        """
        import random
        random.seed(seed)
        
        print(f"\nSplitting images from: {source_dir}")
        print(f"Destination: {dest_dir}")
        print(f"Validation split: {val_split:.0%}")
        
        # Get class directories
        classes = [d for d in os.listdir(source_dir) 
                  if os.path.isdir(os.path.join(source_dir, d))]
        
        stats = {'train': {}, 'validation': {}}
        
        for class_name in classes:
            class_path = os.path.join(source_dir, class_name)
            
            # Get all image files
            image_files = [f for f in os.listdir(class_path)
                          if f.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.webp'))]
            
            # Shuffle and split
            random.shuffle(image_files)
            split_idx = int(len(image_files) * (1 - val_split))
            
            train_files = image_files[:split_idx]
            val_files = image_files[split_idx:]
            
            # Create destination directories
            train_dest = os.path.join(dest_dir, 'train', class_name)
            val_dest = os.path.join(dest_dir, 'validation', class_name)
            os.makedirs(train_dest, exist_ok=True)
            os.makedirs(val_dest, exist_ok=True)
            
            # Copy files
            for f in train_files:
                shutil.copy2(os.path.join(class_path, f), os.path.join(train_dest, f))
            
            for f in val_files:
                shutil.copy2(os.path.join(class_path, f), os.path.join(val_dest, f))
            
            stats['train'][class_name] = len(train_files)
            stats['validation'][class_name] = len(val_files)
            
            print(f"\n{class_name}:")
            print(f"  Train: {len(train_files)} images")
            print(f"  Validation: {len(val_files)} images")
        
        print("\n✓ Split complete!")
        return stats
    
    @staticmethod
    def generate_synthetic_sensor_data(
        output_file='synthetic_sensor_data.csv',
        n_samples=2000,
        sensors=None,
        start_date='2024-01-01',
        freq='H'
    ):
        """
        Generate synthetic sensor data for testing
        
        Args:
            output_file: Output CSV filename
            n_samples: Number of timesteps
            sensors: List of sensor configurations (dict with name, base, amplitude, noise)
            start_date: Start date for timestamps
            freq: Frequency ('H' for hourly, 'D' for daily, etc.)
        """
        if sensors is None:
            sensors = [
                {'name': 'temperature', 'base': 22, 'amplitude': 5, 'noise': 0.5},
                {'name': 'humidity', 'base': 50, 'amplitude': 15, 'noise': 2.0},
                {'name': 'co2', 'base': 400, 'amplitude': 50, 'noise': 10},
                {'name': 'pm25', 'base': 15, 'amplitude': 10, 'noise': 2.0},
                {'name': 'pressure', 'base': 1013, 'amplitude': 5, 'noise': 1.0}
            ]
        
        print(f"Generating synthetic sensor data...")
        print(f"  Samples: {n_samples}")
        print(f"  Sensors: {', '.join([s['name'] for s in sensors])}")
        
        # Create timestamps
        timestamps = pd.date_range(start=start_date, periods=n_samples, freq=freq)
        
        # Generate data
        data = {'timestamp': timestamps}
        
        for sensor in sensors:
            # Base trend
            trend = np.linspace(
                sensor['base'],
                sensor['base'] + np.random.uniform(-2, 2),
                n_samples
            )
            
            # Daily seasonality (24-hour cycle)
            if freq == 'H':
                period = 24
            elif freq == 'D':
                period = 7
            else:
                period = 24
            
            seasonality = sensor['amplitude'] * np.sin(
                2 * np.pi * np.arange(n_samples) / period
            )
            
            # Random noise
            noise = sensor['noise'] * np.random.randn(n_samples)
            
            # Combine components
            data[sensor['name']] = trend + seasonality + noise
        
        # Create DataFrame
        df = pd.DataFrame(data)
        
        # Save to CSV
        df.to_csv(output_file, index=False)
        
        print(f"\n✓ Synthetic data saved to: {output_file}")
        print(f"\nData preview:")
        print(df.head(10))
        print(f"\nData statistics:")
        print(df.describe())
        
        return df
    
    @staticmethod
    def validate_sensor_data(data_file):
        """
        Validate sensor data format and check for issues
        
        Args:
            data_file: Path to sensor data CSV file
        """
        print(f"Validating sensor data: {data_file}")
        
        # Load data
        df = pd.read_csv(data_file)
        
        issues = []
        
        # Check for timestamp column
        if 'timestamp' not in df.columns:
            issues.append("❌ Missing 'timestamp' column")
        else:
            # Try parsing timestamps
            try:
                df['timestamp'] = pd.to_datetime(df['timestamp'])
                
                # Check for gaps
                time_diffs = df['timestamp'].diff()
                if time_diffs.std() > timedelta(minutes=1):
                    issues.append("⚠️  Warning: Irregular time intervals detected")
                
                # Check for duplicates
                if df['timestamp'].duplicated().any():
                    issues.append("❌ Duplicate timestamps found")
                
            except Exception as e:
                issues.append(f"❌ Cannot parse timestamps: {e}")
        
        # Check for numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if len(numeric_cols) == 0:
            issues.append("❌ No numeric sensor columns found")
        
        # Check for missing values
        missing = df.isnull().sum()
        if missing.any():
            issues.append(f"⚠️  Missing values found:\n{missing[missing > 0]}")
        
        # Check data range
        if len(df) < 100:
            issues.append(f"⚠️  Warning: Only {len(df)} samples (recommend 1000+)")
        
        # Print results
        print("\n" + "="*60)
        print("VALIDATION RESULTS")
        print("="*60)
        
        if issues:
            print("\nIssues found:")
            for issue in issues:
                print(f"  {issue}")
        else:
            print("\n✓ All checks passed!")
        
        print(f"\nData info:")
        print(f"  Total samples: {len(df)}")
        print(f"  Sensor columns: {', '.join(numeric_cols)}")
        print(f"  Date range: {df['timestamp'].min()} to {df['timestamp'].max()}")
        
        return len(issues) == 0


def main():
    """Main function with example usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Prepare data for EcoNova AI models')
    parser.add_argument('--task', choices=['pollution', 'sensors', 'both'], 
                       default='both', help='Which data to prepare')
    parser.add_argument('--pollution_dir', default='pollution_dataset',
                       help='Directory for pollution dataset')
    parser.add_argument('--sensor_file', default='synthetic_sensor_data.csv',
                       help='Output file for sensor data')
    parser.add_argument('--samples', type=int, default=2000,
                       help='Number of synthetic sensor samples')
    
    args = parser.parse_args()
    
    prep = DataPreparator()
    
    print("="*70)
    print("ECONOVA AI MODELS - DATA PREPARATION")
    print("="*70)
    
    if args.task in ['pollution', 'both']:
        print("\n" + "-"*70)
        print("POLLUTION DETECTION DATASET")
        print("-"*70)
        prep.create_pollution_dataset_structure(args.pollution_dir)
    
    if args.task in ['sensors', 'both']:
        print("\n" + "-"*70)
        print("SENSOR PREDICTION DATASET")
        print("-"*70)
        df = prep.generate_synthetic_sensor_data(
            output_file=args.sensor_file,
            n_samples=args.samples
        )
        
        print("\nValidating generated data...")
        prep.validate_sensor_data(args.sensor_file)
    
    print("\n" + "="*70)
    print("DATA PREPARATION COMPLETE!")
    print("="*70)
    print("\nNext steps:")
    if args.task in ['pollution', 'both']:
        print(f"  1. Add images to {args.pollution_dir}/ directories")
        print(f"  2. Run: python train_pollution_detector.py --train_dir {args.pollution_dir}/train --val_dir {args.pollution_dir}/validation")
    if args.task in ['sensors', 'both']:
        print(f"  3. Run: python train_sensor_predictor.py --data_path {args.sensor_file}")
    print()


if __name__ == "__main__":
    main()
