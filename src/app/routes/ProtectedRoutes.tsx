import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return React.cloneElement(children);
};
