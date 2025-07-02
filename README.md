# Knowledge Graph Visualizer

A full-stack application for visualizing and querying knowledge graphs using Neo4j, LLM-powered QA, and a modern React frontend.

---

## Project Structure

```
GraphVisualizer/
  backend/        # Python Flask API for Neo4j and LLM-powered QA
  frontend/       # React app and Node.js proxy for graph visualization
  start-scripts/  # Scripts to start both backend and frontend together
  .env            # Environment variables for backend (see below)
  README.md       # Project documentation (this file)
```

---

## Features

- **Natural language QA** over your Neo4j graph (LLM-powered)
- **Interactive graph visualization** (React, vis-network)
- **Modular, production-ready codebase**
- **Centralized environment configuration**
- **Health checks, logging, and error handling**

---

## Environment Variables

### Root/Backend `.env` Example

Create a file named `.env` in your project root and fill in your credentials:

```
# Neo4j Database
NEO4J_URI=neo4j+s://your-neo4j-uri
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-neo4j-password

# Groq LLM
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant
GROQ_TEMPERATURE=0.0
GROQ_MAX_TOKENS=1000

# Flask
FLASK_PORT=8000
FLASK_DEBUG=False

# MongoDB
MONGODB_URI=mongodb+srv://your-mongodb-connection-uri
DB_NAME=your-db-name
```

### Frontend `.env` Example

Create a file named `.env` in your `frontend/` directory:

```
# Example .env file for the frontend React app
# Base URL for all backend API requests
REACT_APP_API_URL=http://localhost:8000
```

---

## Supported Graph Databases

This project is designed to work with any graph database. By default, it is configured for Neo4j (including Neo4j Aura). To use it with your own Neo4j Aura instance or a different graph database:

- **Provide your Neo4j Aura connection details** in the `.env` file as shown below.
- **Customize `frontend/src/nodeLabelConfig.json`** to match your graph's node labels and visualization preferences.
- **Change the custom Cypher prompt** in `backend/custom_cypher_prompt.py` according to your needs for query generation or LLM-powered QA.

---

## Installation & Usage Guide

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd GraphVisualizer
```

### 2. Set up environment variables

- Copy the example files and fill in your credentials:
  - For backend: copy `env_example.txt` to `.env` in the root or backend directory.
  - For frontend: copy `frontend/env_example.txt` to `frontend/.env`.

### 3. Install dependencies

#### Backend
```bash
cd backend
pip install -r requirements.txt
```

#### Frontend
```bash
cd ../frontend
npm install
```

---

## Starting the Application

### **Recommended: Use Start Scripts**

#### **On Windows:**

From the `start-scripts` directory, run:
```powershell
.\start_all.ps1
```
This will open two terminals: one for the backend (Flask) and one for the frontend (React).

#### **On Mac/Linux:**

From the `start-scripts` directory, run:
```bash
./start_all.sh
```
This will start both backend and frontend in the background.

> **Note:**  
> - On Mac/Linux, you may need to make the script executable first:  
>   `chmod +x start_all.sh`
> - On Windows, you may need to allow script execution:  
>   `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

---

### **Manual Start (Alternative)**

#### **Backend**
```bash
cd backend
python app.py
```
The API will start on `http://localhost:8000`

#### **Frontend**
```bash
cd frontend
npm start
```
The React app will start on `http://localhost:3000` (default).

---

## Folder Details

### `/backend`
- Python Flask API for graph QA and user management
- See `backend/README.md` for API details, endpoints, and advanced configuration

### `/frontend`
- React app for graph visualization and chat
- Node.js/Express proxy for Neo4j queries

### `/start-scripts`
- Contains scripts to start both backend and frontend together for convenience

---

## Production Deployment

- Set `FLASK_DEBUG=False` in production
- Use secure, environment-specific `.env` files for both backend and frontend
- Serve the React build with a production server or static hosting

---

## Troubleshooting

- **Deprecation or warning messages:**  
  The project is configured to suppress most deprecation warnings for a cleaner development experience.
- **Environment variables not loading:**  
  Ensure `.env` files are present in both the root/backend and `frontend/` directories.
- **Port conflicts:**  
  Make sure ports 8000 (backend) and 3000 (frontend) are available, or adjust in your `.env` and scripts.

---

## Contributing

1. Fork the repo and create a feature branch
2. Make your changes and add tests if needed
3. Open a pull request

---

## License

[MIT] or your chosen license.

---
