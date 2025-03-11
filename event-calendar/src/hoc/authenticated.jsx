import { useContext, useEffect } from "react";
import { AppContext } from "../store/app.context";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export default function Authenticated({ children }) {
  const { appState } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    console.log("Current appState:", appState);
  }, [appState]);

  if (!appState.user) {
    return <Navigate replace to="/" state={{ from: location }} />;
  }

  return <div>{children}</div>;
}

Authenticated.propTypes = {
  children: PropTypes.node.isRequired,
};
