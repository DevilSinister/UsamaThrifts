import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './CartView.css';

export const CartView: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, setCurrentView } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    
    if (couponCode.trim().toUpperCase() === 'RETRO20') {
      setDiscountPercent(20);
      setCouponSuccess('Coupon "RETRO20" applied! (20% Off)');
    } else if (couponCode.trim()) {
      setCouponError('Invalid coupon code.');
      setDiscountPercent(0);
    }
  };

  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  const handleProceedToCheckout = () => {
    // Pass coupon information to sessionStorage if needed, or we'll just handle it on state
    sessionStorage.setItem('usamathrifts_discount_percent', discountPercent.toString());
    setCurrentView('checkout');
  };

  return (
    <div className="cart-view animate-fade-in">
      <div className="view-header">
        <h2 className="view-title">Shopping Cart</h2>
      </div>

      {cart.length > 0 ? (
        <div className="cart-content">
          <div className="cart-items-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.variant.id}>
                <div className="cart-item-image">
                  <img src={item.product.imageUrl} alt={item.product.name} />
                </div>
                <div className="cart-item-details">
                  <span className="cart-item-category">{item.product.category}</span>
                  <h4 className="cart-item-name">{item.product.name}</h4>
                  <div className="cart-item-meta">
                    <span className="meta-badge">Size: {item.variant.size}</span>
                    <span className="meta-badge">Color: {item.variant.color}</span>
                  </div>
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">${item.product.price.toFixed(2)}</span>
                    <div className="quantity-selector">
                      <button 
                        type="button" 
                        onClick={() => updateCartQuantity(item.variant.id, item.quantity - 1)}
                        className="qty-btn"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        type="button" 
                        onClick={() => updateCartQuantity(item.variant.id, item.quantity + 1)}
                        className="qty-btn"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.variant.id)}
                  className="remove-item-btn"
                  aria-label="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div className="cart-section summary-card">
            <h4 className="section-subtitle">Have a Promo Code?</h4>
            <div className="coupon-input-group">
              <input
                type="text"
                placeholder="e.g. RETRO20"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
              />
              <button onClick={handleApplyCoupon} className="coupon-apply-btn">
                Apply
              </button>
            </div>
            {couponError && <p className="coupon-message error-msg">{couponError}</p>}
            {couponSuccess && <p className="coupon-message success-msg">{couponSuccess}</p>}
          </div>

          {/* Checkout Calculations */}
          <div className="cart-section summary-card total-summary-card">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="summary-row discount-row">
                <span>Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row shipping-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE (Cash on Delivery)</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleProceedToCheckout} 
              className="checkout-proceed-btn"
            >
              Checkout via COD
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart-container animate-fade-in">
          <svg className="empty-cart-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h3 className="empty-cart-title">Your Cart is Empty</h3>
          <p className="empty-cart-text">Looks like you haven't added any football jerseys to your cart yet.</p>
          <button onClick={() => setCurrentView('home')} className="return-shop-btn">
            Go Back Shopping
          </button>
        </div>
      )}
    </div>
  );
};
