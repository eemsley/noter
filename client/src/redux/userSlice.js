import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "guest",
    color: "sky",
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setColor: (state, action) => {
      state.color = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUsername, setColor } = userSlice.actions;

export default userSlice.reducer;
