
export interface ImageFile {
  id: string;
  name: string;
  dataUrl: string;
  timestamp: number;
  type: string;
  size: number;
}

export enum ToolCategory {
  CORE = 'CORE',
  EDIT = 'EDIT',
  CONVERT = 'CONVERT',
  EXTRAS = 'EXTRAS'
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  path: string;
  ai?: boolean;
}

export interface PassportSize {
  name: string;
  widthMm: number;
  heightMm: number;
  label: string;
}

export interface UsageStats {
  aiCalls: number;
  lastReset: number;
}
