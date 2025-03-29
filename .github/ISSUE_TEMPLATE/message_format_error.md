---
name: Message Format Error in Event Extraction
about: Investigate and fix the "Invalid message format" error during event extraction
title: 'Extraction failed: Invalid message format'
labels: bug, high-priority
assignees: ''

---

**Describe the bug**
The extension fails to extract events with the error "Invalid message format" and shows "Extract Events Pause" in the UI. This suggests a mismatch between the message format expected by the content script and what's being sent from the popup.

**To Reproduce**
1. Load the extension in Chrome
2. Navigate to 152 Bar's Facebook events page
3. Click the extension icon to open popup
4. Click "Extract Events"
5. Observe the error message

**Expected behavior**
- Extension should successfully extract events from the Facebook page
- Progress should be shown in the popup
- Events should be saved to the extracted-events directory

**Current behavior**
- Extraction fails immediately with "Invalid message format" error
- UI shows "Extract Events Pause"
- No events are extracted or saved

**Technical Context**
- Browser version: Chrome 122
- Extension version: 1.4.0
- Facebook page URL: https://www.facebook.com/152bar/events
- Using @extend-chrome/messages package for message handling

**Related Code**
```typescript
// src/popup.ts
// Message sending code
chrome.tabs.sendMessage(tab.id!, { type: 'EXTRACT_EVENTS' });

// src/content.ts
// Message handling code
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  debugContent('Received message', message);
  // ...
});
```

**Additional context**
- We're using @extend-chrome/messages package for message handling
- The error suggests the message format doesn't match what the content script expects
- Need to verify message type constants are consistent between popup and content script

**Investigation Steps**
1. [ ] Verify message type constants match between popup and content script
2. [ ] Check @extend-chrome/messages package implementation
3. [ ] Review message passing implementation in both popup and content script
4. [ ] Add detailed logging for message format validation
5. [ ] Consider implementing message type validation using TypeScript

**Screenshots**
[Add screenshots of the error message and UI state] 