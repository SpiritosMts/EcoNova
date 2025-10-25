"""
Training script for Pollution Detection Model
"""

import os
import sys
import argparse
from datetime import datetime
import matplotlib.pyplot as plt
from pollution_detector import PollutionDetector


def plot_training_history(history, save_path='training_history.png'):
    """Plot and save training metrics"""
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    
    # Accuracy
    axes[0, 0].plot(history.history['accuracy'], label='Train Accuracy')
    axes[0, 0].plot(history.history['val_accuracy'], label='Val Accuracy')
    axes[0, 0].set_title('Model Accuracy')
    axes[0, 0].set_xlabel('Epoch')
    axes[0, 0].set_ylabel('Accuracy')
    axes[0, 0].legend()
    axes[0, 0].grid(True)
    
    # Loss
    axes[0, 1].plot(history.history['loss'], label='Train Loss')
    axes[0, 1].plot(history.history['val_loss'], label='Val Loss')
    axes[0, 1].set_title('Model Loss')
    axes[0, 1].set_xlabel('Epoch')
    axes[0, 1].set_ylabel('Loss')
    axes[0, 1].legend()
    axes[0, 1].grid(True)
    
    # Precision
    if 'precision' in history.history:
        axes[1, 0].plot(history.history['precision'], label='Train Precision')
        axes[1, 0].plot(history.history['val_precision'], label='Val Precision')
        axes[1, 0].set_title('Model Precision')
        axes[1, 0].set_xlabel('Epoch')
        axes[1, 0].set_ylabel('Precision')
        axes[1, 0].legend()
        axes[1, 0].grid(True)
    
    # Recall
    if 'recall' in history.history:
        axes[1, 1].plot(history.history['recall'], label='Train Recall')
        axes[1, 1].plot(history.history['val_recall'], label='Val Recall')
        axes[1, 1].set_title('Model Recall')
        axes[1, 1].set_xlabel('Epoch')
        axes[1, 1].set_ylabel('Recall')
        axes[1, 1].legend()
        axes[1, 1].grid(True)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"Training history plot saved to {save_path}")
    plt.close()


def main(args):
    """Main training function"""
    print("="*70)
    print("POLLUTION DETECTION MODEL - TRAINING")
    print("="*70)
    print(f"\nTraining Parameters:")
    print(f"  - Train Directory: {args.train_dir}")
    print(f"  - Validation Directory: {args.val_dir}")
    print(f"  - Epochs: {args.epochs}")
    print(f"  - Batch Size: {args.batch_size}")
    print(f"  - Learning Rate: {args.learning_rate}")
    print(f"  - Image Size: {args.img_size}x{args.img_size}")
    print(f"  - Pretrained: {args.pretrained}")
    print()
    
    # Validate directories
    if not os.path.exists(args.train_dir):
        print(f"ERROR: Training directory not found: {args.train_dir}")
        sys.exit(1)
    if not os.path.exists(args.val_dir):
        print(f"ERROR: Validation directory not found: {args.val_dir}")
        sys.exit(1)
    
    # Initialize detector
    print("Initializing Pollution Detector...")
    detector = PollutionDetector(img_size=(args.img_size, args.img_size), num_classes=3)
    
    # Build model
    print("Building model architecture...")
    detector.build_model(pretrained=args.pretrained)
    detector.compile_model(learning_rate=args.learning_rate)
    
    # Print model summary
    print("\nModel Architecture:")
    detector.get_model_summary()
    
    # Prepare data generators
    print(f"\nPreparing data generators...")
    train_generator, val_generator = detector.get_data_generators(
        args.train_dir,
        args.val_dir,
        batch_size=args.batch_size
    )
    
    print(f"\nTraining samples: {train_generator.samples}")
    print(f"Validation samples: {val_generator.samples}")
    print(f"Classes found: {list(train_generator.class_indices.keys())}")
    
    # Start training
    print("\n" + "="*70)
    print("STARTING TRAINING...")
    print("="*70 + "\n")
    
    start_time = datetime.now()
    
    history = detector.train(
        train_generator,
        val_generator,
        epochs=args.epochs
    )
    
    end_time = datetime.now()
    training_duration = end_time - start_time
    
    print("\n" + "="*70)
    print("TRAINING COMPLETED")
    print("="*70)
    print(f"Training Duration: {training_duration}")
    
    # Print final metrics
    final_train_acc = history.history['accuracy'][-1]
    final_val_acc = history.history['val_accuracy'][-1]
    final_train_loss = history.history['loss'][-1]
    final_val_loss = history.history['val_loss'][-1]
    
    print(f"\nFinal Metrics:")
    print(f"  - Training Accuracy: {final_train_acc:.4f}")
    print(f"  - Validation Accuracy: {final_val_acc:.4f}")
    print(f"  - Training Loss: {final_train_loss:.4f}")
    print(f"  - Validation Loss: {final_val_loss:.4f}")
    
    # Save model
    model_filename = f"pollution_detector_{datetime.now().strftime('%Y%m%d_%H%M%S')}.h5"
    print(f"\nSaving model to {model_filename}...")
    detector.save_model(model_filename)
    
    # Plot training history
    print("Generating training history plots...")
    plot_training_history(history, save_path='pollution_detector_training_history.png')
    
    print("\n" + "="*70)
    print("ALL DONE!")
    print("="*70)
    print(f"\nModel saved: {model_filename}")
    print("Best model saved: pollution_detector_best.h5")
    print("Training plot saved: pollution_detector_training_history.png")
    print()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Train Pollution Detection Model')
    
    parser.add_argument(
        '--train_dir',
        type=str,
        required=True,
        help='Path to training data directory'
    )
    
    parser.add_argument(
        '--val_dir',
        type=str,
        required=True,
        help='Path to validation data directory'
    )
    
    parser.add_argument(
        '--epochs',
        type=int,
        default=50,
        help='Number of training epochs (default: 50)'
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
        '--img_size',
        type=int,
        default=224,
        help='Image size (default: 224)'
    )
    
    parser.add_argument(
        '--pretrained',
        action='store_true',
        default=True,
        help='Use pretrained MobileNetV2 base (default: True)'
    )
    
    parser.add_argument(
        '--no_pretrained',
        dest='pretrained',
        action='store_false',
        help='Train from scratch without pretrained weights'
    )
    
    args = parser.parse_args()
    main(args)
