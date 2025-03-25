import { useContext, useEffect } from "react";
import { AppContext } from "../store/app.context";
import PropTypes from "prop-types";

export default function Authenticated({ children }) {
  const { appState } = useContext(AppContext);

  useEffect(() => {
    console.log("Current appState:", appState);
  }, [appState]);

  if (!appState.user) {
    console.warn("AppState is not ready. Showing loading state.");
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
}

Authenticated.propTypes = {
  children: PropTypes.node.isRequired,
};
