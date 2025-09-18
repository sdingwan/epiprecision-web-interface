import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage';
import ProcessingPage from './components/ProcessingPage';
import ResultsPage from './components/ResultsPage';

// Create context for sharing files between components
const FileContext = createContext();

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

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
    
    // Use actual classification data: 0 = noise, 1 = SOZ
    const classificationData = [
      0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    
    const categorized = { rsn: [], noise: [], soz: [] };
    
    uploadedFiles.forEach((file, index) => {
      // Extract IC number from filename (e.g., "IC_51_thresh.png" -> 51)
      const getICNumber = (filename) => {
        const match = filename.match(/IC_(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };
      
      const icNumber = getICNumber(file.name);
      
      // Use IC number for classification (subtract 1 since IC numbers start at 1, but array indices start at 0)
      const classification = icNumber > 0 ? classificationData[icNumber - 1] : classificationData[index % classificationData.length];
      
      let aiCategory, aiExplanation;
      
      if (classification === 0) {
        // 0 = Noise
        aiCategory = 'noise';
        aiExplanation = 'Motion artifact detected.';
      } else if (classification === 1) {
        // 1 = SOZ
        aiCategory = 'soz';
        aiExplanation = 'Potential SOZ detected. Please review.';
      } else {
        // Fallback to RSN if somehow we get unexpected values
        aiCategory = 'rsn';
        aiExplanation = 'Clusters on grey matter.';
      }
      
      const fileWithAI = {
        ...file,
        aiCategory: aiCategory,
        aiExplanation: aiExplanation,
        aiHeatmap: '/AIHeatmap.png',
        classificationValue: classification, // Store the original classification value for reference
        icNumber: icNumber // Store the IC number for debugging
      };
      
      categorized[aiCategory].push(fileWithAI);
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
      <Container maxWidth="xl" sx={{ mt: 4 }}>
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
