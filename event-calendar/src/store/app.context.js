import { createContext } from "react";

export const AppContext = createContext({
  appState: {
    user: null,
    userData: null,
    token: null,
  },
  setAppState: () => {},
});
