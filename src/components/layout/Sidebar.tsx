'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MessageSquare, Database, ScrollText, LogOut, Zap, CreditCard, ChevronLeft, ChevronRight, X, Plus, Settings } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  { href: '/chat', label: 'Chat', icon: MessageSquare, description: 'Find & Download Data' },
  { href: '/data', label: 'Data', icon: Database, description: 'Audience, ICP & Downloads' },
  { href: '/logs', label: 'Activity Log', icon: ScrollText, description: 'System Logs' },
];

interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
}

const creditPlans: CreditPlan[] = [
  { id: 'starter', name: 'Starter', credits: 500, price: 49 },
  { id: 'growth', name: 'Growth', credits: 2000, price: 149, popular: true },
  { id: 'scale', name: 'Scale', credits: 5000, price: 299 },
  { id: 'enterprise', name: 'Enterprise', credits: 20000, price: 899 },
];

export default function Sidebar({ credits: initialCredits = 500 }: { credits?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [credits, setCredits] = useState(initialCredits);
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  useEffect(() => {
    fetch('/api/credits')
      .then(res => res.json())
      .then(data => {
        if (data.credits !== undefined) setCredits(data.credits);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/login');
  };

  const handlePurchase = async (planId: string) => {
    setSelectedPlan(planId);
    setPurchasing(true);
    const plan = creditPlans.find(p => p.id === planId);
    if (plan) {
      try {
        const res = await fetch('/api/credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: plan.credits, planName: plan.name }),
        });
        const data = await res.json();
        if (data.credits !== undefined) {
          setCredits(data.credits);
        } else {
          setCredits(prev => prev + plan.credits);
        }
      } catch {
        setCredits(prev => prev + plan.credits);
      }
    }
    setPurchasing(false);
    setPurchaseSuccess(true);
    setTimeout(() => {
      setPurchaseSuccess(false);
      setShowBuyCredits(false);
      setSelectedPlan(null);
    }, 2000);
  };

  const getPerCreditCost = (credits: number, price: number) => {
    return (price / credits).toFixed(3);
  };

  return (
    <aside className={`${collapsed ? 'w-[68px]' : 'w-60'} h-screen flex flex-col transition-all duration-300 relative`} style={{ background: 'var(--sidebar-bg)' }}>
      {/* Header */}
      <div className={`${collapsed ? 'px-3 py-5' : 'px-4 py-5'} flex items-center gap-2.5`}>
        <div className="w-8 h-8 bg-[#e85d3a] rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && <span className="text-[15px] font-semibold text-white tracking-tight">Amplifye.AI</span>}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-14 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition z-10 shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto sidebar-scroll">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? 'text-white font-semibold'
                  : 'hover:text-white/80'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              style={{
                color: isActive ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                background: isActive ? 'var(--sidebar-active)' : undefined,
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'var(--sidebar-hover)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--sidebar-text)'; } }}
              title={collapsed ? item.label : ''}
            >
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#e85d3a] rounded-r-full" />}
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-white' : 'text-white/45'}`} />
              {!collapsed && <span className="flex-1">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Credits Section */}
      {!collapsed ? (
        <div className="mx-2.5 mb-2.5">
          <div className="p-3 rounded-lg mb-2" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>Credits</span>
              <CreditCard className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
            </div>
            <p className="text-lg font-semibold text-white tabular-nums">{credits.toLocaleString()}</p>
            <div className="w-full rounded-full h-1 mt-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-1 rounded-full transition-all"
                style={{ width: Math.min(100, (credits / 500) * 100) + '%', background: '#e85d3a' }}
              />
            </div>
          </div>
          <button
            onClick={() => setShowBuyCredits(true)}
            className="w-full rounded-lg text-xs font-medium py-2 px-3 transition-colors flex items-center justify-center gap-1.5"
            style={{ background: '#e85d3a', color: '#ffffff' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#d14e2e'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#e85d3a'; }}
          >
            <Plus className="w-3.5 h-3.5" />
            Buy Credits
          </button>
        </div>
      ) : (
        <div className="mx-2 mb-2.5">
          <button
            onClick={() => setShowBuyCredits(true)}
            className="w-full flex items-center justify-center p-2 rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,255,0.45)', background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--sidebar-hover)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
            title="Buy Credits"
          >
            <CreditCard className="w-[18px] h-[18px]" />
          </button>
        </div>
      )}

      {/* Bottom */}
      <div className="p-2.5 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Link
          href="/settings"
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] w-full transition ${collapsed ? 'justify-center px-2' : ''}`}
          style={{ color: 'var(--sidebar-text)', background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--sidebar-hover)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-text)'; }}
        >
          <Settings className="w-[18px] h-[18px]" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] w-full transition ${collapsed ? 'justify-center px-2' : ''}`}
          style={{ color: 'var(--sidebar-text)', background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-text)'; }}
        >
          <LogOut className="w-[18px] h-[18px]" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Buy Credits Modal */}
      {showBuyCredits && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Buy Credits</h2>
                <p className="text-sm text-gray-500 mt-0.5">Choose a plan that fits your needs</p>
              </div>
              <button
                onClick={() => setShowBuyCredits(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {purchaseSuccess ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-900">Credits Added!</p>
                <p className="text-gray-500 mt-1 text-sm">Your credits have been successfully added.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {creditPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-5 rounded-lg border transition-all ${
                      plan.popular
                        ? 'border-[#e85d3a]/30 bg-orange-50/50 ring-1 ring-[#e85d3a]/10'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2.5 left-4">
                        <span className="bg-[#e85d3a] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          Popular
                        </span>
                      </div>
                    )}
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {plan.credits.toLocaleString()}
                        <span className="text-xs text-gray-500 font-normal ml-1">credits</span>
                      </p>
                      <p className="text-lg font-semibold text-gray-900 mt-0.5">${plan.price}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">${getPerCreditCost(plan.credits, plan.price)} per credit</p>
                    </div>
                    <button
                      onClick={() => handlePurchase(plan.id)}
                      disabled={purchasing && selectedPlan === plan.id}
                      className={`w-full font-medium py-2 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${
                        plan.popular
                          ? 'bg-[#e85d3a] text-white hover:bg-[#d14e2e]'
                          : 'bg-[#1a1a2e] text-white hover:bg-[#2a2a45]'
                      }`}
                    >
                      {purchasing && selectedPlan === plan.id ? 'Processing...' : 'Purchase'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
