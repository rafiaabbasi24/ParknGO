import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";

// Components & Layouts
import ThemeSwitcher from "./components/ThemeSwitcher";
import ProtectedRoute from "./components/ProtectedRoute";
import UserLayout from "./pages/UserLayout";
import AdminRoutes from "./pages/admin/AdminRoutes";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/admin/adminlogin";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Setting";
import Bookings from "./pages/Bookings";
import Book from "./pages/Book";
import Reports from "./pages/Reports";
import BookingStatus from "./pages/BookingStatus";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// UI & Theming
import { Toaster as ShadToaster } from "@/components/ui/sonner";
import { ConfigProvider, theme as antdtheme } from "antd";
import { Toaster } from "react-hot-toast";


// This component sets up the theme and global components
const AppContent = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <ConfigProvider
      theme={
        isDark
          ? { algorithm: antdtheme.darkAlgorithm }
          : {}
      }
    >
      {/* Toaster components for notifications */}
      <ShadToaster />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: isDark ? "#333" : "#fff",
            color: isDark ? "#fff" : "#000",
          },
        }}
      />

      <ThemeSwitcher />
      <Router>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/booking-status" element={<BookingStatus />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* --- Admin Routes --- */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute redirectPath="/admin/login">
                <AdminRoutes />
              </ProtectedRoute>
            }
          />

          {/* --- Protected User Routes (Nested under UserLayout) --- */}
          <Route
            element={
              <ProtectedRoute redirectPath="/login">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:id" element={<Book />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          {/* --- Catch-all for 404 Not Found --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

// Main App component that provides the theme
const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
