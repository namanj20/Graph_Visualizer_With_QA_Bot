/**
 * API service for graph operations
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Fetch graph data from Neo4j
 * @returns {Promise<Object>} The graph data
 */
export async function fetchGraphData() {
  const response = await fetch(`${BASE_URL}/cypher`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  
  return data;
}

/**
 * Fetch node details by ID
 * @param {string} nodeId - The node ID
 * @returns {Promise<Object>} The node data
 */
export async function fetchNodeDetails(nodeId) {
  const response = await fetch(`${BASE_URL}/node`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: nodeId })
  });
  
  const data = await response.json();
  if (data && data.node) {
    return {
      id: nodeId,
      label: data.node.labels && data.node.labels[0],
      properties: data.node.properties
    };
  }
  
  return null;
}

/**
 * Fetch edge details
 * @param {string} from - The source node ID
 * @param {string} to - The target node ID
 * @param {string} type - The relationship type
 * @returns {Promise<Object>} The edge data
 */
export async function fetchEdgeDetails(from, to, type) {
  const response = await fetch(`${BASE_URL}/edge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, type })
  });
  
  const data = await response.json();
  if (data && data.edge && data.fromNode && data.toNode) {
    return {
      edge: data.edge,
      fromNode: data.fromNode,
      toNode: data.toNode
    };
  }
  
  return null;
}

/**
 * Send a question to the QA system
 * @param {string} question - The question to ask
 * @returns {Promise<string>} The answer
 */
export async function askQuestion(question) {
  const response = await fetch(`${BASE_URL}/api/graph-qa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  
  const data = await response.json();
  return data.answer || 'Sorry, I could not get a response.';
} 