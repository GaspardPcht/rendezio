'use client';
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Utilise localStorage pour le web
import practitionerReducer from "../reducers/praticien"; // Chemin à ajuster si nécessaire
import userReducer from "../reducers/user"; // Chemin à ajuster si nécessaire

// Configuration pour redux-persist
const persistConfig = {
  key: "root",
  storage, // Utilise localStorage
  whitelist: ["practitioner", "user"], // Les reducers à persister
};

// Combinaison des reducers
const rootReducer = combineReducers({
  practitioner: practitionerReducer,
  user: userReducer,
});

// Ajout du persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration du store Redux
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Désactive les vérifications de sérialisation pour redux-persist
    }),
});

// Création du persistor
export const persistor = persistStore(store);

// Typage pour le state et le dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;