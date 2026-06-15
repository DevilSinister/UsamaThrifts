import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../services/db';
import type { Order } from '../services/db';
import './CheckoutView.css';

export const CheckoutView: React.FC = () => {
  const { cart, clearCart, refreshProducts, setCurrentView } = useApp();
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  
  // Checkout states
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const pct = sessionStorage.getItem('usamathrifts_discount_percent');
    if (pct) {
      setDiscountPercent(parseInt(pct));
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !address || !phone) {
      setErrorMsg('Please fill out all shipping details.');
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const result = db.placeOrder(
        {
          customerName: name,
          customerEmail: email,
          address: address,
          phone: phone,
        },
        cart
      );

      setIsSubmitting(false);

      if (result.success && result.order) {
        setPlacedOrder(result.order);
        clearCart();
        refreshProducts();
        sessionStorage.removeItem('usamathrifts_discount_percent');
      } else {
        setErrorMsg(result.error || 'Failed to place order.');
      }
    }, 1000);
  };

  if (placedOrder) {
    return (
      <div className="checkout-view success-view animate-fade-in">
        <div className="success-card">
          <div className="success-icon-wrapper animate-slide-up">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="success-checkmark">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 className="success-title">Order Placed!</h2>
          <p className="success-message">Thank you for shopping with UsamaThrifts!</p>
          
          <div className="order-details-card animate-slide-up">
            <div className="detail-row">
              <span className="detail-label">Order ID:</span>
              <span className="detail-val order-id-val">{placedOrder.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-val price-val">${placedOrder.totalAmount.toFixed(2)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Mode:</span>
              <span className="detail-val cod-badge">Cash on Delivery</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Contact Phone:</span>
              <span className="detail-val">{placedOrder.phone}</span>
            </div>
          </div>

          <p className="delivery-note animate-fade-in">We will contact you shortly on your phone number to confirm the dispatch details. Your package will arrive in 2-4 business days.</p>
          
          <button 
            onClick={() => setCurrentView('home')} 
            className="continue-btn animate-slide-up"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-view animate-fade-in">
      <div className="view-header">
        <h2 className="view-title">Checkout</h2>
      </div>

      {cart.length > 0 ? (
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h3 className="section-subtitle">1. Shipping Information</h3>
            
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cristiano Ronaldo"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cr7@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="address">Delivery Address</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, apartment, city, area code"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-subtitle">2. Payment Method</h3>
            <div className="cod-card">
              <div className="cod-header">
                <input
                  type="checkbox"
                  id="cod-check"
                  checked={true}
                  disabled={true}
                  className="cod-checkbox"
                />
                <label htmlFor="cod-check" className="cod-label">Cash on Delivery (COD)</label>
              </div>
              <p className="cod-description">
                You will pay in cash to the delivery courier once your football jerseys arrive at your doorstep. Zero online payment risk.
              </p>
            </div>
          </div>

          {/* Order Summary breakdown */}
          <div className="form-section summary-card">
            <h3 className="section-subtitle">3. Order Summary</h3>
            <div className="checkout-items-preview">
              {cart.map((item) => (
                <div className="checkout-item-row" key={item.variant.id}>
                  <span className="checkout-item-name-qty">
                    {item.product.name} <span className="item-qty">x{item.quantity}</span>
                  </span>
                  <span className="checkout-item-total">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="breakdown-rows">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="breakdown-row discount">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="breakdown-row shipping">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="breakdown-row grand-total">
                <span>Grand Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {errorMsg && <p className="error-alert">{errorMsg}</p>}

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="place-order-btn"
          >
            {isSubmitting ? 'Placing Order...' : `Confirm COD Order - $${total.toFixed(2)}`}
          </button>
        </form>
      ) : (
        <div className="empty-cart-container animate-fade-in">
          <p className="empty-cart-text">No items to checkout.</p>
          <button onClick={() => setCurrentView('home')} className="return-shop-btn">
            Return to Shop
          </button>
        </div>
      )}
    </div>
  );
};
