import React from 'react';
import GraphSearch from './GraphSearch';
import GraphLegend from './GraphLegend';
import NodeModal from './NodeModal';
import EdgeModal from './EdgeModal';

/**
 * GraphContainer component that wraps the graph visualization
 */
function GraphContainer({ 
  graphRef, 
  loading, 
  darkMode, 
  searchTerm, 
  onSearchChange, 
  onSearchKeyDown, 
  searchNotFound, 
  onResetView,
  selectedNode,
  selectedEdge,
  onCloseNodeModal,
  onCloseEdgeModal,
  nodeGroups
}) {
  console.log('GraphContainer darkMode:', darkMode, 'loading:', loading);

  return (
    <div
      className="graph-fullscreen"
      id="graph-container"
      style={{
        position: 'relative',
        width: '60vw', // 3/5th of viewport width
        height: '100%',
        minWidth: 800,
        minHeight: 0,
        marginLeft: 0, // align to left
        marginTop: 'auto',
        marginBottom: 'auto',
        flex: '0 0 60%',
      }}
    >
      {/* Dedicated container for vis-network only */}
      <div
        ref={graphRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
      
      {/* Overlays as siblings, not children of vis-network container */}
      <GraphSearch 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onSearchKeyDown={onSearchKeyDown}
        searchNotFound={searchNotFound}
      />
      
      <div className="graph-reset-box-inside">
        <button className="reset-btn" onClick={onResetView}>
          Reset View
        </button>
      </div>
      
      <GraphLegend nodeGroups={nodeGroups} />
      
      {/* Node and edge modals - positioned within graph area only */}
      <NodeModal selectedNode={selectedNode} onClose={onCloseNodeModal} />
      <EdgeModal selectedEdge={selectedEdge} onClose={onCloseEdgeModal} />
      
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: darkMode ? 'rgba(24,28,35,0.97)' : 'rgba(255,255,255,0.92)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          boxShadow: darkMode ? '0 0 0 2px #23272f, 0 8px 32px rgba(0,0,0,0.25)' : 'none',
          border: darkMode ? '1.5px solid #23272f' : 'none',
        }}>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 24, color: darkMode ? '#f7f9fb' : '#0077be', letterSpacing: 1 }}>Generating graph...</div>
          <div style={{ width: 240, height: 8, background: '#e0e0e0', borderRadius: 6, overflow: 'hidden' }}>
            <div className="progress-bar-animated" style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, #1E88E5 0%, #43A047 100%)', borderRadius: 6, animation: 'progressBarAnim 1.2s linear infinite' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default GraphContainer; 