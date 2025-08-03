import React, { useState, useEffect, createContext } from 'react';
// REMOVED: BrowserRouter as Router, useNavigate
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import Login from './components/Login.jsx';
import AdminHome from './components/AdminHome.jsx';
import ClientChatAndVoice from './components/ClientChatAndVoice.jsx';
import UploadSOP from './components/UploadSOP.jsx';
import VoiceAssistancePage from './components/VoiceAssistancePage.jsx';
import SettingsMenu from './components/SettingsMenu.jsx';
import ClientHistoryReport from './components/ClientHistoryReport.jsx';

import './App.css'; // Main CSS file

// ThemeContext is defined directly in App.jsx
export const ThemeContext = createContext(null);

function App() {
  const [userRole, setUserRole] = useState(null);
  // REMOVED: const navigate = useNavigate(); // This caused the "Router inside Router" error

  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogin = (role) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    // Navigation is handled by Login.jsx directly after successful authentication
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
    // Navigation to login page on logout is handled by components calling onLogout (e.g., AdminHome, ClientChatAndVoice)
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  // REMOVED: This useEffect for navigation in App.jsx
  // This logic is now handled by individual components (Login) and protected routes
  /*
  useEffect(() => {
    if (userRole === 'admin') {
      navigate('/admin-home', { replace: true });
    } else if (userRole === 'client') {
      navigate('/client-chat-voice', { replace: true });
    }
  }, [userRole, navigate]);
  */

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app-container">
        {/* REMOVED: <Router> tag from here */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin-home"
            element={userRole === 'admin' || localStorage.getItem('userRole') === 'admin' ? <AdminHome onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/upload-sop"
            element={userRole === 'admin' || localStorage.getItem('userRole') === 'admin' ? <UploadSOP /> : <Navigate to="/login" />}
          />
          <Route
            path="/voice-assistance"
            element={
              userRole === 'admin' || localStorage.getItem('userRole') === 'admin' ? (
                <VoiceAssistancePage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/client-history-report"
            element={userRole === 'admin' || localStorage.getItem('userRole') === 'admin' ? <ClientHistoryReport /> : <Navigate to="/login" />}
          />

          {/* Client Protected Route */}
          <Route
            path="/client-chat-voice"
            element={
              userRole === 'client' || localStorage.getItem('userRole') === 'client' ? (
                <ClientChatAndVoice onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* General Protected Routes (e.g., Settings) */}
          <Route
            path="/settings"
            element={userRole || localStorage.getItem('userRole') ? <SettingsMenu onLogout={handleLogout} /> : <Navigate to="/login" />}
          />

          {/* Catch-all route for any unhandled paths */}
          <Route
            path="*"
            element={
              userRole ? (
                userRole === 'admin' ? <Navigate to="/admin-home" /> : <Navigate to="/client-chat-voice" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
