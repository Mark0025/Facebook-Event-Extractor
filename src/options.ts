import { FacebookEvent } from './types';

// DOM Elements
const batchSizeInput = document.getElementById('batchSize') as HTMLInputElement;
const concurrentLimitInput = document.getElementById('concurrentLimit') as HTMLInputElement;
const delayMinInput = document.getElementById('delayMin') as HTMLInputElement;
const delayMaxInput = document.getElementById('delayMax') as HTMLInputElement;
const clearStorageButton = document.getElementById('clearStorage') as HTMLButtonElement;
const exportEventsButton = document.getElementById('exportEvents') as HTMLButtonElement;
const storageStatus = document.getElementById('storageStatus') as HTMLElement;
const versionDisplay = document.getElementById('version') as HTMLElement;

// Default values
const DEFAULT_SETTINGS = {
  batchSize: 50,
  concurrentLimit: 2,
  delayMin: 3,
  delayMax: 7
};

// Load settings
async function loadSettings(): Promise<void> {
  try {
    const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    
    batchSizeInput.value = result.batchSize.toString();
    concurrentLimitInput.value = result.concurrentLimit.toString();
    delayMinInput.value = result.delayMin.toString();
    delayMaxInput.value = result.delayMax.toString();
    
    // Update version display
    versionDisplay.textContent = chrome.runtime.getManifest().version;
  } catch (error) {
    console.error('Error loading settings:', error);
    showStatus('Error loading settings', 'error');
  }
}

// Save settings
async function saveSettings(): Promise<void> {
  try {
    const settings = {
      batchSize: parseInt(batchSizeInput.value),
      concurrentLimit: parseInt(concurrentLimitInput.value),
      delayMin: parseInt(delayMinInput.value),
      delayMax: parseInt(delayMaxInput.value)
    };
    
    await chrome.storage.sync.set(settings);
    showStatus('Settings saved successfully', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus('Error saving settings', 'error');
  }
}

// Clear storage
async function clearStorage(): Promise<void> {
  try {
    await chrome.storage.local.clear();
    showStatus('Storage cleared successfully', 'success');
  } catch (error) {
    console.error('Error clearing storage:', error);
    showStatus('Error clearing storage', 'error');
  }
}

// Export events
async function exportEvents(): Promise<void> {
  try {
    const result = await chrome.storage.local.get(['events']);
    if (!result.events) {
      showStatus('No events to export', 'error');
      return;
    }
    
    const events = result.events as FacebookEvent[];
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `152-events-${timestamp}.json`;
    
    await chrome.downloads.download({
      url,
      filename,
      saveAs: true
    });
    
    showStatus('Events exported successfully', 'success');
  } catch (error) {
    console.error('Error exporting events:', error);
    showStatus('Error exporting events', 'error');
  }
}

// Show status message
function showStatus(message: string, type: 'success' | 'error'): void {
  storageStatus.textContent = message;
  storageStatus.className = `status ${type}`;
  storageStatus.style.display = 'block';
  
  setTimeout(() => {
    storageStatus.style.display = 'none';
  }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  
  // Save settings when inputs change
  [batchSizeInput, concurrentLimitInput, delayMinInput, delayMaxInput].forEach(input => {
    input.addEventListener('change', saveSettings);
  });
  
  // Clear storage button
  clearStorageButton.addEventListener('click', clearStorage);
  
  // Export events button
  exportEventsButton.addEventListener('click', exportEvents);
}); 