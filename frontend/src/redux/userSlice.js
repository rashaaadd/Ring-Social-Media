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
    setUser: (state, action) => {
      state.user = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        localStorage.clear();
        state.user = null;
      });
  },
});

export const { setUser } = userSlice.actions;
