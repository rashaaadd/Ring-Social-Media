import { USER_API } from '../axios';

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const fetchUserById = createAsyncThunk(
  'users/fetchByIdStatus',
  async () => {
    const response = await USER_API.get('/user', {
        headers: {
          Authorization: 'Bearer' + localStorage.getItem('token'),
        }});
    return response.data;
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
    .addCase(fetchUserById.pending, (state, action) => {
        state.loading = true;
    })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        localStorage.clear()
        state.user = null;
      });
  },
});

export const { setUser } = userSlice.actions;
