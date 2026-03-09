'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronDown, LogOut, TrendingUp, Sparkles, Zap, CreditCard, Eye, Users, X, Check, Database } from 'lucide-react';

// ─── Notification Types & Mock Data ────────────────────────────────────────

type NotifCategory = 'lead_signals' | 'data_updates' | 'credits';

interface Notification {
  id: string;
  category: NotifCategory;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  href?: string;
  actionLabel?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1', category: 'lead_signals', icon: TrendingUp, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500',
    title: '12 new intent signals detected',
    description: 'Accounts matching your ICP are showing buying intent for cloud migration solutions.',
    time: '5m ago', read: false, href: '/data', actionLabel: 'View matches',
  },
  {
    id: 'n2', category: 'lead_signals', icon: Eye, iconBg: 'bg-violet-500/10', iconColor: 'text-violet-500',
    title: '847 new contacts matched your ICP',
    description: 'Your audience has grown — new contacts in Enterprise Tech and Healthcare segments.',
    time: '22m ago', read: false, href: '/data',
  },
  {
    id: 'n3', category: 'lead_signals', icon: Users, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500',
    title: 'New decision-makers identified',
    description: '23 VP-level contacts added to your matched audience in Financial Services.',
    time: '1h ago', read: false, href: '/data',
  },
  {
    id: 'n4', category: 'data_updates', icon: Database, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500',
    title: 'Data enrichment complete',
    description: 'Email verification ran on 12,450 contacts — 94% verified deliverable.',
    time: '2h ago', read: false, href: '/data',
  },
  {
    id: 'n5', category: 'data_updates', icon: Sparkles, iconBg: 'bg-violet-500/10', iconColor: 'text-violet-500',
    title: 'TAL upload processed',
    description: 'Your 156-account Target Account List has been matched — 79% match rate.',
    time: '3h ago', read: true, href: '/data',
  },
  {
    id: 'n6', category: 'data_updates', icon: Zap, iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500',
    title: 'Match analytics updated',
    description: 'ICP match rate improved to 84% after adding Healthcare segment criteria.',
    time: '5h ago', read: true, href: '/data',
  },
  {
    id: 'n7', category: 'credits', icon: CreditCard, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500',
    title: 'Credit balance getting low',
    description: 'You have 47 credits remaining. Top up to continue downloading data.',
    time: '3h ago', read: false, actionLabel: 'Buy credits',
  },
];

const CATEGORY_LABELS: Record<NotifCategory, string> = {
  lead_signals: 'Lead Signals',
  data_updates: 'Data Updates',
  credits: 'Account',
};

const CATEGORY_ORDER: NotifCategory[] = ['lead_signals', 'data_updates', 'credits'];

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<'all' | NotifCategory>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPageName = () => {
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    const pageNames: Record<string, string> = {
      'chat': 'Chat',
      'data': 'Data',
      'logs': 'Activity Log',
    };
    return pageNames[lastSegment] || 'Dashboard';
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/login');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotifClick = (notif: Notification) => {
    markAsRead(notif.id);
    if (notif.href) {
      setShowNotifications(false);
      router.push(notif.href);
    }
  };

  const filteredNotifications = notifFilter === 'all'
    ? notifications
    : notifications.filter(n => n.category === notifFilter);

  const groupedNotifications = CATEGORY_ORDER
    .map(cat => ({ category: cat, label: CATEGORY_LABELS[cat], items: filteredNotifications.filter(n => n.category === cat) }))
    .filter(g => g.items.length > 0);

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      {/* Left: Page name */}
      <div className="text-sm font-medium text-gray-900">
        {getPageName()}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[380px] bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-200/50 z-50 overflow-hidden animate-slide-down">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                  <button
                    onClick={() => setNotifFilter('all')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition ${
                      notifFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  {CATEGORY_ORDER.map(cat => {
                    const count = notifications.filter(n => n.category === cat).length;
                    if (count === 0) return null;
                    const unread = notifications.filter(n => n.category === cat && !n.read).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setNotifFilter(cat)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition flex items-center gap-1 ${
                          notifFilter === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {CATEGORY_LABELS[cat]}
                        {unread > 0 && <span className={`w-1.5 h-1.5 rounded-full ${notifFilter === cat ? 'bg-red-400' : 'bg-red-500'}`} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="w-7 h-7 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No notifications</p>
                  </div>
                ) : (
                  groupedNotifications.map(group => (
                    <div key={group.category}>
                      {notifFilter === 'all' && (
                        <div className="px-4 pt-3 pb-1">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{group.label}</p>
                        </div>
                      )}
                      {group.items.map(notif => {
                        const Icon = notif.icon;
                        return (
                          <div
                            key={notif.id}
                            className={`group relative px-4 py-3 flex items-start gap-3 cursor-pointer transition hover:bg-gray-50 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                            onClick={() => handleNotifClick(notif)}
                          >
                            {!notif.read && <span className="absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full bg-blue-500" />}
                            <div className={`w-8 h-8 rounded-lg ${notif.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <Icon className={`w-4 h-4 ${notif.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs leading-snug ${!notif.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                {notif.title}
                              </p>
                              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{notif.description}</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[10px] text-gray-400">{notif.time}</span>
                                {notif.actionLabel && (
                                  <span className="text-[10px] font-semibold text-blue-600">{notif.actionLabel} &rarr;</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                              className="p-1 text-gray-300 hover:text-gray-500 rounded opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-100 text-center">
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition">View all notifications</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User / Org Avatar */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
              AT
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-700">Acme Tech</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-200/50 z-50 overflow-hidden animate-slide-down">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    AT
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Acme Technologies</p>
                    <p className="text-xs text-gray-500">demo@amplifye.ai</p>
                  </div>
                </div>
              </div>

              <nav className="py-1">
                <button
                  onClick={() => { setShowDropdown(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
