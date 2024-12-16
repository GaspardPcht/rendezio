import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  email: string | null; // Email peut être null
  name: string | null;  // Nom peut être null
  token: string | null; // Token peut être null
};

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
      action: PayloadAction<{ email: string | null; name: string | null; token: string | null }>
    ) => {
      console.log('Payload reçu dans Redux :', action.payload);
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.token = action.payload.token;
    },
    resetUser: (state) => {
      console.log('Reset utilisateur');
      state.email = null;
      state.name = null;
      state.token = null;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;