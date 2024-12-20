'use client';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {/* PersistGate s'assure que le store est rehydraté avant de rendre l'application */}
      <PersistGate loading={<div>Chargement...</div>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}