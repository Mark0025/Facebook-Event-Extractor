# Facebook Event Scraping Guidelines

## General Rules

1. **Only Public Data**
   - Only scrape publicly available event information
   - Do not attempt to access private events
   - Respect "Friends Only" and other privacy settings

2. **Rate Limiting**
   - Implement delays between requests (3-7 seconds)
   - Maximum 1000 requests per hour
   - Maximum 100,000 requests per day
   - Use exponential backoff if encountering errors

3. **Data Usage**
   - Only collect necessary information
   - Do not store personal user data
   - Focus on event details: title, date, location, description
   - Respect copyright for images and content

## Best Practices

### Timing and Delays
```javascript
// Example delay implementation
const delay = Math.floor(Math.random() * (7000 - 3000) + 3000); // 3-7 seconds
```

- Minimum 3 seconds between requests
- Random delays to appear more natural
- Longer delays (15-30s) after every 50 requests
- Maximum 2 concurrent connections

### Data Collection
- Essential event fields only:
  - Event ID
  - Title
  - Date/Time
  - Location
  - Description (if public)
  - Event Image URL
  - Event URL

### Error Handling
- Implement proper error handling
- Respect HTTP status codes
- Back off on 429 (Too Many Requests)
- Log all errors for monitoring

## Technical Implementation

### Headers
```javascript
// Required headers
{
  'User-Agent': 'Mozilla/5.0 ...',  // Use a real browser UA
  'Accept': 'text/html,application/xhtml+xml...',
  'Accept-Language': 'en-US,en;q=0.9'
}
```

### Storage
- Store data in structured format (JSON)
- Include timestamp of collection
- Keep audit logs of all requests
- Regular cleanup of old data

## Ethical Considerations

1. **Purpose**
   - Only collect data for legitimate business purposes
   - Be transparent about data usage
   - Don't use data for spam or harassment

2. **Resource Usage**
   - Minimize server load
   - Don't interfere with normal site operation
   - Stop if receiving consistent errors

3. **Data Retention**
   - Only keep necessary data
   - Regular cleanup of old records
   - Secure storage of collected data

## Facebook's Terms

1. **Automated Collection**
   - Must respect robots.txt
   - No excessive automated requests
   - Must identify as a bot when required

2. **Content Usage**
   - Public events only
   - No collection of user data
   - Respect copyright and ownership

3. **API Alternatives**
   - Consider using official Graph API
   - Apply for proper API access when possible
   - Stay updated with policy changes

## Monitoring and Compliance

1. **Logging**
   - Keep detailed logs of all requests
   - Monitor error rates
   - Track rate limits

2. **Updates**
   - Regular checks for policy changes
   - Update scraping patterns as needed
   - Maintain documentation

3. **Emergency Stop**
   - Implement kill switch
   - Stop on consistent errors
   - Pause on unusual responses

## Current Implementation

Our extension follows these guidelines by:
- Using 5s page load delay
- 3s between requests
- Only collecting public event data
- Proper error handling and logging
- Saving audit logs with timestamps
- No personal data collection
- Respecting Facebook's structure

## Recommendations

1. **Before Scraping**
   - Verify event is public
   - Check rate limits
   - Test with small batches

2. **During Operation**
   - Monitor error rates
   - Check response validity
   - Maintain audit logs

3. **After Collection**
   - Verify data integrity
   - Clean up temporary files
   - Update logs

Remember: These guidelines help maintain a respectful relationship with Facebook's platform while collecting necessary public event data efficiently and ethically. 