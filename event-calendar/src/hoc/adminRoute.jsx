import { useContext, useEffect } from "react";
import { AppContext } from "../store/app.context";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export default function AdminRoute({ children }) {
  const { appState } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    console.group("Admin Route Debug Info");
    console.log("App State:", appState);
    console.log("User:", appState?.user);
    console.log("User Data:", appState?.userData);
    console.log("Role:", appState?.userData?.isAdmin);
    console.log("Is Admin?:", appState?.userData?.isAdmin === true);
    console.groupEnd();
  }, [appState]);

  if (!appState || !appState.userData) {
    console.warn("AppState is not ready. Showing loading state.");
    return <div>Loading...</div>;
  }

  const isAuthenticated = !!appState?.user;
  const isAdmin = appState?.userData?.isAdmin === true;

  if (!isAuthenticated || !isAdmin) {
    console.warn("Admin access denied:", {
      isAuthenticated,
      isAdmin,
      userisAdmin: appState?.userData?.isAdmin,
    });
    return <Navigate replace to="/" state={{ from: location }} />;
  }

  return <>{children}</>;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
