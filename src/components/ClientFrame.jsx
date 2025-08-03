import React from 'react';
import { useNavigate } from 'react-router-dom';

function ClientFrame() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-gray-100 font-inter antialiased p-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg text-center">
        Client Frame Page
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl mb-10 text-blue-200 text-center">
        This is a placeholder for the Client Frame content.
      </p>
      <button
        className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-full shadow-lg
                   hover:bg-blue-600 transform hover:-translate-y-1 transition-all duration-300
                   focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
        onClick={() => navigate('/client-chat-voice')}
      >
        Go to Client Chat
      </button>
    </div>
  );
}

export default ClientFrame;