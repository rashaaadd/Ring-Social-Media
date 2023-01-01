import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "./authService";

export const fetchUserById = createAsyncThunk(
  "users/fetchUser",
  async (token, thunkAPI) => {
    try {
      return await getUser(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state,action) => {
      state.user = action.payload.data;
    },
    resetUser: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
      })
      .addCase(fetchUserById.rejected, (state) => {
        state.loading = false;
        localStorage.clear();
        state.user = null;
      });
  },
});

export const { setUser, resetUser } = userSlice.actions;
