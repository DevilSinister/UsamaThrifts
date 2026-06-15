import React from 'react';
import { useApp } from '../context/AppContext';
import { CategoryScroller } from '../components/CategoryScroller';
import { ProductCard } from '../components/ProductCard';
import './HomeView.css';

export const HomeView: React.FC = () => {
  const { products, selectedCategory, searchQuery } = useApp();

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="home-view animate-fade-in">
      {/* Dynamic Hero Banner */}
      {!searchQuery && (
        <div className="hero-banner">
          <div className="hero-content">
            <span className="hero-badge">Exclusive Drop</span>
            <h2 className="hero-title">Retro Kit Sale</h2>
            <p className="hero-subtitle">Get 20% off rare classic jerseys. Limited stock available.</p>
            <div className="hero-sale-tag">Use Code: <span className="coupon-code">RETRO20</span></div>
          </div>
          <div className="hero-overlay"></div>
        </div>
      )}

      {/* Categories Scroller */}
      <div className="section-header">
        <h3 className="section-title">Browse Leagues</h3>
      </div>
      <CategoryScroller />

      {/* Product Grid */}
      <div className="section-header">
        <h3 className="section-title">
          {searchQuery ? 'Search Results' : selectedCategory === 'All' ? 'Featured Kits' : selectedCategory}
        </h3>
        <span className="product-count">{filteredProducts.length} items</span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="no-products-container animate-fade-in">
          <svg className="no-products-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <p className="no-products-text">No jerseys found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
