import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage';
import ProcessingPage from './components/ProcessingPage';
import ResultsPage from './components/ResultsPage';
import { Container } from '@mui/material';

// Create context for sharing files between components
const FileContext = createContext();

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

const AI_CATEGORIES = [
  { key: 'normal', color: 'green', label: 'Normal', aiExplanation: 'No abnormality detected.', aiHeatmap: 'https://via.placeholder.com/60x60/e8f5e9/43a047?text=Normal' },
  { key: 'noise', color: 'yellow', label: 'Noisy', aiExplanation: 'Motion artifact detected.', aiHeatmap: 'https://via.placeholder.com/60x60/fffde7/fbc02d?text=Noisy' },
  { key: 'review', color: 'red', label: 'Needs Review', aiExplanation: 'Potential SOZ detected. Please review.', aiHeatmap: 'https://via.placeholder.com/60x60/ffebee/e53935?text=Review' }
];

const FileProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [folderData, setFolderData] = useState({
    normal: [],
    noise: [],
    review: []
  });
  const [processingComplete, setProcessingComplete] = useState(false);

  const clearFiles = () => {
    setUploadedFiles([]);
    setFolderData({ normal: [], noise: [], review: [] });
    setProcessingComplete(false);
  };

  const distributeFiles = () => {
    // Ensure we have files to distribute
    if (!uploadedFiles || uploadedFiles.length === 0) {
      console.warn("No files to distribute");
      setFolderData({ normal: [], noise: [], review: [] });
      setProcessingComplete(true);
      return;
    }
    
    // Simulate AI output: assign each file a random category, explanation, and heatmap
    const categorized = { normal: [], noise: [], review: [] };
    uploadedFiles.forEach(file => {
      const ai = AI_CATEGORIES[Math.floor(Math.random() * AI_CATEGORIES.length)];
      const fileWithAI = {
        ...file,
        aiCategory: ai.key,
        aiExplanation: ai.aiExplanation,
        aiHeatmap: ai.aiHeatmap
      };
      categorized[ai.key].push(fileWithAI);
    });
    
    setFolderData({
      normal: categorized.normal || [],
      noise: categorized.noise || [],
      review: categorized.review || []
    });
    setProcessingComplete(true);
  };

  return (
    <FileContext.Provider value={{
      uploadedFiles,
      setUploadedFiles,
      folderData,
      setFolderData,
      processingComplete,
      setProcessingComplete,
      clearFiles,
      distributeFiles
    }}>
      {children}
    </FileContext.Provider>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FileProvider>
    <Router>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/processing" element={<ProcessingPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Container>
    </Router>
      </FileProvider>
    </ThemeProvider>
  );
}

export default App; 