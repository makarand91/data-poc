'use client';
import { useState, useEffect } from 'react';
import { ScrollText, Filter, Download, Clock, User, MessageSquare, Database, Target, CreditCard, Settings, RefreshCw, ChevronRight, Search, Calendar, History, Upload, Users, CheckCircle, Zap, FileText, BarChart3, Shield } from 'lucide-react';

interface LogEntry {
  id: string;
  action: string;
  category: string;
  details: string;
  creditsUsed?: number;
  createdAt: string;
}

// ─── History Mock Data ─────────────────────────────────────────────────────

interface HistoryItem {
  id: string;
  type: 'icp_save' | 'tal_upload' | 'download' | 'abm_rerun' | 'suppression';
  title: string;
  description: string;
  date: string;
  meta?: { contacts?: number; companies?: number; credits?: number; matchRate?: string };
}

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: 'h1', type: 'download', title: 'Downloaded 100 contacts',
    description: 'Full download from ICP match — Enterprise Tech & SaaS/Software segments',
    date: '2026-03-08T14:32:00Z',
    meta: { contacts: 100, credits: 1 },
  },
  {
    id: 'h2', type: 'abm_rerun', title: 'Re-ran Q1 2026 Enterprise Tech ABM',
    description: 'Found 142 new contacts, 118 new emails verified. Match rate improved from 74.5% to 82.1%',
    date: '2026-03-07T10:15:00Z',
    meta: { contacts: 142, matchRate: '+7.6%' },
  },
  {
    id: 'h3', type: 'tal_upload', title: 'Uploaded enterprise_tech_q1.csv',
    description: 'Processed 20 companies against 280M+ contact database. 1,389 contacts matched.',
    date: '2026-03-05T09:45:00Z',
    meta: { companies: 20, contacts: 1389, matchRate: '74.5%' },
  },
  {
    id: 'h4', type: 'icp_save', title: 'Updated ICP criteria',
    description: 'Industries: Enterprise Tech, SaaS/Software. Functions: Sales, Marketing. Seniority: C-Suite, VP/SVP.',
    date: '2026-03-05T09:30:00Z',
  },
  {
    id: 'h5', type: 'suppression', title: 'Added suppression list',
    description: 'Uploaded existing_customers.csv — 342 domains excluded from future results',
    date: '2026-03-01T11:20:00Z',
    meta: { contacts: 342 },
  },
  {
    id: 'h6', type: 'download', title: 'Downloaded 250 contacts',
    description: 'Full download from Healthcare Expansion List ABM run',
    date: '2026-02-28T16:45:00Z',
    meta: { contacts: 250, credits: 3 },
  },
  {
    id: 'h7', type: 'abm_rerun', title: 'Re-ran Healthcare Expansion List',
    description: 'Found 262 new contacts, coverage improved by 8.2%. Now at 65.8% match rate.',
    date: '2026-02-20T13:10:00Z',
    meta: { contacts: 262, matchRate: '+8.2%' },
  },
  {
    id: 'h8', type: 'tal_upload', title: 'Uploaded healthcare_targets.csv',
    description: 'Processed 35 healthcare & pharma companies. 2,104 contacts matched at 65.8% rate.',
    date: '2026-02-20T09:00:00Z',
    meta: { companies: 35, contacts: 2104, matchRate: '57.6%' },
  },
  {
    id: 'h9', type: 'download', title: 'Downloaded 50 contacts',
    description: 'Sample download from ICP match — Financial Services segment',
    date: '2026-02-18T14:22:00Z',
    meta: { contacts: 50, credits: 1 },
  },
  {
    id: 'h10', type: 'suppression', title: 'Added suppression list',
    description: 'Uploaded do_not_contact.csv — 1,205 emails excluded from future results',
    date: '2026-02-18T10:05:00Z',
    meta: { contacts: 1205 },
  },
  {
    id: 'h11', type: 'icp_save', title: 'Created initial ICP',
    description: 'Industries: Enterprise Tech, Healthcare. Functions: Sales, Engineering. Countries: US, UK, Canada.',
    date: '2026-02-15T08:30:00Z',
  },
  {
    id: 'h12', type: 'tal_upload', title: 'Uploaded fintech_abm_feb.csv',
    description: 'Processed 15 Financial Services companies. 890 contacts matched at 77.4% rate.',
    date: '2026-02-10T11:30:00Z',
    meta: { companies: 15, contacts: 890, matchRate: '77.4%' },
  },
];

