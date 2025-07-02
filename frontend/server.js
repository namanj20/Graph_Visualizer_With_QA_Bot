const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

const app = express();
const port = 5000;

dotenv.config({ path: '../.env' });

app.use(cors());
app.use(express.json());

const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USER = process.env.NEO4J_USER;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

app.post('/cypher', async (req, res) => {
  const { query, params } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Missing Cypher query' });
  }
  const session = driver.session();
  try {
    const result = await session.run(query, params || {});
    res.json({
      records: result.records.map(record => record.toObject()),
      summary: result.summary
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

app.post('/node', async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing node id' });
  }
  const session = driver.session();
  try {
    // Use elementId for matching
    const result = await session.run(
      'MATCH (n) WHERE elementId(n) = $id RETURN n',
      { id }
    );
    if (result.records.length === 0) {
      return res.status(404).json({ error: 'Node not found' });
    }
    const node = result.records[0].get('n');
    res.json({
      node: {
        labels: node.labels,
        properties: node.properties
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

app.post('/edge', async (req, res) => {
  const { from, to, type } = req.body;
  if (!from || !to || !type) {
    return res.status(400).json({ error: 'Missing from, to, or type' });
  }
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (a)-[r]-(b) WHERE ((elementId(a) = $from AND elementId(b) = $to) OR (elementId(a) = $to AND elementId(b) = $from)) AND type(r) = $type RETURN r, a, b',
      { from, to, type }
    );
    if (result.records.length === 0) {
      console.log('[EDGE DEBUG] No edge found for', { from, to, type });
      return res.status(404).json({ error: 'Edge not found' });
    }
    const record = result.records[0];
    const edge = record.get('r');
    const nodeA = record.get('a');
    const nodeB = record.get('b');
    const getElemId = n => (typeof n.elementId === 'function' ? n.elementId() : n.elementId);
    // Log all relevant info for debugging
    console.log('[EDGE DEBUG]', {
      from,
      to,
      type,
      nodeA_id: getElemId(nodeA),
      nodeB_id: getElemId(nodeB),
      nodeA_labels: nodeA.labels,
      nodeB_labels: nodeB.labels,
      edge_type: edge.type
    });
    let fromNode, toNode;
    if (getElemId(nodeA) === from) {
      fromNode = nodeA;
      toNode = nodeB;
    } else {
      fromNode = nodeB;
      toNode = nodeA;
    }
    res.json({
      edge: {
        type: edge.type,
        properties: edge.properties
      },
      fromNode: {
        labels: fromNode.labels,
        properties: fromNode.properties
      },
      toNode: {
        labels: toNode.labels,
        properties: toNode.properties
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});




app.listen(port, () => {
  console.log(`Neo4j proxy server listening at http://localhost:${port}`);
}); 