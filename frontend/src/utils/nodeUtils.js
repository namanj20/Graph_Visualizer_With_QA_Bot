/**
 * Utility functions for node operations
 */

import nodeLabelConfig from '../nodeLabelConfig.json';

/**
 * Get the best label for a node based on config and its properties
 * @param {Object} node - The node object
 * @returns {string} The best label for the node
 */
export function getBestNodeLabel(node) {
  if (!node || !node.labels || node.labels.length === 0) return node.label || '';
  
  // Use config if available
  const labelType = node.labels[0];
  const configProperty = nodeLabelConfig[labelType] || nodeLabelConfig['default'];
  if (configProperty && node.properties?.[configProperty]) {
    return node.properties[configProperty];
  }
  
  // Try to find a name-like property first (fallback)
  const nameProperties = ['name', 'Name', 'title', 'Title', 'label', 'Label'];
  for (const prop of nameProperties) {
    if (node.properties?.[prop]) {
      return node.properties[prop];
    }
  }
  
  // If no name property found, try to find any property that might be a good label
  const properties = Object.keys(node.properties || {});
  if (properties.length > 0) {
    // Look for properties that contain 'name' or 'title' in their key
    const nameLikeProps = properties.filter(prop => 
      prop.toLowerCase().includes('name') || 
      prop.toLowerCase().includes('title') ||
      prop.toLowerCase().includes('label')
    );
    if (nameLikeProps.length > 0) {
      return node.properties[nameLikeProps[0]];
    }
    // Fallback to first property
    return node.properties[properties[0]];
  }
  
  return node.label || '';
}

/**
 * Get the color for a node based on its label
 * @param {string} label - The node label
 * @returns {string} The color hex code
 */
export function getNodeColor(label) {
  // Generate a consistent color based on the label string
  if (!label) return '#888';
  
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate a color from the hash
  const hue = Math.abs(hash) % 360;
  const saturation = 70 + (Math.abs(hash) % 20); // 70-90%
  const lightness = 45 + (Math.abs(hash) % 15); // 45-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get a unique ID from a Neo4j node
 * @param {Object} node - The Neo4j node object
 * @returns {string} The unique ID
 */
export function getVisIdFromNode(node) {
  if (!node) return undefined;
  if (node.elementId) return node.elementId;
  if (node.identity && node.identity.toString) return node.identity.toString();
  return String(node.identity);
}

/**
 * Get relationship endpoint ID
 * @param {Object} rel - The relationship object
 * @param {string} key - The key ('start' or 'end')
 * @returns {string} The endpoint ID
 */
export function getRelEndpointId(rel, key) {
  if (rel[key + 'NodeElementId']) return rel[key + 'NodeElementId'];
  if (rel[key]) return typeof rel[key] === 'object' && rel[key].toString ? rel[key].toString() : String(rel[key]);
  return undefined;
}

/**
 * Format a property value for display
 * @param {*} value - The property value
 * @returns {string} The formatted value
 */
export function formatPropertyValue(value) {
  if (typeof value === 'object' && value !== null) {
    if (typeof value.low === 'number' && typeof value.high === 'number') {
      if (value.high === 0) {
        return value.low.toString();
      } else {
        return (value.low + value.high * Math.pow(2, 32)).toString();
      }
    } else if (Array.isArray(value)) {
      return value.join(', ');
    } else {
      return JSON.stringify(value);
    }
  }
  return String(value);
} 