const historyTypeConfig: Record<string, { icon: any; bg: string; color: string; label: string }> = {
  icp_save: { icon: Target, bg: 'bg-violet-50', color: 'text-violet-600', label: 'ICP Update' },
  tal_upload: { icon: Upload, bg: 'bg-blue-50', color: 'text-blue-600', label: 'TAL Upload' },
  download: { icon: Download, bg: 'bg-emerald-50', color: 'text-emerald-600', label: 'Download' },
  abm_rerun: { icon: RefreshCw, bg: 'bg-orange-50', color: 'text-orange-600', label: 'ABM Re-run' },
  suppression: { icon: Shield, bg: 'bg-red-50', color: 'text-red-600', label: 'Suppression' },
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'activity' | 'history'>('activity');
  const [searchQuery, setSearchQuery] = useState('');
  const [historyFilter, setHistoryFilter] = useState<string>('all');

  useEffect(() => {
    if (activeTab === 'activity') {
      fetchLogs();
    } else {
      // History uses local mock data, no loading needed
      setLoading(false);
    }
  }, [filterCategory, activeTab]);

  const fetchLogs = async () => {
    setLoading(true);
    const url = filterCategory ? `/api/logs?category=${filterCategory}` : '/api/logs';
    const res = await fetch(url);
    const data = await res.json();
    setLogs(data.logs || []);
    setLoading(false);
  };

  const categoryIcons: Record<string, any> = {
    auth: User,
    chat: MessageSquare,
    data: Database,
    abm: Target,
    credits: CreditCard,
    system: Settings,
  };

  const categoryColors: Record<string, string> = {
    auth: 'bg-gray-100 text-gray-600',
    chat: 'bg-blue-50 text-blue-600',
    data: 'bg-violet-50 text-violet-600',
    abm: 'bg-orange-50 text-orange-600',
    credits: 'bg-amber-50 text-amber-700',
    system: 'bg-red-50 text-red-600',
  };

  const categories = ['', 'auth', 'chat', 'data', 'abm', 'credits', 'system'];

  const filteredHistory = MOCK_HISTORY.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = historyFilter === 'all' || h.type === historyFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-[#1a1a2e]">Activity Log</h1>
            <p className="text-gray-500 text-xs mt-0.5">Complete audit trail of all system actions and history</p>
          </div>
          {activeTab === 'activity' && (
            <div className="flex items-center gap-2">
              <button onClick={fetchLogs} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation — Sprinto underline style */}
        <div className="flex gap-0 border-b border-gray-200 mb-6">
          <button onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-1.5 py-2.5 px-4 text-[13px] font-medium transition-all relative ${activeTab === 'activity' ? 'text-[#e85d3a]' : 'text-gray-500 hover:text-gray-700'}`}>
            <ScrollText className="w-4 h-4" /> Activity Log
            {activeTab === 'activity' && <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#e85d3a] rounded-full" />}
          </button>
          <button onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 py-2.5 px-4 text-[13px] font-medium transition-all relative ${activeTab === 'history' ? 'text-[#e85d3a]' : 'text-gray-500 hover:text-gray-700'}`}>
            <History className="w-4 h-4" /> History
            {activeTab === 'history' && <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#e85d3a] rounded-full" />}
          </button>
        </div>

        {/* ═══════════════════ ACTIVITY LOG TAB ═══════════════════ */}
        {activeTab === 'activity' && (
          <>
            {/* Category Filters */}
            <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {categories.map(cat => (
                <button key={cat || 'all'} onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition capitalize ${filterCategory === cat ? 'bg-[#1a1a2e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat || 'All'}
                </button>
              ))}
            </div>

            {/* Log Entries */}
            {loading ? (
              <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-16 shimmer rounded-lg" />)}</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <ScrollText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-gray-900 mb-1">No activity logs yet</h3>
                <p className="text-xs text-gray-500">Activity will appear here as you use the platform</p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-500">Action</span>
                  <span className="text-xs font-semibold text-gray-500 w-24 text-right">Credits</span>
                  <span className="text-xs font-semibold text-gray-500 w-36 text-right">Time</span>
                </div>
                {logs.map((log, i) => {
                  const Icon = categoryIcons[log.category] || ScrollText;
                  return (
                    <div key={log.id} className={`grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 items-center hover:bg-gray-50 transition ${i < logs.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[log.category] || 'bg-gray-100 text-gray-600'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">{log.action}</p>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium flex-shrink-0 ${categoryColors[log.category] || 'bg-gray-100 text-gray-500'}`}>
                              {log.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{log.details}</p>
                        </div>
                      </div>
                      <div className="w-24 text-right flex-shrink-0">
                        {log.creditsUsed ? (
                          <span className="text-xs font-semibold text-amber-600">-{log.creditsUsed}</span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </div>
                      <div className="w-36 text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ═══════════════════ HISTORY TAB ═══════════════════ */}
        {activeTab === 'history' && (
          <>
            {/* Search & Filter */}
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search history..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e85d3a]/20 focus:border-[#e85d3a]/40 transition-colors" />
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'tal_upload', label: 'Uploads' },
                  { key: 'download', label: 'Downloads' },
                  { key: 'abm_rerun', label: 'Re-runs' },
                  { key: 'icp_save', label: 'ICP Updates' },
                  { key: 'suppression', label: 'Suppression' },
                ].map(f => (
                  <button key={f.key} onClick={() => setHistoryFilter(f.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition ${historyFilter === f.key ? 'bg-[#1a1a2e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* History List */}
            {filteredHistory.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <History className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-gray-900 mb-1">No matching history</h3>
                <p className="text-xs text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {filteredHistory.map((item, i) => {
                  const config = historyTypeConfig[item.type];
                  const Icon = config.icon;
                  return (
                    <div key={item.id} className={`flex items-start gap-4 px-4 py-4 hover:bg-gray-50 transition ${i < filteredHistory.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${config.bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        {/* Meta tags */}
                        {item.meta && (
                          <div className="flex items-center gap-3 mt-2">
                            {item.meta.companies !== undefined && (
                              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                <Database className="w-3 h-3" /> {item.meta.companies} companies
                              </span>
                            )}
                            {item.meta.contacts !== undefined && (
                              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                <Users className="w-3 h-3" /> {item.meta.contacts.toLocaleString()} contacts
                              </span>
                            )}
                            {item.meta.matchRate !== undefined && (
                              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                                <BarChart3 className="w-3 h-3" /> {item.meta.matchRate}
                              </span>
                            )}
                            {item.meta.credits !== undefined && (
                              <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                                <Zap className="w-3 h-3" /> -{item.meta.credits} credits
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                        <p className="text-[11px] text-gray-300 mt-0.5">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary footer */}
            <div className="flex items-center justify-between mt-4 px-1">
              <p className="text-xs text-gray-400">{filteredHistory.length} entries</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Upload className="w-3 h-3" /> {MOCK_HISTORY.filter(h => h.type === 'tal_upload').length} uploads</span>
                <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {MOCK_HISTORY.filter(h => h.type === 'download').length} downloads</span>
                <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> {MOCK_HISTORY.filter(h => h.type === 'abm_rerun').length} re-runs</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
