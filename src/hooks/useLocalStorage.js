import { useState, useEffect } from 'react';

/**
 * Persist state in localStorage
 * @param {string} key
 * @param {any} initialValue
 * @returns {[any, Function]}
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Fail silently
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
