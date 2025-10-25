"""
Inference script for Pollution Detection Model
Predict pollution type from images
"""

import os
import sys
import argparse
import json
from glob import glob
from datetime import datetime
from pollution_detector import PollutionDetector


def predict_single_image(detector, image_path, confidence_threshold=0.6):
    """Predict pollution type for a single image"""
    print(f"\nAnalyzing: {os.path.basename(image_path)}")
    print("-" * 50)
    
    result = detector.predict_image(image_path, confidence_threshold)
    
    print(f"Predicted Class: {result['predicted_class'].upper()}")
    print(f"Confidence: {result['confidence']:.2%}")
    
    if 'warning' in result:
        print(f"⚠️  {result['warning']}")
    
    print("\nAll Probabilities:")
    for class_name, prob in result['all_probabilities'].items():
        print(f"  {class_name:20s}: {prob:.2%}")
    
    return result


def predict_batch(detector, image_paths, confidence_threshold=0.6, save_results=True):
    """Predict pollution types for multiple images"""
    print(f"\n{'='*70}")
    print(f"BATCH PREDICTION - {len(image_paths)} images")
    print(f"{'='*70}")
    
    results = detector.predict_batch(image_paths)
    
    # Print summary
    print("\nPrediction Summary:")
    print("-" * 70)
    
    for i, result in enumerate(results, 1):
        if 'error' in result:
            print(f"\n{i}. {os.path.basename(result['image_path'])}")
            print(f"   ❌ Error: {result['error']}")
        else:
            status = "✅" if result['confidence'] >= confidence_threshold else "⚠️"
            print(f"\n{i}. {os.path.basename(result['image_path'])}")
            print(f"   {status} {result['predicted_class'].upper()} ({result['confidence']:.2%})")
    
    # Save results to JSON
    if save_results:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = f"pollution_predictions_{timestamp}.json"
        
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n{'='*70}")
        print(f"Results saved to: {output_file}")
        print(f"{'='*70}")
    
    return results


def main(args):
    """Main prediction function"""
    print("="*70)
    print("POLLUTION DETECTION - INFERENCE")
    print("="*70)
    
    # Check if model file exists
    if not os.path.exists(args.model_path):
        print(f"\nERROR: Model file not found: {args.model_path}")
        print("Please train the model first or provide a valid model path.")
        sys.exit(1)
    
    # Initialize detector
    print(f"\nLoading model from: {args.model_path}")
    detector = PollutionDetector()
    detector.load_model(args.model_path)
    print("✓ Model loaded successfully!")
    
    # Get image paths
    if os.path.isfile(args.input):
        # Single image
        image_paths = [args.input]
    elif os.path.isdir(args.input):
        # Directory of images
        image_paths = []
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.bmp', '*.webp']:
            image_paths.extend(glob(os.path.join(args.input, ext)))
            image_paths.extend(glob(os.path.join(args.input, ext.upper())))
        
        if not image_paths:
            print(f"\nERROR: No image files found in: {args.input}")
            sys.exit(1)
    else:
        print(f"\nERROR: Invalid input path: {args.input}")
        sys.exit(1)
    
    print(f"\nFound {len(image_paths)} image(s) to analyze")
    print(f"Confidence threshold: {args.confidence_threshold:.2%}")
    
    # Perform predictions
    if len(image_paths) == 1:
        # Single image prediction
        result = predict_single_image(
            detector, 
            image_paths[0], 
            args.confidence_threshold
        )
        
        # Save result if requested
        if args.save_results:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_file = f"pollution_prediction_{timestamp}.json"
            with open(output_file, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"\nResult saved to: {output_file}")
    else:
        # Batch prediction
        results = predict_batch(
            detector, 
            image_paths, 
            args.confidence_threshold,
            save_results=args.save_results
        )
    
    print("\n" + "="*70)
    print("PREDICTION COMPLETE!")
    print("="*70 + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Predict pollution type from images',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Predict single image
  python predict_pollution.py --model pollution_detector_model.h5 --input image.jpg
  
  # Predict all images in directory
  python predict_pollution.py --model pollution_detector_model.h5 --input ./images/
  
  # Use custom confidence threshold
  python predict_pollution.py --model model.h5 --input image.jpg --confidence 0.8
        """
    )
    
    parser.add_argument(
        '--model_path',
        type=str,
        default='pollution_detector_model.h5',
        help='Path to trained model file (default: pollution_detector_model.h5)'
    )
    
    parser.add_argument(
        '--input',
        type=str,
        required=True,
        help='Path to image file or directory containing images'
    )
    
    parser.add_argument(
        '--confidence_threshold',
        type=float,
        default=0.6,
        help='Minimum confidence threshold for predictions (default: 0.6)'
    )
    
    parser.add_argument(
        '--save_results',
        action='store_true',
        default=True,
        help='Save prediction results to JSON file (default: True)'
    )
    
    parser.add_argument(
        '--no_save',
        dest='save_results',
        action='store_false',
        help='Do not save prediction results'
    )
    
    args = parser.parse_args()
    main(args)
