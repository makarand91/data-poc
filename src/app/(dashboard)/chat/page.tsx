'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Plus, Bot, User, Loader2, MessageSquare, Clock, Database, Users, Globe, CheckCircle2, Zap, Search, Download, Target, BarChart3 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: any;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

function getThinkingSteps(message: string): { steps: string[]; delays: number[] } {
  const msg = message.toLowerCase();

  // ICP / Match queries
  if (msg.includes('icp') || msg.includes('match') || msg.includes('ideal customer') || msg.includes('match rate') || msg.includes('fit score')) {
    return {
      steps: [
        'Loading your ICP criteria...',
        'Querying audience database for matches...',
        'Analyzing match rates across segments...',
        'Calculating ICP fit scores...',
        'Preparing results...',
      ],
      delays: [700, 1200, 1500, 1000, 600],
    };
  }

  // Decision maker / contact count queries
  if (msg.includes('how many decision makers') || msg.includes('how many contacts') || msg.includes('decision makers') || msg.includes('how many people') || msg.includes('how many leads') || msg.includes('total contacts') || msg.includes('contact count') || msg.includes('available contacts')) {
    return {
      steps: [
        'Querying Data Warehouse for decision makers...',
        'Cross-referencing with your ICP criteria...',
        'Analyzing seniority distribution...',
        'Calculating availability and pricing...',
        'Generating results...',
      ],
      delays: [800, 1200, 1000, 1500, 600],
    };
  }

  // Download / Export
  if (msg.includes('download') || msg.includes('export') || msg.includes('csv') || msg.includes('get the list') || msg.includes('download list') || msg.includes('sample')) {
    return {
      steps: [
        'Compiling selected records...',
        'Verifying data quality...',
        'Checking credit balance...',
        'Preparing download...',
      ],
      delays: [800, 1200, 1000, 600],
    };
  }

  // Audience / Data overview
  if (msg.includes('my audience') || msg.includes('audience size') || msg.includes('database size') || msg.includes('how big') || msg.includes('show my audience') || msg.includes('my reach') || msg.includes('data overview')) {
    return {
      steps: [
        'Connecting to Data Warehouse...',
        'Loading your audience records...',
        'Calculating segment distribution...',
        'Generating audience overview...',
      ],
      delays: [700, 1000, 1200, 800],
    };
  }

  // ABM / Lookalike companies
  if (msg.includes('abm') || msg.includes('similar') || msg.includes('lookalike') || msg.includes('companies') || msg.includes('find companies')) {
    return {
      steps: [
        'Accessing ABM Intelligence Engine...',
        'Loading your ideal customer profile...',
        'Scanning firmographic database for matches...',
        'Ranking companies by match score...',
        'Preparing results...',
      ],
      delays: [700, 1000, 2000, 1200, 600],
    };
  }

  // Segment queries
  const segments = ['oil and gas', 'healthcare', 'enterprise tech', 'fintech', 'saas', 'manufacturing', 'clean energy', 'financial services', 'e-commerce'];
  if (segments.some(s => msg.includes(s)) || msg.includes('segment')) {
    return {
      steps: [
        'Connecting to Data Warehouse...',
        'Filtering segment-specific records...',
        'Analyzing data availability...',
        'Preparing segment details...',
      ],
      delays: [700, 1200, 1000, 800],
    };
  }

  // Data quality
  if (msg.includes('data quality') || msg.includes('data health') || msg.includes('enrich') || msg.includes('clean') || msg.includes('duplicates')) {
    return {
      steps: [
        'Scanning contact records...',
        'Running data quality audit...',
        'Detecting issues and gaps...',
        'Calculating health score...',
      ],
      delays: [700, 1400, 1200, 800],
    };
  }

  // Credits
  if (msg.includes('credit') || msg.includes('balance') || msg.includes('usage') || msg.includes('pricing')) {
    return {
      steps: [
        'Checking account balance...',
        'Loading usage history...',
      ],
      delays: [600, 800],
    };
  }

  // Find / Search queries
  if (msg.includes('find') || msg.includes('search') || msg.includes('look for') || msg.includes('show me')) {
    return {
      steps: [
        'Processing your search...',
        'Querying audience database...',
        'Filtering results...',
        'Preparing matches...',
      ],
      delays: [600, 1200, 1000, 800],
    };
  }

  // Default fallback
  return {
    steps: [
      'Processing your request...',
      'Analyzing context...',
      'Preparing response...',
    ],
    delays: [600, 1000, 800],
  };
}

