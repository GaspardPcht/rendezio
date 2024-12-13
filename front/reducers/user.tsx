import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Définir le type pour l'état utilisateur
export type UserState = {
  email: string | null;
  name: string | null;
  token: string | null;
};

// Définir l'état initial
const initialState: UserState = {
  email: null,
  name: null,
  token: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ email: string; name: string; token: string }>
    ) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.token = action.payload.token;
    },
    resetUser: (state) => {
      state.email = null;
      state.name = null;
      state.token = null;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;