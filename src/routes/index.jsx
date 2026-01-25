import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Layouts
import PrivateLayout from "../layouts/PrivateLayout";
import PublicLayout from "../layouts/PublicLayout";

// Student Pages
import WelcomePage from "../pages/WelcomePage";
import AssessmentPage from "../pages/AssessmentPage";
import ReportPage from "../pages/ReportPage";
import CongratulationsPage from "../pages/CongratulationsPage";
import CareerContent from "../components/CareerContent/CareerContent";
import CareerPage from "../pages/CareerPage";
import CareerList from "../pages/CareerList";
import CareerDetails from "../pages/CareerDetails";

// Counsellor Pages
import CounsellorStudents from "../pages/counsellor/CounsellorStudents";

// Demo Pages
import DemoWelcomePage from "../pages/demo/DemoWelcomePage";
import DemoAssessmentPage from "../pages/demo/DemoAssessmentPage";
import DemoReportPage from "../pages/demo/DemoReportPage";
import DemoCareerPage from "../pages/demo/DemoCareerPage";
import CounsellorStudentReport from "../pages/counsellor/CounsellorStudentReport";

export const router = createBrowserRouter([

  // ---------------------------------------
  // 1) STUDENT ROUTES (Authenticated, STUDENT)
  // ---------------------------------------
  {
    path: "/",
    element: (
      <ProtectedRoute roles={["STUDENT"]}>
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
  // 2) COUNSELLOR ROUTES (Authenticated, COUNSELLOR)
  // ---------------------------------------
  {
    path: "/counsellor",
    element: (
      <ProtectedRoute roles={["COUNSELLOR"]}>
        <PrivateLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "students", element: <CounsellorStudents /> },
      // future:
      { path: "students/:studentId/report", element: <CounsellorStudentReport /> },
    ],
  },

  // ---------------------------------------
  // 3) PUBLIC DEMO ROUTES
  // ---------------------------------------
  {
    path: "/demo",
    element: <PublicLayout />,
    children: [
      { path: "", element: <DemoWelcomePage /> },
      { path: "assessment", element: <DemoAssessmentPage /> },
      { path: "report", element: <DemoReportPage /> },
      { path: "career/:careerId", element: <DemoCareerPage /> },
    ],
  },

]);
