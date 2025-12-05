import { createBrowserRouter } from "react-router-dom";
import AssessmentPage from "../pages/AssessmentPage";
import ReportPage from "../pages/ReportPage";
import WelcomePage from "../pages/WelcomePage";
import ProtectedRoute from "../components/ProtectedRoute";
import CongratulationsPage from "../pages/CongratulationsPage";
import CareerContent from "../components/CareerContent/CareerContent";
import CareerPage from "../pages/CareerPage";

// Demo Pages
import DemoWelcomePage from "../pages/demo/DemoWelcomePage";
import DemoAssessmentPage from "../pages/demo/DemoAssessmentPage";
import DemoReportPage from "../pages/demo/DemoReportPage";
import DemoCareerPage from "../pages/demo/DemoCareerPage";
import PrivateLayout from "../layouts/PrivateLayout";
import PublicLayout from "../layouts/PublicLayout";
import CareerList from "../pages/CareerList";
import CareerDetails from "../pages/CareerDetails";

export const router = createBrowserRouter([

  // ---------------------------------------
  // 1) PROTECTED ROUTES (Main Application)
  // ---------------------------------------
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <PrivateLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <WelcomePage /> },
      { path: "assessment", element: <AssessmentPage /> },
      { path: "report", element: <ReportPage /> },
      { path: "congratulations", element: <CongratulationsPage /> },
      { path: "career_content", element: <CareerContent /> },
      { path: "career/:careerId", element: <CareerPage /> },
      { path: "careers", element: <CareerList /> },
      { path: "careers/:id", element: <CareerDetails /> },
    ],
  },

  // ---------------------------------------
  // 2) PUBLIC DEMO ROUTES
  // ---------------------------------------
  {
    path: "/demo",
    element: <PublicLayout />,  // ⚠️ No ProtectedRoute here
    children: [
      { path: "", element: <DemoWelcomePage /> },
      { path: "assessment", element: <DemoAssessmentPage /> },
      { path: "report", element: <DemoReportPage /> },
      { path: "career/:careerId", element: <DemoCareerPage /> },
    ],
  },

]);
