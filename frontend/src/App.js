import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import GraphContainer from './components/GraphContainer';
import ChatBox from './components/ChatBox';
import { useTheme } from './hooks/useTheme';
import { useGraphData } from './hooks/useGraphData';
import { useChat } from './hooks/useChat';
import Login from './components/Login';
import Signup from './components/Signup';
import EditProfile from './components/EditProfile';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function AppContent() {
  // Theme
  const { darkMode, toggleDarkMode } = useTheme();
  // Sidebar
  const [sidePaneOpen, setSidePaneOpen] = useState(false);
  // User auth
  const [user, setUser] = useState(null);
  // For graph reload: only update on login/logout
  const [graphUser, setGraphUser] = useState(null);
  // Auth page switching
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchNotFound, setSearchNotFound] = useState(false);
  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
    setSearchNotFound(false);
  };
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && graphData) {
      const normalize = str => str.replace(/\s+/g, '').toLowerCase();
      const term = normalize(searchTerm);
      if (!term) return;
      // Exact match only
      const match = graphData.nodes.find(node => {
        const label = normalize(node.label);
        return label === term;
      });
      if (match) {
        focusNode(match.id);
        setSearchNotFound(false);
      } else {
        setSearchNotFound(true);
      }
    }
  };

  // Chat
  const {
    chatInput,
    chatMessages,
    botTyping,
    welcomeShown,
    showNewChatDialog,
    setShowNewChatDialog,
    chatboxMessagesRef,
    lastMessageRef,
    handleChatInputChange,
    handleChatSend,
    handleChatInputKeyDown,
    resetToWelcome,
    handleScrollToTop
  } = useChat();

  // Auth handlers
  const handleLogin = (userData) => {
    setUser(userData);
    setGraphUser(userData); // reload graph
    navigate('/');
  };
  const handleSignup = () => {
    setShowSignup(false);
    // Optionally show a message or auto-login
  };
  const handleLogout = () => {
    setUser(null);
    setGraphUser(null); // clear graph
    setShowSignup(false); // Always show login page after logout
    navigate('/login');
  };

  // Always call the hook with graphUser as a parameter
  const graphDataProps = useGraphData(graphUser);
  const { graphData, focusNode } = graphDataProps;

  const [editProfileOpen, setEditProfileOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full relative" style={{zIndex: 1}}>
        <div className="graph-bg-icons">
          {(() => {
            // Define the number of icons per column, right to left
            const columns = [5, 4, 5, 4, 5, 4, 5, 4]; // More columns for full spread
            // Define the horizontal positions for each column (right to left)
            const colPositions = [
              { side: 'right', value: '2vw' },
              { side: 'right', value: '14vw' },
              { side: 'right', value: '26vw' },
              { side: 'right', value: '38vw' },
              { side: 'left', value: '38vw' },
              { side: 'left', value: '26vw' },
              { side: 'left', value: '14vw' },
              { side: 'left', value: '2vw' }
            ];
            // SVG icon set (cycle through for variety)
            const svgs = [
              (color) => <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="16" r="6" /><circle cx="48" cy="16" r="6" /><circle cx="32" cy="48" r="6" /><line x1="16" y1="16" x2="48" y2="16" /><line x1="16" y1="16" x2="32" y2="48" /><line x1="48" y1="16" x2="32" y2="48" /></svg>,
              (color) => <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="32" r="5" /><circle cx="32" cy="12" r="5" /><circle cx="52" cy="32" r="5" /><circle cx="32" cy="52" r="5" /><line x1="12" y1="32" x2="32" y2="12" /><line x1="32" y1="12" x2="52" y2="32" /><line x1="52" y1="32" x2="32" y2="52" /><line x1="32" y1="52" x2="12" y2="32" /></svg>,
              (color) => <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="32" cy="32" r="6" /><circle cx="32" cy="10" r="4" /><circle cx="54" cy="32" r="4" /><circle cx="32" cy="54" r="4" /><circle cx="10" cy="32" r="4" /><line x1="32" y1="32" x2="32" y2="10" /><line x1="32" y1="32" x2="54" y2="32" /><line x1="32" y1="32" x2="32" y2="54" /><line x1="32" y1="32" x2="10" y2="32" /></svg>,
              (color) => <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="32" cy="12" r="5" /><circle cx="12" cy="52" r="5" /><circle cx="52" cy="52" r="5" /><line x1="32" y1="12" x2="12" y2="52" /><line x1="32" y1="12" x2="52" y2="52" /><line x1="12" y1="52" x2="52" y2="52" /></svg>,
              (color) => <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="32" cy="32" r="6" /><circle cx="16" cy="48" r="4" /><circle cx="48" cy="48" r="4" /><circle cx="16" cy="16" r="4" /><circle cx="48" cy="16" r="4" /><line x1="32" y1="32" x2="16" y2="48" /><line x1="32" y1="32" x2="48" y2="48" /><line x1="32" y1="32" x2="16" y2="16" /><line x1="32" y1="32" x2="48" y2="16" /></svg>
            ];
            // Helper to blend blue and white
            function blendColor(col1, col2, t) {
              const c1 = [parseInt(col1.slice(1,3),16),parseInt(col1.slice(3,5),16),parseInt(col1.slice(5,7),16)];
              const c2 = [parseInt(col2.slice(1,3),16),parseInt(col2.slice(3,5),16),parseInt(col2.slice(5,7),16)];
              const c = c1.map((v,i)=>Math.round(v+(c2[i]-v)*t));
              return `rgb(${c[0]},${c[1]},${c[2]})`;
            }
            const nCols = columns.length;
            let iconIdx = 0;
            // Helper to get centered positions
            function getCenteredPositions(count, iconPx = 80, containerPx = 800) {
              // Use window.innerHeight if available
              if (typeof window !== 'undefined' && window.innerHeight) {
                containerPx = window.innerHeight;
              }
              const iconPercent = (iconPx / containerPx) * 100;
              let positions = [];
              if (count % 2 === 1) {
                // Odd: center, then pairs above/below
                const centerIdx = Math.floor(count / 2);
                for (let i = 0; i < count; i++) {
                  const offset = (i - centerIdx) * (iconPercent + 7); // 12% gap
                  positions.push(50 + offset);
                }
              } else {
                // Even: no icon at center, pairs above/below
                const mid = count / 2 - 0.5;
                for (let i = 0; i < count; i++) {
                  const offset = (i - mid) * (iconPercent + 12); // 12% gap
                  positions.push(50 + offset);
                }
              }
              return positions;
            }
            return columns.map((count, colIdx) => {
              // t=0 (leftmost, white), t=1 (rightmost, blue)
              const t = colIdx/(nCols-1);
              const color = blendColor('#1565c0', '#FFFFFF', t);
              const pos = colPositions[colIdx];
              const positions = getCenteredPositions(count);
              return Array.from({length: count}).map((_, i) => {
                const top = `${positions[i]}%`;
                const svg = svgs[iconIdx % svgs.length](color);
                iconIdx++;
                return (
                  <div
                    key={`icon-col${colIdx}-row${i}`}
                    className={`graph-bg-icon col${colIdx} row${i}`}
                    style={{ [pos.side]: pos.value, top, animationDelay: `${(colIdx*2+i)*1.2}s` }}
                  >
                    {svg}
                  </div>
                );
              });
            });
          })()}
        </div>
        <h1 className="main-title" style={{zIndex: 2, position: 'relative'}}>
          Graph Visualizer with QA Bot
        </h1>
        <div className={"card-container" + (showSignup ? " flipped" : "")}
             style={{ marginTop: '2rem' }}>
          <div className="card-inner">
            <Login onLogin={handleLogin} switchToSignup={() => setShowSignup(true)} />
            <Signup key={showSignup ? 'signup' : 'reset'} onSignup={handleSignup} onLogin={handleLogin} switchToLogin={() => setShowSignup(false)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`App${darkMode ? ' kg-dark' : ''}`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onMenuClick={() => setSidePaneOpen(true)}
      />
      <Sidebar
        darkMode={darkMode}
        isOpen={sidePaneOpen}
        onClose={() => setSidePaneOpen(false)}
        user={user}
        onLogout={handleLogout}
        onEditProfile={() => setEditProfileOpen(true)}
      />
      {editProfileOpen && (
        <EditProfile
          user={user}
          onClose={() => setEditProfileOpen(false)}
          onProfileUpdated={updated => setUser(u => ({ ...u, ...updated }))}
          darkMode={darkMode}
        />
      )}
      <div className="main-content-layout">
        <GraphContainer
          darkMode={darkMode}
          {...(user ? graphDataProps : {})}
          searchTerm={searchTerm}
          onSearchChange={handleSearchInput}
          onSearchKeyDown={handleSearchKeyDown}
          searchNotFound={searchNotFound}
          onResetView={graphDataProps.resetView}
          onCloseNodeModal={() => graphDataProps.setSelectedNode && graphDataProps.setSelectedNode(null)}
          onCloseEdgeModal={() => graphDataProps.setSelectedEdge && graphDataProps.setSelectedEdge(null)}
        />
        <ChatBox
          darkMode={darkMode}
          chatInput={chatInput}
          onChatInputChange={handleChatInputChange}
          onChatSend={handleChatSend}
          onChatInputKeyDown={handleChatInputKeyDown}
          chatMessages={chatMessages}
          botTyping={botTyping}
          welcomeShown={welcomeShown}
          chatboxMessagesRef={chatboxMessagesRef}
          lastMessageRef={lastMessageRef}
          onScrollToTop={handleScrollToTop}
          showNewChatDialog={showNewChatDialog}
          onShowNewChatDialog={setShowNewChatDialog}
          onResetToWelcome={resetToWelcome}
          user={user}
        />
      </div>
      {graphDataProps.error && (
        <div style={{ color: '#e74c3c', fontSize: '1.2rem', marginBottom: 16 }}>
          <b>Runtime Error:</b> {graphDataProps.error}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App; 