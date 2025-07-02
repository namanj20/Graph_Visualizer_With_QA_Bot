import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { exportChatToPDF } from '../utils/pdfUtils';

/**
 * ChatBox component for the chat functionality
 */
function ChatBox({ 
  darkMode, 
  chatInput, 
  onChatInputChange, 
  onChatSend, 
  onChatInputKeyDown, 
  chatMessages, 
  botTyping, 
  welcomeShown, 
  chatboxMessagesRef, 
  lastMessageRef, 
  onScrollToTop, 
  showNewChatDialog, 
  onShowNewChatDialog, 
  onResetToWelcome, 
  user
}) {
  const handleDownloadPDF = () => {
    exportChatToPDF(chatMessages, user && user.username ? user.username : 'User');
  };

  return (
    <div className="chatbox-sidebar" style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Top: Scrollable chat messages area with scroll-to-top button */}
      <div style={{ position: 'relative', flex: '1 1 0%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Scroll to top button */}
        <button
          onClick={onScrollToTop}
          style={{
            position: 'absolute',
            top: 28,
            right: 24,
            zIndex: 10,
            background: 'rgba(30,136,229,0.18)',
            color: '#1E88E5',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            opacity: 0.3,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={e => (e.currentTarget.style.opacity = 0.3)}
          title="Scroll to top"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15V5M10 5L5 10M10 5L15 10" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="chatbox-messages" ref={chatboxMessagesRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {/* Bot welcome message with icon as avatar, only after welcomeShown */}
          {welcomeShown && chatMessages.length > 0 && chatMessages[0].isWelcome && (
            <div ref={chatMessages.length === 1 ? lastMessageRef : null} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span className="chatbox-bot-icon" aria-label="bot" style={{
                marginTop: 2,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                overflow: 'hidden',
                background: darkMode ? '#23272f' : '#e3eaf2',
                border: `1px solid #1E88E5`,
              }}>
                <img
                  src={darkMode ? '/dark_bot.png' : '/light_bot.jpg'}
                  alt="Bot"
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                />
              </span>
              <div className="chat-message-bubble chat-message-bot">
                <span className="chatbox-welcome">{chatMessages[0].text}</span>
              </div>
            </div>
          )}
          
          {/* Show the graph wait message in the same style as welcome */}
          {welcomeShown && chatMessages.length > 1 && chatMessages[1].isGraphWait && (
            <div ref={chatMessages.length === 2 ? lastMessageRef : null} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span className="chatbox-bot-icon" aria-label="bot" style={{
                marginTop: 2,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                overflow: 'hidden',
                background: darkMode ? '#23272f' : '#e3eaf2',
                border: `1px solid #1E88E5`,
              }}>
                <img
                  src={darkMode ? '/dark_bot.png' : '/light_bot.jpg'}
                  alt="Bot"
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                />
              </span>
              <div className="chat-message-bubble chat-message-bot">
                <span className="chatbox-welcome">{chatMessages[1].text}</span>
              </div>
            </div>
          )}
          
          {/* Other chat messages (skip welcome) */}
          {welcomeShown && chatMessages.filter(m => !m.isWelcome && !m.isGraphWait).map((msg, idx, arr) => (
            msg.sender === 'bot' ? (
              <div key={idx} ref={idx === arr.length - 1 ? lastMessageRef : null} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span className="chatbox-bot-icon" aria-label="bot" style={{
                  marginTop: 2,
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: darkMode ? '#23272f' : '#e3eaf2',
                  border: `1px solid #1E88E5`,
                }}>
                  <img
                    src={darkMode ? '/dark_bot.png' : '/light_bot.jpg'}
                    alt="Bot"
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                  />
                </span>
                <div className="chat-message-bubble chat-message-bot">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <div key={idx} ref={idx === arr.length - 1 ? lastMessageRef : null} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, justifyContent: 'flex-end' }}>
                <div className={`chat-message-bubble chat-message-user`}>
                  {msg.text}
                </div>
                <span className="chatbox-user-icon" aria-label="user" style={{
                  marginTop: 2,
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: darkMode ? '#23272f' : '#e3eaf2',
                  border: `1px solid #1E88E5`,
                }}>
                  {user && user.photo ? (
                    <img
                      src={`data:image/jpeg;base64,${user.photo}`}
                      alt="User"
                      style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ display: 'block' }}
                    >
                      <circle cx="20" cy="20" r="20" fill="none" />
                      <path
                        d="M20 22c-4.418 0-8 2.239-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.761-3.582-5-8-5zm0-2a5 5 0 100-10 5 5 0 000 10z"
                        fill={darkMode ? '#b3d2f7' : '#888'}
                      />
                    </svg>
                  )}
                </span>
              </div>
            )
          ))}
          
          {/* Typing indicator after the last message if botTyping is true */}
          {botTyping && chatMessages.length > 0 && !chatMessages[chatMessages.length-1].isWelcome && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span className="chatbox-bot-icon" aria-label="bot" style={{
                marginTop: 2,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                overflow: 'hidden',
                background: darkMode ? '#23272f' : '#e3eaf2',
                border: `1px solid #1E88E5`,
              }}>
                <img
                  src={darkMode ? '/dark_bot.png' : '/light_bot.jpg'}
                  alt="Bot"
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                />
              </span>
              <div className="chat-typing-indicator" style={{marginTop: 6}}>
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Bottom: Fixed input area */}
      <div className="chatbox-input-row">
        <input
          className="chatbox-input"
          type="text"
          placeholder="Ask a question about the database..."
          value={chatInput}
          onChange={onChatInputChange}
          onKeyDown={onChatInputKeyDown}
          autoComplete="off"
          disabled={botTyping}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="chatbox-send-btn" style={{ width: 34, height: 34, minWidth: 34, minHeight: 34 }} onClick={onChatSend} disabled={chatInput.trim() === "" || botTyping}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
              <path d="M10 16H24" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/>
              <path d="M21 13L24 16L21 19" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="chatbox-send-btn" style={{ width: 34, height: 34, minWidth: 34, minHeight: 34 }} onClick={onShowNewChatDialog} title="Start new chat">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="7" y1="2" x2="7" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <line x1="2" y1="7" x2="12" y2="7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="chatbox-send-btn" style={{ width: 34, height: 34, minWidth: 34, minHeight: 34 }} onClick={handleDownloadPDF} title="Download chat as PDF">
            <svg width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 3V15M11 15L6 10M11 15L16 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="4" y="17" width="14" height="2" rx="1" fill="#fff"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* New Chat Dialog - Centered in chatbox-sidebar only */}
      {showNewChatDialog && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.18)',
            zIndex: 5000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="new-chat-dialog-overlay"
        >
          <div style={{
            background: darkMode ? '#23272f' : '#fff',
            color: darkMode ? '#f7f9fb' : '#1E88E5',
            borderRadius: 14,
            boxShadow: '0 4px 18px rgba(30,136,229,0.13)',
            padding: '18px 18px 14px 18px',
            minWidth: 240,
            maxWidth: 320,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, textAlign: 'center', lineHeight: 1.3 }}>
              Do you want to download this chat?
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4, justifyContent: 'center', width: '100%' }}>
              <button
                style={{
                  minWidth: 80,
                  fontSize: 14,
                  borderRadius: 7,
                  background: '#1E88E5',
                  color: '#fff',
                  border: 'none',
                  padding: '7px 0',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => {
                  handleDownloadPDF();
                  onShowNewChatDialog(false);
                  setTimeout(() => onResetToWelcome(true), 300);
                }}
              >
                Download
              </button>
              <button
                style={{
                  minWidth: 80,
                  fontSize: 14,
                  borderRadius: 7,
                  background: '#1E88E5',
                  color: '#fff',
                  border: 'none',
                  padding: '7px 0',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => {
                  onShowNewChatDialog(false);
                  onResetToWelcome(true);
                }}
              >
                Continue
              </button>
              <button
                style={{
                  minWidth: 80,
                  fontSize: 14,
                  borderRadius: 7,
                  background: '#1E88E5',
                  color: '#fff',
                  border: 'none',
                  padding: '7px 0',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => {
                  onShowNewChatDialog(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox; 