import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App.jsx'; // Import ThemeContext from App.jsx

function SettingsMenu({ onLogout }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleBack = () => {
    // Determine where to go back based on user role or previous path
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'admin') {
      navigate('/admin-home');
    } else if (userRole === 'client') {
      navigate('/client-chat-voice');
    } else {
      navigate('/'); // Fallback to landing page
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-gray-100 font-inter antialiased">
      <div className="flex justify-between items-center p-4 bg-gray-900/50 backdrop-blur-sm shadow-lg border-b border-gray-700">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-300 hover:text-blue-100 transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
          aria-label="Back"
        >
          <svg className="text-2xl" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
          </svg>
          <span className="ml-2 hidden sm:inline font-medium">Back</span>
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-white">Settings</h2>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <svg className="text-xl sm:text-2xl text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75S6.615 2.25 12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75zm0 0V21.75"></path>
            </svg>
          ) : (
            <svg className="text-xl sm:text-2xl text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800/70 backdrop-blur-md p-8 rounded-lg shadow-xl w-full max-w-md space-y-6">
          <h3 className="text-2xl font-bold text-white mb-4">Application Settings</h3>

          {/* Theme Toggle Option */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Dark Mode</span>
            <label htmlFor="theme-toggle" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="theme-toggle"
                className="sr-only peer"
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Other settings options can go here */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Notification Sounds</span>
            <label htmlFor="notifications-toggle" className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="notifications-toggle" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold transition-colors duration-200 shadow-md mt-6"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsMenu;