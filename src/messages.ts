import { EventDetails } from './types';

// Message types
export type MessageType = 'extractEventDetails' | 'findEventLinks';

// Message interface
export interface Message {
  type: MessageType;
  data?: any;
}

// Response interface
export interface MessageResponse<T> {
  data?: T;
  error?: string;
}

// Message sender function
export function sendMessage<T>(type: MessageType, data?: any): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type, data }, (response: MessageResponse<T>) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response.data as T);
      }
    });
  });
}

// Message listener function
export function addMessageListener<T>(
  type: MessageType,
  handler: (data: any) => Promise<T> | T
): void {
  chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    if (message.type === type) {
      Promise.resolve(handler(message.data))
        .then(result => sendResponse({ data: result }))
        .catch(error => sendResponse({ error: error.message }));
    }
  });
}

// Convenience functions for our specific messages
export const extractEventDetails = () => sendMessage<EventDetails>('extractEventDetails');
export const findEventLinks = () => sendMessage<{ upcoming: string[], past: string[] }>('findEventLinks');

// Message handlers
export const handleExtractEventDetails = (handler: () => Promise<EventDetails> | EventDetails) => 
  addMessageListener('extractEventDetails', handler);

export const handleFindEventLinks = (handler: () => Promise<{ upcoming: string[], past: string[] }> | { upcoming: string[], past: string[] }) => 
  addMessageListener('findEventLinks', handler); 