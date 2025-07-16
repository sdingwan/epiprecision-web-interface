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
    { key: 'rsn', color: 'green', label: 'RSN', aiExplanation: 'Clusters on grey matter.', aiHeatmap: '/AIHeatmap.png' },
    { key: 'noise', color: 'yellow', label: 'Noise', aiExplanation: 'Motion artifact detected.', aiHeatmap: '/AIHeatmap.png' },
    { key: 'soz', color: 'red', label: 'SOZ', aiExplanation: 'Potential SOZ detected. Please review.', aiHeatmap: '/AIHeatmap.png' }
];

const FileProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [folderData, setFolderData] = useState({
    rsn: [],
    noise: [],
    soz: []
  });
  const [processingComplete, setProcessingComplete] = useState(false);

  const clearFiles = () => {
    setUploadedFiles([]);
    setFolderData({ rsn: [], noise: [], soz: [] });
    setProcessingComplete(false);
  };

  const distributeFiles = () => {
    // Ensure we have files to distribute
    if (!uploadedFiles || uploadedFiles.length === 0) {
      console.warn("No files to distribute");
      setFolderData({ rsn: [], noise: [], soz: [] });
      setProcessingComplete(true);
      return;
    }
    
    // Simulate AI output: assign each file a random category, explanation, and heatmap
    const categorized = { rsn: [], noise: [], soz: [] };
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
      rsn: categorized.rsn || [],
      noise: categorized.noise || [],
      soz: categorized.soz || []
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