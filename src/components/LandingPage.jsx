import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App.jsx'; // Still needed if other parts of the app use it

function LandingPage() {
  const navigate = useNavigate();
  // We still consume ThemeContext, but effectively only use the 'dark' theme styles
  // The 'theme' variable itself is not used for conditional styling in *this* component anymore.
  const { theme } = useContext(ThemeContext); 

  const handleGetStartedClick = () => {
    navigate('/login'); // Navigate to the login page
  };

  // Define color palette and styles for the Landing Page (now only dark theme)
  const colors = {
    dark: {
      bg: "bg-gradient-to-br from-gray-950 via-gray-800 to-blue-950",
      headerText: "bg-gradient-to-r from-sky-200 via-emerald-200 to-rose-200 text-transparent bg-clip-text text-shadow-glow",
      sloganText: "text-blue-50 text-shadow-md",
      buttonBg: "bg-yellow-600 hover:bg-yellow-500", // Adjusted to be consistently vibrant for single theme
      buttonText: "text-white",
      buttonRing: "focus:ring-yellow-400",
      // themeToggleBg and themeToggleIconStroke are removed as toggle button is gone
      logoFilter: "filter brightness-175 contrast-125 drop-shadow-md", // Applicable if logo image is inherently dark
      logoSrc: "/public/thumbnail_image-removebg-preview1.png", // Only light logo path (for dark backgrounds)
    }
  };

  // currentColors now directly refers to the dark theme styles
  const currentColors = colors.dark; 

  return (
    // Applying dynamic background based on the (now forced) dark theme
    <div className={`min-h-screen flex flex-col items-center justify-center font-inter antialiased p-4 relative ${currentColors.bg}`}>

      {/* Theme Toggle button removed as there's only one theme */}
      
      {/* Logo - Dynamically loads theme-optimized logo (now always the light version for dark background) */}
      {/* IMPORTANT: Please ensure '/assets/logos/ausgrid-logo-light.png' is the path
          to your company's logo version designed to be visible on dark backgrounds. */}
      <img
        src={currentColors.logoSrc}
        alt="Company Logo"
        className={`w-48 sm:w-64 lg:w-80 h-auto mb-8 drop-shadow-xl animate-fade-in-down ${currentColors.logoFilter}`}
      />


      {/* Main Heading - "Wow Factor" with FIXED Readability */}
      <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-center leading-tight tracking-tight animate-fade-in ${currentColors.headerText}`}>
        Making electricity accessible for all
      </h1>

      {/* Slogan/Tagline - FIXED Readability */}
      <p className={`text-lg sm:text-xl md:text-2xl lg:text-3xl mb-12 text-center max-w-2xl animate-fade-in delay-200 ${currentColors.sloganText}`}>
        Welcome aboard! 
      </p>

      {/* Get Started Button - Prominent, Interactive & Engaging */}
      <button
        className={`px-10 py-5 ${currentColors.buttonBg} ${currentColors.buttonText} font-bold rounded-full shadow-2xl
          hover:scale-105 hover:shadow-xl transform transition-all duration-300
          focus:outline-none focus:ring-4 ${currentColors.buttonRing} focus:ring-opacity-75 animate-bounce-once inline-flex items-center justify-center group`}
        onClick={handleGetStartedClick}
        aria-label="Get Started and navigate to login"
      >
        Get Started
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>

      {/* Custom CSS for Text Shadow and optional background patterns */}
      <style>{`
        /* Custom Text Shadow for "Glow" Effect on Header */
        .text-shadow-glow {
          text-shadow:
            0 0 5px rgba(255, 255, 255, 0.4), /* subtle base glow */
            0 0 15px rgba(255, 255, 255, 0.3), /* medium glow */
            0 0 30px rgba(255, 255, 255, 0.2); /* wide, softer glow */
        }
        /* Text Shadow for Slogan (now only for dark background) */
        .text-shadow-md {
            text-shadow: 0 2px 4px rgba(255, 255, 255, 0.2); /* Lighter shadow for dark background text */
        }

        /* Standard Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-down { animation: fadeIn 1s ease-out forwards; }
        .delay-200 { animation-delay: 0.2s; }

        @keyframes bounceOnce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-once { animation: bounceOnce 0.6s ease-out; }

        /* Optional Background Patterns (uncomment and provide actual patterns if desired) */
        /*
        .bg-pattern-dark::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);
          background-size: 25px 25px;
          pointer-events: none;
        }
        */
      `}</style>
    </div>
  );
}

export default LandingPage;