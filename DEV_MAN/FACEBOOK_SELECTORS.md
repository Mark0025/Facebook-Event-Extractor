# Facebook DOM Structure Guide (March 2024)

## Current DOM Structure

### Event Container
```html
<!-- Main events container -->
<div role="main">
  <!-- Event card -->
  <div class="x78zum5 x1n2onr6..." role="article">
    <!-- Event content structure -->
  </div>
</div>
```

## Key Selectors (Updated)

### 1. Event Cards
```typescript
const EVENT_SELECTORS = {
  // Main container for all events
  container: '[role="main"]',
  
  // Individual event cards
  cards: '[role="article"]',
  
  // Event title (from screenshot)
  title: 'h2.html-h2.xdj266r.x11i5rnm.xat24cr.x1mh8g0r',
  
  // Event date/time (observed in screenshot)
  dateTime: '[class*="x1lw1t62"]',
  
  // Event location
  location: '[class*="x1h8yyo"]',
  
  // Event link
  link: 'a[href*="/events/"]',
  
  // Event image
  image: 'img[src*="scontent"]'
};
```

## Selector Testing Script
```javascript
// Paste this in DevTools console when on events page
function testFacebookSelectors() {
  const results = {};
  
  // Test each selector
  for (const [key, selector] of Object.entries(EVENT_SELECTORS)) {
    const elements = document.querySelectorAll(selector);
    results[key] = {
      found: elements.length,
      sample: Array.from(elements).slice(0, 2).map(el => ({
        text: el.textContent?.trim(),
        classes: el.className,
        attributes: Object.fromEntries(
          Array.from(el.attributes).map(attr => [attr.name, attr.value])
        )
      }))
    };
  }
  
  console.table(results);
}
```

## Facebook-Specific Class Patterns

### 1. Stable Classes (Don't change often)
- `role="article"` - Event container
- `role="main"` - Main content area
- `html-h2` - Heading style

### 2. Dynamic Classes (Change frequently)
- `x78zum5` - Layout classes
- `x1n2onr6` - Positioning classes
- `x1lw1t62` - Text styling classes

## Data Extraction Patterns

### 1. Event ID Extraction
```typescript
function extractEventId(element: Element): string | null {
  const link = element.querySelector('a[href*="/events/"]');
  const href = link?.getAttribute('href') || '';
  const match = href.match(/\/events\/(\d+)/);
  return match ? match[1] : null;
}
```

### 2. Date/Time Extraction
```typescript
function extractDateTime(element: Element): { date: string, time: string } | null {
  const dateElement = element.querySelector('[class*="x1lw1t62"]');
  if (!dateElement) return null;
  
  const text = dateElement.textContent || '';
  // Facebook format: "DAY at TIME" or "DATE at TIME"
  const parts = text.split(' at ');
  
  return {
    date: parts[0] || '',
    time: parts[1] || ''
  };
}
```

### 3. Location Extraction
```typescript
function extractLocation(element: Element): string | null {
  const locationElement = element.querySelector('[class*="x1h8yyo"]');
  return locationElement?.textContent?.trim() || null;
}
```

## Validation Checks

### 1. Required Fields
```typescript
function validateEventData(data: EventDetails): boolean {
  const required = ['id', 'title', 'date'];
  return required.every(field => !!data[field]);
}
```

### 2. Format Validation
```typescript
function validateEventFormat(data: EventDetails): ValidationResult {
  return {
    hasValidId: /^\d+$/.test(data.id),
    hasValidDate: /^[A-Za-z]+,?\s+[A-Za-z]+\s+\d+$/.test(data.date),
    hasValidTime: /^\d{1,2}:\d{2}\s*(?:AM|PM)$/i.test(data.time),
    hasValidTitle: data.title.length > 0 && data.title.length < 200
  };
}
```

## Common Issues

### 1. Missing Events
- Check if scrolling is triggering lazy loading
- Verify event container is present
- Check for Facebook's loading states

### 2. Wrong Data
- Verify selector specificity
- Check for nested elements with similar classes
- Validate text content normalization

### 3. Rate Limiting
- Monitor network requests
- Check for Facebook's error responses
- Implement exponential backoff

## Testing Procedure

1. Open Facebook events page
2. Open DevTools (Elements panel)
3. Run selector testing script
4. Verify each selector's results
5. Update selectors if needed
6. Test data extraction
7. Validate results 