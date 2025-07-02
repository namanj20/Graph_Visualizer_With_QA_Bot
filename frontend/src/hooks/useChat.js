import { useEffect, useRef, useState } from 'react';
import { askQuestion } from '../api/graphApi';

/**
 * Custom hook for managing chat functionality
 */
export function useChat() {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const chatboxMessagesRef = useRef(null);
  const lastMessageRef = useRef(null);

  // Show welcome message with typing indicator on mount
  useEffect(() => {
    const showBotMessage = async (msgObj, delay = 900) => {
      setBotTyping(true);
      await new Promise(resolve => setTimeout(resolve, delay));
      setChatMessages(msgs => {
        // Prevent duplicate messages by checking a unique property
        if (msgObj.isWelcome && msgs.some(m => m.isWelcome)) return msgs;
        if (msgObj.isGraphWait && msgs.some(m => m.isGraphWait)) return msgs;
        return [...msgs, msgObj];
      });
      setBotTyping(false);
    };

    const runWelcomeSequence = async () => {
      await showBotMessage({ sender: 'bot', text: 'Welcome to the Knowledge Graph', isWelcome: true });
      setWelcomeShown(true);
      await showBotMessage({ sender: 'bot', text: 'Please wait for the graph to render.', isGraphWait: true });
    };

    runWelcomeSequence();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatboxMessagesRef.current) {
      chatboxMessagesRef.current.scrollTop = chatboxMessagesRef.current.scrollHeight;
    }
  }, [chatMessages, botTyping]);

  // Scroll last message into view
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [chatMessages, botTyping]);

  const handleChatInputChange = (e) => setChatInput(e.target.value);

  const handleChatSend = async () => {
    if (chatInput.trim() === "") return;
    
    const userMessage = chatInput;
    setChatMessages((msgs) => [...msgs, { sender: 'user', text: userMessage }]);
    setChatInput("");
    setBotTyping(true);
    
    try {
      const answer = await askQuestion(userMessage);
      setChatMessages((msgs) => [...msgs, { sender: 'bot', text: answer }]);
    } catch (err) {
      setChatMessages((msgs) => [...msgs, { sender: 'bot', text: 'Error contacting the QA chain.' }]);
    } finally {
      setBotTyping(false);
    }
  };

  const handleChatInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  const resetToWelcome = (onlyFirstWelcome = false) => {
    setChatMessages([]);
    setWelcomeShown(true);
    setTimeout(() => {
      const showBotMessage = async (msgObj, delay = 900) => {
        setBotTyping(true);
        await new Promise(resolve => setTimeout(resolve, delay));
        setChatMessages(msgs => {
          if (msgObj.isWelcome && msgs.some(m => m.isWelcome)) return msgs;
          if (msgObj.isGraphWait && msgs.some(m => m.isGraphWait)) return msgs;
          return [...msgs, msgObj];
        });
        setBotTyping(false);
      };

      const runWelcomeSequence = async () => {
        await showBotMessage({ sender: 'bot', text: 'Welcome to the Knowledge Graph', isWelcome: true });
        if (!onlyFirstWelcome) {
          await showBotMessage({ sender: 'bot', text: 'Please wait for the graph to render.', isGraphWait: true });
        }
      };

      runWelcomeSequence();
    }, 100);
  };

  const handleScrollToTop = () => {
    if (chatboxMessagesRef.current) {
      chatboxMessagesRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    chatInput,
    setChatInput,
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
  };
} 