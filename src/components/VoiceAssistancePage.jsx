
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App.jsx'; // Import ThemeContext from App.jsx

// Mock SOP Data (re-used from ClientChatAndVoice for consistency)
const initialSOPData = [
  {
    id: 'sop-001',
    title: 'Emergency Shutdown Procedure',
    summary: 'Steps to safely shut down critical systems in an emergency.',
    keywords: ['emergency', 'shutdown', 'safety', 'critical'],
    sections: [
      {
        title: 'Initial Assessment',
        steps: [
          'Verify the nature and severity of the emergency.',
          'Identify affected systems and personnel.'
        ]
      },
      {
        title: 'System Disconnection',
        steps: [
          'Isolate power to non-essential equipment.',
          'Initiate sequential shutdown of primary systems.'
        ]
      },
      {
        title: 'Verification',
        steps: [
          'Confirm all systems are powered down.',
          'Secure the area and report to command center.'
        ]
      }
    ],
    glossary: [
      { term: 'SOP', definition: 'Standard Operating Procedure' },
      { term: 'Critical Systems', definition: 'Systems essential for operation or safety, whose failure would cause significant harm.' }
    ]
  },
  {
    id: 'sop-002',
    title: 'New Employee Onboarding',
    summary: 'A guide for integrating new employees into the company.',
    keywords: ['onboarding', 'new hire', 'employee', 'HR'],
    sections: [
      {
        title: 'Day 1 Welcome',
        steps: [
          'Greet new employee and introduce to team.',
          'Provide welcome packet and essential documents.'
        ]
      },
      {
        title: 'System Setup',
        steps: [
          'Assist with computer and software setup.',
          'Provide access to internal networks and tools.'
        ]
      }
    ],
    glossary: [
      { term: 'HR', definition: 'Human Resources' },
      { term: 'Welcome Packet', definition: 'A collection of documents and information provided to new employees.' }
    ]
  }
];

