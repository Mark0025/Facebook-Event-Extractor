/// <reference types="chrome"/>
import { debugBackground, logError } from './utils/debug.js';
import { Message, MessageType } from './types.js';

// Type guard for Message
function isValidMessageType(type: unknown): type is MessageType {
  return typeof type === 'string' && Object.values(MessageType).includes(type as MessageType);
}

function isMessage(value: unknown): value is Message {
  return (
    value !== null &&
    typeof value === 'object' &&
    'type' in value &&
    isValidMessageType((value as { type: unknown }).type)
  );
}

// Service worker initialization
debugBackground('Service worker initializing');

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  debugBackground('Extension installed/updated:', details.reason);
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener(function(
  message: unknown,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
) {
  debugBackground('Received message:', message);
  
  try {
    if (!isMessage(message)) {
      sendResponse({ error: 'Invalid message format' });
      return;
    }

    const { type } = message;
    switch (type) {
      case MessageType.EXTRACT_EVENTS:
        // Handle event extraction
        sendResponse({ success: true });
        break;
      case MessageType.GET_STATE:
        // Handle state retrieval
        sendResponse({ success: true });
        break;
      case MessageType.SAVE_FILE:
        // Handle file saving
        sendResponse({ success: true });
        break;
      default:
        debugBackground('Unknown message type:', type);
        sendResponse({ error: 'Unknown message type' });
    }
  } catch (error) {
    logError(error, { message, sender });
    sendResponse({ error: 'Internal error occurred' });
  }
});

// Handle extension lifecycle events
chrome.runtime.onStartup.addListener(() => {
  debugBackground('Extension started');
});

chrome.runtime.onSuspend.addListener(() => {
  debugBackground('Extension suspended');
}); 