import React, { useState, useEffect, useContext, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom'; // Uncomment if you use navigate

import { ThemeContext } from '../App.jsx'; // Import ThemeContext from App.jsx

function WeatherAlertsPage() {
  // const navigate = useNavigate(); // Uncomment if you use navigate
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [enableVoiceAlerts, setEnableVoiceAlerts] = useState(false);
  const [currentWeather, setCurrentWeather] = useState('Rainy');

  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Web Speech API is not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    if (enableVoiceAlerts && currentWeather === 'Rainy') {
      speakText("It's currently rainy. Please be aware of the weather conditions.");
    }
  }, [enableVoiceAlerts, currentWeather, speakText]);

  const handleBack = () => {
    console.log("Navigating back from Weather Alerts Page.");
    // navigate(-1); // Uncomment if you use navigate
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-gray-100 font-inter antialiased">
      {/* Header Bar */}
      <div className="flex justify-between items-center p-4 bg-gray-900/50 backdrop-blur-sm shadow-lg border-b border-gray-700">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-300 hover:text-blue-100 transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
          aria-label="Back"
        >
          {/* FiArrowLeft icon */}
          <svg className="text-2xl" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
          </svg>
          <span className="ml-2 hidden sm:inline font-medium">Back</span>
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-white">Weather Alerts</h2>
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              // Moon icon for light theme
              <svg className="text-xl sm:text-2xl text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75S6.615 2.25 12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75zm0 0V21.75"></path>
              </svg>
            ) : (
              // Sun icon for dark theme
              <svg className="text-xl sm:text-2xl text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            )}
          </button>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-4">
        {/* Toggle Container */}
        <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-lg shadow-xl mb-8 flex items-center space-x-4 w-11/12 md:w-3/4 lg:w-2/3 px-4">
          <label htmlFor="voice-alerts-toggle" className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="voice-alerts-toggle"
              className="sr-only peer"
              checked={enableVoiceAlerts}
              onChange={(e) => setEnableVoiceAlerts(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
          <span className="text-lg font-medium text-gray-100">Enable Voice Alerts</span>
        </div>

        {/* Weather Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 p-4 bg-gray-800/70 backdrop-blur-md rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 px-4">
          <div className={`weather-icon-item flex flex-col items-center p-4 rounded-lg transition-all duration-300 cursor-pointer
            ${currentWeather === 'Sunny' ? 'bg-blue-700 text-white shadow-lg scale-105' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setCurrentWeather('Sunny')}>
            {/* FiSun icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-dim-icon lucide-sun-dim"><circle cx="12" cy="12" r="4"/><path d="M12 4h.01"/><path d="M20 12h.01"/><path d="M12 20h.01"/><path d="M4 12h.01"/>
            <path d="M17.657 6.343h.01"/><path d="M17.657 17.657h.01"/><path d="M6.343 17.657h.01"/><path d="M6.343 6.343h.01"/></svg>
            <span className="text-base font-medium">Sunny</span>
          </div>
          <div className={`weather-icon-item flex flex-col items-center p-4 rounded-lg transition-all duration-300 cursor-pointer
            ${currentWeather === 'Snowy' ? 'bg-blue-700 text-white shadow-lg scale-105' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setCurrentWeather('Snowy')}>
            {/* FiCloudSnow icon */}
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-snow-icon lucide-cloud-snow"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 15h.01"/>
           <path d="M8 19h.01"/><path d="M12 17h.01"/><path d="M12 21h.01"/><path d="M16 15h.01"/><path d="M16 19h.01"/></svg>
            <span className="text-base font-medium">Snowy</span>
          </div>
          <div className={`weather-icon-item flex flex-col items-center p-4 rounded-lg transition-all duration-300 cursor-pointer
            ${currentWeather === 'Thunder' ? 'bg-blue-700 text-white shadow-lg scale-105' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setCurrentWeather('Thunder')}>
            {/* FiCloudLightning icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-lightning-icon lucide-cloud-lightning">
            <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>
            <span className="text-base font-medium">Thunder</span>
          </div>
          <div className={`weather-icon-item flex flex-col items-center p-4 rounded-lg transition-all duration-300 cursor-pointer
            ${currentWeather === 'Rainy' ? 'bg-blue-700 text-white shadow-lg scale-105' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setCurrentWeather('Rainy')}>
            {/* FiCloudRain icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-rain-icon lucide-cloud-rain">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>
            <span className="text-base font-medium">Rainy</span>
          </div>
          <div className={`weather-icon-item flex flex-col items-center p-4 rounded-lg transition-all duration-300 cursor-pointer
            ${currentWeather === 'Cloudy' ? 'bg-blue-700 text-white shadow-lg scale-105' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setCurrentWeather('Cloudy')}>
            {/* FiCloud icon */}
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-icon lucide-cloud">
           <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
            <span className="text-base font-medium">Cloudy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherAlertsPage;