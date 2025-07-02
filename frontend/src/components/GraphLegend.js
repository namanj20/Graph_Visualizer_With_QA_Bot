import React, { useState } from 'react';

/**
 * GraphLegend component for displaying node type legend
 */
function GraphLegend({ nodeGroups = {} }) {
  const [legendOpen, setLegendOpen] = useState(false);

  // Get unique node groups from the provided data
  const getLegendItems = () => {
    const items = [];
    for (const [label, color] of Object.entries(nodeGroups)) {
      items.push({ label, color });
    }
    return items;
  };

  const legendItems = getLegendItems();

  return (
    <div className="graph-legend-bottom">
      <button
        className="reset-btn legend-toggle-btn"
        onClick={() => setLegendOpen((open) => !open)}
        style={{ marginBottom: legendOpen ? 8 : 0 }}
      >
        Legend
      </button>
      {legendOpen && legendItems.length > 0 && (
        <div className="graph-legend">
          {legendItems.map(({ label, color }) => (
            <div key={label} className="legend-item">
              <span className="legend-color" style={{ background: color }}></span>
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GraphLegend; 