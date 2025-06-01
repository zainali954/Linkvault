import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that works like useState but persists the value in localStorage.
 *
 * @param {string} key The key to use in localStorage.
 * @param {*} initialValue The initial value to use if no value is found in localStorage or if localStorage is unavailable/errors.
 * @returns {[*, function]} A stateful value, and a function to update it.
 */
function useLocalStorage(key, initialValue) {
  // Helper function to safely get value from localStorage
  const readValue = useCallback(() => {
    // Prevent build errors "window is not defined" during server-side rendering
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue if doesn't exist
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error reading/parsing, return initialValue
      console.warn(`Error reading localStorage key 	"${key}	":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback((value) => {
    // Prevent build errors "window is not defined" during server-side rendering
    if (typeof window === 'undefined') {
      console.warn(
        `Tried setting localStorage key 	"${key}	" even though environment is not a client`
      );
    }

    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // If error setting value, log it
      console.warn(`Error setting localStorage key 	"${key}	":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes to the localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.storageArea === window.localStorage) {
        try {
          setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
        } catch (error) {
          console.warn(`Error parsing storage change for key 	"${key}	":`, error);
          setStoredValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check value again on mount in case it changed while component wasn't mounted
    // or between the initial useState readValue and this effect running.
    setStoredValue(readValue());

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue, readValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;

