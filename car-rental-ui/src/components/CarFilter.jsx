import React from 'react';
import { Search, Filter } from 'lucide-react';

export const CarFilter = ({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  maxPrice,
  setMaxPrice,
  isAvailableOnly,
  setIsAvailableOnly,
}) => {
  return (
    <div className="filter-container">
      <div className="filter-grid">
        {/* Search Input */}
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search make, model, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Category Selector */}
        <div className="filter-group">
          <label className="filter-label">
            <Filter size={16} /> Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Max Daily Rate Slider */}
        <div className="filter-group">
          <label className="filter-label">
            Max Price: <span className="price-highlight">${maxPrice} / day</span>
          </label>
          <input
            type="range"
            min="30"
            max="300"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="price-slider"
          />
        </div>

        {/* Availability Toggle */}
        <div className="filter-toggle">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isAvailableOnly}
              onChange={(e) => setIsAvailableOnly(e.target.checked)}
              className="checkbox-input"
            />
            <span>Available Cars Only</span>
          </label>
        </div>
      </div>
    </div>
  );
};
