// Simple debug utility that doesn't rely on external modules
const DEBUG = {
  enabled: false,
  namespaces: new Set<string>(),
  
  enable(namespace: string) {
    this.enabled = true;
    this.namespaces.add(namespace);
  },
  
  disable(namespace: string) {
    this.namespaces.delete(namespace);
    if (this.namespaces.size === 0) {
      this.enabled = false;
    }
  },
  
  formatMessage(namespace: string, message: string, ...args: unknown[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    );
    return `[${timestamp}] [${namespace}] ${message} ${formattedArgs.join(' ')}`;
  }
};

// Create debug functions for different parts of the application
export function createDebug(namespace: string) {
  return (message: string, ...args: unknown[]) => {
    if (DEBUG.enabled && DEBUG.namespaces.has(namespace)) {
      console.log(DEBUG.formatMessage(namespace, message, ...args));
    }
  };
}

export function createError(defaultNamespace: string) {
  return (namespace: string | Error | unknown, error?: Error | unknown, context?: Record<string, unknown>) => {
    if (DEBUG.enabled && DEBUG.namespaces.has(defaultNamespace)) {
      // If first argument is a string, it's a namespace
      if (typeof namespace === 'string') {
        const errorMessage = error instanceof Error 
          ? `${error.message}\nStack: ${error.stack}`
          : String(error);
        console.error(DEBUG.formatMessage(namespace, 'Error:', errorMessage, context));
      } else {
        // First argument is the error
        const errorMessage = namespace instanceof Error 
          ? `${namespace.message}\nStack: ${namespace.stack}`
          : String(namespace);
        console.error(DEBUG.formatMessage(defaultNamespace, 'Error:', errorMessage, error as Record<string, unknown>));
      }
    }
  };
}

// Create instances for different parts of the application
export const debugPopup = createDebug('popup');
export const debugContent = createDebug('content');
export const debugBackground = createDebug('background');
export const debugMessages = createDebug('messages');
export const debugEvents = createDebug('events');

export const logError = createError('error');

// Enable all debug logs in development
const isDevelopment = !chrome.runtime.getManifest().update_url;
if (isDevelopment) {
  DEBUG.enable('popup');
  DEBUG.enable('content');
  DEBUG.enable('background');
  DEBUG.enable('messages');
  DEBUG.enable('events');
  DEBUG.enable('error');
}

// Helper function to log state changes
export const logState = (namespace: string, state: Record<string, unknown>) => {
  const debugInstance = createDebug(namespace);
  debugInstance('State changed: %O', state);
};

// Helper function to log network requests
export const logNetwork = (namespace: string, request: { url: string; method: string; data?: unknown }) => {
  const debugInstance = createDebug(namespace);
  debugInstance('Request: %s %s\nData: %O', request.method, request.url, request.data);
}; 