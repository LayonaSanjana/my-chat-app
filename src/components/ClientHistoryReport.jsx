
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App.jsx'; // Import ThemeContext from App.jsx

function ClientHistoryReport() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [selectedClient, setSelectedClient] = useState('');
  const [startDate, setStartDate] = useState(''); // State for start date
  const [endDate, setEndDate] = useState('');     // State for end date
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [showModal, setShowModal] = useState(false); // State for custom alert modal
  const [modalMessage, setModalMessage] = useState(''); // Message for custom alert modal
  const [modalType, setModalType] = useState('info'); // 'info', 'success', 'error' for modal icon

  const modalRef = useRef(null); // Ref for the modal for focus management
  const chatHistoryRef = useRef(null); // Ref for the chat history container for scroll behavior

  // Mock client data and chat histories
  const mockClients = ['Client A', 'Client B', 'Client C'];
  const mockChatHistories = {
    'Client A': [
      { id: 1, sender: 'user', text: 'Hello, OzBot. What is SOP-001?', timestamp: '2025-07-10T09:00:00Z' },
      { id: 2, sender: 'assistant', text: 'SOP-001 is the Emergency Shutdown Procedure.', timestamp: '2025-07-10T09:00:15Z' },
      { id: 3, sender: 'user', text: 'Guide me through it.', timestamp: '2025-07-10T09:01:00Z' },
      { id: 4, sender: 'assistant', text: 'Starting "Emergency Shutdown Procedure". Step 1: Verify the nature and severity of the emergency.', timestamp: '2025-07-10T09:01:30Z' },
      { id: 5, sender: 'user', text: 'Next step, please.', timestamp: '2025-07-11T10:00:00Z' },
      { id: 6, sender: 'assistant', text: 'Step 2: Isolate power to non-essential equipment.', timestamp: '2025-07-11T10:00:10Z' },
      { id: 7, sender: 'user', text: 'What does SOP mean?', timestamp: '2025-07-12T11:00:00Z' },
      { id: 8, sender: 'assistant', text: 'SOP stands for Standard Operating Procedure.', timestamp: '2025-07-12T11:00:15Z' },
    ],
    'Client B': [
      { id: 1, sender: 'user', text: 'Hi, I need to onboard a new employee.', timestamp: '2025-07-10T14:30:00Z' },
      { id: 2, sender: 'assistant', text: 'I found the SOP for "New Employee Onboarding". Want me to guide you through it?', timestamp: '2025-07-10T14:30:45Z' },
      { id: 3, sender: 'user', text: 'Yes, please proceed.', timestamp: '2025-07-10T14:31:00Z' },
      { id: 4, sender: 'assistant', text: 'Starting "New Employee Onboarding". Step 1: Greet new employee and introduce to team.', timestamp: '2025-07-10T14:31:30Z' },
    ],
    'Client C': [
      { id: 1, sender: 'user', text: 'List all available SOPs.', timestamp: '2025-07-11T08:00:00Z' },
      { id: 2, sender: 'assistant', text: 'I have SOPs for: Emergency Shutdown Procedure, New Employee Onboarding.', timestamp: '2025-07-11T08:00:30Z' },
    ],
  };

  // Define color palette and styles based on theme
  const colors = {
    light: {
      bg: "bg-gradient-to-br from-blue-50 to-indigo-100 via-white",
      headerBg: "bg-white border-b border-gray-200",
      headerText: "text-gray-900",
      backBtnBg: "bg-gray-200 hover:bg-gray-300",
      backBtnText: "text-gray-700 hover:text-gray-900",
      themeToggleBg: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      themeToggleIcon: "text-yellow-900",
      panelBg: "bg-white",
      panelText: "text-gray-800",
      labelColor: "text-gray-800",
      inputBg: "bg-white",
      inputBorder: "border-gray-300",
      inputText: "text-gray-800",
      inputFocusRing: "focus:ring-blue-500",
      selectBg: "bg-white",
      selectBorder: "border-gray-300",
      selectText: "text-gray-800",
      selectFocusRing: "focus:ring-blue-500",
      viewBtnBg: "bg-blue-600 hover:bg-blue-700",
      viewBtnText: "text-white",
      downloadBtnBg: "bg-green-600 hover:bg-green-700",
      downloadBtnText: "text-white",
      disabledBtnBg: "bg-gray-300 cursor-not-allowed", // Lighter disabled for light mode
      disabledBtnText: "text-gray-600",
      chatHistoryBg: "bg-white",
      chatBubbleUserBg: "bg-blue-500",
      chatBubbleUserText: "text-white",
      chatBubbleAssistantBg: "bg-gray-200",
      chatBubbleAssistantText: "text-gray-900",
      chatBubbleTimestampUser: "text-blue-200",
      chatBubbleTimestampAssistant: "text-gray-600",
      loadingText: "text-gray-600",
      emptyStateText: "text-gray-600",
      disclaimerText: "text-gray-600",
      modalOverlay: "bg-black/50",
      modalContentBg: "bg-white",
      modalContentText: "text-gray-900",
      modalButtonBg: "bg-blue-600 hover:bg-blue-700",
      modalButtonText: "text-white",
      skeletonLight: "bg-gray-200",
      skeletonDark: "bg-gray-300"
    },
    dark: {
      bg: "bg-gradient-to-br from-gray-950 via-gray-800 to-blue-950",
      headerBg: "bg-gray-900 border-b border-gray-700",
      headerText: "text-white",
      backBtnBg: "bg-gray-700 hover:bg-gray-600",
      backBtnText: "text-gray-300 hover:text-white",
      themeToggleBg: "bg-gray-700 text-yellow-400 hover:bg-gray-600",
      themeToggleIcon: "text-yellow-100",
      panelBg: "bg-gray-800",
      panelText: "text-gray-100",
      labelColor: "text-gray-100",
      inputBg: "bg-gray-700",
      inputBorder: "border-gray-600",
      inputText: "text-white",
      inputFocusRing: "focus:ring-blue-400",
      selectBg: "bg-gray-700",
      selectBorder: "border-gray-600",
      selectText: "text-white",
      selectFocusRing: "focus:ring-blue-400",
      viewBtnBg: "bg-blue-700 hover:bg-blue-800",
      viewBtnText: "text-white",
      downloadBtnBg: "bg-green-700 hover:bg-green-800",
      downloadBtnText: "text-white",
      disabledBtnBg: "bg-gray-600 cursor-not-allowed",
      disabledBtnText: "text-gray-400",
      chatHistoryBg: "bg-gray-800",
      chatBubbleUserBg: "bg-blue-600",
      chatBubbleUserText: "text-white",
      chatBubbleAssistantBg: "bg-gray-700",
      chatBubbleAssistantText: "text-gray-100",
      chatBubbleTimestampUser: "text-blue-300",
      chatBubbleTimestampAssistant: "text-gray-400",
      loadingText: "text-gray-300",
      emptyStateText: "text-gray-300",
      disclaimerText: "text-gray-400",
      modalOverlay: "bg-black/70",
      modalContentBg: "bg-gray-700",
      modalContentText: "text-gray-100",
      modalButtonBg: "bg-blue-700 hover:bg-blue-800",
      modalButtonText: "text-white",
      skeletonLight: "bg-gray-600",
      skeletonDark: "bg-gray-500"
    }
  };

  const currentColors = colors[theme];

  // Function to set default dates (e.g., last 30 days) on initial load
  useEffect(() => {
    const todayDate = new Date();
    const thirtyDaysAgo = new Date(todayDate);
    thirtyDaysAgo.setDate(todayDate.getDate() - 30);

    // Format dates to YYYY-MM-DD for input type="date"
    const formatDate = (date) => date.toISOString().split('T')[0];

    // Only set defaults if they are not already set (e.g., from query params or user interaction)
    if (!startDate) setStartDate(formatDate(thirtyDaysAgo));
    if (!endDate) setEndDate(formatDate(todayDate));
  }, []); // Run once on component mount

  // Focus trap for modal (Accessibility improvement)
  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current.focus(); // Focus the modal when it opens
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
          if (event.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        } else if (event.key === 'Escape') { // Escape key to close modal
          closeModal();
          event.preventDefault();
        }
      };

      modalRef.current.addEventListener('keydown', handleKeyDown);
      return () => {
        modalRef.current?.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showModal]);

  // Auto-scroll chat history to bottom when new messages load (UI/UX improvement)
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]); // Scroll when history updates or loading state changes

  // Function to close the custom modal
  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
    setModalType('info');
  };

  // Function to fetch chat history based on selected client and date range
  const fetchChatHistory = () => {
    if (!selectedClient) {
      setModalMessage("Please select a client to view the report.");
      setModalType('info');
      setShowModal(true);
      return;
    }

    // Validate dates
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include entire end day

      if (start > end) {
        setModalMessage("Start date cannot be after end date. Please adjust the date range.");
        setModalType('error');
        setShowModal(true);
        return;
      }
    }

    setIsLoading(true);
    setChatHistory([]); // Clear previous history immediately (for skeleton loader visibility)

    // Simulate network latency (replace with actual API call)
    setTimeout(() => {
      let filteredHistory = mockChatHistories[selectedClient] || [];

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include entire end day

        filteredHistory = filteredHistory.filter(msg => {
          const msgDate = new Date(msg.timestamp);
          return msgDate >= start && msgDate <= end;
        });
      }
      setChatHistory(filteredHistory);
      setIsLoading(false);
    }, 800);
  };

  // EFFECT: Trigger fetch when client or dates change (auto-update report)
  useEffect(() => {
    // Only auto-fetch if a client is already selected
    if (selectedClient) {
      fetchChatHistory();
    } else {
      setChatHistory([]); // Clear history if no client is selected or on initial load
    }
  }, [selectedClient, startDate, endDate]); // Dependencies for re-fetching

  // Handles navigation back to the admin dashboard
  const handleBack = () => {
    navigate('/admin-home'); // Assuming /admin-home is the path to your admin dashboard
  };

  // Handles downloading the chat history report
  const handleDownloadReport = () => {
    if (!selectedClient) {
      setModalMessage("Please select a client to download a report.");
      setModalType('info');
      setShowModal(true);
      return;
    }
    if (chatHistory.length === 0) {
      setModalMessage("No chat history to download for the selected client and date range.");
      setModalType('info');
      setShowModal(true);
      return;
    }

    setIsLoading(true); // Show loading for download as well (briefly)
    setTimeout(() => { // Simulate download time
        const reportContent = chatHistory
        .map(msg => {
            // Use Intl.DateTimeFormat for robust timezone/locale formatting
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                timeZone: 'Asia/Kolkata', // IST timezone
                hour12: false // 24-hour format
            };
            const formattedDate = new Intl.DateTimeFormat('en-IN', options).format(new Date(msg.timestamp));
            return `${formattedDate}: ${msg.sender === 'user' ? 'User' : 'OzBot'}: ${msg.text}`;
        })
        .join('\n');

      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat_history_${selectedClient.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up the object URL

      setIsLoading(false); // Hide loading after download
      setModalMessage(`Report for ${selectedClient} downloaded successfully!`);
      setModalType('success');
      setShowModal(true);
    }, 500); // Simulate download latency
  };

  // Function to clear date filters
  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
  };

  // Max date for date inputs (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    // Main container with dynamic background/text based on theme
    <div className={`min-h-screen flex flex-col font-inter antialiased ${currentColors.bg}`}>
      {/* Header Bar */}
      <div className={`flex justify-between items-center p-4 shadow-lg ${currentColors.headerBg}`}>
        <button
          onClick={handleBack}
          className={`flex items-center transition-colors duration-200 p-2 rounded-full transform hover:scale-105 shadow-md
            ${currentColors.backBtnBg} ${currentColors.backBtnText} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          aria-label="Back to Admin Dashboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move-left-icon lucide-move-left">
            <path d="M6 8L2 12L6 16"/><path d="M2 12H22"/>
          </svg>
        </button>
        <h2 className={`text-xl sm:text-2xl font-bold ${currentColors.headerText}`}>Client Chat History Report</h2>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full shadow-lg transition-colors duration-200
            ${currentColors.themeToggleBg} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          aria-label="Toggle theme"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-6 h-6 ${currentColors.themeToggleIcon}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-6 h-6 ${currentColors.themeToggleIcon}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center p-4 pt-8">
        {/* Report Controls Panel */}
        <div className={`p-6 rounded-lg shadow-xl mb-8 w-full max-w-4xl flex flex-wrap justify-center items-center gap-4 transition-colors duration-200
          ${currentColors.panelBg}`}>
          
          {/* Client Select */}
          <div className="flex items-center">
            <label htmlFor="client-select" className={`mr-3 text-lg font-medium ${currentColors.labelColor}`}>Client:</label>
            <select
              id="client-select"
              className={`p-2 rounded-md border text-base focus:outline-none focus:ring-2 ${currentColors.selectFocusRing}
                ${currentColors.selectBg} ${currentColors.selectBorder} ${currentColors.selectText}`}
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              aria-label="Select Client"
            >
              <option value="">-- Select --</option>
              {mockClients.map((client) => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>

          {/* Date Range Selectors */}
          <div className="flex items-center">
            <label htmlFor="start-date" className={`mr-3 text-lg font-medium ${currentColors.labelColor}`}>From:</label>
            <input
              type="date"
              id="start-date"
              className={`p-2 rounded-md border text-base focus:outline-none focus:ring-2 ${currentColors.inputFocusRing}
                ${currentColors.inputBg} ${currentColors.inputBorder} ${currentColors.inputText}`}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={today} // Prevent selecting future dates
              aria-label="Start Date"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="end-date" className={`mr-3 text-lg font-medium ${currentColors.labelColor}`}>To:</label>
            <input
              type="date"
              id="end-date"
              className={`p-2 rounded-md border text-base focus:outline-none focus:ring-2 ${currentColors.inputFocusRing}
                ${currentColors.inputBg} ${currentColors.inputBorder} ${currentColors.inputText}`}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={today} // Prevent selecting future dates
              aria-label="End Date"
            />
          </div>

          {/* Clear Dates Button */}
          {(startDate || endDate) && (
            <button
              onClick={handleClearDates}
              className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 shadow-md transform hover:scale-105
                ${currentColors.backBtnBg} ${currentColors.backBtnText} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              aria-label="Clear date filters"
            >
              Clear Dates
            </button>
          )}

          {/* Action Buttons */}
          <button
            onClick={fetchChatHistory}
            disabled={!selectedClient || isLoading}
            className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 shadow-md transform hover:scale-105
              ${!selectedClient || isLoading ? `${currentColors.disabledBtnBg} ${currentColors.disabledBtnText}` : `${currentColors.viewBtnBg} ${currentColors.viewBtnText}`}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            aria-live="polite" // Announce loading state to screen readers
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : 'View Report'}
          </button>
          <button
            onClick={handleDownloadReport}
            disabled={!selectedClient || chatHistory.length === 0 || isLoading}
            className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 shadow-md transform hover:scale-105
              ${!selectedClient || chatHistory.length === 0 || isLoading ? `${currentColors.disabledBtnBg} ${currentColors.disabledBtnText}` : `${currentColors.downloadBtnBg} ${currentColors.downloadBtnText}`}
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
            aria-live="polite" // Announce loading state to screen readers
          >
            Download Report
          </button>
        </div>

        {/* Chat History Display Area */}
        <div className={`p-6 rounded-lg shadow-xl w-full max-w-4xl flex-grow overflow-y-auto custom-scrollbar h-[60vh] transition-colors duration-200
          ${currentColors.chatHistoryBg}`}
          aria-live="polite" // Announce updates to screen readers
          ref={chatHistoryRef} // Attach ref for scroll behavior
        >
          
          {isLoading ? (
            // Skeleton Loader for Chat History (UI/UX improvement)
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-xl max-w-[80%] break-words shadow-sm animate-pulse
                    ${index % 2 === 0 ? currentColors.skeletonLight + ' rounded-br-none' : currentColors.skeletonDark + ' rounded-bl-none'}`}>
                    <div className={`h-3 ${currentColors.skeletonDark} rounded w-3/4 mb-2`}></div>
                    <div className={`h-3 ${currentColors.skeletonLight} rounded w-full`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : chatHistory.length > 0 ? (
            chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[80%] break-words shadow-sm flex flex-col animate-message-in
                    ${msg.sender === 'user'
                      ? `${currentColors.chatBubbleUserBg} ${currentColors.chatBubbleUserText} self-end rounded-br-none`
                      : `${currentColors.chatBubbleAssistantBg} ${currentColors.chatBubbleAssistantText} self-start rounded-bl-none`
                    }`}
                >
                  <span className={`text-xs mb-1 ${msg.sender === 'user' ? currentColors.chatBubbleTimestampUser : currentColors.chatBubbleTimestampAssistant}`}>
                    {msg.sender === 'user' ? 'You' : 'OzBot'} - {new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(msg.timestamp))}
                  </span>
                  <span>{msg.text}</span>
                </div>
              </div>
            ))
          ) : (
            // Empty State (UI/UX improvement)
            <div className={`flex flex-col items-center justify-center h-full text-center ${currentColors.emptyStateText}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 10.5h7.5m-7.5 3h7.5m-7.5 3h7.5H12a9 9 0 00-9 9v1.5a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V6.75a3 3 0 00-3-3H15.75m-1.5-1.5L12 3m0 0L9.75 5.25" />
              </svg>
              <p className="text-xl font-semibold">
                {selectedClient ? "No chat history found for the selected client or date range." : "Select a client to begin."}
              </p>
              {!selectedClient && (
                <p className="text-md mt-2">Choose a client from the dropdown above to view their interactions.</p>
              )}
            </div>
          )}
        </div>

        {/* Disclaimer Text */}
        <p className={`report-disclaimer mt-6 text-center text-sm ${currentColors.disclaimerText}`}>
          This report provides a summary of client interactions with the AI assistant. Dates are displayed in Indian Standard Time (IST).
        </p>
      </div>

      {/* Custom Alert Modal (UI/UX improvement) */}
      {showModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${currentColors.modalOverlay}`}
          role="alertdialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          tabIndex="-1" // Make modal focusable
          ref={modalRef} // Attach ref for focus trap
        >
          <div className={`p-6 rounded-lg shadow-xl max-w-sm w-full text-center ${currentColors.modalContentBg}`}>
            <div className="flex justify-center mb-4">
              {modalType === 'success' && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {modalType === 'error' && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.38 3.375 2.07 3.375h14.006c1.69 0 2.936-1.875 2.07-3.375L13.5 4.625a1.125 1.125 0 00-1.94 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              )}
              {modalType === 'info' && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              )}
            </div>
            <h3 id="modal-title" className={`mb-2 text-xl font-bold ${currentColors.modalContentText}`}>
              {modalType === 'success' ? 'Success!' : modalType === 'error' ? 'Error!' : 'Information'}
            </h3>
            <p id="modal-description" className={`mb-4 text-lg ${currentColors.modalContentText}`}>{modalMessage}</p>
            <button
              onClick={closeModal}
              className={`px-6 py-2 rounded-md font-semibold ${currentColors.modalButtonBg} ${currentColors.modalButtonText} hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Custom CSS for Scrollbar and Animations */}
      <style>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#374151' : '#f3f4f6'}; /* bg-gray-700 / bg-gray-100 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? '#6b7280' : '#9ca3af'}; /* bg-gray-500 / bg-gray-400 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? '#9ca3af' : '#6b7280'}; /* bg-gray-400 / bg-gray-500 */
        }

        /* Message Entrance Animation */
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-message-in { animation: messageIn 0.3s ease-out forwards; }

        /* Skeleton Loader Animation */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

export default ClientHistoryReport;