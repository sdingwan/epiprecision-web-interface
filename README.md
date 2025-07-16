# EpiPrecision Web Interface

A React-based web interface for MRI data analysis using AI-powered IC processing for epilepsy research.

## Project Overview

This application provides a user-friendly interface for:
- Uploading MRI data (100-200 images)
- Running AI-powered IC Analysis
- Processing data with EpiPrecision AI
- Classifying images into RSN, Noise, and SOZ (Seizure Onset Zone) folders

## Project Structure

```
src/
├── App.js                    # Main app with routing
├── index.js                  # React entry point
├── index.css                 # Global styles
└── components/
    ├── Navbar.js             # Navigation bar
    ├── LandingPage.js        # Login/data type selection
    ├── UploadPage.js         # MRI image upload
    ├── ProcessingPage.js     # AI-powered processing
    ├── ResultsPage.js        # Final results display
    └── ICReferenceTable.js   # IC types reference table

public/
├── index.html               # HTML template
└── manifest.json           # Web app manifest
```

## How to Run

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm start
   ```

3. **Open in Browser:**
   Navigate to `http://localhost:3000`

## Features

### 1. Landing Page
- Mock user account display
- Data type selection (MRI, EEG, PET, Other)
- MRI is pre-selected and enabled

### 2. Upload Page
- Multiple file upload for MRI images
- Mock file list display
- API integration placeholder (disabled)

### 3. Processing Page
- Step-by-step workflow with progress indicators
- Run AI Analysis button (simulated processing)
- Run EPIK button (simulated processing)
- Folder creation visualization

### 4. Results Page
- Display of master folder with 3 subfolders:
  - RSN Folder (blue)
  - Noise Folder (orange)
  - SOZ Folder (pink)
- IC Reference Table with visual examples

### 5. IC Reference Table
- **Noise IC**: Small clusters on white matter and brain periphery
- **RSN IC**: Clusters on grey matter (Resting State Network)
- **SOZ IC**: Large cluster on both grey and white matter (Seizure Onset Zone)

## Technology Stack

- **React 18** - Frontend framework
- **React Router 6** - Client-side routing
- **Material-UI (MUI) 5** - UI component library
- **JavaScript ES6+** - Programming language

## Backend Integration Ready

The project is structured to easily integrate backend APIs:
- All processing buttons are ready for API calls
- File upload can be connected to backend endpoints
- Authentication can be added to the landing page
- Results can be fetched from backend services

## Mock Features

Currently, all processing is simulated with timeouts for demonstration purposes:
- File uploads show selected files but don't upload to server
- AI and EPIK processing show progress indicators
- Folder creation is visual only

## Future Enhancements

- Connect to actual AI processing backend
- Implement real file upload with progress tracking
- Add user authentication system
- Integrate with EpiPrecision AI models
- Add data visualization for IC analysis results

## Development

This project was created with Create React App and follows React best practices:
- Functional components with hooks
- Proper component separation
- Responsive design with Material-UI
- Router-based navigation for easy backend integration 