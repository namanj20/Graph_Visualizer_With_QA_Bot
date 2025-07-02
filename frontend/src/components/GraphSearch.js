import React from 'react';

/**
 * GraphSearch component for searching nodes in the graph
 */
function GraphSearch({ searchTerm, onSearchChange, onSearchKeyDown, searchNotFound }) {
  return (
    <div className="graph-search-box-absolute">
      <div className="graph-search-box-with-message">
        <div className="graph-search-box">
          <span className="search-icon" aria-label="search">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="7" stroke="#888" strokeWidth="2"/>
              <line x1="14.2" y1="14.2" x2="18" y2="18" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            className="search-input"
            type="text"
            placeholder=" Search..."
            value={searchTerm}
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown}
            autoComplete="off"
          />
        </div>
        {searchNotFound && (
          <div className="search-no-match-message">No matches found.</div>
        )}
      </div>
    </div>
  );
}

export default GraphSearch; 