import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App.jsx'; // Import ThemeContext from App.jsx

function UploadSOP() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); // Theme context is used for consistent styling

  const [selectedUploadType, setSelectedUploadType] = useState('local'); // 'local' or 'directLink'
  const [selectedFiles, setSelectedFiles] = useState([]); // State for selected local files
  const [directLink, setDirectLink] = useState(''); // State for direct link input
  const [uploadProgress, setUploadProgress] = useState(0); // For progress bar
  const [isUploading, setIsUploading] = useState(false); // To manage upload state
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [statusMessage, setStatusMessage] = useState(''); // Message for upload status
  const [isDragOver, setIsDragOver] = useState(false); // State for drag-over visual feedback

  const fileInputRef = useRef(null); // Ref for the hidden file input
  const modalRef = useRef(null); // Ref for the modal container for focus management

  // Constants for file limitations
  const MAX_FILE_SIZE_MB = 10; // Max 10MB per file
  const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt']; // Allowed extensions

  // Define color palette and styles based on theme
  const colors = {
    light: {
      overlayBg: "bg-black/50", // Darker, more professional overlay
      modalBg: "bg-white text-gray-900",
      modalHeaderBg: "bg-gray-50 border-gray-200",
      modalHeaderText: "text-gray-900",
      closeBtnBg: "bg-gray-200 hover:bg-gray-300",
      closeBtnText: "text-gray-600 hover:text-gray-900",
      sidebarBg: "bg-gray-100 border-gray-200",
      sidebarBtnActiveBg: "bg-blue-600 text-white shadow-md", // Stronger active state with shadow
      sidebarBtnInactiveBg: "bg-transparent text-gray-700 hover:bg-gray-200", // Clearer inactive state
      dragDropBorder: "border-gray-300 text-gray-600",
      dragDropHoverBorder: "border-blue-500 ring-2 ring-blue-500", // Highlight on drag hover
      dragDropText: "text-gray-600",
      dragDropIcon: "text-gray-400",
      linkBtnText: "text-blue-600", // Current blue for light mode
      fileListItemBg: "bg-gray-100 border-gray-300",
      fileListItemText: "text-gray-800",
      removeFileBtnText: "text-red-500 hover:text-red-700",
      progressBarBg: "bg-gray-200",
      progressBarFill: "bg-blue-600",
      statusSuccessBg: "bg-green-100 text-green-800 border border-green-200", // Added border
      statusErrorBg: "bg-red-100 text-red-800 border border-red-200", // Added border
      uploadBtnEnabled: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500", // Added focus ring
      uploadBtnDisabled: "bg-gray-400 text-gray-700 cursor-not-allowed",
      inputBg: "bg-white",
      inputBorder: "border-gray-300",
      inputText: "text-gray-900",
      inputPlaceholder: "placeholder-gray-500",
      inputFocusRing: "focus:ring-blue-500",
    },
    dark: {
      overlayBg: "bg-black/70", // Darker, more professional overlay
      modalBg: "bg-gray-800 text-gray-100",
      modalHeaderBg: "bg-gray-900 border-gray-700",
      modalHeaderText: "text-white",
      closeBtnBg: "bg-gray-700 hover:bg-gray-600",
      closeBtnText: "text-gray-300 hover:text-white",
      sidebarBg: "bg-gray-900 border-gray-700",
      sidebarBtnActiveBg: "bg-blue-700 text-white shadow-md", // Stronger active state with shadow
      sidebarBtnInactiveBg: "bg-transparent text-gray-300 hover:bg-gray-700", // Clearer inactive state
      dragDropBorder: "border-gray-600 text-gray-400",
      dragDropHoverBorder: "border-blue-500 ring-2 ring-blue-500", // Highlight on drag hover
      dragDropText: "text-gray-400",
      dragDropIcon: "text-gray-500",
      linkBtnText: "text-blue-400", // Adjusted to be slightly brighter for dark mode
      fileListItemBg: "bg-gray-700 border-gray-600",
      fileListItemText: "text-gray-200",
      removeFileBtnText: "text-red-400 hover:text-red-300",
      progressBarBg: "bg-gray-700",
      progressBarFill: "bg-blue-500",
      statusSuccessBg: "bg-green-900/50 text-green-200 border border-green-700", // Added border
      statusErrorBg: "bg-red-900/50 text-red-200 border border-red-700", // Added border
      uploadBtnEnabled: "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-400", // Added focus ring
      uploadBtnDisabled: "bg-gray-600 text-gray-400 cursor-not-allowed",
      inputBg: "bg-gray-700",
      inputBorder: "border-gray-600",
      inputText: "text-white",
      inputPlaceholder: "placeholder-gray-400",
      inputFocusRing: "focus:ring-blue-400",
    }
  };

  const currentColors = colors[theme];

  // Focus management for modal (Accessibility)
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus(); // Focus the modal on mount
    }
  }, []);

  // Function to close the modal (navigate back to admin home)
  const handleClose = () => {
    // Clear any pending state before closing
    setSelectedFiles([]);
    setDirectLink('');
    setUploadProgress(0);
    setIsUploading(false);
    setUploadStatus(null);
    setStatusMessage('');
    navigate('/admin-home');
  };

  // --- Local File Upload Logic ---
  const handleChooseFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setUploadStatus(null); // Reset status on new file selection
    setStatusMessage('');
    const files = Array.from(event.target.files);
    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
        errors.push(`File "${file.name}" has an unsupported type: "${fileExtension}". Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
      } else if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.push(`File "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum size of ${MAX_FILE_SIZE_MB} MB.`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setUploadStatus('error');
      setStatusMessage(errors.join('\n'));
      setSelectedFiles([]); // Clear valid files if there are errors
    } else {
      setSelectedFiles(validFiles);
    }
    event.target.value = null; // Reset file input value to allow selecting same file again if needed
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true); // Set drag over state for visual feedback
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false); // Reset drag over state
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false); // Reset drag over state on drop

    setUploadStatus(null); // Reset status on new file drop
    setStatusMessage('');
    const files = Array.from(event.dataTransfer.files);
    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
        errors.push(`File "${file.name}" has an unsupported type: "${fileExtension}". Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
      } else if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.push(`File "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum size of ${MAX_FILE_SIZE_MB} MB.`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setUploadStatus('error');
      setStatusMessage(errors.join('\n'));
      setSelectedFiles([]); // Clear valid files if there are errors
    } else {
      setSelectedFiles(validFiles);
    }
  };

  const handleRemoveFile = (fileNameToRemove) => {
    setSelectedFiles(selectedFiles.filter(file => file.name !== fileNameToRemove));
    if (selectedFiles.length === 1) { // If last file removed, clear status
        setUploadStatus(null);
        setStatusMessage('');
    }
  };

  const handleLocalUpload = () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('error');
      setStatusMessage('Please select at least one file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
    setStatusMessage('');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        // Simulate successful upload after delay
        setTimeout(() => {
          setUploadStatus('success');
          setStatusMessage(`${selectedFiles.length} file(s) uploaded successfully! OzBot AI will now process them.`);
          setIsUploading(false);
          setSelectedFiles([]); // Clear files after successful upload
          // In a real app, you'd send files to backend here
        }, 500);
      } else {
        setUploadProgress(currentProgress);
      }
    }, 100);
  };

  // --- Direct Link Upload Logic ---
  const handleDirectLinkUpload = () => {
    if (!directLink.trim()) {
      setUploadStatus('error');
      setStatusMessage('Please enter a valid direct link.');
      return;
    }
    if (!directLink.startsWith('http://') && !directLink.startsWith('https://')) {
        setUploadStatus('error');
        setStatusMessage('Link must start with http:// or https://');
        return;
    }
    // Basic validation for common file extensions in a link
    const linkExtension = '.' + directLink.split('.').pop().toLowerCase().split('?')[0]; // Handle query params
    if (!ALLOWED_FILE_TYPES.includes(linkExtension)) {
      setUploadStatus('error');
      setStatusMessage(`The link seems to be for an unsupported file type: "${linkExtension}". Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
      return;
    }


    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
    setStatusMessage('');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setUploadStatus('success');
          setStatusMessage('File from link uploaded successfully! OzBot AI will now process it.');
          setIsUploading(false);
          setDirectLink(''); // Clear link after successful upload
          // In a real app, you'd send the link to backend for processing
        }, 500);
      } else {
        setUploadProgress(currentProgress);
      }
    }, 100);
  };

  return (
    // Modal Overlay - fixed full screen, semi-transparent background
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 font-inter ${currentColors.overlayBg}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-sop-title"
      tabIndex="-1" // Make the modal itself focusable
      ref={modalRef}
    >
      {/* Modal Content Container */}
      <div className={`rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden transform scale-95 animate-modal-in
        ${currentColors.modalBg}`}>
        {/* Modal Header */}
        <div className={`flex justify-between items-center p-4 border-b ${currentColors.modalHeaderBg} ${currentColors.modalHeaderText}`}>
          <h2 id="upload-sop-title" className="text-xl font-bold">Upload File (SOP)</h2> {/* Clarified title */}
          <button
            onClick={handleClose}
            className={`p-2 rounded-full transition-colors duration-200 transform hover:scale-110 shadow-md
              ${currentColors.closeBtnBg} ${currentColors.closeBtnText} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            aria-label="Close upload dialog"
          >
            {/* Close icon (X) */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body - Split Layout */}
        <div className="flex-grow flex">
          {/* Left Sidebar for Upload Options */}
          <div className={`w-48 p-4 flex flex-col border-r ${currentColors.sidebarBg}`}>
            <button
              onClick={() => { setSelectedUploadType('local'); setUploadStatus(null); setStatusMessage(''); setSelectedFiles([]); }} // Reset state on tab change
              className={`flex items-center px-4 py-3 rounded-lg text-left font-medium transition-colors duration-200 mb-2 shadow-sm
                ${selectedUploadType === 'local' ?
                  currentColors.sidebarBtnActiveBg :
                  currentColors.sidebarBtnInactiveBg
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              aria-controls="local-file-upload-panel"
              aria-selected={selectedUploadType === 'local'}
              role="tab"
            >
              {/* Folder icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
              </svg>
              Local Files
            </button>
            <button
              onClick={() => { setSelectedUploadType('directLink'); setUploadStatus(null); setStatusMessage(''); setDirectLink(''); }} // Reset state on tab change
              className={`flex items-center px-4 py-3 rounded-lg text-left font-medium transition-colors duration-200 shadow-sm
                ${selectedUploadType === 'directLink' ?
                  currentColors.sidebarBtnActiveBg :
                  currentColors.sidebarBtnInactiveBg
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              aria-controls="direct-link-upload-panel"
              aria-selected={selectedUploadType === 'directLink'}
              role="tab"
            >
              {/* Link icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              Direct Link
            </button>
          </div>

          {/* Right Content Area for Upload Form */}
          <div
            className={`flex-1 p-8 flex flex-col justify-center items-center overflow-y-auto custom-scrollbar ${currentColors.modalBg}`}
            id={selectedUploadType === 'local' ? 'local-file-upload-panel' : 'direct-link-upload-panel'}
            role="tabpanel"
            aria-labelledby={selectedUploadType === 'local' ? 'local-files-tab' : 'direct-link-tab'}
          >
            {selectedUploadType === 'local' ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center text-center p-8 border-2 border-dashed rounded-lg w-full max-w-md min-h-[300px] justify-center transition-all duration-200
                  ${isDragOver ? currentColors.dragDropHoverBorder : currentColors.dragDropBorder}`}
              >
                <input
                  type="file"
                  multiple // Allow multiple files
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden" // Hide the default input
                  accept={ALLOWED_FILE_TYPES.join(',')} // Filter file types in dialog
                  aria-label="Choose files for upload"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-cloud-upload-icon lucide-cloud-upload mb-4 ${currentColors.dragDropIcon}`}>
                  <path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/>
                </svg>
                <p className={`text-2xl font-bold mb-2 ${currentColors.modalHeaderText}`}>Drag & drop files here</p>
                <p className={`text-lg mb-8 ${currentColors.dragDropText}`}>
                  or <button onClick={handleChooseFileClick} className={`${currentColors.linkBtnText} hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}>choose a local file</button>
                </p>
                <p className={`text-sm ${currentColors.dragDropText} mb-4`}>
                    Max file size: {MAX_FILE_SIZE_MB}MB. Allowed types: {ALLOWED_FILE_TYPES.map(type => type.toUpperCase().replace('.', '')).join(', ')}.
                </p>

                {selectedFiles.length > 0 && (
                  <div className={`mt-4 w-full text-left p-3 rounded-md border ${currentColors.fileListItemBg} ${currentColors.fileListItemText}`}>
                    <h4 className="font-semibold mb-2">Selected Files:</h4>
                    <ul className="space-y-1 text-sm" aria-live="polite">
                      {selectedFiles.map((file) => (
                        <li key={file.name} className="flex items-center justify-between py-1">
                          <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                          <button
                            onClick={() => handleRemoveFile(file.name)}
                            className={`${currentColors.removeFileBtnText} p-1 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                            aria-label={`Remove file ${file.name}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Empty state for local files when nothing is selected */}
                {selectedFiles.length === 0 && uploadStatus === null && !isUploading && (
                  <div className={`mt-4 p-3 rounded-md w-full text-center ${currentColors.statusSuccessBg}`}>
                    <p className="font-semibold">No files selected.</p>
                    <p className="text-sm">Drag and drop or click "choose a local file" to begin.</p>
                  </div>
                )}

                {isUploading && (
                  <div className={`w-full rounded-full h-2.5 mt-4 ${currentColors.progressBarBg}`}>
                    <div
                      className={`h-2.5 rounded-full ${currentColors.progressBarFill} transition-all duration-300 ease-out`}
                      style={{ width: `${uploadProgress}%` }}
                      role="progressbar"
                      aria-valuenow={uploadProgress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                )}

                {uploadStatus && (
                  <div
                    className={`mt-4 p-3 rounded-md w-full text-left
                      ${uploadStatus === 'success' ? currentColors.statusSuccessBg : currentColors.statusErrorBg}`}
                    role="status"
                    aria-live="polite"
                  >
                    <p className="font-semibold flex items-center">
                      {uploadStatus === 'success' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-2 text-green-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-2 text-red-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {uploadStatus === 'success' ? 'Success!' : 'Error!'}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{statusMessage}</p>
                  </div>
                )}

                <button
                  onClick={handleLocalUpload}
                  disabled={selectedFiles.length === 0 || isUploading}
                  className={`mt-6 px-8 py-3 rounded-lg shadow-md transition-colors duration-200 text-base font-semibold transform hover:scale-105
                    ${selectedFiles.length === 0 || isUploading ? currentColors.uploadBtnDisabled : currentColors.uploadBtnEnabled}`}
                  aria-live="polite"
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    'Upload Files'
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center w-full max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-link-icon lucide-link mb-4 ${currentColors.dragDropIcon}`}>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <p className={`text-2xl font-bold mb-2 ${currentColors.modalHeaderText}`}>Enter Direct Link</p>
                <p className={`text-lg mb-8 ${currentColors.dragDropText}`}>Paste the URL of your file below.</p>
                <input
                  type="text"
                  placeholder="https://example.com/your-file.pdf"
                  value={directLink}
                  onChange={(e) => { setDirectLink(e.target.value); setUploadStatus(null); setStatusMessage(''); }} // Clear status on input change
                  className={`w-full p-3 rounded-lg border text-base focus:outline-none focus:ring-2 ${currentColors.inputFocusRing} mb-4
                    ${currentColors.inputBg} ${currentColors.inputBorder} ${currentColors.inputText} ${currentColors.inputPlaceholder} shadow-inner`}
                  disabled={isUploading}
                  aria-label="Direct link to file"
                />
                <p className={`text-sm ${currentColors.dragDropText} mb-4`}>
                    Allowed types: {ALLOWED_FILE_TYPES.map(type => type.toUpperCase().replace('.', '')).join(', ')}.
                </p>

                {isUploading && (
                  <div className={`w-full rounded-full h-2.5 mt-4 ${currentColors.progressBarBg}`}>
                    <div
                      className={`h-2.5 rounded-full ${currentColors.progressBarFill} transition-all duration-300 ease-out`}
                      style={{ width: `${uploadProgress}%` }}
                      role="progressbar"
                      aria-valuenow={uploadProgress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                )}

                {uploadStatus && (
                  <div
                    className={`mt-4 p-3 rounded-md w-full text-left
                      ${uploadStatus === 'success' ? currentColors.statusSuccessBg : currentColors.statusErrorBg}`}
                    role="status"
                    aria-live="polite"
                  >
                    <p className="font-semibold flex items-center">
                      {uploadStatus === 'success' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-2 text-green-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-2 text-red-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {uploadStatus === 'success' ? 'Success!' : 'Error!'}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{statusMessage}</p>
                  </div>
                )}

                <button
                  onClick={handleDirectLinkUpload}
                  disabled={!directLink.trim() || isUploading}
                  className={`mt-6 px-8 py-3 rounded-lg shadow-md transition-colors duration-200 text-base font-semibold transform hover:scale-105
                    ${!directLink.trim() || isUploading ? currentColors.uploadBtnDisabled : currentColors.uploadBtnEnabled}`}
                  aria-live="polite"
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    'Upload from Link'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for Modal Animation and Scrollbar */}
      <style>{`
        /* Modal Entrance Animation */
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modalIn 0.3s ease-out forwards; }

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
      `}</style>
    </div>
  );
}

export default UploadSOP;