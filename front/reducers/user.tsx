import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Définir le type pour l'état utilisateur
export type UserState = {
  email: string | null;
  name: string | null;
};

// Définir l'état initial
const initialState: UserState = {
  email: null,
  name: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ email: string; name: string }>
    ) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    resetUser: (state) => {
      state.email = null;
      state.name = null;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;