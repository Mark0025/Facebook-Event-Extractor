// This file is empty as we're using the popup.js to inject our script
// The content script is required by the manifest but we don't need any initialization 

// Content script for event extraction
console.log('152 Bar Events Extractor: Content script loaded');

import { debugContent, logError } from './utils/debug.js';
import type { EventDetails } from './types';

interface EventData {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl?: string;
}

class EventExtractor {
  private static instance: EventExtractor;
  private eventElements = new Map<string, HTMLElement>();

  private constructor() {
    debugContent('Initializing EventExtractor');
  }

  public static getInstance(): EventExtractor {
    if (!EventExtractor.instance) {
      EventExtractor.instance = new EventExtractor();
    }
    return EventExtractor.instance;
  }

  public async findEventLinks(): Promise<{ upcoming: string[]; past: string[] }> {
    debugContent('Finding event links');
    try {
      const upcomingEvents = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="/events/"]'))
        .map(a => this.extractEventId(a.href))
        .filter((id): id is string => id !== null);

      const pastEvents = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="/past_events/"]'))
        .map(a => this.extractEventId(a.href))
        .filter((id): id is string => id !== null);

      debugContent('Found event links', { upcoming: upcomingEvents.length, past: pastEvents.length });
      return { upcoming: upcomingEvents, past: pastEvents };
    } catch (error) {
      logError(error, { action: 'findEventLinks' });
      return { upcoming: [], past: [] };
    }
  }

  private extractEventId(url: string): string | null {
    try {
      const match = url.match(/\/events\/(\d+)/);
      return match ? match[1] : null;
    } catch (error) {
      logError(error, { action: 'extractEventId', url });
      return null;
    }
  }

  public async extractEventDetails(): Promise<EventDetails> {
    debugContent('Extracting event details');
    try {
      const id = window.location.pathname.split('/').pop() || '';
      const title = this.extractText('[data-testid="event-title"]');
      const date = this.extractText('[data-testid="event-details-time"]');
      const location = this.extractText('[data-testid="event-details-location"]');
      const description = this.extractText('[data-testid="event-details-description"]');
      const image = this.extractImageUrl('[data-testid="event-details-image"]') || '';
      const link = window.location.href;
      const isPublic = this.checkIsPublic();

      const details: EventDetails = {
        id,
        title,
        date,
        location,
        description,
        image,
        link,
        isPublic
      };

      debugContent('Extracted event details', details);
      return details;
    } catch (error) {
      logError(error, { action: 'extractEventDetails' });
      throw error;
    }
  }

  private extractText(selector: string): string {
    const element = document.querySelector(selector);
    return element?.textContent?.trim() || '';
  }

  private extractImageUrl(selector: string): string | undefined {
    const element = document.querySelector(selector);
    return element instanceof HTMLImageElement ? element.src : undefined;
  }

  private checkIsPublic(): boolean {
    // Check for privacy indicator elements
    const privateIndicator = document.querySelector('[data-testid="event-privacy-badge"]');
    return !privateIndicator;
  }
}

// Initialize the content script
debugContent('Content script loaded');
const extractor = EventExtractor.getInstance();

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  debugContent('Received message', message);
  
  try {
    switch (message.type) {
      case 'FIND_EVENT_LINKS':
        extractor.findEventLinks().then(sendResponse);
        return true; // Keep the message channel open for async response
        
      case 'EXTRACT_EVENT_DETAILS':
        extractor.extractEventDetails().then(sendResponse);
        return true; // Keep the message channel open for async response
        
      default:
        debugContent('Unknown message type', message);
        sendResponse({ error: 'Unknown message type' });
        return false; // No async response needed
    }
  } catch (error) {
    logError(error, { action: 'messageHandler', message });
    sendResponse({ error: 'Error processing message' });
    return false; // No async response needed
  }
}); 