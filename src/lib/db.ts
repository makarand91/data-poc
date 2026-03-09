import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Primary path (works in local dev)
const SOURCE_DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
// Fallback path for read-only filesystems (AWS Amplify, Vercel, etc.)
const TMP_DB_PATH = '/tmp/db.json';

interface DB {
  users: Record<string, any>;
  crmConnections: Record<string, any>;
  conversations: Record<string, any>;
  messages: Record<string, any>;
  reports: Record<string, any>;
  campaigns: Record<string, any>;
  abmResults: Record<string, any>;
  activityLogs: any[];
  creditTransactions: any[];
}

const defaultDB: DB = {
  users: {},
  crmConnections: {},
  conversations: {},
  messages: {},
  reports: {},
  campaigns: {},
  abmResults: {},
  activityLogs: [],
  creditTransactions: [],
};

/**
 * Determine which DB path to use.
 * - First checks if /tmp/db.json exists (persists within a single Lambda/container lifecycle)
 * - Then tries to read the source db.json bundled with the app
 * - Falls back to /tmp for writing
 */
function getWritablePath(): string {
  // If we can write to the source path, prefer it (local dev)
  try {
    fs.accessSync(path.dirname(SOURCE_DB_PATH), fs.constants.W_OK);
    return SOURCE_DB_PATH;
  } catch {
    return TMP_DB_PATH;
  }
}

