import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../services/db';
import type { Product } from '../services/db';
import { AdminLogin } from './AdminLogin';
import './AdminView.css';

export const AdminView: React.FC = () => {
  const { products, orders, refreshProducts, refreshOrders } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'add_product' | 'manage_stock'>('analytics');
  
  // Add Product Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Retro Classics');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [conditionGrade, setConditionGrade] = useState('9/10');
  
  // Variant Stock levels
  const [stockS, setStockS] = useState('5');
  const [stockM, setStockM] = useState('5');
  const [stockL, setStockL] = useState('5');
  const [stockXL, setStockXL] = useState('3');

  // Feedback states
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Selected product for stock editing
  const [selectedProdStockId, setSelectedProdStockId] = useState('');
  const [tempStockState, setTempStockState] = useState<{ [key: string]: number }>({});

  const analytics = db.getAnalytics();

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name || !description || !price || !conditionGrade) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Please enter a valid price.');
      return;
    }

    const originalPriceNum = originalPrice ? parseFloat(originalPrice) : undefined;

    // Default placeholder image if none provided
    const img = imageUrl.trim() || '/images/jerseys/brazil_2002.png';

    const variantSpecs = [
      { size: 'S', color: 'Default', stock: parseInt(stockS) || 0 },
      { size: 'M', color: 'Default', stock: parseInt(stockM) || 0 },
      { size: 'L', color: 'Default', stock: parseInt(stockL) || 0 },
      { size: 'XL', color: 'Default', stock: parseInt(stockXL) || 0 }
    ];

    try {
      db.addProduct(
        {
          name,
          category,
          description,
          price: priceNum,
          originalPrice: originalPriceNum,
          imageUrl: img,
          rating: 4.8 + Math.random() * 0.2, // Generates a rating between 4.8 and 5.0
          conditionGrade
        },
        variantSpecs
      );

      setSuccessMsg('Product added successfully!');
      refreshProducts();

      // Reset form fields
      setName('');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setImageUrl('');
      setConditionGrade('9/10');
      setStockS('5');
      setStockM('5');
      setStockL('5');
      setStockXL('3');
    } catch (e: any) {
      setErrorMsg('Failed to add product.');
    }
  };

  const handleSelectProductForStock = (prod: Product) => {
    setSelectedProdStockId(prod.id);
    const initialStocks: { [key: string]: number } = {};
    prod.variants.forEach(v => {
      initialStocks[v.id] = v.stock;
    });
    setTempStockState(initialStocks);
  };

  const handleSaveStock = (productId: string) => {
    let success = true;
    Object.entries(tempStockState).forEach(([variantId, newStock]) => {
      const ok = db.updateVariantStock(productId, variantId, newStock);
      if (!ok) success = false;
    });

    if (success) {
      alert('Stock levels updated successfully!');
      setSelectedProdStockId('');
      refreshProducts();
    } else {
      alert('Error updating stock levels.');
    }
  };

  const handleResetDb = () => {
    if (window.confirm('Are you sure you want to reset the store database to original seed data? This deletes all custom products and order records.')) {
      db.resetDatabase();
      refreshProducts();
      refreshOrders();
      alert('Store database reset successfully.');
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="admin-view animate-fade-in">
      <div className="view-header">
        <h2 className="view-title">Admin Dashboard</h2>
        <div className="admin-header-buttons">
          <button onClick={handleResetDb} className="reset-db-btn">
            Reset DB
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="logout-btn">
            Log Out
          </button>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics & Orders
        </button>
        <button 
          className={`admin-tab ${activeTab === 'add_product' ? 'active' : ''}`}
          onClick={() => setActiveTab('add_product')}
        >
          Add Product
        </button>
        <button 
          className={`admin-tab ${activeTab === 'manage_stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage_stock')}
        >
          Manage Stock
        </button>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="tab-content animate-fade-in">
          <div className="analytics-summary">
            <div className="analytics-card">
              <span className="analytics-label">Total Revenue</span>
              <span className="analytics-val">${analytics.totalSales.toFixed(2)}</span>
            </div>
            <div className="analytics-card">
              <span className="analytics-label">Total Orders</span>
              <span className="analytics-val">{analytics.totalOrders}</span>
            </div>
            <div className="analytics-card">
              <span className="analytics-label">Product Catalog</span>
              <span className="analytics-val">{analytics.totalProductsCount}</span>
            </div>
          </div>

          {/* Low Stock Alerts */}
          {analytics.lowStockAlerts.length > 0 && (
            <div className="admin-section alerts-section">
              <h3 className="section-subtitle">⚠️ Low Stock Alerts</h3>
              <div className="alert-list">
                {analytics.lowStockAlerts.map((alert, index) => (
                  <div key={index} className="alert-row">
                    <span>{alert.productName} (Size: {alert.size})</span>
                    <span className="alert-stock-badge">
                      {alert.stock === 0 ? 'Out of Stock' : `${alert.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Received */}
          <div className="admin-section">
            <h3 className="section-subtitle">Received Orders</h3>
            {orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-item-card">
                    <div className="order-header">
                      <span className="order-id">ID: {order.id}</span>
                      <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="order-customer">
                      <p><strong>Customer:</strong> {order.customerName}</p>
                      <p><strong>Phone:</strong> {order.phone}</p>
                      <p><strong>Address:</strong> {order.address}</p>
                    </div>

                    <div className="order-items-summary">
                      <p className="items-label">Ordered Items:</p>
                      {order.items.map((item, index) => (
                        <div key={index} className="ordered-item-row">
                          <span>• {item.productName} (Size: {item.size})</span>
                          <span>x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <span className="order-total-lbl">COD Payment:</span>
                      <span className="order-total-val">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-orders-msg">No orders received yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Add Product Tab */}
      {activeTab === 'add_product' && (
        <form onSubmit={handleAddProduct} className="add-product-form tab-content animate-fade-in">
          <h3 className="section-subtitle">Add New Football Jersey</h3>
          
          <div className="input-group">
            <label>Jersey Title *</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Barcelona 2006 Retro Home" 
              required 
            />
          </div>

          <div className="input-row-group">
            <div className="input-group flex-2">
              <label>Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Retro Classics">Retro Classics</option>
                <option value="Premier League">Premier League</option>
                <option value="La Liga">La Liga</option>
                <option value="National Teams">National Teams</option>
              </select>
            </div>
            
            <div className="input-group flex-1">
              <label>Condition Grade *</label>
              <input 
                type="text" 
                value={conditionGrade} 
                onChange={(e) => setConditionGrade(e.target.value)} 
                placeholder="e.g. 9/10" 
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Description *</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Provide historical context or special features of the jersey kit..." 
              rows={3} 
              required 
            />
          </div>

          <div className="input-row-group">
            <div className="input-group">
              <label>Price ($) *</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="45.00" 
                step="0.01" 
                required 
              />
            </div>
            <div className="input-group">
              <label>Original Price ($)</label>
              <input 
                type="number" 
                value={originalPrice} 
                onChange={(e) => setOriginalPrice(e.target.value)} 
                placeholder="65.00" 
                step="0.01" 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Mockup Image URL (Optional)</label>
            <input 
              type="url" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              placeholder="https://example.com/jersey.jpg" 
            />
          </div>

          <div className="variants-stock-builder">
            <label className="section-label">Initial Variant Stock Levels (Sizes):</label>
            <div className="stock-input-grid">
              <div className="stock-input-card">
                <span>Size S</span>
                <input type="number" value={stockS} onChange={(e) => setStockS(e.target.value)} min="0" />
              </div>
              <div className="stock-input-card">
                <span>Size M</span>
                <input type="number" value={stockM} onChange={(e) => setStockM(e.target.value)} min="0" />
              </div>
              <div className="stock-input-card">
                <span>Size L</span>
                <input type="number" value={stockL} onChange={(e) => setStockL(e.target.value)} min="0" />
              </div>
              <div className="stock-input-card">
                <span>Size XL</span>
                <input type="number" value={stockXL} onChange={(e) => setStockXL(e.target.value)} min="0" />
              </div>
            </div>
          </div>

          {errorMsg && <p className="error-alert">{errorMsg}</p>}
          {successMsg && <p className="success-banner">{successMsg}</p>}

          <button type="submit" className="save-product-btn">
            Publish Jersey
          </button>
        </form>
      )}

      {/* Manage Stock Tab */}
      {activeTab === 'manage_stock' && (
        <div className="tab-content manage-stock-tab animate-fade-in">
          <h3 className="section-subtitle">Inventory Management</h3>
          <p className="instructions-lbl">Select a product to view and adjust its sizes and stock levels:</p>
          
          <div className="products-list-admin">
            {products.map((prod) => {
              const isSelected = selectedProdStockId === prod.id;
              
              return (
                <div key={prod.id} className={`admin-prod-stock-card ${isSelected ? 'active' : ''}`}>
                  <div className="prod-stock-header" onClick={() => handleSelectProductForStock(prod)}>
                    <img src={prod.imageUrl} alt={prod.name} className="prod-stock-img" />
                    <div className="prod-stock-title-info">
                      <span className="prod-stock-name">{prod.name}</span>
                      <span className="prod-stock-cat">{prod.category} • ${prod.price.toFixed(2)}</span>
                    </div>
                    <span className="prod-stock-arrow">{isSelected ? '▲' : '▼'}</span>
                  </div>

                  {isSelected && (
                    <div className="prod-stock-body animate-slide-up">
                      <div className="stock-adjustment-grid">
                        {prod.variants.map((v) => (
                          <div key={v.id} className="stock-adjust-row">
                            <span className="size-label">Size {v.size} ({v.color})</span>
                            <div className="stock-adjust-inputs">
                              <button 
                                type="button" 
                                className="adjust-btn"
                                onClick={() => setTempStockState(prev => ({
                                  ...prev,
                                  [v.id]: Math.max(0, (prev[v.id] ?? v.stock) - 1)
                                }))}
                              >
                                -
                              </button>
                              <span className="adjust-val">
                                {tempStockState[v.id] ?? v.stock}
                              </span>
                              <button 
                                type="button" 
                                className="adjust-btn"
                                onClick={() => setTempStockState(prev => ({
                                  ...prev,
                                  [v.id]: (prev[v.id] ?? v.stock) + 1
                                }))}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="stock-actions-row">
                        <button 
                          className="cancel-stock-btn" 
                          onClick={() => setSelectedProdStockId('')}
                        >
                          Cancel
                        </button>
                        <button 
                          className="save-stock-btn" 
                          onClick={() => handleSaveStock(prod.id)}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
