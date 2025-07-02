import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network/standalone/esm/vis-network';
import { fetchGraphData, fetchNodeDetails, fetchEdgeDetails } from '../api/graphApi';
import { getBestNodeLabel, getNodeColor } from '../utils/nodeUtils';

/**
 * Custom hook for managing graph data and network operations
 */
export function useGraphData(user) {
  const graphRef = useRef(null);
  const networkRef = useRef(null);
  const [graphData, setGraphData] = useState(null);
  const [graphOptions, setGraphOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [nodeGroups, setNodeGroups] = useState({});

  // Fetch data from backend only once on mount
  useEffect(() => {
    if (!user) return; // Only fetch if user is logged in
    const fetchDataAndRender = async () => {
      setLoading(true);
      try {
        const data = await fetchGraphData();
        // data: { nodes: [...], relationships: [...] }
        const nodesMap = new Map();
        const edges = [];
        const edgeSet = new Set();
        const groupsMap = new Map();

        // Add all nodes
        for (const node of data.nodes || []) {
          if (node && node.elementId) {
            const id = node.elementId;
            if (!nodesMap.has(id)) {
              const label = node.labels && node.labels.length > 0 ? node.labels[0] : 'Unknown';
              nodesMap.set(id, {
                id,
                label: getBestNodeLabel(node),
                group: label,
              });
              if (!groupsMap.has(label)) {
                groupsMap.set(label, getNodeColor(label));
              }
            }
          }
        }

        // Add all relationships as edges
        for (const rel of data.relationships || []) {
          if (rel && rel.startNodeElementId && rel.endNodeElementId) {
            const from = rel.startNodeElementId;
            const to = rel.endNodeElementId;
            const edgeKey = `${from}-${to}-${rel.type}`;
            if (!edgeSet.has(edgeKey)) {
              edgeSet.add(edgeKey);
              edges.push({
                id: edgeKey,
                from,
                to,
                label: rel.type,
                arrows: 'to',
              });
            }
          }
        }

        const visData = {
          nodes: Array.from(nodesMap.values()),
          edges,
        };

        // Generate dynamic groups object for vis-network
        const groups = {};
        for (const [label, color] of groupsMap) {
          groups[label] = { color: { background: color } };
        }

        const options = {
          nodes: {
            shape: 'dot',
            size: 20,
            font: { size: 16, color: '#1E88E5' },
          },
          edges: {
            arrows: 'to',
            font: { align: 'middle' },
            color: { color: '#aaa' },
          },
          groups,
          physics: {
            enabled: true,
            barnesHut: {
              gravitationalConstant: -30000,
              centralGravity: 0.3,
              springLength: 200,
              springConstant: 0.04,
              damping: 0.09,
              avoidOverlap: 1
            },
            stabilization: {
              enabled: true,
              iterations: 250,
              updateInterval: 25,
              onlyDynamicEdges: false,
              fit: true
            }
          },
        };

        setGraphData(visData);
        setGraphOptions(options);
        setNodeGroups(Object.fromEntries(groupsMap));
      } catch (e) {
        setError(e.message || 'Error fetching or rendering data');
        setLoading(false);
      }
    };

    fetchDataAndRender();
  }, [user]);

  // Create or update the vis-network instance only when data/options change
  useEffect(() => {
    if (!graphData || !graphOptions || !graphRef.current) return;

    // Clean up previous network instance
    if (networkRef.current) {
      networkRef.current.destroy();
      networkRef.current = null;
    }

    networkRef.current = new Network(graphRef.current, graphData, graphOptions);

    // Hide loading as soon as the graph is first visually drawn
    const handleAfterDrawing = () => {
      setLoading(false);
      networkRef.current.off('afterDrawing', handleAfterDrawing);
      // Fit the entire graph into view (most zoomed out)
      try {
        networkRef.current.fit({ animation: { duration: 600, easingFunction: 'easeInOutQuad' } });
      } catch (e) {}
    };

    networkRef.current.on('afterDrawing', handleAfterDrawing);

    // Add node click event
    networkRef.current.on('click', async function (params) {
      if (params.nodes && params.nodes.length > 0) {
        setSelectedEdge(null);
        const nodeId = params.nodes[0];
        try {
          const nodeData = await fetchNodeDetails(nodeId);
          setSelectedNode(nodeData);
        } catch (e) {
          setSelectedNode(null);
        }
      } else if (params.edges && params.edges.length > 0) {
        setSelectedNode(null);
        const edgeId = params.edges[0];
        // Find the edge and its nodes from visData
        const edge = graphData.edges.find(e => e.id === edgeId || `${e.from}-${e.to}-${e.label}` === edgeId);
        if (edge) {
          try {
            const edgeData = await fetchEdgeDetails(edge.from, edge.to, edge.label);
            setSelectedEdge(edgeData);
          } catch (e) {
            setSelectedEdge(null);
          }
        }
      } else {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    });

    // Redraw on mount
    networkRef.current.redraw();

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [graphData, graphOptions]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (networkRef.current) {
        networkRef.current.redraw();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetView = () => {
    if (networkRef.current) {
      networkRef.current.fit({ animation: { duration: 600, easingFunction: 'easeInOutQuad' } });
    }
  };

  const focusNode = (nodeId, options = {}) => {
    if (networkRef.current && graphData) {
      networkRef.current.focus(nodeId, {
        scale: 1.05,
        animation: { duration: 800, easingFunction: 'easeInOutQuad' },
        ...options
      });
    }
  };

  return {
    graphRef,
    networkRef,
    graphData,
    loading,
    error,
    selectedNode,
    selectedEdge,
    setSelectedNode,
    setSelectedEdge,
    resetView,
    focusNode,
    nodeGroups
  };
} 