/**
 * Base API wrapper that simulates network requests with configurable delay.
 * In production, this would be replaced with actual fetch/axios calls.
 */

const simulateDelay = (ms = null) => {
  const delay = ms || Math.floor(Math.random() * 500) + 200; // 200-700ms
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Simulate a GET request
 * @param {Function} dataFn - Function that returns the data
 * @param {number} delay - Custom delay in ms
 * @returns {Promise}
 */
export const apiGet = async (dataFn, delay = null) => {
  await simulateDelay(delay);
  try {
    const data = dataFn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Simulate a POST request
 * @param {Function} actionFn - Function that performs the action
 * @param {number} delay - Custom delay in ms
 * @returns {Promise}
 */
export const apiPost = async (actionFn, delay = null) => {
  await simulateDelay(delay || 500);
  try {
    const data = actionFn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Simulate a PUT request
 */
export const apiPut = async (actionFn, delay = null) => {
  await simulateDelay(delay || 400);
  try {
    const data = actionFn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
