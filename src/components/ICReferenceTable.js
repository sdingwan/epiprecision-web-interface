import React from 'react';
import { Typography, Box } from '@mui/material';

const ICReferenceTable = () => {
  return (
    <Box sx={{ width: '100%', mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" align="center" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        IC Reference Table
      </Typography>
      
      {/* Display the actual brain scan reference image */}
      <Box sx={{ 
        maxWidth: '800px', 
        width: '100%',
        border: '2px solid #333',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'white'
      }}>
        <img 
          src="/ic-reference-table.png" 
          alt="IC Reference Table showing Noise IC, RSN IC, and SOZ IC brain scans"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      </Box>
    </Box>
  );
};

export default ICReferenceTable; 