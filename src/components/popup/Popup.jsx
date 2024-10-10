// components/Popup.js
import React from 'react';
import './popup-styles.css'

function Popup({ showPopup, setShowPopup, groupBy, setGroupBy, sortOption, setSortOption }) {
  if (!showPopup) return null;

  return (
    <div className="popup">
      {/* Grouping and Sorting menus in a single column */}
      <div className="options-container">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="group">Grouping:</label>
          <select
            id="group"
            value={groupBy}
            onChange={(e) => {
              setGroupBy(e.target.value);
              setSortOption('priority'); // Reset sort option when changing grouping
            }}
          >
            <option value="priority">Priority</option>
            <option value="user">User</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Sorting menu */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="sort">Ordering:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Popup;
