import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../services/authService';

// Thunks
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  const result = await authService.getCurrentUser();
  if (result.success) return result.data.user;
  return rejectWithValue('Not authenticated');
});

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  const result = await authService.login(email, password);
  if (result.success) return result.data.user;
  return rejectWithValue(result.error);
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  },
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => { state.isLoading = true; })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
      })
      // loginUser
      .addCase(loginUser.pending, (state) => { state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
