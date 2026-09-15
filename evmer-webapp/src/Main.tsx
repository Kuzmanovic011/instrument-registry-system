import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PageNotFound from "./views/PageNotFound.tsx";
import { LoginV } from "./views/Login.tsx";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import {
  ProtectedRoute,
  AllowedRoute,
  AllowedAdminRoute,
  AllowedAdminManagerRoute,
} from "./views/ProtectedRoute.tsx";
import { EquipmentV } from "./views/Equipment.tsx";
import { UserV } from "./views/User.tsx";
import { AssignmentV } from "./views/Assignment.tsx";
import { ReservationV } from "./views/Reservation.tsx";
import { FaultsV } from "./views/Faults.tsx";
import App from "./views/App.tsx";
import { ProtectedLayout } from "./ProtectedLayout.tsx";
import { GlobalLoader } from "./components/Loader/GlobalLoader.tsx";
import { APP_BASE_PATH } from "./config/paths.ts";
import { ProfileV } from "./views/Profile.tsx";
import { HistoryV } from "./views/History.tsx";
import { CalibrationsV } from "./views/Calibrations.tsx";
import { Toast } from "./components/Toast/Toast.tsx";

const router = createBrowserRouter(
  [
    {
      element: (
        <ProtectedRoute>
          <ProtectedLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/index",
          element: <App />,
        },
        {
          path: "/equipment",
          element: <EquipmentV />,
        },
        {
          path: "/users",
          element: (
            <AllowedAdminRoute>
              <UserV />
            </AllowedAdminRoute>
          ),
        },
        {
          path: "/profile",
          element: <ProfileV />,
        },
        {
          path: "/assignments",
          element: <AssignmentV />,
        },
        {
          path: "/reservation",
          element: <ReservationV />,
        },
        {
          path: "/calibrations",
          element: (
            <AllowedAdminRoute>
              <CalibrationsV />
            </AllowedAdminRoute>
          ),
        },
        {
          path: "/fault-report",
          element: (
            <AllowedAdminManagerRoute>
              <FaultsV />
            </AllowedAdminManagerRoute>
          ),
        },
        {
          path: "/history",
          element: (
            <AllowedAdminRoute>
              <HistoryV />
            </AllowedAdminRoute>
          ),
        },
      ],
    },

    {
      path: "/",
      element: <Navigate to="/auth/logins" replace />,
    },
    {
      path: "/evmer",
      element: <Navigate to="/auth/logins" replace />,
    },

    {
      path: "/auth/logins",
      element: (
        <AllowedRoute>
          <LoginV />
        </AllowedRoute>
      ),
    },

    {
      path: "*",
      element: <PageNotFound />,
    },
  ],
  { basename: APP_BASE_PATH },
);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <>
      <GlobalLoader />
      <Toast />
      <RouterProvider router={router} />
    </>
  </StrictMode>,
);
