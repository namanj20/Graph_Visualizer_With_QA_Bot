import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_groq import ChatGroq
from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import logging
from pymongo import MongoClient
import bcrypt
from werkzeug.utils import secure_filename
import base64
import neo4j
from custom_cypher_prompt import CUSTOM_CYPHER_PROMPT
import warnings

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# CORS configuration
CORS(app)

# Environment variable validation
def validate_env_vars():
    """Validate that all required environment variables are set"""
    required_vars = [
        'NEO4J_URI', 'NEO4J_USER', 'NEO4J_PASSWORD',
        'GROQ_API_KEY', 'GROQ_MODEL'
    ]
    missing_vars = [var for var in required_vars if not os.environ.get(var)]
    if missing_vars:
        raise ValueError(f"Missing required environment variables: {missing_vars}")

# Validate environment variables on startup
try:
    validate_env_vars()
except ValueError as e:
    logger.error(f"Environment validation failed: {e}")
    raise

# Neo4j connection configuration
NEO4J_URI = os.environ['NEO4J_URI']
NEO4J_USER = os.environ['NEO4J_USER']
NEO4J_PASSWORD = os.environ['NEO4J_PASSWORD']

# Initialize Neo4j graph connection
try:
    graph = Neo4jGraph(
        url=NEO4J_URI,
        username=NEO4J_USER,
        password=NEO4J_PASSWORD
    )
    logger.info("Neo4j connection established successfully")
except Exception as e:
    logger.error(f"Failed to connect to Neo4j: {e}")
    raise

# Groq LLM configuration
GROQ_API_KEY = os.environ['GROQ_API_KEY']
GROQ_MODEL = os.environ.get('GROQ_MODEL', 'llama-3.1-8b-instant')
GROQ_TEMPERATURE = float(os.environ.get('GROQ_TEMPERATURE', '0.0'))
GROQ_MAX_TOKENS = int(os.environ.get('GROQ_MAX_TOKENS', '1000'))

# Initialize Groq LLM
try:
    llm = ChatGroq(
        api_key=GROQ_API_KEY,
        model=GROQ_MODEL,
        temperature=GROQ_TEMPERATURE,
        max_tokens=GROQ_MAX_TOKENS
    )
    logger.info(f"Groq LLM initialized with model: {GROQ_MODEL}")
except Exception as e:
    logger.error(f"Failed to initialize Groq LLM: {e}")
    raise

# Prompt to generate Cypher query (now imported from separate file)
RESPONSE_PROMPT = PromptTemplate(
    input_variables=["question", "context"],
    template=(
        "You are a helpful assistant. Based on the Cypher query result below, answer the question.\n"
        "Do NOT summarize or omit values.\n"
        "Use the full context"
        "Do not say you don't know if the result has the answer.\n\n"
        "Make the answer into a sentence.\n"
        "Question: {question}\n"
        "Result: {context}\n"
        "Answer:"
    )
)

# Create the QA chain with both prompts (exactly as before)
try:
    chain = GraphCypherQAChain.from_llm(
        llm=llm,
        graph=graph,
        verbose=True,
        allow_dangerous_requests=True,
        cypher_prompt=CUSTOM_CYPHER_PROMPT,
        qa_prompt=RESPONSE_PROMPT
    )
    logger.info("GraphCypherQAChain initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize GraphCypherQAChain: {e}")
    raise

# MongoDB connection setup
MONGODB_URI = os.environ.get('MONGODB_URI')
MONGODB_DB_NAME = os.environ.get('DB_NAME')

mongo_client = MongoClient(MONGODB_URI)
mongo_db = mongo_client[MONGODB_DB_NAME]
users_collection = mongo_db['users']

def serialize_node(node):
    if not node:
        return None
    return {
        "elementId": getattr(node, "element_id", None) or getattr(node, "elementId", None),
        "labels": getattr(node, "labels", []),
        "properties": dict(getattr(node, "properties", {}))
    }

# Neo4j direct driver setup for /cypher endpoint
NEO4J_DRIVER = neo4j.GraphDatabase.driver(
    NEO4J_URI,
    auth=(NEO4J_USER, NEO4J_PASSWORD)
)

