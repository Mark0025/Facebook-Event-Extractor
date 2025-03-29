# 152 Bar Events Extractor - Architecture Documentation

## Overview
The 152 Bar Events Extractor is a Chrome extension designed to extract event information from 152 Bar's Facebook page. The extension is built using TypeScript and follows a modular architecture with clear separation of concerns.

## Core Components

### 1. Content Script (`src/content.ts`)
- Runs in the context of Facebook pages
- Responsible for:
  - Extracting event details from individual event pages
  - Finding event links on the page
  - Communicating with the popup script
- Key functions:
  - `extractEventDetails()`: Extracts detailed information from an event page
  - `findEventLinks()`: Finds all event links on a page

### 2. Background Script (`src/background.ts`)
- Service worker that handles:
  - File management and downloads
  - Extension lifecycle events
  - Message routing
- Key functions:
  - `sanitizeFilename()`: Ensures safe filenames
  - `sanitizePath()`: Ensures safe file paths
  - Handles file downloads and storage

### 3. Popup Script (`src/popup.ts`)
- Main UI and control center
- Manages:
  - Event extraction process
  - Progress tracking
  - Rate limiting
  - Batch processing
- Key features:
  - Batch processing with configurable size
  - Rate limiting (1000 requests/hour)
  - Progress tracking and UI updates
  - Error handling and recovery
  - Pause/resume functionality

### 4. Types (`src/types.ts`)
- Defines core data structures:
  - `FacebookEvent`: Basic event information
  - `EventDetails`: Complete event information
  - `SaveFileMessage`: File saving operations
  - `StorageData`: Local storage structure
  - `BatchProgress`: Progress tracking

## Data Flow

1. **Initialization**:
   - Extension loads and initializes background service worker
   - Popup UI initializes and loads existing events from storage

2. **Event Extraction Process**:
   ```
   User clicks "Extract Events" →
   Popup finds event links →
   Processes events in batches →
   Content script extracts details →
   Background script handles storage →
   UI updates with progress
   ```

3. **Rate Limiting**:
   - Maximum 1000 requests per hour
   - Random delays between requests (3-7 seconds)
   - Batch size of 50 events
   - Maximum 2 concurrent requests

## Error Handling

1. **Network Errors**:
   - Automatic retry mechanism
   - Error logging and UI feedback
   - Graceful degradation

2. **Rate Limiting**:
   - Automatic pause when limits reached
   - User notification
   - Resume capability

3. **Data Validation**:
   - Type checking through TypeScript
   - Null checks and default values
   - Data sanitization

## Storage

1. **Local Storage**:
   - Stores extracted events
   - Caches event details
   - Maintains progress information

2. **File Storage**:
   - Downloads events as JSON
   - Sanitized filenames and paths
   - Organized in extracted-events directory

## Build Process

1. **TypeScript Compilation**:
   - Target: ES2020
   - Strict mode enabled
   - Chrome types included

2. **Asset Management**:
   - Icons generation
   - HTML file copying
   - Manifest copying

3. **Output Structure**:
   ```
   dist/
   ├── assets/
   ├── extracted-events/
   ├── manifest.json
   ├── popup.html
   ├── options.html
   └── compiled JS files
   ```

## Development Guidelines

1. **Code Style**:
   - TypeScript strict mode
   - Clear function and variable naming
   - Comprehensive error handling
   - Detailed logging

2. **Testing**:
   - Manual testing required
   - Console logging for debugging
   - Error boundary implementation

3. **Performance**:
   - Batch processing
   - Rate limiting
   - Efficient DOM operations
   - Memory management

## Security Considerations

1. **Data Safety**:
   - Input sanitization
   - File path validation
   - Content Security Policy

2. **Permissions**:
   - Minimal required permissions
   - Host-specific access
   - Secure storage practices

## Future Improvements

1. **Technical**:
   - Automated testing
   - Performance optimization
   - Better error recovery
   - Enhanced logging

2. **Features**:
   - Event filtering
   - Custom export formats
   - Advanced search
   - Event categorization

3. **UI/UX**:
   - Better progress visualization
   - More detailed error messages
   - Enhanced event preview
   - Keyboard shortcuts 