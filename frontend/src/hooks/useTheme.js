import { useEffect, useState } from 'react';

/**
 * Custom hook for managing theme (dark/light mode)
 */
export function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('kg_dark_mode');
    return saved === 'true' ? true : false;
  });

  useEffect(() => {
    localStorage.setItem('kg_dark_mode', darkMode);
    if (darkMode) {
      document.body.classList.add('kg-dark');
    } else {
      document.body.classList.remove('kg-dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return {
    darkMode,
    setDarkMode,
    toggleDarkMode
  };
} 