warnings.filterwarnings("ignore", category=DeprecationWarning)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'service': 'graph-qa-api',
        'neo4j_connected': True,
        'llm_configured': True
    }), 200

@app.route('/api/graph-qa', methods=['POST'])
def graph_qa():
    """Main graph QA endpoint - exactly the same logic as before"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    
    question = data.get('question')
    if not question:
        return jsonify({'error': 'Missing question'}), 400
    
    try:
        logger.info(f"Processing question: {question}")
        response = chain.invoke({"query": question})
        logger.info("Chain response generated successfully")
        
        # Return response exactly as before
        return jsonify({
            'answer': response['result'] if isinstance(response, dict) and 'result' in response else response
        })
    except Exception as e:
        logger.error(f"Error processing question: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/signup', methods=['POST'])
def signup():
    if 'username' not in request.form or 'password' not in request.form or 'photo' not in request.files:
        return jsonify({'error': 'Username, password, and photo are required.'}), 400

    username = request.form['username']
    password = request.form['password']
    photo = request.files['photo']

    # Check if user already exists
    if users_collection.find_one({'username': username}):
        return jsonify({'error': 'Username already exists.'}), 409

    # Hash the password
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Read image as binary
    photo_data = photo.read()

    # Store in MongoDB
    user_doc = {
        'username': username,
        'password': hashed_pw,
        'photo': photo_data
    }
    users_collection.insert_one(user_doc)

    return jsonify({'message': 'User registered successfully.'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Username and password are required.'}), 400

    username = data['username']
    password = data['password']

    user = users_collection.find_one({'username': username})
    if not user:
        return jsonify({'error': 'Invalid username or password.'}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({'error': 'Invalid username or password.'}), 401

    # Encode the image as base64 for frontend display
    photo_base64 = base64.b64encode(user['photo']).decode('utf-8') if user.get('photo') else None

    return jsonify({
        'username': username,
        'photo': photo_base64
    }), 200

@app.route('/cypher', methods=['POST'])
def cypher_graph():
    """Return all nodes and all relationships for visualization using the raw Neo4j driver"""
    try:
        with NEO4J_DRIVER.session() as session:
            # Get all nodes
            node_result = session.run('MATCH (n) RETURN n')
            nodes = []
            for rec in node_result:
                n = rec.get('n')
                nodes.append({
                    "elementId": n.element_id if hasattr(n, 'element_id') else getattr(n, 'elementId', None),
                    "labels": list(n.labels) if hasattr(n, 'labels') else [],
                    "properties": dict(n.items()) if hasattr(n, 'items') else dict(getattr(n, 'properties', {})),
                    "identity": str(n.id) if hasattr(n, 'id') else None
                })
            # Get all relationships
            rel_result = session.run('MATCH ()-[r]->() RETURN r')
            relationships = []
            for rec in rel_result:
                r = rec.get('r')
                relationships.append({
                    "elementId": r.element_id if hasattr(r, 'element_id') else getattr(r, 'elementId', None),
                    "type": r.type if hasattr(r, 'type') else None,
                    "startNodeElementId": r.start_node.element_id if hasattr(r, 'start_node') and hasattr(r.start_node, 'element_id') else None,
                    "endNodeElementId": r.end_node.element_id if hasattr(r, 'end_node') and hasattr(r.end_node, 'element_id') else None,
                    "properties": dict(r.items()) if hasattr(r, 'items') else dict(getattr(r, 'properties', {})),
                    "identity": str(r.id) if hasattr(r, 'id') else None
                })
        return jsonify({'nodes': nodes, 'relationships': relationships})
    except Exception as e:
        logger.error(f"Error in /cypher endpoint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/node', methods=['POST'])
def get_node():
    data = request.get_json()
    node_id = data.get('id')
    if not node_id:
        return jsonify({'error': 'Missing node id'}), 400
    try:
        with NEO4J_DRIVER.session() as session:
            result = session.run('MATCH (n) WHERE elementId(n) = $id RETURN n', {'id': node_id})
            record = result.single()
            if not record:
                return jsonify({'error': 'Node not found'}), 404
            n = record.get('n')
            node_data = {
                "elementId": n.element_id if hasattr(n, 'element_id') else getattr(n, 'elementId', None),
                "labels": list(n.labels) if hasattr(n, 'labels') else [],
                "properties": dict(n.items()) if hasattr(n, 'items') else dict(getattr(n, 'properties', {})),
                "identity": str(n.id) if hasattr(n, 'id') else None
            }
            return jsonify({'node': node_data})
    except Exception as e:
        logger.error(f"Error in /node endpoint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/edge', methods=['POST'])
def get_edge():
    data = request.get_json()
    from_id = data.get('from')
    to_id = data.get('to')
    rel_type = data.get('type')
    if not from_id or not to_id or not rel_type:
        return jsonify({'error': 'Missing from, to, or type'}), 400
    try:
        with NEO4J_DRIVER.session() as session:
            query = (
                'MATCH (a)-[r]-(b) '
                'WHERE ((elementId(a) = $from AND elementId(b) = $to) OR (elementId(a) = $to AND elementId(b) = $from)) '
                'AND type(r) = $type '
                'RETURN r, a, b'
            )
            params = {'from': from_id, 'to': to_id, 'type': rel_type}
            result = session.run(query, params)
            record = result.single()
            if not record:
                return jsonify({'error': 'Edge not found'}), 404
            r = record.get('r')
            a = record.get('a')
            b = record.get('b')
            edge_data = {
                "elementId": r.element_id if hasattr(r, 'element_id') else getattr(r, 'elementId', None),
                "type": r.type if hasattr(r, 'type') else None,
                "startNodeElementId": r.start_node.element_id if hasattr(r, 'start_node') and hasattr(r.start_node, 'element_id') else None,
                "endNodeElementId": r.end_node.element_id if hasattr(r, 'end_node') and hasattr(r.end_node, 'element_id') else None,
                "properties": dict(r.items()) if hasattr(r, 'items') else dict(getattr(r, 'properties', {})),
                "identity": str(r.id) if hasattr(r, 'id') else None
            }
            def serialize_node(n):
                return {
                    "elementId": n.element_id if hasattr(n, 'element_id') else getattr(n, 'elementId', None),
                    "labels": list(n.labels) if hasattr(n, 'labels') else [],
                    "properties": dict(n.items()) if hasattr(n, 'items') else dict(getattr(n, 'properties', {})),
                    "identity": str(n.id) if hasattr(n, 'id') else None
                } if n else None
            fromNode = serialize_node(a) if a and from_id == (a.element_id if hasattr(a, 'element_id') else getattr(a, 'elementId', None)) else serialize_node(b)
            toNode = serialize_node(b) if b and to_id == (b.element_id if hasattr(b, 'element_id') else getattr(b, 'elementId', None)) else serialize_node(a)
            return jsonify({
                'edge': edge_data,
                'fromNode': fromNode,
                'toNode': toNode
            })
    except Exception as e:
        logger.error(f"Error in /edge endpoint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/update_profile', methods=['POST'])
def update_profile():
    user_id = request.form.get('user_id')  # Assume frontend sends user_id or current username
    new_username = request.form.get('username')
    new_password = request.form.get('password')
    new_photo = request.files.get('photo')

    if not user_id:
        return jsonify({'error': 'User ID is required.'}), 400

    user = users_collection.find_one({'username': user_id})
    if not user:
        return jsonify({'error': 'User not found.'}), 404

    update_fields = {}
    # Username update
    if new_username and new_username != user_id:
        if users_collection.find_one({'username': new_username}):
            return jsonify({'error': 'Username already exists.'}), 409
        update_fields['username'] = new_username
    # Password update
    if new_password:
        hashed_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        update_fields['password'] = hashed_pw
    # Photo update
    if new_photo:
        update_fields['photo'] = new_photo.read()
    if not update_fields:
        return jsonify({'error': 'No changes provided.'}), 400
    users_collection.update_one({'username': user_id}, {'$set': update_fields})
    # Return updated user info
    updated_user = users_collection.find_one({'username': update_fields.get('username', user_id)})
    photo_base64 = base64.b64encode(updated_user['photo']).decode('utf-8') if updated_user.get('photo') else None
    return jsonify({
        'username': updated_user['username'],
        'photo': photo_base64
    }), 200

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('FLASK_PORT', 8000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Flask app on port {port} with debug={debug}")
    app.run(port=port, debug=debug) 