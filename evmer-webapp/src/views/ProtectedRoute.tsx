import { getRole, isAuthenticated } from "../scripts/Session";
import { Navigate } from "react-router";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/logins" />;
  } else return children;
};

export const AllowedRoute = ({ children }: ProtectedRouteProps) => {
  if (isAuthenticated()) return <Navigate to="/index" />;
  else return children;
};

export const AllowedAdminRoute = ({ children }: ProtectedRouteProps) => {
  if (getRole() !== "ADMINISTRATOR") return <Navigate to="/index" />;
  else return children;
};

export const AllowedAdminManagerRoute= ({ children }: ProtectedRouteProps) => {
  if (getRole() !== "ADMINISTRATOR" && getRole() !== "MENADZER") return <Navigate to="/index" />;
  else return children;
};
