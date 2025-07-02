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
  FolderSpecial
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
      id: 'normal',
      name: 'Normal',
      color: '#e8f5e9',
      borderColor: '#43a047',
      description: 'No abnormality detected',
      files: folderData?.normal || [],
      badgeColor: 'success',
      icon: '✓'
    },
    {
      id: 'noise',
      name: 'Noisy', 
      color: '#fffde7',
      borderColor: '#fbc02d',
      description: 'Motion artifact or noise detected',
      files: folderData?.noise || [],
      badgeColor: 'warning',
      icon: '⚠'
    },
    {
      id: 'review',
      name: 'Needs Review',
      color: '#ffebee',
      borderColor: '#e53935',
      description: 'Potential SOZ detected - requires review',
      files: folderData?.review || [],
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
      (Array.isArray(folderData.normal) ? folderData.normal.length : 0) + 
      (Array.isArray(folderData.noise) ? folderData.noise.length : 0) + 
      (Array.isArray(folderData.review) ? folderData.review.length : 0)
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

  // PDF generation
  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(18);
    doc.text('EpiPrecision AI Report', 14, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, y);
    y += 10;
    // For each folder
    for (const folder of folders) {
      if (!folder.files || folder.files.length === 0) continue;
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      y += 10;
      doc.text(folder.name, 14, y);
      y += 4;
      doc.setFontSize(10);
      for (const file of folder.files) {
        y += 8;
        // Image
        if (file.blobUrl) {
          try {
            const imgData = await getImageDataUrl(file.blobUrl);
            doc.addImage(imgData, 'JPEG', 14, y, 24, 24);
          } catch (e) {}
        }
        // Heatmap
        if (file.aiHeatmap) {
          try {
            const heatmapData = await getImageDataUrl(file.aiHeatmap);
            doc.addImage(heatmapData, 'JPEG', 40, y, 24, 24);
          } catch (e) {}
        }
        // Text info
        doc.setTextColor(40, 40, 40);
        doc.text(`File: ${file.name}`, 70, y + 6);
        doc.text(`Type: ${file.dataType || ''}`, 70, y + 12);
        doc.text(`Category: ${file.aiCategory || ''}`, 70, y + 18);
        doc.text(`Approval: ${file.clinicianApproval || 'Pending'}`, 120, y + 6);
        doc.text(`Clinical Note: ${file.clinicalNote || '-'}`, 120, y + 12);
        doc.text('Explanation:', 70, y + 24);
        doc.setFont('helvetica', 'italic');
        doc.text(`${file.clinicianExplanation !== undefined ? file.clinicianExplanation : file.aiExplanation}`, 90, y + 24, { maxWidth: 100 });
        doc.setFont('helvetica', 'normal');
        y += 28;
        if (y > 250) {
          doc.addPage();
          y = 10;
        }
      }
    }
    doc.save('epiprecision_report.pdf');
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
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        borderRadius: 3,
        p: 2,
        mb: 3,
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 48, height: 48 }}>
            <Assessment fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Analysis Results
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              AI-powered categorization complete
            </Typography>
          </Box>
        </Box>
        
        {processingComplete && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {uploadedFiles.length} files processed and categorized
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
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
              <FolderSpecial color="primary" />
              Processing Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
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
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          bgcolor: selectedFolder?.color,
          borderBottom: `3px solid ${selectedFolder?.borderColor}`
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
          background: '#fff', // White background for dialog body
          border: '3px solid #fff',
          borderTop: 0,
          borderRadius: '0 0 18px 18px',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
        }}>
          <Box sx={{
            background: selectedFolder?.color,
            borderRadius: 3,
            p: 2,
            minHeight: 180,
          }}>
            {selectedFolder && selectedFolder.files && selectedFolder.files.length > 0 ? (
              <Grid container spacing={2}>
                {selectedFolder.files.map((file) => {
                  const imagePreview = createImagePreview(file);
                  return (
                    <Grid item xs={12} key={file.id}>
                      <Paper 
                        sx={{ 
                          p: 3,
                          border: `1px solid ${selectedFolder.borderColor}`,
                          borderRadius: 2,
                          bgcolor: selectedFolder.color
                        }}
                      >
                        <Grid container spacing={3} alignItems="flex-start">
                                                   {/* Images Section */}
                           <Grid item xs={12} md={3}>
                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
                                       height: 100,
                                       objectFit: 'cover',
                                       borderRadius: 2,
                                       border: '2px solid #ddd',
                                       cursor: 'pointer',
                                       transition: 'all 0.2s ease',
                                       '&:hover': { 
                                         opacity: 0.8,
                                         transform: 'scale(1.02)',
                                         borderColor: '#1976d2'
                                       }
                                     }}
                                     onClick={() => setImagePreviewUrl(imagePreview)}
                                   />
                                 ) : (
                                   <Box
                                     sx={{
                                       width: '100%',
                                       height: 100,
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
                               
                               {file.aiHeatmap && (
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
                                       height: 80,
                                       objectFit: 'cover',
                                       borderRadius: 2,
                                       border: '2px solid #ddd',
                                       cursor: 'pointer',
                                       transition: 'all 0.2s ease',
                                       '&:hover': { 
                                         opacity: 0.8,
                                         transform: 'scale(1.02)',
                                         borderColor: '#1976d2'
                                       }
                                     }}
                                     onClick={() => setImagePreviewUrl(file.aiHeatmap)}
                                   />
                                 </Box>
                               )}
                             </Box>
                           </Grid>

                           {/* File Info Section */}
                           <Grid item xs={12} md={9}>
                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
                                       fontWeight: file?.clinicianApproval ? 600 : 'normal'
                                     }}
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

                               <Box sx={{ display: 'flex', gap: 2 }}>
                                 <Box sx={{ flex: 3 }}>
                                   <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                                     AI Explanation
                                   </Typography>
                                   <Box
                                     component="textarea"
                                     value={file.clinicianExplanation !== undefined ? file.clinicianExplanation : (file.aiExplanation || 'No explanation available')}
                                     onChange={e => handleExplanationChange(selectedFolder.id, file.id, e.target.value)}
                                     style={{
                                       width: '100%',
                                       height: '70px',
                                       padding: '10px',
                                       borderRadius: '8px',
                                       border: '1px solid #e0e0e0',
                                       fontSize: '0.95rem',
                                       fontFamily: 'inherit',
                                       resize: 'vertical',
                                       backgroundColor: '#fafafa'
                                     }}
                                   />
                                 </Box>

                                 <Box sx={{ flex: 2 }}>
                                   <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                                     Clinical Note
                                   </Typography>
                                   {file && file.clinicalNote ? (
                                     <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText', height: '70px', overflow: 'auto', borderRadius: 2 }}>
                                       <Typography variant="body2" sx={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                                         {file.clinicalNote}
                                       </Typography>
                                     </Paper>
                                   ) : (
                                     <Paper sx={{ p: 2, bgcolor: 'grey.100', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                                       <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                         No clinical note provided
                                       </Typography>
                                     </Paper>
                                   )}
                                 </Box>
                               </Box>
                             </Box>
                           </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'grey.100', 
                  color: 'grey.400',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Folder sx={{ fontSize: '3rem' }} />
                </Avatar>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No Files Found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No files were classified into this category during analysis
                </Typography>
              </Box>
            )}
    </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Button onClick={handleCloseDialog} variant="contained" size="large">
            Close
          </Button>
        </DialogActions>
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