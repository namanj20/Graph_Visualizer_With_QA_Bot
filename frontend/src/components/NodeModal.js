import React, { useState, useEffect } from 'react';
import { formatPropertyValue } from '../utils/nodeUtils';

/**
 * NodeModal component for displaying node details
 */
function NodeModal({ selectedNode, onClose }) {
  const [carouselPage, setCarouselPage] = useState(0);

  // Reset carousel when node changes
  useEffect(() => {
    setCarouselPage(0);
  }, [selectedNode]);

  if (!selectedNode) return null;

  // Get all properties for the node in the order they're fetched
  const getNodeProperties = () => {
    if (!selectedNode.properties) return [];
    
    // Return all properties in the order they're fetched, no filtering or ordering
    return Object.entries(selectedNode.properties);
  };

  const properties = getNodeProperties();
  const totalPages = properties.length;

  const nextCarouselPage = () => {
    if (totalPages > 0) {
      setCarouselPage((prev) => (prev + 1) % totalPages);
    }
  };

  const prevCarouselPage = () => {
    if (totalPages > 0) {
      setCarouselPage((prev) => (prev - 1 + totalPages) % totalPages);
    }
  };

  // Get current property
  const getCurrentProperty = () => {
    if (totalPages === 0) return null;
    const [key, value] = properties[carouselPage];
    return { key, value };
  };

  const currentProperty = getCurrentProperty();

  return (
    <div 
      className="node-modal-overlay" 
      onClick={e => { if (e.target.classList.contains('node-modal-overlay')) { onClose(); } }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className={`node-modal-card ${selectedNode.label === 'VC' ? 'vc-modal-card' : 'node-modal-nonvc'}`}>
        {/* Modal header */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 24 }}>{selectedNode.label}</div>
        </div>
        
        {/* Carousel content for all nodes */}
        {totalPages > 0 ? (
          <div className="node-modal-carousel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Navigation bar at the top */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: 18,
              flexShrink: 0
            }}>
              <button 
                className="node-modal-carousel-arrow" 
                onClick={prevCarouselPage} 
                style={{ fontWeight: 700, fontSize: 20, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                &lt;
              </button>
              <span style={{ fontWeight: 700, fontSize: 18, textAlign: 'center', flex: 1 }}>
                {currentProperty.key}
              </span>
              <button 
                className="node-modal-carousel-arrow" 
                onClick={nextCarouselPage} 
                style={{ fontWeight: 700, fontSize: 20, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                &gt;
              </button>
            </div>
            {/* Content below navigation */}
            <div className="node-modal-carousel-page" style={{ 
              flex: 1,
              display: 'flex', 
              alignItems: 'flex-start', 
              justifyContent: 'center',
              minHeight: 0,
              overflow: 'hidden',
              textAlign: 'center',
              overflowY: 'auto'
            }}>
              <div style={{
                fontSize: 16,
                color: '#fff',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                maxWidth: '100%',
                width: '100%',
                lineHeight: 1.6,
                textAlign: 'center',
                padding: '8px',
                boxSizing: 'border-box'
              }}>
                {formatPropertyValue(currentProperty.value)}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: '#fff', 
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '120px'
          }}>
            No properties available for this node.
          </div>
        )}
      </div>
    </div>
  );
}

export default NodeModal; 