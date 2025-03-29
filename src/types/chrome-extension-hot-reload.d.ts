declare module 'chrome-extension-hot-reload' {
  interface HotReloadOptions {
    retryTime?: number;
    dbg?: boolean;
  }

  interface HotReload {
    start(): void;
    connect(options?: HotReloadOptions): void;
  }

  const hotReload: HotReload;
  export default hotReload;
} 