# Chrome DevTools Guide for Event Extraction Debugging

## Required Setup

1. **Extension Development Mode**
   ```bash
   # Load unpacked extension in Chrome
   1. Open Chrome Extensions (chrome://extensions/)
   2. Enable Developer Mode
   3. Load unpacked extension from 'dist' directory
   ```

2. **DevTools Access**
   - Right-click extension icon → Inspect popup
   - Open DevTools on Facebook page (Cmd+Opt+I on Mac, Ctrl+Shift+I on Windows)
   - Enable source maps in DevTools settings

## Key DevTools Panels

### 1. Elements Panel
**Purpose**: Inspect Facebook's DOM structure for events

**Required Information**:
```typescript
// Current event selectors to verify
const SELECTORS = {
  eventContainer: '[role="main"]',
  eventCards: '[role="article"]',
  eventTitle: 'h2.html-h2',
  eventDate: '[class*="x1lw1t62"]', // Time component class
  eventLocation: '[class*="x1h8yyo"]' // Location component class
}
```

**Steps**:
1. Use Elements picker (🔍) to inspect event elements
2. Note any class name patterns
3. Verify selector stability across different events
4. Document any Facebook-specific class naming patterns

### 2. Console Panel
**Required Logging**:
```typescript
// Add to content.ts
console.group('Event Extraction Debug');
console.log('🔍 DOM Ready:', document.readyState);
console.log('📍 Current URL:', window.location.href);
console.log('🎯 Event Elements Found:', document.querySelectorAll('[role="article"]').length);
console.groupEnd();
```

**Debugging Commands**:
```javascript
// Paste in Console to test selectors
function testSelector(selector) {
  const elements = document.querySelectorAll(selector);
  console.log({
    selector,
    found: elements.length,
    elements: Array.from(elements).map(el => ({
      text: el.textContent,
      classes: el.className
    }))
  });
}
```

### 3. Network Panel
**What to Monitor**:
1. Facebook API calls during scroll
2. Rate limiting headers
3. Request patterns

**Filter Setup**:
```
- Filter: XHR
- Pattern: *events*
- Status: Focus on 429 (Rate Limit) responses
```

### 4. Application Panel
**Storage Monitoring**:
1. Extension Storage
   - Check cached events
   - Verify progress state
2. Local Storage
   - Monitor Facebook's state management
   - Track session data

## Debugging Workflow

### 1. Event Discovery Phase
```typescript
// Add to content.ts for debugging
function debugEventDiscovery() {
  const eventElements = document.querySelectorAll('[role="article"]');
  console.table(Array.from(eventElements).map(el => ({
    id: el.getAttribute('id'),
    type: el.getAttribute('role'),
    childCount: el.children.length,
    hasImage: !!el.querySelector('img'),
    hasLink: !!el.querySelector('a[href*="/events/"]')
  })));
}
```

### 2. Data Extraction Phase
```typescript
// Add to content.ts
function debugEventExtraction(element) {
  const data = {};
  for (const [key, selectors] of Object.entries(SELECTORS)) {
    const results = selectors.map(selector => ({
      selector,
      element: element.querySelector(selector),
      text: element.querySelector(selector)?.textContent?.trim()
    }));
    data[key] = results;
  }
  console.table(data);
}
```

### 3. Performance Monitoring
```typescript
// Add to popup.ts
const PERF_MARKS = {
  START: 'extraction-start',
  BATCH_START: 'batch-start',
  BATCH_END: 'batch-end',
  END: 'extraction-end'
};

performance.mark(PERF_MARKS.START);
// ... after completion
performance.measure('Total Extraction Time', PERF_MARKS.START, PERF_MARKS.END);
```

## Common Issues & Solutions

### 1. Missing Events
**Debug Steps**:
1. Check scroll position tracking
2. Verify lazy loading triggers
3. Monitor DOM mutations

```typescript
// Add to content.ts
const observer = new MutationObserver((mutations) => {
  console.log('DOM Updated:', mutations.map(m => ({
    type: m.type,
    target: m.target,
    addedNodes: m.addedNodes.length
  })));
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

### 2. Incorrect Data
**Validation Steps**:
1. Compare extracted vs visible data
2. Check text normalization
3. Verify date parsing

```typescript
// Add to content.ts
function validateEventData(extracted: EventDetails, element: Element) {
  const visible = {
    title: element.querySelector('h2')?.innerText,
    date: element.querySelector('[class*="x1lw1t62"]')?.innerText,
    // ... other fields
  };

  console.table({
    field: Object.keys(extracted),
    extracted: Object.values(extracted),
    visible: Object.values(visible),
    matches: Object.keys(extracted).map(k => extracted[k] === visible[k])
  });
}
```

## Required Information for Support

When reporting issues, provide:
1. Console logs with group 'Event Extraction Debug'
2. Network requests log for failed extractions
3. Screenshot of Elements panel showing event structure
4. Performance measurements for the extraction process
5. Current selector success rates from validation 