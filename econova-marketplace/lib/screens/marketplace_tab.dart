import 'package:flutter/material.dart';
import '../models/product_model.dart';
import '../services/firestore_service.dart';
import '../utils/color_theme.dart';
import '../utils/constants.dart';
import '../widgets/product_card.dart';
import '../widgets/category_chip.dart';
import 'product_detail_screen.dart';

class MarketplaceTab extends StatefulWidget {
  const MarketplaceTab({super.key});

  @override
  State<MarketplaceTab> createState() => _MarketplaceTabState();
}

class _MarketplaceTabState extends State<MarketplaceTab> {
  final FirestoreService _firestoreService = FirestoreService();
  String _selectedCategory = 'All';
  final TextEditingController _searchController = TextEditingController();
  List<ProductModel> _searchResults = [];
  bool _isSearching = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _handleSearch(String query) async {
    if (query.isEmpty) {
      setState(() {
        _isSearching = false;
        _searchResults = [];
      });
      return;
    }

    setState(() => _isSearching = true);
    try {
      final results = await _firestoreService.searchProducts(query);
      setState(() => _searchResults = results);
    } catch (e) {
      // Handle error
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppConstants.appName),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              onChanged: _handleSearch,
              decoration: InputDecoration(
                hintText: AppStrings.searchProducts,
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          _handleSearch('');
                        },
                      )
                    : null,
              ),
            ),
          ),
          // Category Chips
          if (!_isSearching)
            SizedBox(
              height: 50,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  CategoryChip(
                    label: 'All',
                    isSelected: _selectedCategory == 'All',
                    onTap: () => setState(() => _selectedCategory = 'All'),
                  ),
                  const SizedBox(width: 8),
                  ...AppConstants.categories.map((category) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: CategoryChip(
                        label: category,
                        isSelected: _selectedCategory == category,
                        onTap: () => setState(() => _selectedCategory = category),
                      ),
                    );
                  }).toList(),
                ],
              ),
            ),
          const SizedBox(height: 16),
          // Products Grid
          Expanded(
            child: _isSearching
                ? _buildSearchResults()
                : _buildProductsGrid(),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchResults() {
    if (_searchResults.isEmpty) {
      return const Center(
        child: Text(
          AppStrings.noProducts,
          style: TextStyle(
            color: AppColors.textSecondary,
            fontSize: 16,
          ),
        ),
      );
    }

    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.7,
      ),
      itemCount: _searchResults.length,
      itemBuilder: (context, index) {
        final product = _searchResults[index];
        return ProductCard(
          product: product,
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => ProductDetailScreen(product: product),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildProductsGrid() {
    return StreamBuilder<List<ProductModel>>(
      stream: _selectedCategory == 'All'
          ? _firestoreService.getProducts()
          : _firestoreService.getProductsByCategory(_selectedCategory),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(
              color: AppColors.primaryOrange,
            ),
          );
        }

        if (snapshot.hasError) {
          return Center(
            child: Text(
              'Error: ${snapshot.error}',
              style: const TextStyle(color: AppColors.error),
            ),
          );
        }

        final products = snapshot.data ?? [];

        if (products.isEmpty) {
          return const Center(
            child: Text(
              AppStrings.noProducts,
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 16,
              ),
            ),
          );
        }

        return GridView.builder(
          padding: const EdgeInsets.all(16),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 0.7,
          ),
          itemCount: products.length,
          itemBuilder: (context, index) {
            final product = products[index];
            return ProductCard(
              product: product,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => ProductDetailScreen(product: product),
                  ),
                );
              },
            );
          },
        );
      },
    );
  }
}
