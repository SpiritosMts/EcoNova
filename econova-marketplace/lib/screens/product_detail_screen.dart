import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/product_model.dart';
import '../services/transaction_service.dart';
import '../utils/color_theme.dart';
import '../utils/helpers.dart';
import '../widgets/animated_button.dart';

class ProductDetailScreen extends StatefulWidget {
  final ProductModel product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final TransactionService _transactionService = TransactionService();
  bool _isLoading = false;
  int _quantity = 1;

  Future<void> _handlePurchase() async {
    final currentUser = FirebaseAuth.instance.currentUser;
    if (currentUser == null) return;

    if (currentUser.uid == widget.product.sellerId) {
      Fluttertoast.showToast(
        msg: 'You cannot buy your own product!',
        backgroundColor: AppColors.error,
        textColor: Colors.white,
      );
      return;
    }

    if (widget.product.stock < _quantity) {
      Fluttertoast.showToast(
        msg: 'Not enough stock available!',
        backgroundColor: AppColors.error,
        textColor: Colors.white,
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      await _transactionService.createTransaction(
        buyerId: currentUser.uid,
        sellerId: widget.product.sellerId,
        product: widget.product,
        quantity: _quantity,
      );

      if (mounted) {
        Fluttertoast.showToast(
          msg: 'Purchase successful!',
          backgroundColor: AppColors.success,
          textColor: Colors.white,
        );
        Navigator.of(context).pop();
      }
    } catch (e) {
      Fluttertoast.showToast(
        msg: 'Error: ${e.toString()}',
        backgroundColor: AppColors.error,
        textColor: Colors.white,
      );
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App Bar with Image
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Hero(
                tag: 'product_${widget.product.id}',
                child: widget.product.imageUrl.isNotEmpty
                    ? Image.network(
                        widget.product.imageUrl,
                        fit: BoxFit.cover,
                      )
                    : Container(
                        color: Colors.grey[300],
                        child: const Icon(
                          Icons.image,
                          size: 100,
                          color: Colors.grey,
                        ),
                      ),
              ),
            ),
          ),
          // Product Details
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(24),
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Name and Price
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            widget.product.name,
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                        Text(
                          Helpers.formatCurrency(widget.product.price),
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primaryOrange,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    // Category
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        gradient: AppColors.primaryGradient,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        widget.product.category,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Divider(),
                    const SizedBox(height: 16),
                    // Seller Info
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            gradient: AppColors.primaryGradient,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.store,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Seller',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary,
                              ),
                            ),
                            Text(
                              widget.product.sellerName,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Divider(),
                    const SizedBox(height: 16),
                    // Stock
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Available Stock',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: widget.product.stock > 0
                                ? AppColors.success.withOpacity(0.1)
                                : AppColors.error.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            '${widget.product.stock} units',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: widget.product.stock > 0
                                  ? AppColors.success
                                  : AppColors.error,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    // Description
                    const Text(
                      'Description',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.product.description,
                      style: const TextStyle(
                        fontSize: 15,
                        color: AppColors.textSecondary,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Quantity Selector
                    if (widget.product.stock > 0) ...[
                      const Text(
                        'Quantity',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          IconButton(
                            onPressed: _quantity > 1
                                ? () => setState(() => _quantity--)
                                : null,
                            icon: const Icon(Icons.remove_circle_outline),
                            color: AppColors.primaryOrange,
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: AppColors.primaryOrange,
                                width: 2,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '$_quantity',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ),
                          IconButton(
                            onPressed: _quantity < widget.product.stock
                                ? () => setState(() => _quantity++)
                                : null,
                            icon: const Icon(Icons.add_circle_outline),
                            color: AppColors.primaryOrange,
                          ),
                          const Spacer(),
                          Text(
                            'Total: ${Helpers.formatCurrency(widget.product.price * _quantity)}',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppColors.primaryOrange,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 32),
                    ],
                    // Buy Button
                    AnimatedButton(
                      text: widget.product.stock > 0 ? 'Buy Now' : 'Out of Stock',
                      onPressed: widget.product.stock > 0 ? _handlePurchase : () {},
                      isLoading: _isLoading,
                      icon: Icons.shopping_cart,
                      backgroundColor: widget.product.stock > 0
                          ? null
                          : Colors.grey,
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
