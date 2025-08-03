import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App.jsx'; // Assuming ThemeContext is defined in App.jsx

function AdminHome({ onLogout }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Define color palette based on theme
  const colors = {
    light: {
      bg: "bg-gray-50", // Softer light background
      header: "bg-white/90 border-gray-200", // Slightly more opaque header
      textPrimary: "text-gray-900",
      textSecondary: "text-gray-700", // Darker secondary text for better contrast
      card: "bg-white border border-gray-200 shadow-md", // Subtle shadow
      cardHover: "hover:scale-[1.02] hover:shadow-lg", // More pronounced hover effect
      buttonText: "text-white",
      logoutBg: "bg-red-500 hover:bg-red-600", // Stronger red for logout
      logoutText: "text-white", // White text on red for clarity
      themeToggleBg: "bg-gray-200 text-gray-700 hover:bg-gray-300", // Neutral toggle background
      ozbotText: "text-blue-700",
      welcomeText: "text-gray-900", // Darker welcome text
      welcomeDescription: "text-gray-700", // Darker description
      cardIcon: "text-blue-600", // Stronger blue for icons
      cardIconBg: "bg-blue-50", // Light blue background for icons
      cardLabel: "text-gray-800",
      cardDescription: "text-gray-600",
      cardButtonBg: "bg-blue-600 hover:bg-blue-700",
    },
    dark: {
      bg: "bg-gradient-to-br from-gray-950 via-gray-800 to-indigo-950",
      header: "bg-gray-900/80 border-gray-700",
      textPrimary: "text-white",
      textSecondary: "text-gray-300",
      card: "bg-gray-800/70 border border-gray-700 shadow-xl",
      cardHover: "hover:scale-[1.02] hover:shadow-2xl", // Consistent scale effect
      buttonText: "text-white",
      logoutBg: "bg-red-800 hover:bg-red-700",
      logoutText: "text-red-300",
      themeToggleBg: "bg-gray-700 text-yellow-400 hover:bg-gray-600",
      ozbotText: "text-blue-400",
      welcomeText: "text-white", // Reverted to solid white for clear visibility in dark mode
      welcomeDescription: "text-blue-200",
      cardIcon: "text-blue-400",
      cardIconBg: "bg-gray-700", // Dark background for icons
      cardLabel: "text-white",
      cardDescription: "text-gray-300",
      cardButtonBg: "bg-blue-700 hover:bg-blue-800",
    }
  };

  const currentColors = colors[theme];

  const featureCards = [
    {
      label: "Voice Assistance",
      description: "Engage with Ozbot AI using voice commands for quick information retrieval.",
      path: "/voice-assistance",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
          <path d="M12 19v3" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <rect x="9" y="2" width="6" height="13" rx="3" />
        </svg>
      ),
    },
    {
      label: "Upload SOP",
      description: "Securely upload and manage Standard Operating Procedures for Ozbot AI to learn from.",
      path: "/upload-sop",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
          <path d="M12 3v12" />
          <path d="m17 8-5-5-5 5" />
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        </svg>
      ),
    },
    {
      label: "Chat History",
      description: "Review past conversations and interactions between users and Ozbot AI.",
      path: "/client-history-report",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l4 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-inter antialiased ${currentColors.bg}`}>

      {/* Header Bar */}
      <div className={`relative z-20 flex justify-between items-center p-4
        ${currentColors.header} shadow-lg backdrop-blur-sm border-b`}>
        <div className="flex items-center space-x-3">
          {/* Ozbot Logo/Branding - Larger Font */}
          <span className={`text-3xl sm:text-4xl font-extrabold ${currentColors.ozbotText}`}>
            Ozbot
          </span>
          <h1 className={`text-xl sm:text-2xl font-bold ${currentColors.textPrimary}`}>
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full shadow-lg transition-colors duration-200
              ${currentColors.themeToggleBg}`}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75
                    0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21
                    12.75 21a9.753 9.753 0 009.002-5.998Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386
                    6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591
                    1.591M5.25 12H3m4.227-4.773L5.636
                    5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75
                    3.75 0 017.5 0Z" />
              </svg>
            )}
          </button>

          {/* User Info Placeholder */}
          <div className={`flex items-center justify-center px-4 py-2 h-10 rounded-md shadow-md
            ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} text-base font-semibold`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <span>Admin User</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogoutClick}
            className={`flex items-center px-4 py-2 rounded-lg shadow-md text-sm transition-colors duration-200
              ${currentColors.logoutBg} ${currentColors.logoutText} font-semibold`}
            aria-label="Log out"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor"
              strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25
                2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5
                21h6a2.25 2.25 0 002.25-2.25V15M12
                9l3 3m0 0l-3 3m3-3H9" />
            </svg>
            Log out
          </button>
        </div>
      </div>

      {/* Main Content Area - Full Width */}
      <main className="flex-grow flex flex-col items-center justify-center p-8 overflow-y-auto">
        {/* Central welcome message - Now with Gradient Text and enhanced font */}
        <div className={`text-center mb-12 max-w-3xl drop-shadow-lg`}>
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${currentColors.welcomeText}`}>
            Welcome to Ozbot AI Admin
          </h2>
          <p className={`text-lg sm:text-xl ${currentColors.welcomeDescription}`}>
            Your central hub for managing Ozbot AI's core functionalities.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {featureCards.map((card) => (
            <div
              key={card.label}
              onClick={() => handleNavigation(card.path)}
              // Added role="button" and tabIndex="0" for accessibility
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNavigation(card.path);
                }
              }}
              className={`group p-8 rounded-2xl flex flex-col items-center text-center
                transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:ring-offset-2
                ${currentColors.card} ${currentColors.cardHover}`}
              aria-label={`Go to ${card.label}`}
            >
              {/* Icon Container - New Design */}
              <div className={`relative mb-4 p-3 rounded-full flex items-center justify-center
                  ${currentColors.cardIconBg} transition-transform duration-300 group-hover:scale-110`}>
                <div className={`transition-transform duration-300 ${currentColors.cardIcon}`}>
                  {card.icon}
                </div>
              </div>

              <h3 className={`text-2xl font-semibold mb-3 ${currentColors.cardLabel}`}>
                {card.label}
              </h3>
              <p className={`text-base mb-6 ${currentColors.cardDescription} leading-relaxed`}>
                {card.description}
              </p>
              <button
                className={`mt-auto px-6 py-3 rounded-lg shadow-md text-base font-semibold w-full flex items-center justify-center gap-2
                  ${currentColors.cardButtonBg} ${currentColors.buttonText}
                  transition-all duration-200 group-hover:translate-x-1 group-hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                aria-label={`Go to ${card.label}`} // Redundant but good for button
              >
                Go to {card.label}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 ml-1 transition-transform duration-200 group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminHome;
