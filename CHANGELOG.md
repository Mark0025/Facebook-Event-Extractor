# Changelog

All notable changes to the 152 Bar Events Extractor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2024-03-28

### Added
- TypeScript implementation for better type safety
- Content script for event link discovery
- Event details extraction functionality
- Progress tracking and saving
- Options page for configuration
- Rate limiting and batch processing
- Debug logging system

### Changed
- Migrated from JavaScript to TypeScript
- Improved build process with asset generation
- Enhanced error handling and recovery
- Updated manifest for Chrome Extension Manifest V3

### Fixed
- Added missing event link detection in content script
- Improved error handling in message passing
- Fixed type definitions for better type safety

### Known Issues
- Content script connection issues on past events page
- Event link detection may need enhancement for dynamic content
- Need to implement proper content script injection verification

### Next Steps
1. Implement proper content script injection verification
2. Add retry mechanism for message passing
3. Enhance event link detection for dynamic content
4. Add error recovery for failed connections

## [1.3.8] - 2024-03-28

### Fixed
- Fixed log function scope issues
- Added proper version display using manifest version
- Improved logging functionality with better timestamps
- Fixed global variable scope issues
- Added proper initialization of version display

## [1.3.7] - 2024-03-28

### Fixed
- Removed unnecessary file initialization on extension install
- Fixed ReferenceError in background service worker
- Removed deprecated saveFile function call

## [1.3.6] - 2024-03-28

### Fixed
- Removed automatic creation of empty files
- Added validation to only save files when we have actual data
- Improved file saving logic and error handling
- Fixed empty file creation on extension load
- Enhanced filename sanitization

## [1.3.5] - 2024-03-28

### Fixed
- Fixed log function scope issues
- Improved event ID handling and processing
- Fixed event element management
- Enhanced storage and file saving logic
- Improved error handling throughout the extension
- Fixed event list UI updates
- Better status handling for events

## [1.3.4] - 2024-03-28

### Fixed
- Fixed event ID handling in event processing
- Added proper ID validation before UI updates
- Improved error handling for missing event IDs
- Enhanced event details extraction reliability

## [1.3.3] - 2024-03-28

### Fixed
- Added path sanitization to comply with Chrome's requirements
- Fixed invalid filename errors in file saving operations
- Improved path handling for nested directories
- Added proper file extension for keep file
- Enhanced error handling for path-related issues

## [1.3.2] - 2024-03-28

### Fixed
- Added filename sanitization to comply with Chrome's requirements
- Fixed invalid filename errors in file saving operations
- Removed leading dot from keep file to prevent issues
- Improved error handling for file operations

## [1.3.1] - 2024-03-28

### Fixed
- Resolved URL.createObjectURL error in service worker
- Improved file saving mechanism to work in service worker context
- Fixed data URL generation for file downloads

## [1.3.0] - 2024-03-28

### Added
- Initial Chrome extension setup
- Basic popup interface
- Background service worker
- File system integration

### Changed
- Updated manifest for Chrome Extension Manifest V3
- Improved build process

### Fixed
- Initial setup and configuration
- Basic extension structure

## [1.0.0] - 2024-03-26

### Added
- Initial project setup
- Basic documentation
- Project structure

[1.4.0]: https://github.com/aireinvestor/152bar/compare/v1.3.8...v1.4.0
[1.3.8]: https://github.com/aireinvestor/152bar/compare/v1.3.7...v1.3.8
[1.3.7]: https://github.com/aireinvestor/152bar/compare/v1.3.6...v1.3.7
[1.3.6]: https://github.com/aireinvestor/152bar/compare/v1.3.5...v1.3.6
[1.3.5]: https://github.com/aireinvestor/152bar/compare/v1.3.4...v1.3.5
[1.3.4]: https://github.com/aireinvestor/152bar/compare/v1.3.3...v1.3.4
[1.3.3]: https://github.com/aireinvestor/152bar/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/aireinvestor/152bar/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/aireinvestor/152bar/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/aireinvestor/152bar/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/aireinvestor/152bar/releases/tag/v1.2.1 