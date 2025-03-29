# Troubleshooting Guide

## Event Information Not Being Retrieved

### Common Causes

1. **Facebook DOM Structure Changes**
   - Facebook frequently updates their DOM structure
   - Current selectors might be outdated
   - Solution: Update selectors in `content.ts`

2. **Rate Limiting Issues**
   - Facebook might be blocking requests
   - Too many concurrent requests
   - Solution: Adjust rate limits and delays

3. **Content Script Injection**
   - Content script might not be properly injected
   - Timing issues with DOM loading
   - Solution: Check content script injection timing

### Debugging Steps

1. **Check Console Logs**
   ```javascript
   // Add these logs in content.ts
   console.log('DOM Structure:', document.body.innerHTML);
   console.log('Event Elements:', document.querySelectorAll('[role="article"]'));
   ```

2. **Verify Selectors**
   ```javascript
   // Test each selector individually
   const title = document.querySelector('h1')?.textContent;
   const date = document.querySelector('[aria-label="Event date and time"]')?.textContent;
   console.log('Extracted Data:', { title, date });
   ```

3. **Check Network Requests**
   - Open Chrome DevTools
   - Go to Network tab
   - Look for failed requests
   - Check response headers for rate limiting

4. **Verify Content Script Injection**
   ```javascript
   // Add to content.ts
   console.log('Content script loaded at:', new Date().toISOString());
   ```

### Solutions

1. **Update Selectors**
   ```typescript
   // In content.ts
   function extractEventDetails(): EventDetails {
     // Add more robust selectors
     const selectors = {
       title: ['h1', '[data-testid="event_title"]', '.event-title'],
       date: ['[aria-label="Event date and time"]', '[data-testid="event_time"]'],
       location: ['[aria-label="Event location"]', '[data-testid="event_location"]'],
       description: ['[data-ad-preview="message"]', '.event-description']
     };

     // Try each selector
     const title = selectors.title
       .map(selector => document.querySelector(selector)?.textContent)
       .find(text => text) || '';
     
     // ... similar for other fields
   }
   ```

2. **Improve Rate Limiting**
   ```typescript
   // In popup.ts
   const RATE_LIMIT = {
     HOURLY: 800, // Reduce from 1000
     BATCH_SIZE: 25, // Reduce from 50
     DELAY_MIN: 5000, // Increase from 3000
     DELAY_MAX: 10000 // Increase from 7000
   };
   ```

3. **Better Error Handling**
   ```typescript
   // In content.ts
   async function extractEventDetails(): Promise<EventDetails> {
     try {
       // Add timeout
       const timeout = new Promise((_, reject) => 
         setTimeout(() => reject(new Error('Timeout')), 10000)
       );

       const details = await Promise.race([
         extractDetails(),
         timeout
       ]);

       return details;
     } catch (error) {
       console.error('Extraction failed:', error);
       throw error;
     }
   }
   ```

4. **Add Retry Logic**
   ```typescript
   // In popup.ts
   async function processEventWithRetry(eventId: string, maxRetries = 3): Promise<FacebookEvent | null> {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await processEvent(eventId);
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await randomDelay(5000, 10000);
       }
     }
     return null;
   }
   ```

### Monitoring

1. **Add Performance Metrics**
   ```typescript
   // In popup.ts
   const metrics = {
     startTime: Date.now(),
     processedEvents: 0,
     failedEvents: 0,
     totalTime: 0
   };
   ```

2. **Enhanced Logging**
   ```typescript
   // In content.ts
   function logExtractionAttempt(selector: string, found: boolean, value: string) {
     console.log({
       selector,
       found,
       value,
       timestamp: new Date().toISOString()
     });
   }
   ```

### Prevention

1. **Regular Selector Updates**
   - Monitor Facebook's DOM changes
   - Update selectors monthly
   - Maintain a selector version history

2. **Progressive Enhancement**
   ```typescript
   // In content.ts
   function getElementByMultipleSelectors(selectors: string[]): Element | null {
     for (const selector of selectors) {
       const element = document.querySelector(selector);
       if (element) return element;
     }
     return null;
   }
   ```

3. **Health Checks**
   ```typescript
   // In popup.ts
   async function checkExtensionHealth(): Promise<boolean> {
     try {
       const response = await chrome.runtime.sendMessage({ action: 'healthCheck' });
       return response.healthy;
     } catch (error) {
       console.error('Health check failed:', error);
       return false;
     }
   }
   ``` 