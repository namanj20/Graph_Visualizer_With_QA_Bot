import React from 'react';
import { getBestNodeLabel, getNodeColor } from '../utils/nodeUtils';

/**
 * EdgeModal component for displaying edge details
 */
function EdgeModal({ selectedEdge, onClose }) {
  if (!selectedEdge) return null;

  return (
    <div 
      className="node-modal-overlay" 
      onClick={e => { if (e.target.classList.contains('node-modal-overlay')) onClose(); }}
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
      <div className="node-modal-card edge-modal-card">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            alignItems: 'center',
            gap: 0,
            height: '100%',
            width: '100%',
            margin: '0 auto',
            padding: '8px 0',
            background: 'none',
          }}
        >
          {/* From Node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: getNodeColor(selectedEdge.fromNode.labels[0]), display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}></div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginTop: 2, textAlign: 'center', wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: 100 }}>{getBestNodeLabel(selectedEdge.fromNode)}</div>
          </div>
          {/* Relationship */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: 15, marginBottom: 2, textAlign: 'center', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{selectedEdge.edge.type}</div>
            <svg width="48" height="20" style={{ display: 'block' }}>
              <line x1="6" y1="10" x2="42" y2="10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="42,10 36,6 36,14" fill="#fff" />
            </svg>
          </div>
          {/* To Node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: getNodeColor(selectedEdge.toNode.labels[0]), display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}></div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginTop: 2, textAlign: 'center', wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: 100 }}>{getBestNodeLabel(selectedEdge.toNode)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EdgeModal; 