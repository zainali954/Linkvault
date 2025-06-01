import { useState, useEffect } from 'react';

/**
 * Custom hook to manage dark mode state and persistence.
 *
 * @returns {[boolean, function]} A tuple containing the current dark mode state (boolean) and a function to toggle it.
 */
function useDarkMode() {
  // Initialize state by reading from localStorage or defaulting to false (light mode)
  const [darkMode, setDarkMode] = useState(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window === 'undefined') {
      return false; // Default to light mode on server
    }
    try {
      const theme = window.localStorage.getItem('theme');
      return theme === 'dark';
    } catch (error) {
      console.warn('Error reading theme from localStorage:', error);
      return false; // Default to light mode on error
    }
  });

  // Effect to apply class to documentElement and update localStorage
  useEffect(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window === 'undefined') {
      return;
    }

    const root = window.document.documentElement;
    const currentTheme = darkMode ? 'dark' : 'light';

    // Update class on root element
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Update localStorage
    try {
      window.localStorage.setItem('theme', currentTheme);
    } catch (error) {
      console.warn('Error setting theme in localStorage:', error);
    }
  }, [darkMode]); // Only re-run the effect if darkMode changes

  // Function to toggle the theme
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Return the state and the toggle function
  return [darkMode, toggleDarkMode];
}

export default useDarkMode;

