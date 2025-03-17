import { useContext, useEffect } from "react";
import { AppContext } from "../store/app.context";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export default function AdminRoute({ children }) {
  const { appState } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    // Add detailed debugging logs
    console.group('Admin Route Debug Info');
    console.log('User:', appState.user);
    console.log('User Data:', appState.userData);
    console.log('Role:', appState.userData?.role);
    console.log('Is Admin?:', appState.userData?.role === 'admin');
    console.groupEnd();
  }, [appState]);

  // Separate checks for better debugging
  const isAuthenticated = !!appState.user;
  const isAdmin = appState.userData?.role === 'admin';

  if (!isAuthenticated || !isAdmin) {
    console.warn('Admin access denied:', {
      isAuthenticated,
      isAdmin,
      userRole: appState.userData?.role
    });
    return <Navigate replace to="/" state={{ from: location }} />;
  }

  return <>{children}</>;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};