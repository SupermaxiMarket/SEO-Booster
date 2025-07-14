export enum Lang {
  EN = 'en',
  FR = 'fr',
}

export enum AnalysisType {
  KEYWORDS = 'KEYWORDS',
  IMPROVE = 'IMPROVE',
  COMPETITOR = 'COMPETITOR',
  SUGGESTION = 'SUGGESTION',
}

export interface Keyword {
  word: string;
  category: 'primary' | 'secondary' | 'long-tail';
  reason: string;
}

export interface Competitor {
  name: string;
  strategy: string;
  keywords: string[];
  weakness: string;
}

export interface SeoResult {
  keywords?: Keyword[];
  improvedText?: string;
  competitors?: Competitor[];
}

export interface HistoryItem {
  id: string;
  type: AnalysisType;
  input: string;
  result: SeoResult;
  timestamp: number;
}

export interface User {
  isPremium: boolean;
  requestCount: number;
  history: HistoryItem[];
  email?: string;
}