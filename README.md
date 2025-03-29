# 152 Bar Events Extractor

A Chrome extension that extracts event details from 152 Bar's Facebook page.

## Features

- Extracts event details from Facebook events
- Supports both upcoming and past events
- Downloads event data in JSON format
- User-friendly popup interface
- Background processing for better performance

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the extension:
   ```bash
   pnpm run build
   ```
4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` directory

## Development

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build the extension
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier

## Project Structure

```
src/
  ├── assets/         # Images and other static assets
  ├── utils/          # Utility functions
  ├── types/          # TypeScript type definitions
  ├── background.ts   # Background service worker
  ├── content.ts      # Content script
  ├── popup.ts        # Popup UI logic
  └── options.ts      # Options page logic
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details. 