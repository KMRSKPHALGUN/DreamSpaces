import { createSlice } from '@reduxjs/toolkit';

const localhostSlice = createSlice({
  name: 'localhost',
  initialState: { localhost: null },
  reducers: {
    setLocalhost: (state, action) => {
        console.log("Reducer triggered with payload:", action.payload);
        state.localhost = action.payload;
    },
  },
});

export const { setLocalhost } = localhostSlice.actions;

export default localhostSlice.reducer;