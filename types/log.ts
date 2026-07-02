export type LogStream = 'SYSTEM' | 'STDOUT' | 'STDERR';
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogItem {
  id: string;
  deploymentId: string;
  projectId: string;
  seq: number;
  level: LogLevel;
  stream: LogStream;
  message: string;
  createdAt: string;
}

export type LogsResponse = LogItem[];
