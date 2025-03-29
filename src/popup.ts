import { FacebookEvent, EventDetails, BatchProgress, SaveFileMessage } from './types';
import { Logger } from './utils/logger';
import { extractEventDetails, findEventLinks } from './messages';
import { debugPopup, logError, logState } from './utils/debug';

const logger = Logger.getInstance();

// Constants
const CONFIG = {
  HOURLY_LIMIT: 1000,
  BATCH_SIZE: 50,
  CONCURRENT_LIMIT: 2,
  DELAY: {
    MIN: 3000,
    MAX: 7000
  }
} as const;

// Update the EventLinks interface inline since it's only used in this file
interface EventLinks {
  upcoming: string[];
  past: string[];
}

// State management
class ExtractorState {
  private static instance: ExtractorState;
  private eventLinks: EventLinks = { upcoming: [], past: [] };
  private events: FacebookEvent[] = [];
  private eventElements = new Map<string, HTMLElement>();
  private _isPaused = false;
  private requestCount = 0;
  private successCount = 0;
  private processedCount = 0;
  private currentBatchIndex = 0;
  private existingEvents = new Map<string, FacebookEvent>();
  private currentBatchPromise: Promise<FacebookEvent[]> | null = null;

  private constructor() {
    debugPopup('Initializing ExtractorState');
  }

  static getInstance(): ExtractorState {
    if (!ExtractorState.instance) {
      ExtractorState.instance = new ExtractorState();
    }
    return ExtractorState.instance;
  }

  // Getters and setters
  getEventIds(): EventLinks { 
    debugPopup('Getting event IDs', { eventLinks: this.eventLinks });
    return this.eventLinks; 
  }
  
  setEventIds(links: EventLinks): void { 
    logState('popup', { eventLinks: links });
    this.eventLinks = links; 
  }
  
  isPaused(): boolean { 
    debugPopup('Checking pause state', { isPaused: this._isPaused });
    return this._isPaused; 
  }
  
  togglePause(): void {
    this._isPaused = !this._isPaused;
    logState('popup', { isPaused: this._isPaused });
  }
}

// UI Controller
class UIController {
  private elements: {
    status: HTMLElement;
    progressBar: HTMLElement;
    progressText: HTMLElement;
    eventList: HTMLElement;
    extractButton: HTMLButtonElement;
    totalEvents: HTMLElement;
    processedEvents: HTMLElement;
    successRate: HTMLElement;
    pauseButton: HTMLButtonElement;
  };

  constructor() {
    debugPopup('Initializing UIController');
    this.elements = {
      status: document.getElementById('status') as HTMLElement,
      progressBar: document.getElementById('progressBar') as HTMLElement,
      progressText: document.getElementById('progressText') as HTMLElement,
      eventList: document.getElementById('eventList') as HTMLElement,
      extractButton: document.getElementById('extractEvents') as HTMLButtonElement,
      totalEvents: document.getElementById('totalEvents') as HTMLElement,
      processedEvents: document.getElementById('processedEvents') as HTMLElement,
      successRate: document.getElementById('successRate') as HTMLElement,
      pauseButton: document.getElementById('pauseButton') as HTMLButtonElement
    };

    this.initializeEventListeners();
    debugPopup('UIController initialized successfully');
  }

  private initializeEventListeners(): void {
    debugPopup('Initializing event listeners');
    // Use AbortController for cleanup
    const controller = new AbortController();
    const { signal } = controller;

    this.elements.extractButton.addEventListener('click', () => this.handleExtractClick(), { signal });
    this.elements.pauseButton.addEventListener('click', () => this.handlePauseClick(), { signal });

    // Cleanup on popup close
    window.addEventListener('unload', () => {
      debugPopup('Cleaning up event listeners');
      controller.abort();
    }, { once: true });
  }

  private async handleExtractClick(): Promise<void> {
    debugPopup('Extract button clicked');
    try {
      this.elements.extractButton.disabled = true;
      this.log('Starting extraction...', 'info');
      await this.startExtraction();
    } catch (error) {
      logError(error, { namespace: 'popup', action: 'handleExtractClick' });
      this.log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      this.elements.extractButton.disabled = false;
    }
  }

  private async startExtraction(): Promise<void> {
    debugPopup('Starting event extraction');
    const state = ExtractorState.getInstance();
    
    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) {
        throw new Error('No active tab found');
      }
      debugPopup('Found active tab', { tabId: tab.id });

      // Find event links
      const eventIds = await this.findEventLinks(tab.id);
      state.setEventIds(eventIds);
      debugPopup('Found event links', eventIds);

