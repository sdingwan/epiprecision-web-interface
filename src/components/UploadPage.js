import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  Box, 
  LinearProgress, 
  Alert, 
  Chip,
  Grid,
  Paper,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  CloudUpload, 
  Folder, 
  Delete,
  Description,
  Image as ImageIcon,
  CheckCircle,
  Warning,
  Info,
  PsychologyAlt,
  CameraAlt
} from '@mui/icons-material';
import { useFiles } from '../App';

const EEG_FILE_TYPES = '.edf,.csv,.mat,.txt';
const MRI_FILE_TYPES = 'image/*,.nii,.nii.gz,.dcm';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dataType, setDataType] = useState('MRI');
  const navigate = useNavigate();
  const { uploadedFiles, setUploadedFiles, clearFiles } = useFiles();

  // Log existing uploaded files for debugging
  console.log('UploadPage - existing uploadedFiles:', uploadedFiles);
 
  const processFiles = (selectedFiles) => {
    // Create file objects with metadata and blob URLs for persistence
    const processedFiles = selectedFiles.map(file => ({
      id: `${file.name}-${file.size}-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      blobUrl: URL.createObjectURL(file),
      originalFile: file,
      dataType // Store whether MRI or EEG
    }));
    return processedFiles;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    // Process files and store in context
    const processedFiles = processFiles(selectedFiles);
    console.log('UploadPage - setting uploadedFiles:', processedFiles);
    setUploadedFiles(processedFiles);
    // Simulate upload progress for demo
    if (selectedFiles.length > 0) {
      setUploading(true);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleFolderUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    // Process files and store in context
    const processedFiles = processFiles(selectedFiles);
    console.log('UploadPage - setting uploadedFiles (folder):', processedFiles);
    setUploadedFiles(processedFiles);
    if (selectedFiles.length > 0) {
      setUploading(true);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
  };

  const getFileCountMessage = () => {
    if (files.length === 0) return `No new files selected`;
    if (files.length === 1) return `1 new file selected`;
    return `${files.length} new files selected`;
  };

  const getTotalFileSize = (fileList) => {
    const totalBytes = fileList.reduce((sum, file) => sum + (file.size || 0), 0);
    const totalMB = totalBytes / (1024 * 1024);
    return totalMB.toFixed(2);
  };

  const getFileIcon = (file) => {
    if (file.dataType === 'EEG') {
      return <PsychologyAlt sx={{ color: 'secondary.main' }} />;
    }
    if (file.type && file.type.startsWith('image/')) {
      return <ImageIcon sx={{ color: 'primary.main' }} />;
    }
    return <Description sx={{ color: 'text.secondary' }} />;
  };

  // Add or update clinical note for a file
  const handleNoteChange = (fileId, note) => {
    setUploadedFiles(prevFiles => prevFiles.map(f => f.id === fileId ? { ...f, clinicalNote: note } : f));
  };

  return (
    <Box sx={{ minHeight: '80vh', p: 3 }}>
      <Grid container maxWidth="lg" spacing={4} sx={{ mx: 'auto' }}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                  Upload {dataType} Data
                </Typography>
                <ToggleButtonGroup
                  value={dataType}
                  exclusive
                  onChange={(_, val) => val && setDataType(val)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}
                >
                  <ToggleButton value="MRI" sx={{ fontWeight: 600, px: 3 }}>
                    <CameraAlt sx={{ mr: 1 }} /> MRI
                  </ToggleButton>
                  <ToggleButton value="EEG" sx={{ fontWeight: 600, px: 3 }}>
                    <PsychologyAlt sx={{ mr: 1 }} /> EEG
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.95)', mb: 2 }}>
                Upload your {dataType} data for advanced analysis
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<CheckCircle />}
                  label="Secure Platform" 
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', color: '#2e7d32', fontWeight: 600 }}
                />
                <Chip 
                  icon={<CheckCircle />}
                  label="Secure Upload" 
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', color: '#2e7d32', fontWeight: 600 }}
                />
                <Chip 
                  icon={<Info />}
                  label={dataType === 'MRI' ? 'MRI Formats Supported' : 'EEG Formats Supported'} 
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white', fontWeight: 600 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Upload Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 4 }}>
              {/* Existing Files Display */}
              {uploadedFiles.length > 0 && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 3 }}
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      onClick={clearFiles}
                      startIcon={<Delete />}
                    >
                      Clear All
                    </Button>
                  }
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} ready for processing
                  </Typography>
                  <Typography variant="body2">
                    Total size: {getTotalFileSize(uploadedFiles)} MB
                  </Typography>
                  {/* Clinical context input for each file */}
                  <List dense sx={{ mt: 2 }}>
                    {uploadedFiles.map((file, idx) => (
                      <ListItem key={file.id} alignItems="flex-start" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                          {getFileIcon(file)}
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ width: '100%', mt: 1 }}>
                          <input
                            type="text"
                            placeholder="Add clinical context (optional)"
                            value={file.clinicalNote || ''}
                            onChange={e => handleNoteChange(file.id, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '6px',
                              border: '1px solid #e0e0e0',
                              fontSize: '0.95rem',
                              marginTop: 2
                            }}
                          />
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}

              {/* Upload Instructions */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Select {dataType} Data
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                {dataType === 'MRI'
                  ? 'Choose your MRI images or DICOM files. Supported formats: JPEG, PNG, NIfTI (.nii, .nii.gz), DICOM (.dcm).'
                  : 'Choose your EEG files. Supported formats: EDF, CSV, MAT, TXT.'}
              </Typography>

              {/* Upload Buttons */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUpload />}
                    size="large"
                    fullWidth
                    sx={{ py: 2, borderRadius: 2 }}
                  >
                    Select Individual Files
                    <input
                      type="file"
                      hidden
                      multiple
                      accept={dataType === 'MRI' ? MRI_FILE_TYPES : EEG_FILE_TYPES}
                      onChange={handleFileChange}
                    />
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Folder />}
                    size="large"
                    fullWidth
                    sx={{ py: 2, borderRadius: 2 }}
                  >
                    Select Folder
                    <input
                      type="file"
                      hidden
                      webkitdirectory=""
                      multiple
                      accept={dataType === 'MRI' ? MRI_FILE_TYPES : EEG_FILE_TYPES}
                      onChange={handleFolderUpload}
                    />
                  </Button>
                </Grid>
              </Grid>

              {/* File Count Display */}
              {files.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Chip 
                    label={getFileCountMessage()} 
                    color="primary"
                    size="medium"
                    sx={{ fontSize: '0.9rem', fontWeight: 600 }}
                  />
                </Box>
              )}

              {/* Upload Progress */}
              {uploading && (
                <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Uploading {files.length} {files.length === 1 ? 'file' : 'files'}...
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={uploadProgress} 
                    sx={{ height: 8, borderRadius: 1, mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {uploadProgress}% complete
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getTotalFileSize(files)} MB
                    </Typography>
                  </Box>
                </Paper>
              )}

              {/* File List (show first 10 and summary) */}
              {files.length > 0 && !uploading && (
                <Paper sx={{ p: 3, mb: 3, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'success.main' }}>
                    New Files Ready ({files.length} total - {getTotalFileSize(files)} MB)
                  </Typography>
                  <Box sx={{ 
                    maxHeight: 200, 
                    overflow: 'auto', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 1,
                    bgcolor: 'white'
                  }}>
                    <List dense>
                      {files.slice(0, 10).map((file, idx) => (
                        <ListItem key={idx} sx={{ py: 1, borderBottom: '1px solid #f5f5f5' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                            {getFileIcon({ ...file, dataType })}
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {file.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}
                              </Typography>
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                      {files.length > 10 && (
                        <ListItem sx={{ py: 1, bgcolor: 'grey.50' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            ... and {files.length - 10} more files
                          </Typography>
                        </ListItem>
                      )}
                    </List>
                  </Box>
                </Paper>
              )}

              {/* Proceed Button */}
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={() => navigate('/processing')}
                disabled={(files.length === 0 && uploadedFiles.length === 0) || uploading}
                sx={{ 
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                {uploading 
                  ? 'Uploading...' 
                  : (files.length === 0 && uploadedFiles.length === 0)
                    ? 'Select Files to Continue'
                    : uploadedFiles.length > 0 && files.length === 0
                      ? `Begin Analysis with ${uploadedFiles.length} ${uploadedFiles.length === 1 ? (uploadedFiles[0].dataType || dataType) : 'Files'}`
                      : files.length === 1
                        ? 'Begin Analysis with 1 New File'
                        : `Begin Analysis with ${files.length} New Files`
                }
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Information Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Upload Guidelines
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Supported Formats:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {dataType === 'MRI' ? (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        • JPEG, PNG, TIFF images
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • NIfTI files (.nii, .nii.gz)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • DICOM files (.dcm)
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        • EDF (European Data Format)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • CSV, MAT, TXT
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Recommended Size:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dataType === 'MRI'
                    ? '100-200 images for optimal results'
                    : 'Typical EEG files are 1-100 MB'}
                </Typography>
              </Box>

            </CardContent>
          </Card>

          {/* Quick Stats */}
          {(uploadedFiles.length > 0 || files.length > 0) && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Upload Summary
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Files:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {uploadedFiles.length + files.length}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Size:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {(parseFloat(getTotalFileSize(uploadedFiles)) + parseFloat(getTotalFileSize(files))).toFixed(2)} MB
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Chip 
                    label={uploading ? "Uploading" : "Ready"} 
                    size="small" 
                    color={uploading ? "warning" : "success"}
                  />
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadPage; 