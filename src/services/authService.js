import { apiPost, apiGet } from './api';
import { mockUsers } from '../data/users';

const AUTH_KEY = 'aaj_scm_auth';

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const login = async (email, password) => {
  return apiPost(() => {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const { password: _, ...safeUser } = user;
    const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 }));
    
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user: safeUser, token }));
    return { user: safeUser, token };
  }, 800);
};

/**
 * Logout
 */
export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

/**
 * Get current authenticated user
 * @returns {Promise<{success: boolean, data?: object}>}
 */
export const getCurrentUser = async () => {
  return apiGet(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) throw new Error('Not authenticated');
    
    const { user, token } = JSON.parse(stored);
    const decoded = JSON.parse(atob(token));
    
    if (decoded.exp < Date.now()) {
      localStorage.removeItem(AUTH_KEY);
      throw new Error('Session expired');
    }
    
    return { user, token };
  }, 100);
};
