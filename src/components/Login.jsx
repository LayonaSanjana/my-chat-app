import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App.jsx'; // Ensure this is a named export

function Login({ onLogin }) {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const mockUsers = {
    'admin@example.com': { role: 'admin', password: 'admin123' },
    'client@example.com': { role: 'client', password: 'client123' }
  };

  const handleLogin = () => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      let role = null;
      if (mockUsers[email] && password === mockUsers[email].password) {
        role = mockUsers[email].role;
      } else {
        setError('Invalid email or password.');
      }

      if (role) {
        onLogin(role);
        navigate(role === 'admin' ? '/admin-home' : '/client-chat-voice');
      }
      setLoading(false);
    }, 1500);
  };

  const colors = {
    light: {
      bg: "bg-gradient-to-br from-blue-50 to-indigo-100 via-white",
      loginCardBg: "bg-white/90 border border-gray-200 shadow-2xl",
      headingText: "text-gray-900",
      subheadingText: "text-gray-600",
      inputBg: "bg-gray-50",
      inputText: "text-gray-900",
      inputPlaceholder: "placeholder-gray-500",
      inputBorder: "border-gray-300",
      inputFocusRing: "focus:ring-blue-500",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      buttonText: "text-white",
      errorBg: "bg-red-100",
      errorText: "text-red-700",
      illustrationBg: "bg-gradient-to-br from-blue-100 to-indigo-200",
      illustrationText: "text-blue-800",
    },
    dark: {
      bg: "bg-gradient-to-br from-gray-950 via-gray-800 to-blue-950",
      loginCardBg: "bg-gray-900/80 border border-gray-700 shadow-2xl",
      headingText: "text-white",
      subheadingText: "text-gray-300",
      inputBg: "bg-gray-700",
      inputText: "text-white",
      inputPlaceholder: "placeholder-gray-400",
      inputBorder: "border-gray-600",
      inputFocusRing: "focus:ring-blue-400",
      buttonBg: "bg-blue-700 hover:bg-blue-800",
      buttonText: "text-white",
      errorBg: "bg-red-900/50",
      errorText: "text-red-300",
      illustrationBg: "bg-gradient-to-br from-gray-800 to-blue-900",
      illustrationText: "text-blue-200",
    }
  };

  const currentColors = colors[theme];

  return (
    <div className={`min-h-screen flex items-center justify-center font-inter antialiased p-4 ${currentColors.bg}`}>
      <div className={`flex flex-col md:flex-row rounded-2xl overflow-hidden max-w-6xl w-full transform transition-transform duration-500 animate-fade-in-up ${currentColors.loginCardBg}`}>

        {/* Left - Form */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-2 ${currentColors.headingText}`}>Welcome back</h2>
          <p className={`mb-8 ${currentColors.subheadingText}`}>Enter your email and password to sign in.</p>

          {error && (
            <div className={`p-3 mb-4 rounded-lg text-sm ${currentColors.errorBg} ${currentColors.errorText}`}>
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4 relative">
            <label htmlFor="email" className="sr-only">Email ID</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className={`w-5 h-5 ${currentColors.subheadingText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21.75 9.75v7.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 17.25V9.75m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9.75m18 0V6.75A2.25 2.25 0 0018.75 4.5H5.25A2.25 2.25 0 003 6.75v3" />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              autoComplete="email"
              className={`w-full p-3 pl-10 rounded-lg ${currentColors.inputBg} ${currentColors.inputBorder} ${currentColors.inputText} ${currentColors.inputPlaceholder} focus:outline-none focus:ring-2 ${currentColors.inputFocusRing}`}
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              aria-label="Enter your email ID"
            />
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className={`w-5 h-5 ${currentColors.subheadingText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25Z" />
              </svg>
            </div>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              className={`w-full p-3 pl-10 rounded-lg ${currentColors.inputBg} ${currentColors.inputBorder} ${currentColors.inputText} ${currentColors.inputPlaceholder} focus:outline-none focus:ring-2 ${currentColors.inputFocusRing}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
              aria-label="Enter your password"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center justify-center gap-2 ${currentColors.buttonBg} ${currentColors.buttonText} disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={loading || !email || !password}
            aria-label={loading ? 'Signing In...' : 'Sign In'}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        {/* Right - Illustration */}
        <div className={`flex-1 p-8 md:p-12 lg:p-16 flex items-center justify-center relative ${currentColors.illustrationBg}`}>
          <div className="relative w-full h-full flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full opacity-30 animate-pulse-slow" viewBox="0 0 200 200">
              <path fill="currentColor" d="M100 0C44.772 0 0 44.772 0 100s44.772 100 100 100 100-44.772 100-100S155.228 0 100 0zm0 180c-44.183 0-80-35.817-80-80s35.817-80 80-80 80 35.817 80 80-35.817 80-80 80z"/>
              <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.8" className="animate-ping-slow" />
              <circle cx="150" cy="150" r="10" fill="currentColor" opacity="0.8" className="animate-ping-slow animation-delay-1000" />
              <line x1="50" y1="50" x2="150" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <path d="M50 150c0-20 20-20 20-40s-20-20-20-40" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" className="animate-draw-line" />
            </svg>
            <div className={`text-center relative z-10 ${currentColors.illustrationText}`}>
              <svg className="w-24 h-24 mx-auto mb-4 drop-shadow-lg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25Z" />
              </svg>
              <p className="text-xl font-semibold drop-shadow-md">Secure & Seamless Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.7s ease-out forwards; }

        @keyframes pulseSlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.02); }
        }
        .animate-pulse-slow { animation: pulseSlow 5s infinite ease-in-out; }

        @keyframes pingSlow {
          0% { transform: scale(0.2); opacity: 0.8; }
          80%, 100% { transform: scale(1.2); opacity: 0; }
        }
        .animate-ping-slow { animation: pingSlow 3s infinite; }
        .animation-delay-1000 { animation-delay: 1s; }

        @keyframes drawLine {
          from { stroke-dasharray: 0 100; }
          to { stroke-dasharray: 100 0; }
        }
        .animate-draw-line {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawLine 2s linear infinite alternate;
        }
      `}</style>
    </div>
  );
}

export default Login;