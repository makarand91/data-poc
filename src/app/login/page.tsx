'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, Building2, User, ArrowRight, Sparkles, Database, Target } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: 'demo@amplifye.ai', password: 'demo123', name: '', company: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      router.push('/chat');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: '#1a1a2e' }}>
        {/* Subtle gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'rgba(232, 93, 58, 0.12)' }} />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: 'rgba(232, 93, 58, 0.06)' }} />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#e85d3a' }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-semibold tracking-tight">Amplifye.AI</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight tracking-tight">Accelerate Your<br/>Sales Pipeline</h1>
          <p className="text-lg mb-14 max-w-md leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>AI-powered lead generation, hyper-personalization, and campaign management — all in one platform.</p>
          <div className="space-y-4">
            {[
              { icon: Database, text: '280M+ Verified B2B Contacts' },
              { icon: Target, text: 'ABM & ICP-Based Targeting' },
              { icon: Sparkles, text: 'AI-Powered Data Enrichment' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <item.icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
                </div>
                <span className="text-[15px]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#e85d3a' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold" style={{ color: '#1a1a2e' }}>Amplifye.AI</span>
          </div>
          <h2 className="text-2xl font-bold mb-1.5 tracking-tight" style={{ color: '#1a1a2e' }}>{isRegister ? 'Create your account' : 'Welcome back'}</h2>
          <p className="text-gray-500 mb-8 text-[15px]">{isRegister ? 'Start your free trial with 500 credits' : 'Sign in to your Demand AI platform'}</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#e85d3a]/20 focus:border-[#e85d3a]/40 outline-none transition bg-white hover:border-gray-300" placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" required value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#e85d3a]/20 focus:border-[#e85d3a]/40 outline-none transition bg-white hover:border-gray-300" placeholder="Acme Inc." />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#e85d3a]/20 focus:border-[#e85d3a]/40 outline-none transition bg-white hover:border-gray-300" placeholder="you@company.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#e85d3a]/20 focus:border-[#e85d3a]/40 outline-none transition bg-white hover:border-gray-300" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 text-white font-medium rounded-lg text-sm transition flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: '#1a1a2e' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2a2a45'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1a1a2e'; }}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{isRegister ? 'Create Account' : 'Sign In'} <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-sm font-medium transition" style={{ color: '#e85d3a' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#d14e2e'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#e85d3a'; }}>
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>

          {!isRegister && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 font-medium mb-1">Demo Credentials</p>
              <p className="text-xs text-gray-600">Email: demo@amplifye.ai / Password: demo123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