function getFollowUpSuggestions(lastMessageType?: string): string[] {
  switch (lastMessageType) {
    case 'icp_match':
      return ['Download matched contacts', 'Show match breakdown by industry', 'How many VP-level contacts?', 'Get sample download'];
    case 'audience':
      return ['Show match analytics', 'Find decision makers in Enterprise Tech', 'Download sample contacts', 'Check my credit balance'];
    case 'abm':
      return ['How many decision makers at these companies?', 'Download this list', 'Show match rate details', 'Find more companies'];
    case 'decision_makers':
      return ['Download these contacts', 'Get sample download', 'Show breakdown by industry', 'Check credit balance'];
    case 'download':
    case 'data_download':
      return ['Download more segments', 'Check remaining credits', 'Show match analytics', 'Find more contacts'];
    case 'segment':
      return ['Download this segment', 'Show segment match rate', 'Find decision makers here', 'Compare with other segments'];
    case 'data_quality':
      return ['Download verified contacts only', 'Show match analytics', 'Find contacts in Healthcare', 'Check credit balance'];
    case 'credits':
      return ['Download sample contacts', 'Show my audience', 'Find companies in my ICP', 'Show match analytics'];
    default:
      return ['Show my audience overview', 'Find decision makers in Enterprise Tech', 'What is my ICP match rate?', 'Download sample contacts'];
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConvList, setShowConvList] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [isThinking, setIsThinking] = useState(false);
  const [lastResponseType, setLastResponseType] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    const res = await fetch('/api/chat');
    const data = await res.json();
    setConversations(data.conversations || []);
  };

  const loadConversation = async (convId: string) => {
    const res = await fetch(`/api/chat?conversationId=${convId}`);
    const data = await res.json();
    setMessages(data.messages || []);
    setCurrentConvId(convId);
    setShowConvList(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentConvId(null);
    setShowConvList(false);
    inputRef.current?.focus();
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setIsThinking(true);

    const tempUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userMessage, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, tempUserMsg]);

    const { steps, delays } = getThinkingSteps(userMessage);
    setThinkingSteps(steps);
    setActiveStepIndex(0);

    for (let i = 0; i < steps.length; i++) {
      setActiveStepIndex(i);
      await new Promise(r => setTimeout(r, delays[i]));
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, conversationId: currentConvId }),
      });
      const data = await res.json();
      if (data.conversationId && !currentConvId) {
        setCurrentConvId(data.conversationId);
      }

      await new Promise(r => setTimeout(r, 500));

      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempUserMsg.id);
        return [...filtered, data.userMessage, data.assistantMessage];
      });
      setLastResponseType(data.metadata?.type || null);
      fetchConversations();
    } catch (err) {
      setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: 'Sorry, something went wrong. Please try again.', createdAt: new Date().toISOString() }]);
    } finally {
      setThinkingSteps([]);
      setActiveStepIndex(-1);
      setIsThinking(false);
      setLoading(false);
    }
  };

  const sendDirectMessage = async (text: string) => {
    if (loading) return;
    setInput('');
    setLoading(true);
    setIsThinking(true);

    const tempUserMsg: Message = { id: Date.now().toString(), role: 'user', content: text, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, tempUserMsg]);

    const { steps, delays } = getThinkingSteps(text);
    setThinkingSteps(steps);
    setActiveStepIndex(0);

    for (let i = 0; i < steps.length; i++) {
      setActiveStepIndex(i);
      await new Promise(r => setTimeout(r, delays[i]));
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationId: currentConvId }),
      });
      const data = await res.json();
      if (data.conversationId && !currentConvId) {
        setCurrentConvId(data.conversationId);
      }
      await new Promise(r => setTimeout(r, 500));
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempUserMsg.id);
        return [...filtered, data.userMessage, data.assistantMessage];
      });
      setLastResponseType(data.metadata?.type || null);
      fetchConversations();
    } catch (err) {
      setMessages(prev => [...prev, { id: 'err', role: 'assistant', content: 'Sorry, something went wrong. Please try again.', createdAt: new Date().toISOString() }]);
    } finally {
      setThinkingSteps([]);
      setActiveStepIndex(-1);
      setIsThinking(false);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Data-focused prompt cards
  const promptRow1 = [
    { icon: Search, label: 'Find decision makers in Enterprise Tech', desc: 'Search by industry, title & seniority' },
    { icon: Target, label: 'How many contacts match my ICP?', desc: 'See your ICP match rate & coverage' },
    { icon: Users, label: 'Show matched accounts in Healthcare', desc: 'Browse matched audience by segment' },
    { icon: Database, label: 'Show my audience overview', desc: 'Total contacts, segments & enrichment' },
  ];
  const promptRow2 = [
    { icon: Download, label: 'Download sample contacts', desc: 'Free sample of 25 matched contacts' },
    { icon: BarChart3, label: 'What is my match rate?', desc: 'Analytics on matched vs unmatched' },
    { icon: Globe, label: 'Find similar ABM companies', desc: 'Lookalike accounts matching your ICP' },
    { icon: Zap, label: 'Check my credit balance', desc: 'View credits & download pricing' },
  ];

  const renderMarkdown = (text: string) => {
    let html = text
      .replace(/### (.*?)$/gm, '<h3 class="text-base font-semibold mt-4 mb-2 text-gray-900">$1</h3>')
      .replace(/## (.*?)$/gm, '<h2 class="text-lg font-bold mt-5 mb-2 text-gray-900">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 underline">$1</a>')
      .replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc text-sm text-gray-700">$1</li>')
      .replace(/^(\d+)\. (.*?)$/gm, '<li class="ml-4 list-decimal text-sm text-gray-700">$2</li>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/---/g, '<hr class="my-3 border-gray-200"/>')
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim()).map(c => c.trim());
        if (cells.every(c => /^[-:]+$/.test(c))) return '';
        return '<div class="flex gap-4 text-xs py-1 border-b border-gray-100">' + cells.map(c => `<span class="flex-1 text-gray-700">${c}</span>`).join('') + '</div>';
      });
    return html;
  };

  return (
    <div className="flex h-full">
      {/* Conversation Sidebar */}
      {showConvList && (
        <div className="w-72 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <button onClick={startNewChat} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map(conv => (
              <button key={conv.id} onClick={() => loadConversation(conv.id)} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${currentConvId === conv.id ? 'bg-blue-500/10 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <p className="font-medium truncate">{conv.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(conv.updatedAt).toLocaleDateString()}</p>
              </button>
            ))}
            {conversations.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No conversations yet</p>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowConvList(!showConvList)} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Toggle conversations">
              <Clock className="w-5 h-5 text-gray-500" />
            </button>
            <h1 className="text-base font-semibold text-gray-900">
              {currentConvId ? conversations.find(c => c.id === currentConvId)?.title || 'Chat' : 'New Conversation'}
            </h1>
          </div>
          <button onClick={startNewChat} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">
            <Plus className="w-4 h-4" /> New
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Bot className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Hi, I&apos;m DAAR</h2>
              <p className="text-gray-500 mb-10 text-center max-w-md">How can I help you sell more today? Ask me to analyze data, find companies, or create campaigns.</p>

              {/* Data-focused prompt rows */}
              <div className="w-full max-w-3xl space-y-3 overflow-hidden">
                <div className="marquee-row relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)' }}>
                  <div className="flex gap-3 animate-marquee-left-slow w-max">
                    {[...promptRow1, ...promptRow1].map((card, i) => (
                      <button
                        key={`r1-${i}`}
                        onClick={() => sendDirectMessage(card.label)}
                        className="text-left px-5 py-3.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group flex-shrink-0 w-[280px]"
                      >
                        <div className="flex items-center gap-2.5 mb-1">
                          <card.icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          <span className="text-sm font-medium text-gray-900 group-hover:text-gray-900 transition-colors">{card.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors leading-relaxed pl-[26px]">{card.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="marquee-row relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)' }}>
                  <div className="flex gap-3 animate-marquee-right-slow w-max">
                    {[...promptRow2, ...promptRow2].map((card, i) => (
                      <button
                        key={`r2-${i}`}
                        onClick={() => sendDirectMessage(card.label)}
                        className="text-left px-5 py-3.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group flex-shrink-0 w-[280px]"
                      >
                        <div className="flex items-center gap-2.5 mb-1">
                          <card.icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          <span className="text-sm font-medium text-gray-900 group-hover:text-gray-900 transition-colors">{card.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors leading-relaxed pl-[26px]">{card.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto py-6 px-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-gray-900 text-white rounded-2xl rounded-tr-sm px-4 py-3' : 'bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4'}`}>
                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="text-sm leading-relaxed text-gray-900 prose-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                    )}
                    {msg.metadata?.creditsUsed && (
                      <div className={`mt-2 pt-2 border-t ${msg.role === 'user' ? 'border-gray-700/30' : 'border-gray-200'}`}>
                        <span className="text-xs opacity-70">Credits used: {msg.metadata.creditsUsed}</span>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {isThinking && thinkingSteps.length > 0 && (
                <div className="flex gap-3 animate-fade-in-up">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-4 max-w-[80%]">
                    <div className="space-y-2.5">
                      {thinkingSteps.map((step, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2.5 transition-all duration-300 ${
                            i <= activeStepIndex ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                          }`}
                        >
                          {i < activeStepIndex ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : i === activeStepIndex ? (
                            <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm ${
                              i < activeStepIndex
                                ? 'text-gray-500'
                                : i === activeStepIndex
                                ? 'text-gray-900 font-medium'
                                : 'text-gray-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Follow-up Suggestions */}
        {messages.length > 0 && !loading && lastResponseType && (
          <div className="px-4 pt-2 pb-1 bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 gap-2 pb-2">
                {getFollowUpSuggestions(lastResponseType).slice(0, 4).map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => sendDirectMessage(suggestion)}
                    className="text-left px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
                    style={{ animationDelay: `${i * 120}ms`, animation: 'fadeSlideUp 0.4s ease-out forwards', opacity: 0 }}
                  >
                    <span className="group-hover:text-gray-900 transition-colors duration-200">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
              <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Find contacts, check match rates, download data..." rows={1} className="flex-1 bg-transparent outline-none resize-none text-sm text-gray-900 placeholder-gray-400 max-h-32" style={{ minHeight: '24px' }} />
              <button onClick={sendMessage} disabled={!input.trim() || loading} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed mb-0.5">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
