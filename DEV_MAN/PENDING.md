# Pending Tasks: Message Handling Improvement

## Current Issue
- Extraction fails with "Invalid message format" error
- UI shows "Extract Events Pause"
- Inconsistent message handling between components

## Solution: @extend-chrome/messages Integration

### Phase 1: Message Type Definition
```typescript
// src/types/messages.ts
import type { EventDetails } from './types';

export type Messages = {
  // Popup -> Content Script
  EXTRACT_EVENTS: { url: string };
  PAUSE_EXTRACTION: void;
  RESUME_EXTRACTION: void;
  
  // Content Script -> Background
  EVENT_EXTRACTED: { event: EventDetails };
  EXTRACTION_ERROR: { error: string; context?: Record<string, unknown> };
  EXTRACTION_PROGRESS: { 
    total: number;
    processed: number;
    currentUrl: string;
  };
  
  // Background -> Popup
  EXTRACTION_COMPLETE: { 
    success: boolean;
    totalEvents: number;
    errors?: string[];
  };
};
```

### Phase 2: Implementation Steps

#### Step 1: Add Dependencies
```bash
pnpm add @extend-chrome/messages
```

#### Step 2: Create Message Handlers
```typescript
// src/utils/messageHandlers.ts
import { createMessageHandler } from '@extend-chrome/messages';
import type { Messages } from '../types/messages';

export const createHandlers = () => {
  return createMessageHandler<Messages>({
    EXTRACT_EVENTS: async (message) => {
      // Implementation
    },
    EVENT_EXTRACTED: async (message) => {
      // Implementation
    },
    // ... other handlers
  });
};
```

#### Step 3: Component Updates

##### Popup.ts
```typescript
// Before
chrome.tabs.sendMessage(tab.id!, { type: 'EXTRACT_EVENTS' });

// After
import { sendMessage } from '@extend-chrome/messages';
await sendMessage('EXTRACT_EVENTS', { url: currentUrl });
```

##### Content.ts
```typescript
// Before
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Implementation
});

// After
import { createHandlers } from '../utils/messageHandlers';
const handlers = createHandlers();
```

##### Background.ts
```typescript
// Before
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Implementation
});

// After
import { createHandlers } from '../utils/messageHandlers';
const handlers = createHandlers();
```

### Phase 3: Testing Strategy

1. **Unit Tests**
   - Test message type validation
   - Test handler functions
   - Test error scenarios

2. **Integration Tests**
   - Test message flow between components
   - Test error propagation
   - Test state management

3. **Manual Testing**
   - Test on Facebook events page
   - Test error scenarios
   - Test UI feedback

### Phase 4: Rollout Plan

1. **Development**
   - Implement changes in feature branch
   - Run all tests
   - Code review

2. **Staging**
   - Test in development environment
   - Verify all message flows
   - Check error handling

3. **Production**
   - Deploy to Chrome Web Store
   - Monitor error rates
   - Gather user feedback

## Breaking Changes Prevention

1. **Backward Compatibility**
   - Keep old message format support
   - Add version checking
   - Graceful degradation

2. **Feature Flags**
   ```typescript
   const USE_NEW_MESSAGING = false; // Toggle for rollout
   
   if (USE_NEW_MESSAGING) {
     await sendMessage('EXTRACT_EVENTS', { url: currentUrl });
   } else {
     chrome.tabs.sendMessage(tab.id!, { type: 'EXTRACT_EVENTS' });
   }
   ```

3. **Error Boundaries**
   ```typescript
   try {
     await sendMessage('EXTRACT_EVENTS', { url: currentUrl });
   } catch (error) {
     // Fallback to old implementation
     chrome.tabs.sendMessage(tab.id!, { type: 'EXTRACT_EVENTS' });
   }
   ```

## Success Metrics

1. **Error Reduction**
   - Track "Invalid message format" errors
   - Monitor extraction success rate
   - Measure UI responsiveness

2. **Performance**
   - Message processing time
   - Memory usage
   - CPU utilization

3. **User Experience**
   - Extraction success rate
   - Error message clarity
   - UI feedback accuracy

## Rollback Plan

1. **Quick Rollback**
   ```bash
   git checkout <previous-commit>
   pnpm run build
   ```

2. **Feature Flag Toggle**
   ```typescript
   const USE_NEW_MESSAGING = false; // Disable new implementation
   ```

3. **Version Control**
   - Tag releases
   - Keep release notes
   - Document breaking changes

## Timeline

1. **Week 1**
   - Message type definition
   - Basic implementation
   - Unit tests

2. **Week 2**
   - Integration tests
   - Feature flags
   - Error boundaries

3. **Week 3**
   - Staging deployment
   - Performance testing
   - User feedback

4. **Week 4**
   - Production rollout
   - Monitoring
   - Optimization 