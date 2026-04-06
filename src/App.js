import React, { createContext, useState, useContext, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
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
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisSummary, setAnalysisSummary] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const clearFiles = () => {
    setUploadedFiles([]);
    setFolderData({ rsn: [], noise: [], soz: [] });
    setProcessingComplete(false);
    setAnalysisResults(null);
    setAnalysisSummary(null);
    setAnalysisError(null);
  };

  const getICNumber = (filename = '') => {
    const match = filename.match(/IC_(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  const distributeFiles = useCallback(async () => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      console.warn("No files to distribute");
      setFolderData({ rsn: [], noise: [], soz: [] });
      setProcessingComplete(true);
      setAnalysisResults([]);
      setAnalysisSummary({
        totalComponents: 0,
        sozCount: 0,
        patientIsSoz: false,
        sozIcs: []
      });
      return { results: [], summary: null };
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const classificationData = [
        0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1,
        0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0,
        0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1,
        1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0,
        1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0
      ];
      const categorized = { rsn: [], noise: [], soz: [] };
      const publicUrl = process.env.PUBLIC_URL || '';
      const results = [];

      uploadedFiles.forEach((file, index) => {
        if (!file.name?.toLowerCase().includes('_thresh')) {
          return;
        }

        const icNumber = getICNumber(file.name);
        const classification =
          icNumber && icNumber > 0
            ? classificationData[icNumber - 1]
            : classificationData[index % classificationData.length];

        let aiCategory;
        let aiExplanation;

        if (classification === 0) {
          aiCategory = 'noise';
          aiExplanation = 'Motion artifact detected.';
        } else if (classification === 1) {
          aiCategory = 'soz';
          aiExplanation = 'Potential SOZ detected. Please review.';
        } else {
          aiCategory = 'rsn';
          aiExplanation = 'Clusters on grey matter.';
        }

        const fileWithAI = {
          ...file,
          aiCategory,
          aiExplanation,
          aiHeatmap: `${publicUrl}/AIHeatmap.png`,
          icNumber,
          analysisDetails: {
            ic: icNumber,
            isSoz: aiCategory === 'soz',
            dlLabel: classification,
            klPrediction: classification === 1 ? 3 : 1,
            reason: aiExplanation
          }
        };

        categorized[aiCategory].push(fileWithAI);
        results.push({
          ic: icNumber,
          isSoz: aiCategory === 'soz',
          dlLabel: classification,
          klPrediction: classification === 1 ? 3 : 1,
          reason: aiExplanation
        });
      });

      const summary = {
        totalComponents: results.length,
        sozCount: categorized.soz.length,
        patientIsSoz: categorized.soz.length > 0,
        sozIcs: categorized.soz
          .map((file) => file.icNumber)
          .filter((value) => value != null)
      };

      setAnalysisResults(results);
      setAnalysisSummary(summary);
      setFolderData({
        rsn: categorized.rsn || [],
        noise: categorized.noise || [],
        soz: categorized.soz || []
      });
      setProcessingComplete(true);
      return { results, summary };
    } catch (error) {
      console.error('Error distributing demo analysis results:', error);
      setAnalysisError(error.message);
      setProcessingComplete(false);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedFiles]);

  return (
    <FileContext.Provider value={{
      uploadedFiles,
      setUploadedFiles,
      folderData,
      setFolderData,
      processingComplete,
      setProcessingComplete,
      clearFiles,
      distributeFiles,
      analysisResults,
      analysisSummary,
      analysisError,
      isAnalyzing
    }}>
      {children}
    </FileContext.Provider>
  );
};

function App() {
  // GitHub Pages project sites are served from /<repo-name> in production.
  const basename = process.env.NODE_ENV === 'production' 
    ? '/epiprecision-web-interface'
    : '/';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FileProvider>
        <Router basename={basename}>
          <Navbar />
          <Box component="main" sx={{ width: '100%' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/processing" element={<ProcessingPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </Box>
        </Router>
      </FileProvider>
    </ThemeProvider>
  );
}

export default App; 
