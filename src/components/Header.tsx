import React from 'react';
import { useApp } from '../context/AppContext';
import './Header.css';

export const Header: React.FC = () => {
  const { cart, searchQuery, setSearchQuery, currentView, setCurrentView } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="app-header">
      <div className="header-top">
        <h1 className="brand-logo" onClick={() => setCurrentView('home')}>
          Usama<span>Thrifts</span>
        </h1>
        
        <button 
          className={`cart-btn ${currentView === 'cart' ? 'active' : ''}`} 
          onClick={() => setCurrentView('cart')}
          aria-label="View Cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {totalCartCount > 0 && (
            <span className="cart-badge animate-fade-in">{totalCartCount}</span>
          )}
        </button>
      </div>

      {currentView === 'home' && (
        <div className="search-bar-container animate-fade-in">
          <div className="search-input-wrapper">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search retro jerseys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search-btn" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear Search"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