function VoiceAssistancePage({ onLogout, chatHistoryKey = 'adminVoiceHistory' }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState(''); // New state for live transcript
  const chatAreaRef = useRef(null);
  const recognitionRef = useRef(null);

  const [guidedSOP, setGuidedSOP] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const [isAIThinking, setIsAIThinking] = useState(false);

  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState(() => {
    const storedWeatherAlerts = localStorage.getItem(`${chatHistoryKey}-weatherAlertsEnabled`);
    return storedWeatherAlerts === null ? false : JSON.parse(storedWeatherAlerts);
  });

  const [currentWeatherAlert, setCurrentWeatherAlert] = useState('No active weather alerts.');
  const [isWeatherAlertActive, setIsWeatherAlertActive] = useState(false);
  const [userName, setUserName] = useState('Admin User');

  const [showChatHistory, setShowChatHistory] = useState(false);

  // Mock chat history for sidebar
  const [sidebarChats, setSidebarChats] = useState([
    { id: 'admin-chat-1', title: 'SOP Management' },
    { id: 'admin-chat-2', title: 'System Diagnostics' },
    { id: 'admin-chat-3', title: 'User Support' },
  ]);

  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const getAvailableSOPs = useCallback(() => {
    // In a real app, this would fetch from a backend service
    // For now, combining initial mock data with any potentially "uploaded" data
    const uploadedSOPsRaw = localStorage.getItem('mockUploadedSOPs'); // Assuming this stores new SOPs
    const uploadedSOPs = uploadedSOPsRaw ? JSON.parse(uploadedSOPsRaw) : [];
    // Simple deduplication based on ID or title if needed
    const allSOPs = [...initialSOPData, ...uploadedSOPs.filter(upSOP => !initialSOPData.some(initSOP => initSOP.id === upSOP.id))];
    return allSOPs;
  }, []);

  const getGlossaryDefinition = useCallback((term) => {
    const lowerTerm = term.toLowerCase();
    const sops = getAvailableSOPs();
    for (const sop of sops) {
      if (sop.glossary) {
        const definition = sop.glossary.find(g => lowerTerm === g.term.toLowerCase());
        if (definition) return definition.definition;
      }
    }
    return null;
  }, [getAvailableSOPs]);

  const findSOPByKeyword = useCallback((query) => {
    const lowerQuery = query.replace(/find sop for|search sop for|what is the procedure for/i, '').trim();
    const sops = getAvailableSOPs(); // Search through all available SOPs
    const foundSOP = sops.find(sop =>
      sop.keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase())) ||
      lowerQuery.includes(sop.title.toLowerCase())
    );
    return foundSOP;
  }, [getAvailableSOPs]);

  const getAIResponse = useCallback((userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (guidedSOP) {
      const allSteps = guidedSOP.sections.flatMap(section => section.steps);
      const sopTitle = guidedSOP.title;

      if (lowerMessage.includes('next') || lowerMessage.includes('next step')) {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < allSteps.length) {
          setCurrentStepIndex(nextIndex);
          return `Okay, here is the next step for "${sopTitle}": ${allSteps[nextIndex]}.`;
        } else {
          setGuidedSOP(null);
          setCurrentStepIndex(-1);
          return `You have completed all steps for "${sopTitle}".`;
        }
      }

      if (lowerMessage.includes('repeat') || lowerMessage.includes('repeat step')) {
        if (currentStepIndex >= 0 && currentStepIndex < allSteps.length) {
          return `Repeating current step for "${sopTitle}": ${allSteps[currentStepIndex]}.`;
        } else {
          return "I'm not on a specific step to repeat.";
        }
      }

      if (lowerMessage.includes('exit') || lowerMessage.includes('stop guide')) {
        setGuidedSOP(null);
        setCurrentStepIndex(-1);
        return `Ended the guided procedure for "${sopTitle}".`;
      }

      const termMatch = lowerMessage.match(/what is (.+?) mean/);
      if (termMatch && termMatch[1]) {
        const term = termMatch[1].trim();
        const definition = getGlossaryDefinition(term);
        if (definition) return `${term} means: ${definition}.`;
      }

      return `You're in guided mode for "${sopTitle}". Say "next step", "repeat step", or "exit guide".`;
    }

    if (lowerMessage.includes('find sop for') || lowerMessage.includes('search sop for') || lowerMessage.includes('what is the procedure for')) {
      const sopQuery = lowerMessage.replace(/find sop for|search sop for|what is the procedure for/i, '').trim();
      const foundSOP = findSOPByKeyword(sopQuery);
      if (foundSOP) {
        setGuidedSOP(foundSOP); // Start guiding through this SOP
        setCurrentStepIndex(0); // Start from the first step
        const firstStep = foundSOP.sections.flatMap(section => section.steps)[0];
        return `I found the SOP for "${foundSOP.title}". It's about ${foundSOP.summary}. Let's start with the first step: ${firstStep}.`;
      } else {
        return `I couldn't find an SOP for "${sopQuery}".`;
      }
    }

    if (lowerMessage.includes('list sop') || lowerMessage.includes('show sops')) {
      const sops = getAvailableSOPs();
      return sops.length > 0
        ? `I have SOPs for: ${sops.map(s => s.title).join(', ')}.`
        : "No SOPs available yet.";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey ozbot')) return `Hello ${userName}! How can I help you today?`;
    if (lowerMessage.includes('time')) return `Current time is ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false })} IST.`;
    if (lowerMessage.includes('thank')) return `You're welcome!`;
    if (lowerMessage.includes('your name')) return `I'm OzBot, your AI assistant.`;
    if (lowerMessage.includes('how are you')) return `I'm great, thank you for asking!`;

    return "I didn't understand that. Try asking about SOPs, like 'Find SOP for emergency shutdown' or 'List SOPs'.";
  }, [guidedSOP, currentStepIndex, userName, getGlossaryDefinition, findSOPByKeyword, getAvailableSOPs]);

  const handleSendMessage = useCallback((messageText, senderType) => {
    setShowChatHistory(true);
    if (senderType.startsWith('user')) {
      setIsAIThinking(true); // AI starts thinking as soon as user sends message
    }
    const newMessages = [...messages, { id: messages.length + 1, sender: senderType, text: messageText }];
    setMessages(newMessages);

    // Add message to sidebar history if it's a new conversation start (mock logic)
    // Only add if it's a user message and the first message of a truly new chat session
    if (messages.length === 0 && senderType.startsWith('user')) {
      const newChatTitle = messageText.length > 25 ? messageText.substring(0, 25) + '...' : messageText;
      // Check if a similar chat title already exists to avoid duplicates in mock sidebar
      if (!sidebarChats.some(chat => chat.title === newChatTitle)) {
        setSidebarChats(prev => [{ id: `chat-${Date.now()}`, title: newChatTitle }, ...prev]);
      }
    }

    if (senderType.startsWith('user')) {
      // Simulate AI processing time
      setTimeout(() => {
        const aiResponse = getAIResponse(messageText);
        setMessages(prev => [...prev, { id: prev.length + 1, sender: 'assistant', text: aiResponse }]);
        speakText(aiResponse);
        setIsAIThinking(false); // AI stops thinking
      }, 1000); // Simulate 1 second processing time
    } else {
      setIsAIThinking(false); // If it's an AI message being sent (e.g., initial greeting), it's not "thinking"
    }
  }, [messages, getAIResponse, speakText, sidebarChats]); // Added sidebarChats as dependency

  const handleSendChat = () => {
    if (chatInput.trim() || interimTranscript.trim()) { // Allow sending interim transcript if user stops speaking
      const messageToSend = chatInput.trim() || interimTranscript.trim();
      handleSendMessage(messageToSend, 'user');
      setChatInput('');
      setInterimTranscript(''); // Clear interim transcript on send
    }
  };

  const handleLogoutClick = () => {
    // onLogout(); // Call the actual logout function passed from App.jsx
    navigate('/admin-home'); // Navigate back to the admin dashboard
  };

  const checkWeatherAndAlert = useCallback(() => {
    const events = [
      { type: 'clear', message: 'No active weather alerts.', voice: null, probability: 0.6 },
      { type: 'rain', message: 'Rain expected in about 1.5 hours.', voice: 'Light rain soon.', probability: 0.15 },
      { type: 'snow', message: 'Snow expected soon.', voice: 'Snow soon.', probability: 0.05 },
      { type: 'temp_change', message: 'Sudden temperature change. Stay safe!', voice: 'Sudden temperature change.', probability: 0.1 },
      { type: 'severe', message: 'Severe weather alert! Seek shelter.', voice: 'Severe weather alert!', probability: 0.1 }
    ];

    let rand = Math.random();
    let cumulative = 0;

    for (const event of events) {
      cumulative += event.probability;
      if (rand <= cumulative) {
        setCurrentWeatherAlert(event.message);
        setIsWeatherAlertActive(event.type !== 'clear');
        if (voiceAlertsEnabled && event.voice) speakText(event.voice);
        break;
      }
    }
  }, [voiceAlertsEnabled, speakText]);

  // Scroll to bottom when messages update
  useEffect(() => {
    localStorage.setItem(chatHistoryKey, JSON.stringify(messages));
    if (chatAreaRef.current) {
      // Smooth scroll to the bottom of the chat container
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, chatHistoryKey]);

  // Load initial messages
  useEffect(() => {
    const stored = localStorage.getItem(chatHistoryKey);
    if (stored) {
      const parsedMessages = JSON.parse(stored);
      setMessages(parsedMessages);
      if (parsedMessages.length > 1) { // If there's more than just the initial greeting
        setShowChatHistory(true);
      }
    } else {
      const greeting = `Hi, I am OzBot. Say "Hey OzBot" to start talking.`;
      setMessages([{ id: 1, sender: 'assistant', text: greeting }]);
      if (chatHistoryKey === 'adminVoiceHistory') speakText(greeting); // Admin page automatically greets
    }
  }, [chatHistoryKey, userName, speakText]); // Added userName as dependency for greeting

  // Weather alerts setup
  useEffect(() => {
    localStorage.setItem(`${chatHistoryKey}-weatherAlertsEnabled`, JSON.stringify(voiceAlertsEnabled));
    let intervalId;
    if (voiceAlertsEnabled) {
      checkWeatherAndAlert();
      intervalId = setInterval(checkWeatherAndAlert, 25000); // Check every 25 seconds
    } else {
      clearInterval(intervalId);
      setCurrentWeatherAlert('Automatic weather alerts off.');
      setIsWeatherAlertActive(false); // Reset active status
      window.speechSynthesis.cancel(); // Stop any ongoing speech alerts
    }
    return () => {
      clearInterval(intervalId);
      window.speechSynthesis.cancel(); // Cleanup on unmount
    };
  }, [voiceAlertsEnabled, chatHistoryKey, checkWeatherAndAlert]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      return; // Exit if API not supported
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Set to true for continuous listening for interim results
    recognition.interimResults = true; // Get real-time results
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setInterimTranscript(''); // Clear interim transcript on start
      console.log('Voice recognition started.');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let currentInterimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          currentInterimTranscript += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(currentInterimTranscript); // Update live transcript
      if (finalTranscript) {
        setChatInput(finalTranscript); // Put final transcript into input for display before sending
        handleSendMessage(finalTranscript, 'user');
        setInterimTranscript(''); // Clear interim after final is sent
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setInterimTranscript(''); // Clear interim on error
      // Only speak error if it's not a common 'no-speech' error (e.g., user just stopped talking)
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        speakText("Sorry, I had an error. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // If there's an interim transcript left, send it as a final message if user stopped speaking
      // but didn't explicitly send
      if (interimTranscript.trim() && !chatInput.trim()) { // Check chatInput to avoid double sending if user typed and then used voice
        handleSendMessage(interimTranscript, 'user');
      }
      setInterimTranscript(''); // Ensure interim is cleared regardless
      console.log('Voice recognition ended.');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop(); // Ensure recognition is stopped on component unmount
      }
    };
  }, [handleSendMessage, speakText]); // Removed interimTranscript and chatInput from dependencies to prevent re-instantiation

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setChatInput(''); // Clear existing text input
      setInterimTranscript(''); // Clear any old interim transcript
      try {
        recognitionRef.current?.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        speakText("Failed to start listening. Please check your microphone permissions.");
        setIsListening(false);
      }
    }
  };

  return (
    // ROOT DIV: Use h-screen and overflow-hidden to make the app fit screen and prevent full page scroll
    <div className={`flex h-screen overflow-hidden font-inter antialiased ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`w-64 flex flex-col p-4 shadow-xl flex-shrink-0 ${theme === 'dark' ? 'bg-gray-900 text-gray-100 border-r border-gray-700' : 'bg-white text-gray-900 border-r border-gray-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">OzBot AI</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-800/70 text-gray-100 hover:bg-gray-700/70 transition-colors duration-200 shadow-lg"
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              // Moon icon for light theme
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            ) : (
              // Sun icon for dark theme
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            )}
          </button>
        </div>

        <button
          onClick={() => {
            setMessages([]); // Clear messages to start new chat
            setGuidedSOP(null);
            setCurrentStepIndex(-1);
            setShowChatHistory(false); // Go back to greeting
            // Initial greeting after clearing (similar to how it loads initially)
            const greeting = `Hi, I am OzBot. Say "Hey OzBot" to start talking.`;
            setMessages([{ id: 1, sender: 'assistant', text: greeting }]);
            speakText(greeting); // Speak greeting on new chat too
          }}
          className={`flex items-center w-full px-3 py-2 text-sm rounded-md shadow-md mb-4
            ${theme === 'dark' ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' : 'bg-blue-500 text-white hover:bg-blue-600'
          } transition-colors duration-200 font-semibold transform hover:scale-105`}
          aria-label="Start new chat"
        >
          {/* Plus icon */}
          <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
          </svg>
          New Chat
        </button>

        {/* Mock Chat History in Sidebar */}
        <nav className="flex-grow overflow-y-auto custom-scrollbar" aria-label="Recent Chats">
          <p className={`text-xs uppercase font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Recent Chats</p>
          {sidebarChats.map(chat => (
            <div
              key={chat.id}
              className={`flex items-center py-2 px-3 rounded-md mb-1
                ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
              } cursor-pointer transition-colors duration-150`}
              onClick={() => {
                console.log('Loading chat:', chat.id);
                setShowChatHistory(true);
                // Mock loading chat history (replace with actual fetch)
                setMessages([
                  { id: 1, sender: 'assistant', text: `Loaded chat: "${chat.title}"` },
                  { id: 2, sender: 'user', text: `This is a message from ${chat.title}` },
                  { id: 3, sender: 'assistant', text: `What else can I help with regarding ${chat.title}?` }
                ]);
                speakText(`Loaded chat: "${chat.title}"`);
              }}
              role="button"
              tabIndex="0" // Make div focusable
              aria-label={`Open chat: ${chat.title}`}
            >
              {/* More appropriate chat icon */}
              <svg className={`mr-2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 1.014-.37 2.005-1.036 2.809M17.25 21H6.75A2.25 2.25 0 014.5 18.75V5.25A2.25 2.25 0 016.75 3h10.5A2.25 2.25 0 0119.5 5.25v13.5A2.25 2.25 0 0117.25 21z"></path>
              </svg>
              <span className="truncate">{chat.title}</span>
            </div>
          ))}
        </nav>

        {/* Weather Alert and Toggle in Sidebar */}
        <div className={`mt-4 p-3 rounded-lg shadow-md transition-colors duration-300 w-full
          ${isWeatherAlertActive ? 'bg-yellow-800/70 text-yellow-100' : 'bg-green-800/70 text-green-100'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {/* Voice Alert Icon (Bell) */}
              <svg className={`mr-2 w-5 h-5 ${isWeatherAlertActive ? 'text-yellow-300 animate-ring' : 'text-green-300'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 0 01-2.312 6.022c1.733.64 3.56 1.04 5.455 1.31m5.714 0a24.249 24.249 0 00-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
              </svg>
              <span className="text-sm font-medium" aria-live="polite">{currentWeatherAlert}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Voice Alerts</span>
            <label htmlFor="voice-alerts-toggle" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="voice-alerts-toggle"
                className="sr-only peer"
                checked={voiceAlertsEnabled}
                onChange={() => setVoiceAlertsEnabled(!voiceAlertsEnabled)}
                aria-label="Toggle voice alerts for weather"
              />
              <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Logout Button (if needed globally, consider moving to a global header/profile menu) */}
        <div className={`pt-4 mt-auto ${theme === 'dark' ? 'border-t border-gray-700' : 'border-t border-gray-300'}`}>
           <button
             onClick={handleLogoutClick}
             className={`flex items-center w-full py-2 px-4 rounded-md shadow-md transition-colors duration-200
               ${theme === 'dark' ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-500 text-white hover:bg-red-600'}
               font-semibold transform hover:scale-105`}
             aria-label="Logout"
           >
             <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H9"></path>
             </svg>
             Logout
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full items-center p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        {/* Conditional content based on showChatHistory */}
        {showChatHistory ? (
          <>
            {/* Chat Area */}
            <div
              ref={chatAreaRef}
              className={`flex-grow overflow-y-auto p-4 rounded-lg shadow-lg flex flex-col space-y-4 custom-scrollbar
                w-full max-w-5xl min-h-0 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender.startsWith('user') ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-xl max-w-[80%] break-words shadow-sm
                      ${msg.sender.startsWith('user')
                        ? 'bg-blue-500 text-white self-end rounded-br-none'
                        : `bg-gray-200 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'} text-gray-900 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} self-start rounded-bl-none`
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAIThinking && (
                <div className="flex justify-start">
                  <div className={`p-3 rounded-xl max-w-[80%] break-words animate-pulse-chat shadow-sm rounded-bl-none
                    ${theme === 'dark' ? 'bg-gray-600 text-gray-100' : 'bg-gray-200 text-gray-900'}`}>
                    OzBot is thinking...
                  </div>
                </div>
              )}
              {interimTranscript && ( // Display live transcript when listening
                <div className="flex justify-end">
                  <div className={`p-2 rounded-xl max-w-[80%] break-words text-sm italic opacity-75
                    ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {interimTranscript}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // Initial greeting/examples view
          <div className="flex-grow flex flex-col items-center justify-center p-4 w-full max-w-5xl">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              Hello, {userName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
              <div className={`p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer
                ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}>
                <h3 className="font-semibold text-lg mb-2">Examples</h3>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>"Explain quantum computing in simple terms"</li>
                  <li>"Give any creative ideas for a 10-year old's birthday?"</li>
                  <li>"Find SOP for emergency shutdown"</li> {/* Added SOP example */}
                </ul>
              </div>
              <div className={`p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer
                ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}>
                <h3 className="font-semibold text-lg mb-2">Capabilities</h3>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>Remembers what user said earlier in the conversation.</li>
                  <li>Allows user to provide follow-up corrections.</li>
                  <li>Can guide through SOPs step-by-step.</li> {/* Added SOP capability */}
                </ul>
              </div>
              <div className={`p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer
                ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'}`}>
                <h3 className="font-semibold text-lg mb-2">Limitations</h3>
                <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>May occasionally generate incorrect information.</li>
                  <li>May occasionally produce harmful instructions or biased content.</li>
                  <li>Knowledge limited to provided SOPs and general understanding.</li> {/* Added relevant limitation */}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Chat Input Area - always at the bottom of the main content */}
        <div className={`flex items-center p-4 w-full flex-shrink-0 ${theme === 'dark' ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
          <div className="flex mx-auto w-full max-w-5xl space-x-2">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full text-white hover:opacity-80 transition-all duration-300 shadow-md transform ${isListening ? 'bg-red-600 animate-pulse-voice-mic scale-110' : 'bg-blue-600'}`}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              {/* Mic icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            </button>
            <input
              type="text"
              value={chatInput || interimTranscript}
              onChange={(e) => {
                setChatInput(e.target.value);
                setInterimTranscript(''); // Clear interim if user types manually
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder={isListening ? "Listening..." : "Message OzBot..."}
              className={`flex-grow border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-100 focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} shadow-inner`}
              aria-label="Chat input"
              disabled={isAIThinking} // Disable input while AI is thinking
            />
            <button
              onClick={handleSendChat}
              className={`p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-md
                ${!chatInput.trim() && !interimTranscript.trim() ? 'opacity-50 cursor-not-allowed' : ''}`} // Disable send button if no text
              aria-label="Send message"
              disabled={!chatInput.trim() && !interimTranscript.trim()} // Disable send button
            >
              {/* Send icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal-icon lucide-send-horizontal">
                <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/><path d="M6 12h16"/></svg>
            </button>
          </div>
        </div>
      </div>
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

        /* Mic Pulse Animation */
        @keyframes pulse-voice-mic {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } /* Tailwind red-600 */
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .animate-pulse-voice-mic {
          animation: pulse-voice-mic 1.5s infinite;
        }

        /* AI Thinking Pulse Animation for Chat Bubble */
        @keyframes pulse-chat {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-chat {
          animation: pulse-chat 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Bell Ringing Animation */
        @keyframes ring {
          0% { transform: rotate(0); }
          15% { transform: rotate(25deg); }
          30% { transform: rotate(-25deg); }
          45% { transform: rotate(15deg); }
          60% { transform: rotate(-15deg); }
          75% { transform: rotate(5deg); }
          100% { transform: rotate(0); }
        }
        .animate-ring {
            animation: ring 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default VoiceAssistancePage;