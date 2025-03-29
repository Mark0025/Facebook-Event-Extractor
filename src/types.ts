export interface FacebookEvent {
  id: string;
  title?: string;
  date?: string;
  location?: string;
  description?: string;
  image?: string;
  link?: string;
  isPublic?: boolean;
  fetchedAt?: string;
}

export interface EventDetails {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  link: string;
  isPublic: boolean;
}

export enum MessageType {
  EXTRACT_EVENTS = 'EXTRACT_EVENTS',
  GET_STATE = 'GET_STATE',
  SAVE_FILE = 'SAVE_FILE'
}

export interface BaseMessage {
  type: MessageType;
}

export interface ExtractEventsMessage extends BaseMessage {
  type: MessageType.EXTRACT_EVENTS;
  url: string;
}

export interface GetStateMessage extends BaseMessage {
  type: MessageType.GET_STATE;
}

export interface SaveFileMessage extends BaseMessage {
  type: MessageType.SAVE_FILE;
  filename: string;
  data: unknown;
}

export type Message = ExtractEventsMessage | GetStateMessage | SaveFileMessage;

export interface StorageData {
  events: FacebookEvent[];
  lastUpdate: string;
}

export interface BatchProgress {
  total: number;
  processed: number;
  success: number;
  currentBatch: number;
  totalBatches: number;
} 