export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  credits: number;
  createdAt: string;
}

export interface CRMConnection {
  id: string;
  userId: string;
  provider: 'salesforce' | 'hubspot' | 'pipedrive' | 'zoho' | 'custom';
  apiToken: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
  connectedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    type?: 'analysis' | 'campaign' | 'abm' | 'report' | 'general';
    reportId?: string;
    campaignId?: string;
    creditsUsed?: number;
  };
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface DataReport {
  id: string;
  userId: string;
  conversationId: string;
  title: string;
  type: 'crm_analysis' | 'segment_analysis' | 'pipeline_report' | 'engagement_report';
  summary: string;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  type: 'email' | 'multi-channel' | 'abm';
  status: 'draft' | 'active' | 'paused' | 'completed';
  segment: string;
  metrics: {
    sent?: number;
    opened?: number;
    clicked?: number;
    replied?: number;
    converted?: number;
  };
  content: {
    subject?: string;
    body?: string;
    sequences?: Array<{step: number; type: string; content: string; delay: string}>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ABMLookalike {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  size: string;
  revenue: string;
  matchScore: number;
  signals: string[];
  website: string;
  location: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  category: 'auth' | 'crm' | 'chat' | 'data' | 'campaign' | 'abm' | 'credits' | 'system';
  details: string;
  metadata?: Record<string, unknown>;
  creditsUsed?: number;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  balanceAfter: number;
  createdAt: string;
}
