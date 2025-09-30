import { type JSX } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = (): JSX.Element => {
  const { accessToken, isAuthLoading } = useAuth();
  const location = useLocation();
  // If there's an access token, render the child route.
  // Otherwise, redirect to the auth page, saving the original location.

  if (isAuthLoading) {
    return <div>Loading...</div>; // spinner component
  }

  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
