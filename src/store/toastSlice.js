import { createSlice } from '@reduxjs/toolkit';

let toastId = 0;

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast: {
      reducer: (state, action) => {
        state.toasts.push(action.payload);
      },
      prepare: (message, type = 'info', duration = 4000) => ({
        payload: { id: ++toastId, message, type, duration },
      }),
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

// Thunk for auto-dismiss
export const showToast = (message, type = 'info', duration = 4000) => (dispatch) => {
  const action = dispatch(addToast(message, type, duration));
  setTimeout(() => dispatch(removeToast(action.payload.id)), duration);
};

export default toastSlice.reducer;
