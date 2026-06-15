import React from 'react';
import { useApp } from '../context/AppContext';
import './CategoryScroller.css';

const CATEGORIES = [
  'All',
  'Retro Classics',
  'Premier League',
  'La Liga',
  'National Teams'
];

export const CategoryScroller: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useApp();

  return (
    <div className="category-scroller-container">
      <div className="category-scroller">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
