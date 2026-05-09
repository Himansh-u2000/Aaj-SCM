/**
 * Validate email format
 * @param {string} email
 * @returns {{ valid: boolean, message: string }}
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { valid: false, message: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true, message: '' };
};

/**
 * Validate password
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
};

/**
 * Validate required field
 * @param {string} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || !String(value).trim()) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: '' };
};
