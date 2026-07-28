import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { NewProject } from "./pages/NewProject";
import { ProjectDetail } from "./pages/ProjectDetail";
import { InnovationMentor } from "./pages/InnovationMentor";
import { Settings } from "./pages/Settings";
import { ExportCenter } from "./pages/ExportCenter";
import { Auth } from "./pages/Auth";
import { HelpCenter } from "./pages/HelpCenter";
import { Legal } from "./pages/Legal";
import { Onboarding } from "./pages/Onboarding";
import { ContactSupport } from "./pages/ContactSupport";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="blooplabs-theme">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Landing />} />
            <Route path="auth" element={<Auth />} />
            <Route path="legal" element={<Legal />} />
            <Route path="contact" element={<ContactSupport />} />
            
            {/* Protected Routes */}
            <Route path="onboarding" element={<ProtectedRoute requireProfile={false}><Onboarding /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="new" element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
            <Route path="project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="mentor" element={<ProtectedRoute><InnovationMentor /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="export" element={<ProtectedRoute><ExportCenter /></ProtectedRoute>} />
            <Route path="help" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
