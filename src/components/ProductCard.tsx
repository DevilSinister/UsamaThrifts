import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Product, Variant } from '../services/db';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useApp();
  
  // Find the first variant that is in stock as default
  const defaultVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<Variant>(defaultVariant);
  const [isAdded, setIsAdded] = useState(false);

  const [imageError, setImageError] = useState(false);

  const handleAdd = () => {
    if (!selectedVariant || selectedVariant.stock === 0) return;
    
    addToCart(product, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const getConditionClass = (grade: string) => {
    const num = parseFloat(grade);
    if (num >= 9.5) return 'grade-excellent';
    if (num >= 9.0) return 'grade-very-good';
    return 'grade-good';
  };

  // Extract unique colors for swatches
  const colors = Array.from(new Set(product.variants.map(v => v.color)));

  // Render color indicator dot based on name
  const getColorStyle = (colorName: string) => {
    const parts = colorName.split('/');
    const mainColor = parts[0].toLowerCase();
    const subColor = parts[1] ? parts[1].toLowerCase() : '';

    if (mainColor === 'white') {
      return { 
        background: `linear-gradient(135deg, #ffffff 50%, ${subColor === 'purple' ? '#5a2d82' : subColor === 'blue' ? '#74c0fc' : '#ced4da'} 50%)`,
        border: '1px solid #ced4da'
      };
    }
    if (mainColor === 'black') {
      return { background: `linear-gradient(135deg, #1a1a1a 50%, ${subColor === 'red' ? '#e21b22' : '#495057'} 50%)` };
    }
    if (mainColor === 'yellow') {
      return { background: `linear-gradient(135deg, #ffd43b 50%, ${subColor === 'green' ? '#2b8a3e' : '#ffd43b'} 50%)` };
    }
    if (mainColor === 'blue') {
      return { background: `linear-gradient(135deg, #228be6 50%, ${subColor === 'white' ? '#ffffff' : '#228be6'} 50%)`, border: subColor === 'white' ? '1px solid #ced4da' : 'none' };
    }
    if (mainColor === 'red') {
      return { background: `linear-gradient(135deg, #e21b22 50%, ${subColor === 'black' ? '#1a1a1a' : '#e21b22'} 50%)` };
    }
    return { backgroundColor: '#adb5bd' };
  };

  return (
    <div className="product-card animate-fade-in">
      <div className="product-image-container">
        {imageError ? (
          <div className="product-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="placeholder-jersey-svg">
              <path d="M30,20 L40,10 L60,10 L70,20 L85,25 L80,45 L70,42 L70,90 L30,90 L30,42 L20,45 L15,25 Z" fill={getColorStyle(product.variants[0].color).backgroundColor || '#e21b22'} stroke="#0a1128" strokeWidth="3" />
              <text x="50" y="60" fontSize="16" fontWeight="bold" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">KIT</text>
            </svg>
          </div>
        ) : (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="product-image" 
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
        <span className={`condition-badge ${getConditionClass(product.conditionGrade)}`}>
          {product.conditionGrade}
        </span>
        {product.originalPrice && (
          <span className="badge badge-sale discount-tag">Sale</span>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-rating-price">
          <div className="product-price">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="product-rating">
            <svg className="star-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Color Indicators */}
        <div className="swatch-section">
          <span className="swatch-label">Colors:</span>
          <div className="color-dots">
            {colors.map((color) => (
              <span 
                key={color} 
                className="color-dot" 
                style={getColorStyle(color)}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Size Selection Swatches */}
        <div className="size-section">
          <span className="swatch-label">Sizes:</span>
          <div className="size-chips">
            {product.variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const isOutOfStock = v.stock === 0;

              return (
                <button
                  key={v.id}
                  type="button"
                  className={`size-chip ${isSelected ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                  disabled={isOutOfStock}
                  onClick={() => setSelectedVariant(v)}
                >
                  {v.size}
                  {isOutOfStock && <span className="slash"></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleAdd}
          disabled={!selectedVariant || selectedVariant.stock === 0}
          className={`quick-add-btn ${isAdded ? 'added' : ''} ${(!selectedVariant || selectedVariant.stock === 0) ? 'out-of-stock-btn' : ''}`}
        >
          {isAdded ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Added!
            </>
          ) : selectedVariant && selectedVariant.stock > 0 ? (
            `Quick Add (${selectedVariant.size})`
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
    </div>
  );
};