function getDB(): DB {
  const writablePath = getWritablePath();

  // 1. Try reading from the writable location first (has latest state)
  try {
    if (fs.existsSync(writablePath)) {
      const data = fs.readFileSync(writablePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // Fall through
  }

  // 2. Try reading the bundled source db.json (seed data)
  try {
    if (fs.existsSync(SOURCE_DB_PATH)) {
      const data = fs.readFileSync(SOURCE_DB_PATH, 'utf-8');
      const db = JSON.parse(data);
      // Copy seed data to writable location
      saveDB(db);
      return db;
    }
  } catch {
    // Fall through
  }

  // 3. Create fresh default DB
  saveDB(defaultDB);
  return { ...defaultDB, activityLogs: [], creditTransactions: [] };
}

function saveDB(db: DB) {
  const writablePath = getWritablePath();
  try {
    const dir = path.dirname(writablePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(writablePath, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Failed to save DB:', err);
  }
}

export function generateId(): string {
  return uuidv4();
}

// User operations
export function createUser(email: string, name: string, company: string, passwordHash: string) {
  const db = getDB();
  const id = generateId();
  const user = { id, email, name, company, passwordHash, credits: 500, createdAt: new Date().toISOString() };
  db.users[id] = user;
  saveDB(db);
  addLog(id, 'User registered', 'auth', `${name} registered with ${email}`);
  return { id, email, name, company, credits: 500, createdAt: user.createdAt };
}

export function getUserByEmail(email: string) {
  const db = getDB();
  return Object.values(db.users).find((u: any) => u.email === email) || null;
}

export function getUserById(id: string) {
  const db = getDB();
  const u = db.users[id];
  if (!u) return null;
  const { passwordHash, ...rest } = u;
  return rest;
}

export function updateCredits(userId: string, amount: number, type: 'debit' | 'credit', description: string) {
  const db = getDB();
  const user = db.users[userId];
  if (!user) return null;
  const newBalance = type === 'debit' ? user.credits - amount : user.credits + amount;
  user.credits = Math.max(0, newBalance);
  const tx = { id: generateId(), userId, amount, type, description, balanceAfter: user.credits, createdAt: new Date().toISOString() };
  db.creditTransactions.push(tx);
  saveDB(db);
  return { credits: user.credits, transaction: tx };
}

// CRM operations
export function saveCRMConnection(userId: string, provider: string, apiToken: string) {
  const db = getDB();
  const id = generateId();
  const lastFour = apiToken.slice(-4);
  const conn = { id, userId, provider, apiToken: `****` + lastFour, rawToken: apiToken, status: 'connected', lastSync: new Date().toISOString(), connectedAt: new Date().toISOString() };
  db.crmConnections[id] = conn;
  saveDB(db);
  addLog(userId, 'CRM Connected', 'crm', `Connected ${provider} CRM`);
  return { id, provider, status: 'connected', lastSync: conn.lastSync, connectedAt: conn.connectedAt };
}

export function getCRMConnections(userId: string) {
  const db = getDB();
  return Object.values(db.crmConnections).filter((c: any) => c.userId === userId).map((c: any) => {
    const { rawToken, ...rest } = c;
    return rest;
  });
}

// Conversation operations
export function createConversation(userId: string, title: string) {
  const db = getDB();
  const id = generateId();
  const conv = { id, userId, title, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  db.conversations[id] = conv;
  saveDB(db);
  return conv;
}

export function getConversations(userId: string) {
  const db = getDB();
  return Object.values(db.conversations).filter((c: any) => c.userId === userId).sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function addMessage(conversationId: string, role: string, content: string, metadata?: any) {
  const db = getDB();
  const id = generateId();
  const msg = { id, conversationId, role, content, metadata: metadata || {}, createdAt: new Date().toISOString() };
  if (!db.messages[conversationId]) db.messages[conversationId] = [];
  db.messages[conversationId].push(msg);
  if (db.conversations[conversationId]) {
    db.conversations[conversationId].updatedAt = new Date().toISOString();
  }
  saveDB(db);
  return msg;
}

export function getMessages(conversationId: string) {
  const db = getDB();
  return db.messages[conversationId] || [];
}

// Report operations
export function saveReport(userId: string, conversationId: string, title: string, type: string, summary: string, data: any) {
  const db = getDB();
  const id = generateId();
  const report = { id, userId, conversationId, title, type, summary, data, createdAt: new Date().toISOString() };
  db.reports[id] = report;
  saveDB(db);
  addLog(userId, 'Report Generated', 'data', `Generated ${type}: ${title}`);
  return report;
}

export function getReports(userId: string) {
  const db = getDB();
  return Object.values(db.reports).filter((r: any) => r.userId === userId).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Campaign operations
export function saveCampaign(userId: string, campaign: any) {
  const db = getDB();
  const id = generateId();
  const c = { id, userId, ...campaign, status: campaign.status || 'draft', metrics: campaign.metrics || {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  db.campaigns[id] = c;
  saveDB(db);
  addLog(userId, 'Campaign Created', 'campaign', `Created campaign: ${campaign.name}`);
  return c;
}

export function getCampaigns(userId: string) {
  const db = getDB();
  return Object.values(db.campaigns).filter((c: any) => c.userId === userId).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function updateCampaign(campaignId: string, updates: any) {
  const db = getDB();
  if (db.campaigns[campaignId]) {
    db.campaigns[campaignId] = { ...db.campaigns[campaignId], ...updates, updatedAt: new Date().toISOString() };
    saveDB(db);
  }
  return db.campaigns[campaignId];
}

// ABM operations
export function saveABMResults(userId: string, results: any[]) {
  const db = getDB();
  const saved = results.map(r => {
    const id = generateId();
    const entry = { id, userId, ...r };
    db.abmResults[id] = entry;
    return entry;
  });
  saveDB(db);
  return saved;
}

export function getABMResults(userId: string) {
  const db = getDB();
  return Object.values(db.abmResults).filter((r: any) => r.userId === userId);
}

// Activity log operations
export function addLog(userId: string, action: string, category: string, details: string, metadata?: any, creditsUsed?: number) {
  const db = getDB();
  const log = { id: generateId(), userId, action, category, details, metadata, creditsUsed, createdAt: new Date().toISOString() };
  db.activityLogs.push(log);
  saveDB(db);
  return log;
}

export function getLogs(userId: string, category?: string, limit = 50) {
  const db = getDB();
  let logs = db.activityLogs.filter((l: any) => l.userId === userId);
  if (category) logs = logs.filter((l: any) => l.category === category);
  return logs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
}

export function getCreditTransactions(userId: string) {
  const db = getDB();
  return db.creditTransactions.filter((t: any) => t.userId === userId).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
