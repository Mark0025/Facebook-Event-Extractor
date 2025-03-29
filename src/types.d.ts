/// <reference types="chrome"/>

declare global {
  interface Window {
    chrome: typeof chrome;
  }
}

export interface FacebookEvent {
  id: string;
  title?: string;
  date?: string;
  location?: string;
  description?: string;
  image?: string;
  link?: string;
  isPublic?: boolean;
  fetchedAt?: string;
  category?: 'upcoming' | 'past';
}

export interface EventDetails {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  link: string;
  isPublic: boolean;
}

export interface SaveFileMessage {
  type: 'SAVE_FILE';
  filename: string;
  content: string;
  data?: any;
}

export interface StorageData {
  events: FacebookEvent[];
  lastUpdate: string;
}

export interface BatchProgress {
  total: number;
  processed: number;
  success: number;
  currentBatch: number;
  totalBatches: number;
}

export interface EventLinks {
  upcoming: string[];
  past: string[];
}

// Chrome message types
export interface ChromeMessage {
  action: 'extractEventDetails' | 'findEventLinks';
}

export interface ChromeMessageResponse {
  data?: any;
  error?: string;
} 