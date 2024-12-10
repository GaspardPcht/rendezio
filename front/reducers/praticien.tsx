import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PractitionerState = {
  token: string | null;
  id: string | null; // Ajoute l'ID du praticien
};

const initialState: PractitionerState = {
  token: null,
  id: null,
};

export const practitionerSlice = createSlice({
  name: 'practitioner',
  initialState,
  reducers: {
    setToken: (state: PractitionerState, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setId: (state: PractitionerState, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    resetToken: (state: PractitionerState) => {
      state.token = null;
      state.id = null;
    },
  },
});

export const { setToken, setId, resetToken } = practitionerSlice.actions;
export default practitionerSlice.reducer;
