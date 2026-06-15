import React from 'react';
import { useApp, type ViewType } from '../context/AppContext';
import './BottomNavBar.css';

export const BottomNavBar: React.FC = () => {
  const { currentView, setCurrentView, cart } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems: { view: ViewType; label: string; icon: React.ReactNode }[] = [
    {
      view: 'home',
      label: 'Shop',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      view: 'cart',
      label: 'Cart',
      icon: (
        <div className="cart-nav-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {totalCartCount > 0 && (
            <span className="cart-nav-badge animate-fade-in">{totalCartCount}</span>
          )}
        </div>
      )
    }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = currentView === item.view || (item.view === 'cart' && currentView === 'checkout');
        return (
          <button
            key={item.view}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setCurrentView(item.view)}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
