import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AssessmentPage from "../pages/AssessmentPage";
import ReportPage from "../pages/ReportPage";
import WelcomePage from "../pages/WelcomePage";
import ProtectedRoute from "../components/ProtectedRoute";
import CongratulationsPage from "../pages/CongratulationsPage";
import CareerContent from "../components/CareerContent/CareerContent";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <ProtectedRoute>
        <MainLayout />
      // </ProtectedRoute>
    ),
    children: [
      { path: "assessment", element: <AssessmentPage /> },
      { path: "report", element: <ReportPage /> },
      { path: "", element: <WelcomePage /> },
      { path: "congratulations", element: <CongratulationsPage /> },
      { path: "career_content", element: <CareerContent /> }
    ],
  },
]);