      // Start processing events
      await this.processEvents();
    } catch (error) {
      logError('popup', error, { action: 'startExtraction' });
      this.log(`Extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  }

  private async findEventLinks(tabId: number): Promise<EventLinks> {
    debugPopup('Finding event links', { tabId });
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });

    const eventLinks = await findEventLinks();
    debugPopup('Received event links response', { eventLinks });
    return eventLinks;
  }

  private handlePauseClick(): void {
    const state = ExtractorState.getInstance();
    state.togglePause();
    this.elements.pauseButton.textContent = state.isPaused() ? 'Resume' : 'Pause';
    this.log(state.isPaused() ? 'Processing paused' : 'Processing resumed', 'info');
  }

  public log(message: string, level: 'info' | 'error' | 'warn' | 'debug' = 'info'): void {
    const status = this.elements.status;
    status.textContent = message;
    status.className = `status ${level}`;
    logger[level](message);
  }

  public updateStats(total: number, processed: number, success: number): void {
    this.elements.totalEvents.textContent = total.toString();
    this.elements.processedEvents.textContent = processed.toString();
    const rate = total > 0 ? Math.round((success / total) * 100) : 0;
    this.elements.successRate.textContent = `${rate}%`;
  }

  public updateProgress(percent: number): void {
    this.elements.progressBar.style.width = `${percent}%`;
    this.elements.progressText.textContent = `${Math.round(percent)}%`;
  }

  private async processEvents(): Promise<void> {
    debugPopup('Starting event processing');
    const state = ExtractorState.getInstance();
    const eventLinks = state.getEventIds();
    
    // Process upcoming events first
    if (eventLinks.upcoming.length > 0) {
      debugPopup(`Processing ${eventLinks.upcoming.length} upcoming events`);
      await this.processEventBatch(eventLinks.upcoming, 'upcoming');
    }
    
    // Then process past events
    if (eventLinks.past.length > 0) {
      debugPopup(`Processing ${eventLinks.past.length} past events`);
      await this.processEventBatch(eventLinks.past, 'past');
    }
  }

  private async processEventBatch(eventIds: string[], category: 'upcoming' | 'past'): Promise<void> {
    debugPopup('Processing event batch', { eventIds, category });
    // Process events in batches
    for (let i = 0; i < eventIds.length; i += CONFIG.BATCH_SIZE) {
      const batch = eventIds.slice(i, i + CONFIG.BATCH_SIZE);
      await this.processBatch(batch, category);
      
      // Update progress
      const progress = (i + batch.length) / eventIds.length * 100;
      this.updateProgress(progress);
      
      // Respect rate limits
      await this.delay(CONFIG.DELAY.MIN, CONFIG.DELAY.MAX);
    }
  }

  private async processBatch(eventIds: string[], category: 'upcoming' | 'past'): Promise<void> {
    debugPopup('Processing batch', { eventIds, category });
    const promises = eventIds.map(id => this.processEvent(id, category));
    await Promise.all(promises);
  }

  private async processEvent(eventId: string, category: 'upcoming' | 'past'): Promise<void> {
    debugPopup('Processing event', { eventId, category });
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) throw new Error('No active tab');

      // Navigate to event page
      await chrome.tabs.update(tab.id, { url: `https://www.facebook.com/events/${eventId}` });
      debugPopup('Navigated to event page', { eventId });
      
      // Wait for page load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract details using new message handler
      const details = await extractEventDetails();
      debugPopup('Extracted event details', { eventId, details });
      
      // Update UI
      this.updateEventStatus(eventId, 'success', category);
      
      // Store event
      await this.storeEvent(details);
      debugPopup('Successfully processed event', { eventId, category });
    } catch (error) {
      debugPopup('Error processing event', { eventId, category, error });
      this.updateEventStatus(eventId, 'error', category);
      this.log(`Error processing event ${eventId}: ${error}`, 'error');
    }
  }

  private updateEventStatus(eventId: string, status: 'success' | 'error', category: 'upcoming' | 'past'): void {
    debugPopup('Updating event status', { eventId, status, category });
    const eventItem = document.querySelector(`[data-event-id="${eventId}"]`);
    if (eventItem) {
      eventItem.classList.remove('status-pending', 'status-success', 'status-error');
      eventItem.classList.add(`status-${status}`);
      eventItem.setAttribute('data-category', category);
    }
  }

  private async delay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    debugPopup('Applying delay', { delay });
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private async storeEvent(event: FacebookEvent): Promise<void> {
    debugPopup('Storing event', { event });
    try {
      const result = await chrome.storage.local.get(['events']);
      const events = result.events || [];
      events.push(event);
      await chrome.storage.local.set({ events });
      debugPopup('Successfully stored event', { eventId: event.id });
    } catch (error) {
      debugPopup('Error storing event', error);
      throw error;
    }
  }
}

// Initialize the popup
document.addEventListener('DOMContentLoaded', () => {
  debugPopup('DOM Content Loaded');
  try {
    const ui = new UIController();
    debugPopup('UIController initialized successfully');
  } catch (error) {
    logError('popup', error, { action: 'popupInitialization' });
  }
});

// Add a direct console log to verify script loading
debugPopup('Popup script loaded'); 