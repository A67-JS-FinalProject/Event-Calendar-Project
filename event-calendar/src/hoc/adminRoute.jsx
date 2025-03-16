import { useContext, useEffect } from "react";
import { AppContext } from "../store/app.context";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export default function AdminRoute({ children }) {
  const { appState } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    console.log("Current appState:", appState);
  }, [appState]);

  if (!appState.user || !appState.userData?.isAdmin) {
    return <Navigate replace to="/" state={{ from: location }} />;
  }

  return <div>{children}</div>;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
