import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { HomePage } from "../pages/HomePage/HomePage";
import { CalendarPage } from "../pages/CalendarPage/CalendarPage";
import ClientsPage from "../pages/ClientsPage/ClientsPage";
import { TherapistsPage } from "../pages/therapists/TherapistsPage";
import { ReportsPage } from "../pages/Reports/ReportPage";
import LoginPage from "../pages/LoginPage/LoginPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <ClientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapists"
        element={
          <ProtectedRoute>
            <TherapistsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<HomePage />} />
    </Routes>
  );
};
