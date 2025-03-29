declare namespace chrome {
  export interface Tab {
    id?: number;
    url?: string;
    active: boolean;
  }

  export interface QueryInfo {
    active?: boolean;
    currentWindow?: boolean;
  }

  export interface ExecuteScriptInjection {
    target: { tabId: number };
    files?: string[];
    func?: () => void;
  }

  export interface CreateProperties {
    url: string;
    active?: boolean;
  }

  export interface UpdateProperties {
    url?: string;
    active?: boolean;
  }

  export interface Manifest {
    manifest_version: number;
    name: string;
    version: string;
    description: string;
    permissions: string[];
    host_permissions: string[];
    background: {
      service_worker: string;
      type: string;
    };
    content_scripts: {
      matches: string[];
      js: string[];
    }[];
    action: {
      default_popup: string;
      default_icon: {
        [key: string]: string;
      };
    };
    icons: {
      [key: string]: string;
    };
  }

  export interface Tabs {
    query(queryInfo: QueryInfo): Promise<Tab[]>;
    executeScript(injection: ExecuteScriptInjection): Promise<any[]>;
    create(createProperties: CreateProperties): Promise<Tab>;
    update(tabId: number, updateProperties: UpdateProperties): Promise<Tab>;
  }

  export interface Scripting {
    executeScript(injection: ExecuteScriptInjection): Promise<any[]>;
  }

  export interface Runtime {
    getManifest(): Manifest;
    lastError?: { message: string };
    onMessage: {
      addListener(
        callback: (
          message: any,
          sender: MessageSender,
          sendResponse: (response?: any) => void
        ) => void | Promise<any>
      ): void;
    };
    onInstalled: {
      addListener(callback: (details: { reason: string }) => void): void;
    };
    sendMessage(message: any, responseCallback?: (response: any) => void): void;
  }

  export interface MessageSender {
    tab?: { id?: number; url?: string };
    frameId?: number;
    id?: string;
    url?: string;
  }

  export const tabs: Tabs;
  export const scripting: Scripting;
  export const runtime: Runtime;
} 