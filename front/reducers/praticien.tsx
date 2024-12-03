import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Définir le type pour l'état
export type PractitionerState = {
  token: string | null;
};

// Définir l'état initial
const initialState: PractitionerState = {
  token: null,
};

export const practitionerSlice = createSlice({
  name: 'practitioner',
  initialState,
  reducers: {
    setToken: (state: PractitionerState, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    resetToken: (state: PractitionerState) => {
      state.token = null;
    },
  },
});

export const { setToken, resetToken } = practitionerSlice.actions;
export default practitionerSlice.reducer;