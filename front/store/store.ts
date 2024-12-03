'use client'
import { configureStore } from "@reduxjs/toolkit";
import practitionerReducer from "../reducers/praticien"; // Chemin à ajuster si nécessaire
import userReducer from "../reducers/user"; // Chemin à ajuster si nécessaire

// Configuration du store Redux
const store = configureStore({
  reducer: {
    practitioner: practitionerReducer,
    user: userReducer,
  },
});

// Typage pour le state et le dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;