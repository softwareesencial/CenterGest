import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { HomePage } from "../features/HomePage/HomePage";
import { CalendarPage } from "../features/CalendarPage/CalendarPage";
import ClientsPage from "../features/ClientsPage/ClientsPage";
import { TherapistsPage } from "../features/therapists/TherapistsPage";
import { ReportsPage } from "../features/Reports/ReportPage";
import LoginPage from "../features/LoginPage/LoginPage";
import { TherapistDetailsPage } from "../features/therapists/pages/TherapistDetailsPage";

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
        path="/therapists/:id"
        element={
          <ProtectedRoute>
            <TherapistDetailsPage />
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
