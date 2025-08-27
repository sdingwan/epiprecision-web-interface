import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Badge, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  MenuItem,
  Select,
  Paper,
  Divider,
  Avatar,
  Container
} from '@mui/material';
import { 
  Folder, 
  Close, 
  InsertDriveFile,
  CheckCircleOutline,
  HighlightOff,
  Download,
  Assessment,
  FolderSpecial,
  KeyboardArrowDown
} from '@mui/icons-material';
import ICReferenceTable from './ICReferenceTable';
import { useFiles } from '../App';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ResultsPage = () => {
  const { folderData, processingComplete, uploadedFiles, setFolderData } = useFiles();
  
  // Debug: log data
  console.log('ResultsPage - uploadedFiles:', uploadedFiles);
  console.log('ResultsPage - folderData:', folderData);
  console.log('ResultsPage - processingComplete:', processingComplete);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const folders = [
    {
      id: 'rsn',
      name: 'RSN',
      color: '#e8f5e9',
      borderColor: '#43a047',
      description: 'Clusters on grey matter (Resting State Network)',
      files: folderData?.rsn || [],
      badgeColor: 'success',
      icon: '✓'
    },
    {
      id: 'noise',
      name: 'Noise', 
      color: '#fffde7',
      borderColor: '#fbc02d',
      description: 'Small clusters on white matter and brain periphery',
      files: folderData?.noise || [],
      badgeColor: 'warning',
      icon: '⚠'
    },
    {
      id: 'soz',
      name: 'SOZ',
      color: '#ffebee',
      borderColor: '#e53935',
      description: 'Large cluster on both grey and white matter (Seizure Onset Zone)',
      files: folderData?.soz || [],
      badgeColor: 'error',
      icon: '!'
    }
  ];

  const handleFolderClick = (folder) => {
    setSelectedFolderId(folder.id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedFolderId(null);
  };

  const createImagePreview = (file) => {
    try {
      if (file && file.type && file.type.startsWith('image/')) {
        // Use the blob URL if available, otherwise try to create one from original file
        return file.blobUrl || (file.originalFile ? URL.createObjectURL(file.originalFile) : null);
      }
    } catch (error) {
      console.error("Error creating image preview:", error);
    }
    return null;
  };

  const getTotalFileCount = () => {
    if (!folderData) return 0;
    return (
      (Array.isArray(folderData.rsn) ? folderData.rsn.length : 0) + 
      (Array.isArray(folderData.noise) ? folderData.noise.length : 0) + 
      (Array.isArray(folderData.soz) ? folderData.soz.length : 0)
    );
  };

  // Handle approval and explanation changes
  const handleApprovalChange = (folderId, fileId, value) => {
    setFolderData(prev => {
      if (!prev || !prev[folderId] || !Array.isArray(prev[folderId])) {
        return prev;
      }
      return {
        ...prev,
        [folderId]: prev[folderId].map(f => f.id === fileId ? { ...f, clinicianApproval: value } : f)
      };
    });
  };
  
  const handleExplanationChange = (folderId, fileId, value) => {
    setFolderData(prev => {
      if (!prev || !prev[folderId] || !Array.isArray(prev[folderId])) {
        return prev;
      }
      return {
        ...prev,
        [folderId]: prev[folderId].map(f => f.id === fileId ? { ...f, clinicianExplanation: value } : f)
      };
    });
  };

  // Get the latest folder object from folderData using selectedFolderId
  const selectedFolder = selectedFolderId
    ? folders.find(f => f.id === selectedFolderId)
    : null;

  // Sort files by IC number in ascending order
  const sortFilesByICNumber = (fileList) => {
    return [...fileList].sort((a, b) => {
      // Extract IC number from filename (e.g., "IC_51_thresh.png" -> 51)
      const getICNumber = (filename) => {
        const match = filename.match(/IC_(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };
      
      const aNumber = getICNumber(a.name);
      const bNumber = getICNumber(b.name);
      
      return aNumber - bNumber;
    });
  };

  // PDF generation
  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    let y = 20;
    const pageHeight = 297; // A4 height in mm
    const pageWidth = 210; // A4 width in mm
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace = 40) => {
      if (y + requiredSpace > pageHeight - margin) {
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(25, 118, 210); // Primary blue
    doc.text('EpiPrecision AI Analysis Report', margin, y);
    y += 15;

    // Date and summary
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 8;
    doc.text(`Total Files Analyzed: ${uploadedFiles.length}`, margin, y);
    y += 8;
    doc.text(`Categories: ${folders.filter(f => f.files.length > 0).length} active`, margin, y);
    y += 20;

    // Draw separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y - 5, pageWidth - margin, y - 5);
    y += 5;

    // Process each folder category
    for (const folder of folders) {
      if (!folder.files || folder.files.length === 0) continue;

      checkNewPage(30);

      // Category header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text(`${folder.name} Category`, margin, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(`${folder.description} • ${folder.files.length} file${folder.files.length !== 1 ? 's' : ''}`, margin, y);
      y += 15;

      // Process each file in this category
      for (let i = 0; i < folder.files.length; i++) {
        const file = folder.files[i];
        
        checkNewPage(60); // Ensure enough space for file entry

        // File entry background
        doc.setFillColor(248, 249, 250);
        doc.rect(margin, y - 5, contentWidth, 50, 'F');
        
        // File thumbnail area
        const imgX = margin + 5;
        const imgY = y;
        const imgSize = 30;

        // Add image if available
        if (file.blobUrl) {
          try {
            const imgData = await getImageDataUrl(file.blobUrl);
            doc.addImage(imgData, 'JPEG', imgX, imgY, imgSize, imgSize);
          } catch (e) {
            // Draw placeholder if image fails
            doc.setDrawColor(200, 200, 200);
            doc.rect(imgX, imgY, imgSize, imgSize);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('No Image', imgX + 8, imgY + 18);
          }
        } else {
          // Draw placeholder
          doc.setDrawColor(200, 200, 200);
          doc.rect(imgX, imgY, imgSize, imgSize);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text('No Image', imgX + 8, imgY + 18);
        }

        // File information area
        const textX = imgX + imgSize + 10;
        let textY = y + 5;

        // File name
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        const fileName = file.name.length > 35 ? file.name.substring(0, 35) + '...' : file.name;
        doc.text(`File: ${fileName}`, textX, textY);
        textY += 6;

        // File details
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text(`Type: ${file.dataType || 'Unknown'}`, textX, textY);
        textY += 5;
        doc.text(`Category: ${folder.name}`, textX, textY);
        textY += 5;
        doc.text(`Status: ${file.clinicianApproval || 'Pending Review'}`, textX, textY);
        textY += 8;

        // Clinical note (if available)
        if (file.clinicalNote) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(60, 60, 60);
          doc.text('Clinical Note:', textX, textY);
          textY += 5;
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(40, 40, 40);
          const clinicalNote = file.clinicalNote.length > 50 ? file.clinicalNote.substring(0, 50) + '...' : file.clinicalNote;
          doc.text(clinicalNote, textX, textY);
        }

        // AI Explanation area (right side)
        const explanationX = margin + (contentWidth * 0.6);
        let explanationY = y + 5;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text('AI Analysis:', explanationX, explanationY);
        explanationY += 5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        const explanation = file.clinicianExplanation !== undefined 
          ? file.clinicianExplanation 
          : (file.aiExplanation || 'No explanation available');
        
        // Split explanation into multiple lines if needed
        const maxWidth = (contentWidth * 0.35);
        const explanationLines = doc.splitTextToSize(explanation, maxWidth);
        doc.text(explanationLines.slice(0, 3), explanationX, explanationY); // Max 3 lines

        y += 55; // Move to next file position
      }

      y += 10; // Extra space between categories
    }

    // Footer on last page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`EpiPrecision Medical Imaging Platform - Page ${i} of ${totalPages}`, margin, pageHeight - 10);
      doc.text('Confidential Medical Report', pageWidth - margin - 40, pageHeight - 10);
    }

    // Save the PDF
    doc.save('EpiPrecision_Analysis_Report.pdf');
  };

  // Helper to get image data URL from blob URL or static path
  const getImageDataUrl = (url) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header Section */}
      <Box sx={{ 
        background: '#1a1a1a',
        border: '1px solid #333333',
        borderRadius: 3,
        p: 2,
        mb: 3,
        color: '#e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: '#2a2a2a', color: '#e0e0e0', width: 48, height: 48 }}>
            <Assessment fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: '#e0e0e0' }}>
              Analysis Results
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, color: '#e0e0e0' }}>
              AI-powered categorization complete
            </Typography>
          </Box>
        </Box>
        
        {processingComplete && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body1" sx={{ opacity: 0.9, color: '#e0e0e0' }}>
              {uploadedFiles.length} files processed and categorized
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                                  bgcolor: '#2a2a2a', 
                  color: '#e0e0e0',
                  '&:hover': { bgcolor: '#333333' }
              }}
              startIcon={<Download />}
              onClick={handleDownloadPDF}
            >
              Download Report
            </Button>
          </Box>
        )}
      </Box>

      {processingComplete ? (
        <>
          {/* Summary Stats */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FolderSpecial sx={{ color: '#e0e0e0' }} />
              Processing Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#e0e0e0' }}>
                    {uploadedFiles.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Files Uploaded
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                    {getTotalFileCount()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Files Processed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="info.main" sx={{ fontWeight: 700 }}>
                    {folders.filter(f => f.files.length > 0).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Categories
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Folder Categories */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            File Categories
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {folders.map((folder) => (
              <Grid item xs={12} md={4} key={folder.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: `2px solid ${folder.borderColor}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                  onClick={() => handleFolderClick(folder)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Badge 
                      badgeContent={folder.files.length} 
                      color={folder.badgeColor}
                      sx={{ mb: 1 }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: folder.color,
                          color: folder.borderColor,
                          width: 56,
                          height: 56,
                          fontSize: '2rem',
                          border: `2px solid ${folder.borderColor}`
                        }}
                      >
                        {folder.icon}
                      </Avatar>
                    </Badge>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {folder.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {folder.description}
                    </Typography>
                    <Chip 
                      label={`${folder.files.length} ${folder.files.length === 1 ? 'file' : 'files'}`}
                      color={folder.badgeColor}
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Hint removed to save space */}
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No Results Available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please complete the processing workflow first to view analysis results.
          </Typography>
        </Paper>
      )}

      {/* Folder Contents Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="xl"
        fullWidth
        PaperProps={{ 
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          bgcolor: '#1a1a1a',
          borderBottom: `3px solid ${selectedFolder?.borderColor}`,
          color: '#e0e0e0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: selectedFolder?.borderColor, color: 'white' }}>
              {selectedFolder?.icon}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedFolder?.name} Category
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedFolder?.description}
              </Typography>
            </Box>
            <Chip 
              label={`${selectedFolder?.files.length || 0} files`} 
              color={selectedFolder?.badgeColor}
              sx={{ ml: 2 }}
            />
          </Box>
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ 
          p: 2,
          mt: 1.5,
          background: '#1a1a1a', // Dark background for dialog body
          border: '3px solid #1a1a1a',
          borderTop: 0,
          borderRadius: '0 0 18px 18px',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.6)',
        }}>
          <Box sx={{ 
            background: '#1a1a1a',
            borderRadius: 3,
            p: 2,
            minHeight: 180,
            border: `2px solid ${selectedFolder?.borderColor}`,
          }}>
            {selectedFolder && selectedFolder.files && selectedFolder.files.length > 0 ? (
              <Grid container spacing={2}>
                {sortFilesByICNumber(selectedFolder.files).map((file) => {
                  const imagePreview = createImagePreview(file);
                  return (
                    <Grid item xs={12} key={file.id}>
                      <Paper 
                        sx={{ 
                          p: 3,
                          border: `2px solid ${selectedFolder.borderColor}`,
                          borderRadius: 2,
                          bgcolor: '#1a1a1a',
                          color: selectedFolder.borderColor,
                        }}
                      >
                        <Grid container spacing={3} alignItems="flex-start">
                          {/* Header Section */}
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {file.name}
                                </Typography>
                                <Chip 
                                  label={selectedFolder.name}
                                  color={selectedFolder.badgeColor}
                                  size="small"
                                />
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Select
                                  value={file && typeof file.clinicianApproval === 'string' ? file.clinicianApproval : ''}
                                  onChange={e => handleApprovalChange(selectedFolder.id, file.id, e.target.value)}
                                  displayEmpty
                                  size="small"
                                  sx={{ 
                                    minWidth: 140, 
                                    borderRadius: 1,
                                    bgcolor: file?.clinicianApproval === 'approved' ? '#e8f5e9' : 
                                            file?.clinicianApproval === 'disapproved' ? '#ffebee' : 'white',
                                    color: file?.clinicianApproval === 'approved' ? '#2e7d32' : 
                                           file?.clinicianApproval === 'disapproved' ? '#d32f2f' : 'inherit',
                                    fontWeight: file?.clinicianApproval ? 600 : 'normal',
                                    '& .MuiSelect-icon': {
                                      color: 'rgba(0, 0, 0, 0.8)',
                                      fontSize: '1.2rem'
                                    }
                                  }}
                                  IconComponent={KeyboardArrowDown}
                                >
                                  <MenuItem value=""><em>Pending Review</em></MenuItem>
                                  <MenuItem value="approved">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <CheckCircleOutline sx={{ color: 'green' }} />
                                      Approved
                                    </Box>
                                  </MenuItem>
                                  <MenuItem value="disapproved">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <HighlightOff sx={{ color: 'red' }} />
                                      Disapproved
                                    </Box>
                                  </MenuItem>
                                </Select>
                              </Box>
                            </Box>
                          </Grid>

                          {/* Images Section */}
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                                    Original Image
                                  </Typography>
                                  {imagePreview ? (
                                    <Box
                                      component="img"
                                      src={imagePreview}
                                      alt={file.name}
                                      sx={{ 
                                        width: '100%',
                                        height: 300,
                                        objectFit: 'contain',
                                        borderRadius: 2,
                                        border: '2px solid #444444',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { 
                                          opacity: 0.8,
                                          transform: 'scale(1.02)',
                                          borderColor: '#4fc3f7'
                                        }
                                      }}
                                      onClick={() => setImagePreviewUrl(imagePreview)}
                                    />
                                  ) : (
                                    <Box
                                      sx={{ 
                                        width: '100%',
                                        height: 300,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: '#f5f5f5',
                                        borderRadius: 2,
                                        border: '2px solid #ddd'
                                      }}
                                    >
                                      <InsertDriveFile color="action" sx={{ fontSize: '2rem' }} />
                                    </Box>
                                  )}
                                </Box>
                              </Grid>
                              {file.aiHeatmap && (
                                <Grid item xs={12} md={6}>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                                      AI Heatmap
                                    </Typography>
                                    <Box
                                      component="img"
                                      src={file.aiHeatmap}
                                      alt="AI Heatmap"
                                      sx={{ 
                                        width: '100%',
                                        height: 300,
                                        objectFit: 'contain',
                                        borderRadius: 2,
                                        border: '2px solid #444444',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { 
                                          opacity: 0.8,
                                          transform: 'scale(1.02)',
                                          borderColor: '#4fc3f7'
                                        }
                                      }}
                                      onClick={() => setImagePreviewUrl(file.aiHeatmap)}
                                    />
                                  </Box>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>

                          {/* Explanations Section */}
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                                    AI Explanation
                                  </Typography>
                                  <Box
                                    component="textarea"
                                    value={file.clinicianExplanation !== undefined ? file.clinicianExplanation : (file.aiExplanation || 'No explanation available')}
                                    onChange={e => handleExplanationChange(selectedFolder.id, file.id, e.target.value)}
                                    style={{ 
                                      width: '100%',
                                      height: '80px',
                                      padding: '10px',
                                      borderRadius: '8px',
                                      border: '1px solid #444444',
                                      fontSize: '0.95rem',
                                      fontFamily: 'inherit',
                                      resize: 'vertical',
                                      backgroundColor: '#1a1a1a',
                                      color: '#e0e0e0'
                                    }}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                                    Clinical Note
                                  </Typography>
                                  {file && file.clinicalNote ? (
                                    <Paper sx={{ 
                                      p: 2, 
                                      bgcolor: '#2a2a2a', 
                                      color: '#e0e0e0', 
                                      height: '80px', 
                                      overflow: 'auto', 
                                      borderRadius: 2,
                                      border: '1px solid #444444',
                                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
                                    }}>
                                      <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.4, color: '#e0e0e0' }}>
                                        {file.clinicalNote}
                                      </Typography>
                                    </Paper>
                                  ) :
                                    <Paper sx={{ 
                                      p: 2, 
                                      bgcolor: '#2a2a2a', 
                                      height: '80px', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center', 
                                      borderRadius: 2,
                                      border: '1px solid #444444'
                                    }}>
                                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        No clinical note provided
                                      </Typography>
                                    </Paper>
                                  }
                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Typography variant="h6">
                  No files in this category
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox Dialog */}
      <Dialog open={!!imagePreviewUrl} onClose={() => setImagePreviewUrl(null)} maxWidth="md">
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#222' }}>
          <IconButton onClick={() => setImagePreviewUrl(null)} sx={{ alignSelf: 'flex-end', color: 'white' }}>
            <Close />
          </IconButton>
          {imagePreviewUrl && (
            <Box component="img" src={imagePreviewUrl} alt="Preview" sx={{ maxWidth: '80vw', maxHeight: '70vh', borderRadius: 2, boxShadow: 6, mt: 1 }} />
          )}
        </Box>
      </Dialog>
    </Container>
  );
};

export default ResultsPage; 