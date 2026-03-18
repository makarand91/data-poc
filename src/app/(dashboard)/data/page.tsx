'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronDown,
  Plus,
  X,
  Upload,
  BarChart3,
  Download,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  FileText,
  Calendar,
  Zap,
  Building2,
  Users,
  AlertTriangle,
  Search,
  RefreshCw,
  Clock,
  Database,
  Shield,
  Sparkles,
  Loader2,
  ArrowRight,
  RotateCcw,
  Eye,
  Lock,
  Activity,
  Globe,
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  MapPin,
  Monitor,
  Server,
  Wifi,
  HeartPulse,
  Lightbulb,
  ExternalLink,
  TrendingDown,
  Mail,
  MessageSquare,
  User,
  Target,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  'Enterprise Tech', 'Healthcare', 'Financial Services', 'SaaS/Software',
  'Manufacturing', 'Oil & Gas', 'Clean Energy', 'E-Commerce', 'Retail',
  'Logistics', 'Telecom', 'Media & Entertainment', 'Education', 'Pharma',
];

const JOB_FUNCTIONS = [
  'Sales', 'Marketing', 'Engineering', 'IT / Technology', 'Finance',
  'Operations', 'Human Resources', 'Product', 'Legal', 'Procurement',
  'Customer Success', 'Business Development',
];

const SENIORITY_LEVELS = [
  'C-Suite (CEO, CTO, CFO, CMO, CRO)',
  'VP / SVP / EVP',
  'Director / Sr. Director',
  'Manager / Sr. Manager',
  'Individual Contributor',
  'Owner / Founder',
];

const SUGGESTED_JOB_TITLES = [
  'VP Sales', 'CTO', 'CMO', 'Director of Marketing', 'Head of Engineering',
  'Chief Revenue Officer', 'VP of Product', 'Director IT', 'CISO',
  'Head of Procurement', 'VP Business Development', 'Director of Operations',
];

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France',
  'Australia', 'India', 'Singapore', 'UAE', 'Netherlands', 'Japan',
  'Brazil', 'Mexico', 'South Korea', 'Sweden', 'Switzerland',
  'Israel', 'Ireland', 'Spain', 'Italy',
];

const COMPANY_SIZES = ['1-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];

const REVENUE_RANGES = [
  { value: 'under1m', label: 'Under $1M' },
  { value: '1m-10m', label: '$1M - $10M' },
  { value: '10m-50m', label: '$10M - $50M' },
  { value: '50m-200m', label: '$50M - $200M' },
  { value: '200m-500m', label: '$200M - $500M' },
  { value: '500m-1b', label: '$500M - $1B' },
  { value: '1b-5b', label: '$1B - $5B' },
  { value: '5b+', label: '$5B+' },
];

// ─── Processing Steps ─────────────────────────────────────────────────────────

const PROCESSING_STEPS = [
  { id: 'upload', label: 'Uploading file', detail: 'Reading CSV and validating columns...', icon: Upload, duration: 1200 },
  { id: 'parse', label: 'Parsing accounts', detail: 'Extracting company names, domains, and metadata...', icon: FileText, duration: 1500 },
  { id: 'db_lookup', label: 'Querying database', detail: 'Searching 280M+ contacts across 45M+ companies...', icon: Database, duration: 2500 },
  { id: 'matching', label: 'Matching contacts', detail: 'Cross-referencing ICP criteria against contact records...', icon: Search, duration: 2000 },
  { id: 'enrichment', label: 'Enriching data', detail: 'Verifying emails, phone numbers, and LinkedIn profiles...', icon: Sparkles, duration: 1800 },
  { id: 'scoring', label: 'Scoring coverage', detail: 'Calculating coverage scores and generating analytics...', icon: Shield, duration: 1000 },
];

// ─── TAL Mock Data ────────────────────────────────────────────────────────────

interface TALCompany {
  id: number;
  company: string;
  domain: string;
  industry: string;
  size: string;
  country: string;
  totalContacts: number;
  matchedContacts: number;
  emailsFound: number;
  phonesFound: number;
  status: 'full' | 'partial' | 'none';
}

const MOCK_TAL_COMPANIES: TALCompany[] = [
  { id: 1, company: 'Salesforce', domain: 'salesforce.com', industry: 'Enterprise Tech', size: '5000+', country: 'United States', totalContacts: 345, matchedContacts: 312, emailsFound: 298, phonesFound: 187, status: 'full' },
  { id: 2, company: 'HubSpot', domain: 'hubspot.com', industry: 'SaaS/Software', size: '5000+', country: 'United States', totalContacts: 210, matchedContacts: 195, emailsFound: 188, phonesFound: 142, status: 'full' },
  { id: 3, company: 'Roche', domain: 'roche.com', industry: 'Pharma', size: '5000+', country: 'Switzerland', totalContacts: 180, matchedContacts: 134, emailsFound: 120, phonesFound: 78, status: 'full' },
  { id: 4, company: 'Stripe', domain: 'stripe.com', industry: 'Financial Services', size: '1001-5000', country: 'United States', totalContacts: 95, matchedContacts: 82, emailsFound: 79, phonesFound: 45, status: 'full' },
  { id: 5, company: 'Siemens Energy', domain: 'siemens-energy.com', industry: 'Clean Energy', size: '5000+', country: 'Germany', totalContacts: 120, matchedContacts: 67, emailsFound: 58, phonesFound: 23, status: 'partial' },
  { id: 6, company: 'Shopify', domain: 'shopify.com', industry: 'E-Commerce', size: '5000+', country: 'Canada', totalContacts: 155, matchedContacts: 140, emailsFound: 132, phonesFound: 89, status: 'full' },
  { id: 7, company: 'Flexport', domain: 'flexport.com', industry: 'Logistics', size: '1001-5000', country: 'United States', totalContacts: 68, matchedContacts: 52, emailsFound: 48, phonesFound: 31, status: 'partial' },
  { id: 8, company: 'Wise', domain: 'wise.com', industry: 'Financial Services', size: '1001-5000', country: 'United Kingdom', totalContacts: 74, matchedContacts: 61, emailsFound: 55, phonesFound: 28, status: 'full' },
  { id: 9, company: 'Datadog', domain: 'datadoghq.com', industry: 'SaaS/Software', size: '1001-5000', country: 'United States', totalContacts: 88, matchedContacts: 76, emailsFound: 72, phonesFound: 40, status: 'full' },
  { id: 10, company: 'ASML', domain: 'asml.com', industry: 'Manufacturing', size: '5000+', country: 'Netherlands', totalContacts: 60, matchedContacts: 18, emailsFound: 12, phonesFound: 5, status: 'partial' },
  { id: 11, company: 'Freshworks', domain: 'freshworks.com', industry: 'SaaS/Software', size: '1001-5000', country: 'India', totalContacts: 45, matchedContacts: 38, emailsFound: 35, phonesFound: 19, status: 'full' },
  { id: 12, company: 'Vestas', domain: 'vestas.com', industry: 'Clean Energy', size: '5000+', country: 'Denmark', totalContacts: 32, matchedContacts: 0, emailsFound: 0, phonesFound: 0, status: 'none' },
  { id: 13, company: 'Celonis', domain: 'celonis.com', industry: 'Enterprise Tech', size: '501-1000', country: 'Germany', totalContacts: 42, matchedContacts: 35, emailsFound: 30, phonesFound: 14, status: 'full' },
  { id: 14, company: 'Grab', domain: 'grab.com', industry: 'E-Commerce', size: '5000+', country: 'Singapore', totalContacts: 28, matchedContacts: 0, emailsFound: 0, phonesFound: 0, status: 'none' },
  { id: 15, company: 'Toast', domain: 'toasttab.com', industry: 'SaaS/Software', size: '1001-5000', country: 'United States', totalContacts: 52, matchedContacts: 41, emailsFound: 38, phonesFound: 22, status: 'full' },
  { id: 16, company: 'Aramco Digital', domain: 'aramcodigital.com', industry: 'Oil & Gas', size: '501-1000', country: 'UAE', totalContacts: 18, matchedContacts: 5, emailsFound: 3, phonesFound: 1, status: 'partial' },
  { id: 17, company: 'Nubank', domain: 'nubank.com.br', industry: 'Financial Services', size: '5000+', country: 'Brazil', totalContacts: 65, matchedContacts: 48, emailsFound: 42, phonesFound: 20, status: 'full' },
  { id: 18, company: 'Klarna', domain: 'klarna.com', industry: 'Financial Services', size: '1001-5000', country: 'Sweden', totalContacts: 40, matchedContacts: 0, emailsFound: 0, phonesFound: 0, status: 'none' },
  { id: 19, company: 'UiPath', domain: 'uipath.com', industry: 'Enterprise Tech', size: '1001-5000', country: 'United States', totalContacts: 72, matchedContacts: 63, emailsFound: 58, phonesFound: 34, status: 'full' },
  { id: 20, company: 'Rivian', domain: 'rivian.com', industry: 'Manufacturing', size: '5000+', country: 'United States', totalContacts: 55, matchedContacts: 22, emailsFound: 18, phonesFound: 8, status: 'partial' },
];

// ─── Past ABM Runs Mock Data ──────────────────────────────────────────────────

interface RerunSnapshot {
  matchedContacts: number;
  totalContacts: number;
  matchRate: number;
  date: string;
  newContactsFound: number;
  newEmailsVerified: number;
  newPhonesVerified: number;
  coverageImprovement: number;
}

interface ABMRun {
  id: string;
  name: string;
  fileName: string;
  date: string;
  companies: number;
  matchedContacts: number;
  totalContacts: number;
  matchRate: number;
  status: 'completed' | 'enriching' | 'scheduled';
  creditsUsed: number;
  nextRerunDate?: string;
  industries: string[];
  rerunCount?: number;
  lastRerun?: RerunSnapshot;
}

const MOCK_PAST_RUNS: ABMRun[] = [
  {
    id: 'run-001',
    name: 'Q1 2026 Enterprise Tech ABM',
    fileName: 'enterprise_tech_q1.csv',
    date: '2026-03-05',
    companies: 20,
    matchedContacts: 1389,
    totalContacts: 1864,
    matchRate: 74.5,
    status: 'completed',
    creditsUsed: 14,
    industries: ['Enterprise Tech', 'SaaS/Software'],
  },
  {
    id: 'run-002',
    name: 'Healthcare Expansion List',
    fileName: 'healthcare_targets.csv',
    date: '2026-02-20',
    companies: 35,
    matchedContacts: 2104,
    totalContacts: 3200,
    matchRate: 65.8,
    status: 'completed',
    creditsUsed: 21,
    nextRerunDate: '2026-03-20',
    industries: ['Healthcare', 'Pharma'],
    rerunCount: 1,
    lastRerun: {
      matchedContacts: 1842,
      totalContacts: 3200,
      matchRate: 57.6,
      date: '2026-02-13',
      newContactsFound: 262,
      newEmailsVerified: 218,
      newPhonesVerified: 134,
      coverageImprovement: 8.2,
    },
  },
  {
    id: 'run-003',
    name: 'FinTech Pipeline Build',
    fileName: 'fintech_abm_feb.csv',
    date: '2026-02-10',
    companies: 15,
    matchedContacts: 890,
    totalContacts: 1150,
    matchRate: 77.4,
    status: 'enriching',
    creditsUsed: 9,
    nextRerunDate: '2026-03-10',
    industries: ['Financial Services'],
  },
  {
    id: 'run-004',
    name: 'APAC Market Entry',
    fileName: 'apac_companies.csv',
    date: '2026-01-28',
    companies: 42,
    matchedContacts: 1567,
    totalContacts: 2890,
    matchRate: 54.2,
    status: 'completed',
    creditsUsed: 16,
    nextRerunDate: '2026-03-28',
    industries: ['Enterprise Tech', 'E-Commerce', 'Financial Services'],
  },
];

const MOCK_DOWNLOAD_HISTORY = [
  { id: 1, date: '2026-03-08', contacts: 100, format: 'CSV', credits: 1 },
  { id: 2, date: '2026-03-05', contacts: 50, format: 'CSV', credits: 1 },
  { id: 3, date: '2026-02-28', contacts: 250, format: 'CSV', credits: 3 },
  { id: 4, date: '2026-02-20', contacts: 100, format: 'CSV', credits: 1 },
];

// ─── ICP Interface ────────────────────────────────────────────────────────────

interface ICP {
  industries: string[];
  jobFunctions: string[];
  seniorityLevels: string[];
  jobTitles: string[];
  countries: string[];
  companySizes: string[];
  revenueRange: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DataPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [talSubTab, setTalSubTab] = useState('upload');
  const [analyticsSubTab, setAnalyticsSubTab] = useState('analytics');
  const [changesSubTab, setChangesSubTab] = useState('changes');
  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const suppressionInputRef = useRef<HTMLInputElement>(null);

  // Suppression list
  const [suppressionList, setSuppressionList] = useState<{ name: string; type: 'domains' | 'emails' | 'companies'; count: number; date: string }[]>([
    { name: 'existing_customers.csv', type: 'domains', count: 342, date: '2026-03-01' },
    { name: 'do_not_contact.csv', type: 'emails', count: 1205, date: '2026-02-18' },
  ]);
  const [suppressionUploading, setSuppressionUploading] = useState(false);
  const [suppressionDrag, setSuppressionDrag] = useState(false);
  const [applySuppressionToTAL, setApplySuppressionToTAL] = useState(true);

  // ICP
  const [icp, setIcp] = useState<ICP>({
    industries: [],
    jobFunctions: [],
    seniorityLevels: [],
    jobTitles: [],
    countries: [],
    companySizes: [],
    revenueRange: '',
  });
  const [savedICP, setSavedICP] = useState<ICP | null>(null);

  // TAL
  const [talData, setTalData] = useState<TALCompany[] | null>(null);
  const [talFilter, setTalFilter] = useState<'all' | 'full' | 'partial' | 'none'>('all');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Multi-step processing
  const [processingStep, setProcessingStep] = useState(-1);
  const [stepProgress, setStepProgress] = useState(0);
  const [processingLog, setProcessingLog] = useState<string[]>([]);
  const [recordsProcessed, setRecordsProcessed] = useState(0);

  // Download contacts from TAL
  const [showContactDownload, setShowContactDownload] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [downloadingContacts, setDownloadingContacts] = useState(false);

  // Past ABM runs
  const [pastRuns, setPastRuns] = useState<ABMRun[]>(MOCK_PAST_RUNS);
  const [rerunningId, setRerunningId] = useState<string | null>(null);
  const [rerunStep, setRerunStep] = useState(-1);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);
  const [showRerunResult, setShowRerunResult] = useState<string | null>(null);

  // Match Analytics
  const matchData = { totalMatched: 12450, totalUnmatched: 3210, matchRate: 79.5, icpFitScore: 84 };
  const industryBreakdown = [
    { name: 'Enterprise Tech', matched: 2845, total: 3500 },
    { name: 'Healthcare', matched: 2100, total: 2650 },
    { name: 'Financial Services', matched: 1890, total: 2200 },
    { name: 'SaaS/Software', matched: 2345, total: 2900 },
    { name: 'Manufacturing', matched: 1560, total: 2100 },
    { name: 'Clean Energy', matched: 1710, total: 2450 },
  ];
  const jobLevelBreakdown = [
    { level: 'C-Suite', matched: 2500, total: 3000 },
    { level: 'VP / SVP', matched: 3200, total: 3800 },
    { level: 'Director', matched: 3500, total: 4200 },
    { level: 'Manager', matched: 2400, total: 3200 },
    { level: 'IC', matched: 850, total: 1470 },
  ];
  const regionBreakdown = [
    { name: 'North America', matched: 5200, total: 6500 },
    { name: 'Europe', matched: 3400, total: 4200 },
    { name: 'Asia Pacific', matched: 2100, total: 2800 },
    { name: 'Middle East', matched: 890, total: 1200 },
    { name: 'Latin America', matched: 860, total: 910 },
  ];

  // Download
  const [downloadFormat, setDownloadFormat] = useState('csv');
  const [creditBalance, setCreditBalance] = useState(45);

  // ─── ICP Helpers ──────────────────────────────────────────────────────────

  const toggleItem = (field: keyof ICP, value: string) => {
    setIcp(prev => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const addJobTitle = () => {
    const t = currentJobTitle.trim();
    if (t && !icp.jobTitles.includes(t)) {
      setIcp(prev => ({ ...prev, jobTitles: [...prev.jobTitles, t] }));
      setCurrentJobTitle('');
    }
  };

  const saveICP = async () => {
    setSavedICP(icp);
    try {
      await fetch('/api/audience/icp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(icp) });
    } catch { /* prototype */ }
  };

  // ─── Suppression List Helpers ────────────────────────────────────────────

  const handleSuppressionDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSuppressionDrag(e.type === 'dragenter' || e.type === 'dragover');
  };

  const simulateSuppressionUpload = (fileName?: string) => {
    setSuppressionUploading(true);
    const types: Array<'domains' | 'emails' | 'companies'> = ['domains', 'emails', 'companies'];
    setTimeout(() => {
      setSuppressionList(prev => [...prev, {
        name: fileName || 'suppression_list.csv',
        type: types[Math.floor(Math.random() * types.length)],
        count: Math.floor(Math.random() * 800) + 100,
        date: new Date().toISOString().split('T')[0],
      }]);
      setSuppressionUploading(false);
    }, 1200);
  };

  const handleSuppressionDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setSuppressionDrag(false);
    const file = e.dataTransfer.files?.[0];
    simulateSuppressionUpload(file?.name);
  };

  const handleSuppressionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateSuppressionUpload(file.name);
  };

  const removeSuppressionItem = (index: number) => {
    setSuppressionList(prev => prev.filter((_, i) => i !== index));
  };

  // ─── Multi-step Processing ──────────────────────────────────────────────

  const runProcessingSteps = useCallback(() => {
    setUploading(true);
    setUploadComplete(false);
    setProcessingStep(0);
    setStepProgress(0);
    setProcessingLog([]);
    setRecordsProcessed(0);

    let currentStep = 0;
    let progress = 0;

    const logMessages = [
      ['Receiving file upload...', 'File size: 4.2 KB', 'Format: CSV detected', 'Columns validated: 5 found'],
      ['Parsing 30 company records...', 'Extracting domains...', 'Validating company names...', '30 accounts parsed successfully'],
      ['Connecting to contact database...', 'Running fuzzy match on 30 domains...', 'Querying 280M+ contact records...', 'Found 1,864 potential contacts', 'Cross-referencing job titles...'],
      ['Matching against ICP criteria...', 'Filtering by seniority levels...', 'Applying industry filters...', '1,389 contacts matched ICP'],
      ['Verifying email deliverability...', 'Checking phone number validity...', 'Enriching LinkedIn profiles...', '1,188 emails verified', '686 phone numbers verified'],
      ['Calculating coverage scores...', 'Generating industry breakdown...', 'Building analytics dashboard...', 'Processing complete!'],
    ];

    const advanceStep = () => {
      if (currentStep >= PROCESSING_STEPS.length) {
        setUploading(false);
        setUploadComplete(true);
        setTalData(MOCK_TAL_COMPANIES);
        setProcessingStep(-1);
        return;
      }

      setProcessingStep(currentStep);
      setStepProgress(0);
      progress = 0;

      // Add log messages one by one
      const msgs = logMessages[currentStep] || [];
      msgs.forEach((msg, i) => {
        setTimeout(() => {
          setProcessingLog(prev => [...prev, msg]);
        }, (i + 1) * (PROCESSING_STEPS[currentStep].duration / (msgs.length + 1)));
      });

      // Animate progress and records
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        setStepProgress(progress);
        setRecordsProcessed(prev => Math.min(prev + Math.floor(Math.random() * 50 + 10), 1864));
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, PROCESSING_STEPS[currentStep].duration / 6);

      setTimeout(() => {
        clearInterval(interval);
        setStepProgress(100);
        currentStep++;
        advanceStep();
      }, PROCESSING_STEPS[currentStep].duration);
    };

    advanceStep();
  }, []);

  // ─── TAL Helpers ──────────────────────────────────────────────────────────

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); runProcessingSteps(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) runProcessingSteps(); };

  // TAL analytics
  const talStats = talData ? {
    total: talData.length,
    full: talData.filter(c => c.status === 'full').length,
    partial: talData.filter(c => c.status === 'partial').length,
    none: talData.filter(c => c.status === 'none').length,
    totalContacts: talData.reduce((s, c) => s + c.totalContacts, 0),
    matchedContacts: talData.reduce((s, c) => s + c.matchedContacts, 0),
    emailsFound: talData.reduce((s, c) => s + c.emailsFound, 0),
    phonesFound: talData.reduce((s, c) => s + c.phonesFound, 0),
  } : null;

  const filteredTal = talData?.filter(c => talFilter === 'all' || c.status === talFilter) ?? [];

  // TAL industry breakdown
  const talIndustryMap = talData ? talData.reduce<Record<string, { companies: number; contacts: number; matched: number }>>((acc, c) => {
    if (!acc[c.industry]) acc[c.industry] = { companies: 0, contacts: 0, matched: 0 };
    acc[c.industry].companies++;
    acc[c.industry].contacts += c.totalContacts;
    acc[c.industry].matched += c.matchedContacts;
    return acc;
  }, {}) : {};

  // ─── Download Contacts from TAL ─────────────────────────────────────────

  const toggleCompanySelect = (id: number) => {
    setSelectedCompanies(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAllCompanies = () => {
    if (!talData) return;
    const available = talData.filter(c => c.status !== 'none').map(c => c.id);
    setSelectedCompanies(prev => prev.length === available.length ? [] : available);
  };

  const getSelectedContactCount = () => {
    if (!talData) return 0;
    return talData.filter(c => selectedCompanies.includes(c.id)).reduce((s, c) => s + c.matchedContacts, 0);
  };

  const getSelectedCreditCost = () => Math.max(1, Math.ceil(getSelectedContactCount() / 100));

  const handleContactDownload = () => {
    const cost = getSelectedCreditCost();
    if (creditBalance < cost) return;
    setDownloadingContacts(true);
    setTimeout(() => {
      const contacts = getSelectedContactCount();
      const headers = ['First Name','Last Name','Title','Company','Email','Phone','LinkedIn'];
      const rows = Array.from({ length: contacts }, (_, i) => [`Contact${i+1}`,`User${i+1}`,'VP Sales','Acme Corp',`c${i+1}@example.com`,`+1-555-${String(i+1).padStart(4,'0')}`,`linkedin.com/in/contact${i+1}`]);
      const csv = [headers,...rows].map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `tal_contacts_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(url);
      setCreditBalance(prev => prev - cost);
      setDownloadingContacts(false);
      setShowContactDownload(false);
      setSelectedCompanies([]);
    }, 2000);
  };

  // ─── Re-run ABM ────────────────────────────────────────────────────────

  const handleRerun = (runId: string) => {
    setRerunningId(runId);
    setRerunStep(0);
    setShowRerunResult(null);

    const rerunSteps = [
      { label: 'Re-fetching account list...', duration: 1200 },
      { label: 'Querying updated database...', duration: 2000 },
      { label: 'Finding new contacts since last run...', duration: 1800 },
      { label: 'Enriching newly found records...', duration: 1500 },
      { label: 'Updating coverage analytics...', duration: 1000 },
    ];

    let step = 0;
    const advance = () => {
      if (step >= rerunSteps.length) {
        setRerunningId(null);
        setRerunStep(-1);
        // Save snapshot of old data, then update with improved numbers
        setPastRuns(prev => prev.map(r => {
          if (r.id !== runId) return r;
          const newContacts = Math.floor(Math.random() * 200) + 80;
          const newEmails = Math.floor(newContacts * (0.7 + Math.random() * 0.2));
          const newPhones = Math.floor(newContacts * (0.4 + Math.random() * 0.2));
          const oldMatchRate = r.matchRate;
          const newMatchedContacts = r.matchedContacts + newContacts;
          const newMatchRate = Math.min(95, (newMatchedContacts / r.totalContacts) * 100);
          const coverageImprovement = newMatchRate - oldMatchRate;
          return {
            ...r,
            lastRerun: {
              matchedContacts: r.matchedContacts,
              totalContacts: r.totalContacts,
              matchRate: oldMatchRate,
              date: r.date,
              newContactsFound: newContacts,
              newEmailsVerified: newEmails,
              newPhonesVerified: newPhones,
              coverageImprovement: coverageImprovement,
            },
            matchedContacts: newMatchedContacts,
            matchRate: newMatchRate,
            date: new Date().toISOString().split('T')[0],
            status: 'completed' as const,
            rerunCount: (r.rerunCount || 0) + 1,
            nextRerunDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          };
        }));
        // Auto-expand the comparison view
        setShowRerunResult(runId);
        setExpandedRun(runId);
        return;
      }
      setRerunStep(step);
      setTimeout(() => {
        step++;
        advance();
      }, rerunSteps[step].duration);
    };
    advance();
  };

  // Download
  const getDownloadStats = () => { const cost = Math.ceil(matchData.totalMatched / 100); return { cost, canDownload: creditBalance >= cost }; };
  const handleDownload = (isSample: boolean) => {
    const contacts = isSample ? 25 : matchData.totalMatched;
    const cost = isSample ? 0 : getDownloadStats().cost;
    if (!isSample && !getDownloadStats().canDownload) return;
    const headers = ['First Name','Last Name','Title','Company','Email','Phone'];
    const rows = Array.from({ length: contacts }, (_, i) => [`Contact${i+1}`,`User${i+1}`,'VP Sales','Acme Corp',`c${i+1}@example.com`,`+1-555-${String(i+1).padStart(4,'0')}`]);
    const csv = [headers,...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `contacts_${isSample ? 'sample' : 'full'}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(url);
    if (!isSample) setCreditBalance(prev => prev - cost);
  };

  const pct = (a: number, b: number) => b > 0 ? (a / b) * 100 : 0;
  const filteredCountries = COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));

  const RERUN_STEPS_LABELS = [
    'Re-fetching account list...',
    'Querying updated database...',
    'Finding new contacts since last run...',
    'Enriching newly found records...',
    'Updating coverage analytics...',
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  const TAB_ICONS: Record<string, React.ReactNode> = {
    icp: <Sparkles className="w-4 h-4" />,
    analytics: <BarChart3 className="w-4 h-4" />,
    tal: <Upload className="w-4 h-4" />,
    runs: <RefreshCw className="w-4 h-4" />,
    download: <Download className="w-4 h-4" />,
    health: <HeartPulse className="w-4 h-4" />,
    changes: <Activity className="w-4 h-4" />,
    webanalytics: <Globe className="w-4 h-4" />,
    technographics: <Cpu className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header — professional */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-8 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeTab !== 'home' && (
                <button onClick={() => setActiveTab('home')} className="text-gray-500 hover:text-gray-700 transition">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              )}
              <div>
                <h1 className="text-lg font-semibold text-[#1a1a2e]">Your Audience</h1>
                <p className="text-gray-500 text-xs mt-0.5">Build, enrich, and download your ideal customer profiles</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-1.5 border border-amber-200">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">{creditBalance} credits</span>
            </div>
          </div>
        </div>
        {/* Sub-tabs bar — only show when drilled in */}
        {activeTab === 'tal' && (
          <div className="px-8 flex gap-0 border-t border-gray-100">
            {[
              { id: 'upload', label: 'ABM / TAL Upload' },
              { id: 'runs', label: 'Past ABM Runs' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setTalSubTab(tab.id)}
                className={`flex items-center gap-1.5 py-2.5 px-4 text-[13px] font-medium transition-all relative ${talSubTab === tab.id ? 'text-[#e85d3a]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
                {talSubTab === tab.id && <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#e85d3a] rounded-full" />}
              </button>
            ))}
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="px-8 flex gap-0 border-t border-gray-100">
            {[
              { id: 'analytics', label: 'ICP Match Analytics' },
              { id: 'health', label: 'Data Health' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setAnalyticsSubTab(tab.id)}
                className={`flex items-center gap-1.5 py-2.5 px-4 text-[13px] font-medium transition-all relative ${analyticsSubTab === tab.id ? 'text-[#e85d3a]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
                {analyticsSubTab === tab.id && <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#e85d3a] rounded-full" />}
              </button>
            ))}
          </div>
        )}
        {activeTab === 'changes' && (
          <div className="px-8 flex gap-0 border-t border-gray-100">
            {[
              { id: 'changes', label: 'Job & Account Changes' },
              { id: 'webanalytics', label: 'Website Analytics' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setChangesSubTab(tab.id)}
                className={`flex items-center gap-1.5 py-2.5 px-4 text-[13px] font-medium transition-all relative ${changesSubTab === tab.id ? 'text-[#e85d3a]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
                {changesSubTab === tab.id && <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#e85d3a] rounded-full" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content — full width */}
      <div className="px-8 py-5">

        {/* ═══════════════════ HOME / LANDING PAGE ═══════════════════ */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Feature Cards Grid - 3x2 */}
            <div className="grid grid-cols-3 gap-6">
              {/* Card 1: Define ICP */}
              <button onClick={() => setActiveTab('icp')} className="group text-left">
                <div className="border border-gray-200 rounded-lg p-5 bg-white hover:border-gray-300 hover:shadow-sm transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-[#e85d3a]" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition" />
                  </div>
                  <h3 className="text-[#1a1a2e] font-semibold text-base mb-2">Define ICP</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">Build your ideal customer profile with industry, job function, seniority, and geo filters</p>
                </div>
              </button>

              {/* Card 2: ABM Campaigns */}
              <button onClick={() => { setActiveTab('tal'); setTalSubTab('upload'); }} className="group text-left">
                <div className="border border-gray-200 rounded-lg p-5 bg-white hover:border-gray-300 hover:shadow-sm transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 flex-shrink-0">
                      <Upload className="w-4 h-4 text-[#1a1a2e]" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition" />
                  </div>
                  <h3 className="text-[#1a1a2e] font-semibold text-base mb-2">ABM Campaigns</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">Upload target account lists, run ABM matching, and manage past campaign runs</p>
                </div>
              </button>

              {/* Card 3: Audience Insights */}
              <button onClick={() => { setActiveTab('analytics'); setAnalyticsSubTab('analytics'); }} className="group text-left">
                <div className="border border-gray-200 rounded-lg p-5 bg-white hover:border-gray-300 hover:shadow-sm transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 flex-shrink-0">
                      <BarChart3 className="w-4 h-4 text-[#059669]" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition" />
                  </div>
                  <h3 className="text-[#1a1a2e] font-semibold text-base mb-2">Audience Insights</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">ICP match analytics, data health scores, and enrichment recommendations</p>
                </div>
              </button>

              {/* Card 4: Buyer Signals */}
              <button onClick={() => { setActiveTab('changes'); setChangesSubTab('changes'); }} className="group text-left">
                <div className="border border-gray-200 rounded-lg p-5 bg-white hover:border-gray-300 hover:shadow-sm transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-50 flex-shrink-0">
                      <Activity className="w-4 h-4 text-[#7c3aed]" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition" />
                  </div>
                  <h3 className="text-[#1a1a2e] font-semibold text-base mb-2">Buyer Signals</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">Track job changes, account movements, and website visitor analytics</p>
                </div>
              </button>

              {/* Card 5: Technographics */}
              <button onClick={() => setActiveTab('technographics')} className="group text-left">
                <div className="border border-gray-200 rounded-lg p-5 bg-white hover:border-gray-300 hover:shadow-sm transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 flex-shrink-0">
                      <Cpu className="w-4 h-4 text-[#2563eb]" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition" />
                  </div>
                  <h3 className="text-[#1a1a2e] font-semibold text-base mb-2">Technographics</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">Technology stack tracking, adoption trends, and competitive intelligence</p>
                </div>
              </button>

              {/* Card 6: Download Center */}
              <button onClick={() => setActiveTab('download')} className="group text-left">
                <div className="border border-gray-200 rounded-lg p-5 bg-white hover:border-gray-300 hover:shadow-sm transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 flex-shrink-0">
                      <Download className="w-4 h-4 text-[#d97706]" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition" />
                  </div>
                  <h3 className="text-[#1a1a2e] font-semibold text-base mb-2">Download Center</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">Export enriched contact lists, suppression files, and campaign reports</p>
                </div>
              </button>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-4 gap-4 mt-8">
              {[
                { label: 'Total Contacts', value: '280M+' },
                { label: 'Companies Tracked', value: '45M+' },
                { label: 'Data Health Score', value: '78%' },
                { label: 'Active Campaigns', value: '4' },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1a1a2e]">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB 1: DEFINE ICP ═══════════════════ */}
        {activeTab === 'icp' && (
          <div className={`${savedICP ? 'grid grid-cols-3 gap-8' : ''}`}>
            <div className={`${savedICP ? 'col-span-2' : ''} space-y-6`}>

              {/* Industries */}
              <div className="gradient-card rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 icon-badge icon-badge-indigo">
                    <Building2 className="w-4.5 h-4.5 text-[#1a1a2e]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">Target Industries</h3>
                    <p className="text-xs text-gray-400">Select one or more industries</p>
                  </div>
                  {icp.industries.length > 0 && <span className="ml-auto px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">{icp.industries.length} selected</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map(v => (
                    <button key={v} onClick={() => toggleItem('industries', v)}
                      className={`chip-select px-3.5 py-1.5 rounded-full text-sm font-medium ${icp.industries.includes(v) ? 'chip-active' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'}`}
                    >{v}</button>
                  ))}
                </div>
              </div>

              {/* Job Function */}
              <div className="gradient-card rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 icon-badge icon-badge-violet">
                    <Users className="w-4.5 h-4.5 text-[#1a1a2e]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">Job Function</h3>
                    <p className="text-xs text-gray-400">What departments do your target buyers work in?</p>
                  </div>
                  {icp.jobFunctions.length > 0 && <span className="ml-auto px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">{icp.jobFunctions.length} selected</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {JOB_FUNCTIONS.map(v => (
                    <button key={v} onClick={() => toggleItem('jobFunctions', v)}
                      className={`chip-select px-3.5 py-1.5 rounded-full text-sm font-medium ${icp.jobFunctions.includes(v) ? 'chip-active' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'}`}
                    >{v}</button>
                  ))}
                </div>
              </div>

              {/* Seniority */}
              <div className="gradient-card rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 icon-badge icon-badge-amber">
                    <TrendingUp className="w-4.5 h-4.5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">Seniority Level</h3>
                    <p className="text-xs text-gray-400">Which seniority levels are you targeting?</p>
                  </div>
                  {icp.seniorityLevels.length > 0 && <span className="ml-auto px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">{icp.seniorityLevels.length} selected</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {SENIORITY_LEVELS.map(v => (
                    <button key={v} onClick={() => toggleItem('seniorityLevels', v)}
                      className={`chip-select px-3.5 py-1.5 rounded-full text-sm font-medium ${icp.seniorityLevels.includes(v) ? 'chip-active' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'}`}
                    >{v}</button>
                  ))}
                </div>
              </div>

              {/* Job Titles */}
              <div className="gradient-card rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 icon-badge icon-badge-emerald">
                    <FileText className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">Job Titles</h3>
                    <p className="text-xs text-gray-400">Add specific titles or pick from suggestions</p>
                  </div>
                  {icp.jobTitles.length > 0 && <span className="ml-auto px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">{icp.jobTitles.length} added</span>}
                </div>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={currentJobTitle} onChange={e => setCurrentJobTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addJobTitle(); } }}
                    placeholder="Type a job title and press Enter..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-[#e85d3a]/20 focus:border-[#e85d3a]/40 transition-all" />
                  <button onClick={addJobTitle} className="px-4 py-2.5 rounded-lg bg-[#1a1a2e] text-white hover:bg-[#2a2a45] transition-all flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {/* Suggestions */}
                <div className="mb-3">
                  <p className="text-xs text-gray-400 font-medium mb-2">Suggested titles:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_JOB_TITLES.filter(t => !icp.jobTitles.includes(t)).slice(0, 8).map(t => (
                      <button key={t} onClick={() => setIcp(prev => ({ ...prev, jobTitles: [...prev.jobTitles, t] }))}
                        className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium hover:bg-indigo-100  transition-all">
                        + {t}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Selected */}
                {icp.jobTitles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {icp.jobTitles.map(t => (
                      <div key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 border-gray-200">
                        {t}
                        <button onClick={() => setIcp(prev => ({ ...prev, jobTitles: prev.jobTitles.filter(x => x !== t) }))} className="hover:bg-blue-200 rounded p-0.5 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Countries */}
              <div className="gradient-card rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 icon-badge icon-badge-sky">
                    <Search className="w-4.5 h-4.5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">Target Countries</h3>
                    <p className="text-xs text-gray-400">Where are your target accounts located?</p>
                  </div>
                  {icp.countries.length > 0 && <span className="ml-auto px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">{icp.countries.length} selected</span>}
                </div>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input type="text" value={countrySearch} onChange={e => setCountrySearch(e.target.value)}
                    placeholder="Search countries..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm placeholder-gray-400 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e85d3a]/20 focus:border-[#e85d3a]/40 transition-all" />
                </div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {filteredCountries.map(c => (
                    <button key={c} onClick={() => toggleItem('countries', c)}
                      className={`chip-select px-3 py-1.5 rounded-full text-sm font-medium ${icp.countries.includes(c) ? 'chip-active' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'}`}
                    >{c}</button>
                  ))}
                </div>
              </div>

              {/* Company Size */}
              <div className="gradient-card rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 icon-badge icon-badge-slate">
                    <Building2 className="w-4.5 h-4.5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">Company Size</h3>
                    <p className="text-xs text-gray-400">Number of employees</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {COMPANY_SIZES.map(v => (
                    <button key={v} onClick={() => toggleItem('companySizes', v)}
                      className={`chip-select px-4 py-2.5 rounded-lg text-sm font-medium border ${icp.companySizes.includes(v) ? 'chip-active border-transparent' : 'bg-white text-gray-600 border-gray-200  hover:bg-gray-50'}`}
                    >{v} employees</button>
                  ))}
                </div>
              </div>

              {/* Revenue Range */}
              <div className="gradient-card rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 icon-badge icon-badge-emerald">
                    <Zap className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">Annual Revenue</h3>
                    <p className="text-xs text-gray-400">Target company revenue range</p>
                  </div>
                </div>
                <div className="relative">
                  <select value={icp.revenueRange} onChange={e => setIcp({ ...icp, revenueRange: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm appearance-none cursor-pointer hover:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all">
                    <option value="">Select revenue range</option>
                    {REVENUE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <button onClick={saveICP} className="w-full px-6 py-3.5 rounded-lg bg-[#1a1a2e] text-white hover:bg-[#2a2a45] transition-all">Save ICP</button>

              {/* Suppression List */}
              <div className="gradient-card rounded-lg p-5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 icon-badge icon-badge-rose">
                      <Shield className="w-4.5 h-4.5 text-rose-500" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Suppression List</h3>
                  </div>
                  {suppressionList.length > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                      {suppressionList.reduce((s, l) => s + l.count, 0).toLocaleString()} records excluded
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4">Upload domains, emails, or company names to exclude from your audience</p>

                {/* Current suppression lists */}
                {suppressionList.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {suppressionList.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.count.toLocaleString()} {item.type} &middot; Uploaded {item.date}</p>
                          </div>
                        </div>
                        <button onClick={() => removeSuppressionItem(i)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-all">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload area */}
                <div onDragEnter={handleSuppressionDrag} onDragLeave={handleSuppressionDrag} onDragOver={handleSuppressionDrag} onDrop={handleSuppressionDrop}
                  className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors ${suppressionDrag ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
                  <input ref={suppressionInputRef} type="file" accept=".csv,.xlsx,.xls,.txt" onChange={handleSuppressionFileChange} className="hidden" />
                  {suppressionUploading ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                      <span className="text-sm text-gray-600 font-medium">Processing suppression list...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-left">
                        <Upload className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-700 font-medium">Drop a CSV or Excel file here</p>
                          <p className="text-xs text-gray-400">Columns: domain, email, or company name</p>
                        </div>
                      </div>
                      <button onClick={() => suppressionInputRef.current?.click()}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors flex-shrink-0">
                        Browse
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ICP Summary Sidebar */}
            {savedICP && (
              <div className="col-span-1">
                <div className="sticky top-[140px] gradient-card rounded-lg p-5 space-y-5">
                  <div className="flex items-center gap-2 text-green-600 font-semibold"><CheckCircle className="w-5 h-5" /> ICP Saved</div>
                  {([
                    { key: 'industries', label: 'Industries', color: 'blue' },
                    { key: 'jobFunctions', label: 'Job Functions', color: 'violet' },
                    { key: 'seniorityLevels', label: 'Seniority', color: 'orange' },
                    { key: 'jobTitles', label: 'Job Titles', color: 'blue' },
                    { key: 'countries', label: 'Countries', color: 'green' },
                    { key: 'companySizes', label: 'Company Size', color: 'gray' },
                  ] as const).map(({ key, label, color }) => {
                    const arr = savedICP[key] as string[];
                    if (!arr || arr.length === 0) return null;
                    return (
                      <div key={key}>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {arr.map(v => (
                            <span key={v} className={`px-2 py-1 rounded-md text-xs font-medium bg-${color}-50 text-${color}-700`}>{v}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {savedICP.revenueRange && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Revenue</h4>
                      <p className="text-gray-700 text-sm font-medium">{REVENUE_RANGES.find(r => r.value === savedICP.revenueRange)?.label || savedICP.revenueRange}</p>
                    </div>
                  )}
                  {suppressionList.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Suppression</h4>
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-sm text-red-600 font-medium">{suppressionList.reduce((s, l) => s + l.count, 0).toLocaleString()} records excluded</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{suppressionList.length} list{suppressionList.length > 1 ? 's' : ''} uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ TAB 2: ABM / TAL UPLOAD ═══════════════════ */}
        {(activeTab === 'tal' && talSubTab === 'upload') && (
          <div className="space-y-8">

            {/* Suppression from ICP notice */}
            {suppressionList.length > 0 && (
              <div className={`rounded-lg border p-4 flex items-center justify-between transition-colors ${applySuppressionToTAL ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${applySuppressionToTAL ? 'bg-red-100' : 'bg-gray-200'}`}>
                    <Shield className={`w-4.5 h-4.5 ${applySuppressionToTAL ? 'text-red-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Apply Suppression from ICP
                    </p>
                    <p className="text-xs text-gray-500">
                      {applySuppressionToTAL
                        ? `${suppressionList.reduce((s, l) => s + l.count, 0).toLocaleString()} records from ${suppressionList.length} suppression list${suppressionList.length > 1 ? 's' : ''} will be excluded from results`
                        : 'Suppression lists are not applied \u2014 all matches will be included'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setApplySuppressionToTAL(!applySuppressionToTAL)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${applySuppressionToTAL ? 'bg-red-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${applySuppressionToTAL ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
            )}

            {/* Upload Area (before upload or while processing) */}
            {!uploadComplete && !uploading && (
              <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${dragActive ? 'border-gray-400 bg-gray-100 scale-[1.01]' : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-100'}`}>
                <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="hidden" />
                <div className="w-16 h-16 rounded-lg icon-badge-indigo flex items-center justify-center mx-auto mb-5">
                  <Upload className="w-7 h-7 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload your Target Account List</h3>
                <p className="text-gray-500 mb-1">Drag and drop a CSV or Excel file with company names, domains, or both</p>
                <p className="text-xs text-gray-400 mb-6">Required: Company Name or Domain. Optional: Industry, Size, Country</p>
                <button onClick={() => fileInputRef.current?.click()} className="px-8 py-3.5 rounded-lg bg-[#1a1a2e] text-white hover:bg-[#2a2a45] transition-all">Choose File</button>
              </div>
            )}

            {/* ─── Multi-Step Processing Animation ─── */}
            {uploading && (
              <div className="space-y-6">
                {/* Main processing card */}
                <div className="gradient-card rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 icon-badge icon-badge-violet">
                        <Loader2 className="w-5 h-5 text-[#1a1a2e] animate-spin" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Processing Your Account List</h3>
                        <p className="text-indigo-400 text-sm font-medium">Matching against our database of 280M+ contacts across 45M+ companies</p>
                      </div>
                    </div>
                    {/* Overall progress */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Overall Progress</span>
                        <span className="font-semibold text-gray-700">{Math.round(((processingStep) / PROCESSING_STEPS.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                        <div className="bg-[#e85d3a] h-full rounded-full transition-all duration-500" style={{ width: `${((processingStep + (stepProgress / 100)) / PROCESSING_STEPS.length) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="p-8">
                    <div className="space-y-4">
                      {PROCESSING_STEPS.map((step, i) => {
                        const StepIcon = step.icon;
                        const isActive = i === processingStep;
                        const isDone = i < processingStep;
                        const isPending = i > processingStep;
                        return (
                          <div key={step.id} className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ${isActive ? 'bg-gray-50 border border-gray-200' : isDone ? 'bg-emerald-50/40 border border-emerald-200/60' : 'bg-gray-50/40 border border-gray-100/60'}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'icon-badge-violet' : isDone ? 'icon-badge-emerald' : 'bg-gray-100'}`}>
                              {isDone ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : isActive ? <Loader2 className="w-5 h-5 text-[#1a1a2e] animate-spin" /> : <StepIcon className="w-5 h-5 text-gray-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className={`text-sm font-semibold ${isActive ? 'text-indigo-700' : isDone ? 'text-emerald-700' : 'text-gray-400'}`}>{step.label}</h4>
                                {isDone && <span className="text-xs text-emerald-500 font-medium">Complete</span>}
                                {isPending && <span className="text-xs text-gray-400">Waiting</span>}
                              </div>
                              <p className={`text-xs mt-0.5 ${isActive ? 'text-indigo-400' : isDone ? 'text-emerald-500' : 'text-gray-400'}`}>{step.detail}</p>
                              {isActive && (
                                <div className="mt-2">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-[#e85d3a] h-full rounded-full transition-all duration-300" style={{ width: `${stepProgress}%` }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Live log terminal */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-400 text-xs ml-2 font-mono">processing-log</span>
                    <span className="text-gray-600 text-xs ml-auto font-mono">{recordsProcessed.toLocaleString()} records processed</span>
                  </div>
                  <div className="p-4 font-mono text-xs max-h-48 overflow-y-auto space-y-1">
                    {processingLog.map((msg, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-gray-600 flex-shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <span className={`${msg.includes('complete') || msg.includes('success') || msg.includes('verified') ? 'text-green-400' : msg.includes('Found') || msg.includes('matched') ? 'text-blue-400' : 'text-gray-300'}`}>{msg}</span>
                      </div>
                    ))}
                    {processingStep >= 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-gray-600 flex-shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <span className="text-yellow-400 animate-pulse">...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats during processing */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
                    <Database className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{recordsProcessed.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Records Scanned</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
                    <Users className="w-5 h-5 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{Math.floor(recordsProcessed * 0.74).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Contacts Matched</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-5 text-center">
                    <Clock className="w-5 h-5 text-[#1a1a2e] mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{processingStep + 1}/{PROCESSING_STEPS.length}</p>
                    <p className="text-xs text-gray-500">Steps Complete</p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAL Analytics (after upload) ─── */}
            {talStats && uploadComplete && (
              <>
                {/* Summary bar */}
                <div className="bg-green-50 border-green-200 rounded-lg border border-green-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">TAL Processing Complete</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Matched your account list against our database of 280M+ contacts in 10.0 seconds
                          {applySuppressionToTAL && suppressionList.length > 0 && (
                            <span className="inline-flex items-center gap-1 ml-2 text-red-600 font-medium">
                              <Shield className="w-3 h-3" /> Suppression applied ({suppressionList.reduce((s, l) => s + l.count, 0).toLocaleString()} excluded)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowContactDownload(!showContactDownload)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2a2a45] transition-colors">
                        <Download className="w-4 h-4" /> Download Contacts
                      </button>
                      <button onClick={() => { setTalData(null); setUploadComplete(false); setProcessingLog([]); setRecordsProcessed(0); }}
                        className="text-sm text-gray-500 font-medium hover:text-gray-700 px-3 py-2.5">Upload new list</button>
                    </div>
                  </div>
                </div>

                {/* Download contacts panel */}
                {showContactDownload && (
                  <div className="bg-white rounded-lg border-2 border-blue-200 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Download className="w-5 h-5 text-blue-600" /> Download Contacts
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Select companies to download their matched contacts. Each 100 contacts costs 1 credit.</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Credit Balance</p>
                          <p className="text-xl font-bold text-gray-900 flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-500" />{creditBalance}</p>
                        </div>
                      </div>
                    </div>

                    {/* Select all / summary */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={selectedCompanies.length === talData!.filter(c => c.status !== 'none').length && selectedCompanies.length > 0}
                          onChange={selectAllCompanies} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Select all companies with contacts</span>
                      </label>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">{selectedCompanies.length} companies selected</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-700 font-medium">{getSelectedContactCount().toLocaleString()} contacts</span>
                        <span className="text-gray-300">|</span>
                        <span className={`font-semibold ${creditBalance >= getSelectedCreditCost() ? 'text-blue-600' : 'text-red-600'}`}>
                          {getSelectedCreditCost()} credits required
                        </span>
                      </div>
                    </div>

                    {/* Company selection list */}
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {talData!.map(c => (
                        <label key={c.id} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${c.status === 'none' ? 'opacity-40 cursor-not-allowed' : selectedCompanies.includes(c.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" disabled={c.status === 'none'} checked={selectedCompanies.includes(c.id)}
                              onChange={() => toggleCompanySelect(c.id)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                            <div>
                              <span className="text-sm font-medium text-gray-900">{c.company}</span>
                              <span className="text-xs text-gray-400 ml-2">{c.domain}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-500">{c.matchedContacts} contacts</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.status === 'full' ? 'bg-green-100 text-green-700' : c.status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                              {c.status === 'full' ? 'Full' : c.status === 'partial' ? 'Partial' : 'None'}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Download button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      {creditBalance < getSelectedCreditCost() && selectedCompanies.length > 0 ? (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Insufficient credits. Need {getSelectedCreditCost()}, have {creditBalance}.</span>
                        </div>
                      ) : <div />}
                      <div className="flex items-center gap-3">
                        <button onClick={() => { setShowContactDownload(false); setSelectedCompanies([]); }}
                          className="px-4 py-2.5 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors">Cancel</button>
                        <button onClick={handleContactDownload}
                          disabled={selectedCompanies.length === 0 || creditBalance < getSelectedCreditCost() || downloadingContacts}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors ${selectedCompanies.length > 0 && creditBalance >= getSelectedCreditCost() ? 'bg-[#1a1a2e] hover:bg-[#2a2a45]' : 'bg-gray-300 cursor-not-allowed'}`}>
                          {downloadingContacts ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Preparing download...</>
                          ) : (
                            <><Download className="w-4 h-4" /> Download {getSelectedContactCount().toLocaleString()} Contacts ({getSelectedCreditCost()} credits)</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top-level stats */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { icon: Building2, label: 'Total Companies', value: talStats.total, badge: 'icon-badge-indigo', iconColor: 'text-gray-700', textColor: 'text-gray-800', sub: '' },
                    { icon: CheckCircle, label: 'Full Coverage', value: talStats.full, badge: 'icon-badge-emerald', iconColor: 'text-emerald-500', textColor: 'text-emerald-600', sub: 'with contacts' },
                    { icon: AlertTriangle, label: 'Partial', value: talStats.partial, badge: 'icon-badge-amber', iconColor: 'text-amber-500', textColor: 'text-amber-600', sub: 'limited contacts' },
                    { icon: AlertCircle, label: 'No Coverage', value: talStats.none, badge: 'icon-badge-rose', iconColor: 'text-rose-500', textColor: 'text-rose-500', sub: 'not found' },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 icon-badge ${s.badge}`}>
                          <s.icon className={`w-3.5 h-3.5 ${s.iconColor}`} />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{s.label}</span>
                      </div>
                      <p className={`text-3xl font-bold ${s.textColor} animate-count-up`}>{s.value}</p>
                      {s.sub && <p className="text-xs text-gray-400 mt-1">{s.sub}</p>}
                    </div>
                  ))}
                </div>

                {/* Contact coverage stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total Contacts Found', value: talStats.matchedContacts.toLocaleString(), sub: `/ ${talStats.totalContacts.toLocaleString()} targeted`, pctVal: pct(talStats.matchedContacts, talStats.totalContacts), barColor: 'bg-indigo-500', pctLabel: `${pct(talStats.matchedContacts, talStats.totalContacts).toFixed(1)}% match rate`, badge: 'icon-badge-indigo', iconColor: 'text-gray-700', icon: Users },
                    { label: 'Emails Found', value: talStats.emailsFound.toLocaleString(), sub: '', pctVal: pct(talStats.emailsFound, talStats.matchedContacts), barColor: 'bg-emerald-500', pctLabel: `${pct(talStats.emailsFound, talStats.matchedContacts).toFixed(0)}% of matched`, badge: 'icon-badge-emerald', iconColor: 'text-emerald-500', icon: CheckCircle },
                    { label: 'Phones Found', value: talStats.phonesFound.toLocaleString(), sub: '', pctVal: pct(talStats.phonesFound, talStats.matchedContacts), barColor: 'bg-violet-500', pctLabel: `${pct(talStats.phonesFound, talStats.matchedContacts).toFixed(0)}% of matched`, badge: 'icon-badge-violet', iconColor: 'text-violet-500', icon: Zap },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 icon-badge ${s.badge}`}>
                          <s.icon className={`w-3.5 h-3.5 ${s.iconColor}`} />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{s.label}</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{s.value} {s.sub && <span className="text-sm font-normal text-gray-400">{s.sub}</span>}</p>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden"><div className={`${s.barColor} h-full rounded-full`} style={{ width: `${s.pctVal}%` }} /></div>
                      <p className="text-xs text-gray-500 mt-1">{s.pctLabel}</p>
                    </div>
                  ))}
                </div>

                {/* Industry breakdown - compact grid with ring charts */}
                <div className="gradient-card rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 icon-badge icon-badge-indigo">
                      <BarChart3 className="w-3.5 h-3.5 text-gray-700" />
                    </div>
                    TAL Coverage by Industry
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(talIndustryMap).sort((a, b) => b[1].companies - a[1].companies).map(([industry, data]) => {
                      const matchPct = pct(data.matched, data.contacts);
                      const circumference = 2 * Math.PI * 28;
                      const offset = circumference - (matchPct / 100) * circumference;
                      return (
                        <div key={industry} className="bg-white rounded-lg p-4 flex flex-col items-center text-center border border-gray-100">
                          <div className="relative w-16 h-16 mb-2">
                            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                              <circle cx="32" cy="32" r="28" fill="none" stroke="#e0e7ff" strokeWidth="5" />
                              <circle cx="32" cy="32" r="28" fill="none" stroke="#6366f1" strokeWidth="5"
                                strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">{matchPct.toFixed(0)}%</span>
                          </div>
                          <p className="text-xs font-semibold text-gray-900 leading-tight">{industry}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{data.companies} co &middot; {data.matched}/{data.contacts}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Company table with filter */}
                <div className="gradient-card rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Account List Detail</h3>
                    <div className="flex gap-1.5">
                      {[
                        { key: 'all' as const, label: `All (${talStats.total})` },
                        { key: 'full' as const, label: `Full (${talStats.full})` },
                        { key: 'partial' as const, label: `Partial (${talStats.partial})` },
                        { key: 'none' as const, label: `None (${talStats.none})` },
                      ].map(f => (
                        <button key={f.key} onClick={() => setTalFilter(f.key)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${talFilter === f.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >{f.label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-left">
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500">Company</th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500">Industry</th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500">Country</th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Contacts</th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Emails</th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Phones</th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTal.map((c, i) => (
                          <tr key={c.id} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-gray-900">{c.company}</p>
                              <p className="text-xs text-gray-400">{c.domain}</p>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{c.industry}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{c.country}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">{c.matchedContacts}/{c.totalContacts}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-right">{c.emailsFound}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-right">{c.phonesFound}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                c.status === 'full' ? 'bg-green-100 text-green-700' :
                                c.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {c.status === 'full' ? 'Full' : c.status === 'partial' ? 'Partial' : 'None'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════════════ TAB 3: PAST ABM RUNS ═══════════════════ */}
        {(activeTab === 'tal' && talSubTab === 'runs') && (
          <div className="space-y-6">
            {/* Info banner */}
            <div className="gradient-card rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 icon-badge icon-badge-indigo flex-shrink-0">
                  <RefreshCw className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Re-run Your ABM Lists Anytime</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Our database is continuously enriched with new contacts and verified data. Re-running your ABM lists every 5-7 days
                    typically yields <span className="font-semibold text-blue-700">15-25% more matched contacts</span> as we add new records.
                    We recommend scheduling regular re-runs to maximize your pipeline coverage.
                  </p>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span><span className="font-semibold">280M+</span> contacts updated daily</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span><span className="font-semibold">~20%</span> avg. improvement per re-run</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-[#1a1a2e]" />
                      <span><span className="font-semibold">No extra</span> credits for re-runs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Re-running overlay */}
            {rerunningId && (
              <div className="gradient-card rounded-lg overflow-hidden border border-gray-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 icon-badge icon-badge-violet">
                      <Loader2 className="w-4 h-4 text-[#1a1a2e] animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-gray-800 font-semibold">Re-running: {pastRuns.find(r => r.id === rerunningId)?.name}</h3>
                      <p className="text-indigo-400 text-sm">Searching for new contacts added since last run...</p>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#e85d3a] h-full rounded-full transition-all duration-500" style={{ width: `${((rerunStep + 1) / 5) * 100}%` }} />
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  {RERUN_STEPS_LABELS.map((label, i) => (
                    <div key={i} className={`flex items-center gap-3 text-sm ${i <= rerunStep ? 'text-gray-900' : 'text-gray-300'}`}>
                      {i < rerunStep ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : i === rerunStep ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                      )}
                      <span className={i === rerunStep ? 'font-medium' : ''}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past runs list */}
            <div className="space-y-4">
              {pastRuns.map(run => (
                <div key={run.id} className="gradient-card rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 icon-badge ${run.status === 'completed' ? 'icon-badge-emerald' : run.status === 'enriching' ? 'icon-badge-amber' : 'icon-badge-indigo'}`}>
                          {run.status === 'completed' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : run.status === 'enriching' ? <Loader2 className="w-5 h-5 text-amber-600 animate-spin" /> : <Clock className="w-5 h-5 text-gray-700" />}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{run.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1"><FileText className="w-3 h-3" />{run.fileName}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" />{run.date}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${run.status === 'completed' ? 'bg-green-100 text-green-700' : run.status === 'enriching' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                              {run.status === 'completed' ? 'Completed' : run.status === 'enriching' ? 'Enriching...' : 'Scheduled'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-all">
                          <Eye className="w-4 h-4" /> Details
                        </button>
                        <button onClick={() => handleRerun(run.id)} disabled={rerunningId !== null}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${rerunningId ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#1a1a2e] text-white hover:bg-[#2a2a45]'}`}>
                          <RotateCcw className="w-4 h-4" /> Re-run
                        </button>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-5 gap-3 mt-4">
                      <div className="bg-gray-50/60 rounded-lg p-3 text-center border border-white/60">
                        <p className="text-[10px] text-gray-400 font-medium">Companies</p>
                        <p className="text-lg font-bold text-gray-700">{run.companies}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center border border-indigo-100/60">
                        <p className="text-[10px] text-indigo-400 font-medium">Matched</p>
                        <p className="text-lg font-bold text-[#1a1a2e]">{run.matchedContacts.toLocaleString()}</p>
                      </div>
                      <div className="bg-emerald-50/50 rounded-lg p-3 text-center border border-emerald-100/60">
                        <p className="text-[10px] text-emerald-400 font-medium">Match Rate</p>
                        <p className="text-lg font-bold text-emerald-600">{run.matchRate.toFixed(1)}%</p>
                      </div>
                      <div className="bg-violet-50/50 rounded-lg p-3 text-center border border-violet-100/60">
                        <p className="text-[10px] text-violet-400 font-medium">Re-runs</p>
                        <p className="text-lg font-bold text-[#1a1a2e]">{run.rerunCount || 0}</p>
                      </div>
                      <div className="bg-gray-50/60 rounded-lg p-3 text-center border border-white/60">
                        <p className="text-[10px] text-gray-400 font-medium">Credits</p>
                        <p className="text-lg font-bold text-gray-700">{run.creditsUsed}</p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details + Improvement Audit */}
                  {expandedRun === run.id && (
                    <div className="border-t border-gray-100">

                      {/* Improvement Audit - shown when lastRerun exists */}
                      {run.lastRerun && (
                        <div className="p-6 bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                              <div className="w-6 h-6 icon-badge icon-badge-emerald">
                                <TrendingUp className="w-3 h-3 text-emerald-600" />
                              </div>
                              Re-run Improvement Audit
                              {showRerunResult === run.id && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold animate-pulse border border-emerald-200">NEW</span>}
                            </h4>
                            <span className="text-xs text-gray-500">
                              Compared: {run.lastRerun.date} vs {run.date}
                            </span>
                          </div>

                          {/* Before / After comparison */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            {/* Matched Contacts */}
                            <div className="gradient-card rounded-lg p-4">
                              <p className="text-xs text-gray-500 font-medium mb-2">Matched Contacts</p>
                              <div className="flex items-end justify-between">
                                <div>
                                  <p className="text-xs text-gray-400 line-through">{run.lastRerun.matchedContacts.toLocaleString()}</p>
                                  <p className="text-xl font-bold text-gray-900">{run.matchedContacts.toLocaleString()}</p>
                                </div>
                                <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-600 text-xs font-bold flex items-center gap-0.5 border border-emerald-200">
                                  <ArrowRight className="w-3 h-3 rotate-[-45deg]" />+{run.lastRerun.newContactsFound}
                                </span>
                              </div>
                              <div className="mt-2 w-full bg-emerald-50 rounded-full h-1.5">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct(run.lastRerun.newContactsFound, run.lastRerun.matchedContacts)}%` }} />
                              </div>
                              <p className="text-xs text-green-600 mt-1 font-medium">+{pct(run.lastRerun.newContactsFound, run.lastRerun.matchedContacts).toFixed(1)}% increase</p>
                            </div>

                            {/* Match Rate */}
                            <div className="gradient-card rounded-lg p-4">
                              <p className="text-xs text-gray-500 font-medium mb-2">Match Rate</p>
                              <div className="flex items-end justify-between">
                                <div>
                                  <p className="text-xs text-gray-400 line-through">{run.lastRerun.matchRate.toFixed(1)}%</p>
                                  <p className="text-xl font-bold text-gray-900">{run.matchRate.toFixed(1)}%</p>
                                </div>
                                <span className="px-2 py-1 rounded-lg bg-indigo-100 text-[#1a1a2e] text-xs font-bold flex items-center gap-0.5 border border-indigo-200">
                                  <ArrowRight className="w-3 h-3 rotate-[-45deg]" />+{run.lastRerun.coverageImprovement.toFixed(1)}%
                                </span>
                              </div>
                              {/* Mini gauge */}
                              <div className="mt-2 flex items-center gap-1">
                                <div className="flex-1 bg-indigo-50 rounded-full h-1.5 relative">
                                  <div className="bg-gray-200 h-full rounded-full absolute" style={{ width: `${run.lastRerun.matchRate}%` }} />
                                  <div className="bg-indigo-500 h-full rounded-full absolute" style={{ width: `${run.matchRate}%` }} />
                                </div>
                              </div>
                              <p className="text-xs text-blue-600 mt-1 font-medium">Coverage improved</p>
                            </div>

                            {/* New Data Found */}
                            <div className="gradient-card rounded-lg p-4">
                              <p className="text-xs text-gray-500 font-medium mb-2">New Data Found</p>
                              <div className="space-y-2 mt-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600">New contacts</span>
                                  <span className="text-sm font-bold text-green-600">+{run.lastRerun.newContactsFound}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600">Emails verified</span>
                                  <span className="text-sm font-bold text-blue-600">+{run.lastRerun.newEmailsVerified}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-600">Phones verified</span>
                                  <span className="text-sm font-bold text-[#1a1a2e]">+{run.lastRerun.newPhonesVerified}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Remaining gap callout */}
                          <div className="gradient-card rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 icon-badge icon-badge-amber">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {(run.totalContacts - run.matchedContacts).toLocaleString()} contacts still unmatched
                                </p>
                                <p className="text-xs text-gray-500">Re-run again in 5-7 days to capture newly added records</p>
                              </div>
                            </div>
                            {run.nextRerunDate && (
                              <span className="text-xs text-blue-700 font-semibold bg-blue-100 px-3 py-1.5 rounded-full">
                                Next suggested: {run.nextRerunDate}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Base details */}
                      <div className="p-6 bg-gray-50/60 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Industries Targeted</h4>
                            <div className="flex flex-wrap gap-2">
                              {run.industries.map(ind => (
                                <span key={ind} className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{ind}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Coverage Breakdown</h4>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Total in DB</span>
                                <span className="text-xs font-medium text-gray-900">{run.totalContacts.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Matched to ICP</span>
                                <span className="text-xs font-medium text-blue-600">{run.matchedContacts.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Gap</span>
                                <span className="text-xs font-medium text-amber-600">{(run.totalContacts - run.matchedContacts).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* No lastRerun yet - encourage first re-run */}
                        {!run.lastRerun && (
                          <div className="gradient-card rounded-lg p-4 border border-dashed border-indigo-200 flex items-center gap-3">
                            <div className="w-8 h-8 icon-badge icon-badge-indigo">
                              <RefreshCw className="w-4 h-4 text-gray-700" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">No re-run comparison available yet</p>
                              <p className="text-xs text-gray-500">Run a re-run to see before/after improvement metrics. Our database refreshes daily with new verified contacts.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB 4: ICP MATCH ANALYTICS ═══════════════════ */}
        {(activeTab === 'analytics' && analyticsSubTab === 'analytics') && (
          <div className="space-y-4">
            {/* Top stats row - compact */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Total Matched', value: matchData.totalMatched.toLocaleString(), color: 'text-[#1a1a2e]', icon: Users, badge: 'icon-badge-indigo', iconColor: 'text-gray-700' },
                { label: 'Unmatched', value: matchData.totalUnmatched.toLocaleString(), color: 'text-amber-600', icon: AlertCircle, badge: 'icon-badge-amber', iconColor: 'text-amber-500' },
                { label: 'Match Rate', value: `${matchData.matchRate}%`, color: 'text-emerald-600', icon: TrendingUp, badge: 'icon-badge-emerald', iconColor: 'text-emerald-500' },
                { label: 'ICP Fit Score', value: `${matchData.icpFitScore}/100`, color: 'text-[#1a1a2e]', icon: Sparkles, badge: 'icon-badge-violet', iconColor: 'text-violet-500' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-6 h-6 icon-badge ${s.badge}`}>
                      <s.icon className={`w-3 h-3 ${s.iconColor}`} />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  </div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* 2-column grid: Industry + Job Level side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* By Industry */}
              <div className="gradient-card rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-indigo-400" /> By Industry</h3>
                <div className="space-y-2.5">
                  {industryBreakdown.map(d => (
                    <div key={d.name} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 font-medium w-28 flex-shrink-0 truncate">{d.name}</span>
                      <div className="flex-1 bg-indigo-50 rounded-full h-2"><div className="bg-indigo-500 h-full rounded-full" style={{ width: `${pct(d.matched, d.total)}%` }} /></div>
                      <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">{pct(d.matched, d.total).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Job Level */}
              <div className="gradient-card rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-violet-400" /> By Job Level</h3>
                <div className="space-y-2.5">
                  {jobLevelBreakdown.map(d => (
                    <div key={d.level} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 font-medium w-28 flex-shrink-0 truncate">{d.level}</span>
                      <div className="flex-1 bg-violet-50 rounded-full h-2"><div className="bg-violet-500 h-full rounded-full" style={{ width: `${pct(d.matched, d.total)}%` }} /></div>
                      <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">{pct(d.matched, d.total).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2-column grid: Region + Data Quality side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* By Region */}
              <div className="gradient-card rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">By Region</h3>
                <div className="space-y-2.5">
                  {regionBreakdown.map(d => (
                    <div key={d.name} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 font-medium w-28 flex-shrink-0 truncate">{d.name}</span>
                      <div className="flex-1 bg-emerald-50 rounded-full h-2"><div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct(d.matched, d.total)}%` }} /></div>
                      <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">{pct(d.matched, d.total).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Quality */}
              <div className="gradient-card rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Data Quality</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Email Completeness', value: 94, color: 'bg-sky-500' },
                    { label: 'Phone Completeness', value: 78, color: 'bg-pink-500' },
                    { label: 'LinkedIn URL', value: 86, color: 'bg-emerald-500' },
                  ].map(d => (
                    <div key={d.label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 font-medium w-28 flex-shrink-0 truncate">{d.label}</span>
                      <div className="flex-1 bg-gray-100/60 rounded-full h-2"><div className={`${d.color} h-full rounded-full`} style={{ width: `${d.value}%` }} /></div>
                      <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB 5: DOWNLOAD ═══════════════════ */}
        {activeTab === 'download' && (
          <div className="space-y-6">
            {/* Credit balance hero card */}
            <div className="gradient-card rounded-lg p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 icon-badge icon-badge-amber">
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Available Credits</p>
                  <p className="text-3xl font-bold text-gray-800">{creditBalance}</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-[#e85d3a] text-white text-sm font-semibold hover:bg-[#d14e2e] transition-colors">
                Buy More Credits
              </button>
            </div>

            {/* Sample + Full download side by side */}
            <div className="grid grid-cols-2 gap-6">
              {/* Sample Download */}
              <div className="gradient-card rounded-lg p-5 space-y-4 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold border border-emerald-200">FREE</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 icon-badge icon-badge-indigo">
                    <Download className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">Sample Download</h3>
                    <p className="text-xs text-gray-500">25 sample contacts</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Preview the data quality with a free sample of matched contacts from your ICP criteria.</p>
                <button onClick={() => handleDownload(true)} className="w-full px-5 py-2.5 rounded-lg bg-[#1a1a2e] text-white hover:bg-[#2a2a45] transition-all">
                  Download Sample
                </button>
              </div>

              {/* Full Download */}
              <div className="gradient-card rounded-lg p-5 space-y-4 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full bg-violet-100 text-[#1a1a2e] text-xs font-bold border border-violet-200">PREMIUM</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 icon-badge icon-badge-violet">
                    <FileText className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">Full Download</h3>
                    <p className="text-xs text-gray-500">All matched contacts</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-gray-500 font-medium">Contacts</p>
                    <p className="text-lg font-bold text-gray-900">{matchData.totalMatched.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-gray-500 font-medium">Cost</p>
                    <p className="text-lg font-bold text-[#1a1a2e]">{getDownloadStats().cost}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] text-gray-500 font-medium">Balance</p>
                    <p className={`text-lg font-bold ${creditBalance >= getDownloadStats().cost ? 'text-green-600' : 'text-red-500'}`}>{creditBalance}</p>
                  </div>
                </div>
                {!getDownloadStats().canDownload ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs font-medium text-red-700">Need {getDownloadStats().cost} credits — you have {creditBalance}</p>
                  </div>
                ) : (
                  <button onClick={() => handleDownload(false)} className="w-full px-5 py-2.5 rounded-lg bg-[#1a1a2e] text-white font-semibold text-sm hover:bg-[#2a2a45] transition-colors">
                    Download All Contacts
                  </button>
                )}
              </div>
            </div>

            {/* Download History */}
            <div className="gradient-card rounded-lg p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-7 h-7 icon-badge icon-badge-slate">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                </div>
                Download History
              </h3>
              <div className="space-y-2">
                {MOCK_DOWNLOAD_HISTORY.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{d.contacts.toLocaleString()} contacts <span className="text-gray-400">·</span> {d.format.toUpperCase()}</p>
                        <p className="text-xs text-gray-500">{d.date}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full">-{d.credits} cr</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB 6: DATA HEALTH ═══════════════════ */}
        {(activeTab === 'analytics' && analyticsSubTab === 'health') && (
          <div className="space-y-5">
            {/* Health Score Hero */}
            <div className="gradient-card rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 icon-badge icon-badge-emerald"><HeartPulse className="w-4 h-4 text-emerald-600" /></div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1a1a2e]">Overall Data Health Score</h3>
                    <p className="text-xs text-gray-500">Last updated 2 hours ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-600">78<span className="text-lg text-gray-400">/100</span></p>
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 justify-end"><ArrowUpRight className="w-3 h-3" /> +3 from last week</p>
                </div>
              </div>
              {/* Score breakdown bar */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Email Validity', score: 94, color: 'bg-emerald-500' },
                  { label: 'Phone Accuracy', score: 72, color: 'bg-amber-500' },
                  { label: 'Title Freshness', score: 68, color: 'bg-orange-500' },
                  { label: 'Company Data', score: 89, color: 'bg-emerald-500' },
                ].map(m => (
                  <div key={m.label} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600 font-medium">{m.label}</span>
                      <span className="text-xs font-bold text-gray-900">{m.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className={`${m.color} h-full rounded-full`} style={{ width: `${m.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="gradient-card rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 icon-badge icon-badge-amber"><Lightbulb className="w-4 h-4 text-amber-600" /></div>
                <h3 className="text-sm font-semibold text-[#1a1a2e]">Recommendations</h3>
              </div>
              <div className="space-y-3">
                {[
                  { priority: 'High', title: 'Re-verify 1,240 stale email addresses', description: 'These emails haven\'t been verified in 90+ days. Re-running verification could recover 15-20% of bounced contacts.', action: 'Run Verification', color: 'bg-red-50 text-red-700 border-red-200' },
                  { priority: 'Medium', title: 'Enrich 3,400 contacts missing phone numbers', description: 'Phone coverage is at 72%. Enrichment could add direct dials for an estimated 2,100 additional contacts.', action: 'Start Enrichment', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                  { priority: 'Medium', title: 'Update 890 outdated job titles', description: 'These contacts show title changes in external signals. Refreshing could improve ICP match accuracy by ~8%.', action: 'Refresh Titles', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                  { priority: 'Low', title: 'Merge 156 duplicate company records', description: 'Duplicate companies detected across your TAL uploads. Merging will clean up analytics and avoid double-counting.', action: 'Review Duplicates', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                ].map((rec, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex-shrink-0 mt-0.5 ${rec.color}`}>{rec.priority}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{rec.description}</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-[#1a1a2e] text-white text-xs font-medium hover:bg-[#2a2a45] transition-colors flex-shrink-0">{rec.action}</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Decay Trends */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Contacts Decaying Monthly', value: '~320', trend: 'down', detail: 'Avg. 2.5% monthly decay rate', icon: TrendingDown, bg: 'icon-badge-rose', color: 'text-rose-600' },
                { label: 'Last Full Enrichment', value: '12 days ago', trend: 'neutral', detail: 'Recommended: every 7 days', icon: RefreshCw, bg: 'icon-badge-amber', color: 'text-amber-600' },
                { label: 'Data Completeness', value: '84%', trend: 'up', detail: 'Up from 79% last month', icon: Database, bg: 'icon-badge-emerald', color: 'text-emerald-600' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 icon-badge ${s.bg}`}><s.icon className={`w-3.5 h-3.5 ${s.color}`} /></div>
                    <span className="text-xs text-gray-500 font-medium">{s.label}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB 7: JOB & ACCOUNT CHANGES ═══════════════════ */}
        {(activeTab === 'changes' && changesSubTab === 'changes') && (
          <div className="space-y-5">
            {/* Summary stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Job Changes (30d)', value: '247', icon: Briefcase, bg: 'icon-badge-violet', color: 'text-violet-600', detail: 'Promotions, role changes, departures' },
                { label: 'New Hires Detected', value: '89', icon: Users, bg: 'icon-badge-emerald', color: 'text-emerald-600', detail: 'Into your target accounts' },
                { label: 'Champions Moved', value: '34', icon: Building2, bg: 'icon-badge-amber', color: 'text-amber-600', detail: 'Known contacts at new companies' },
                { label: 'Contacts at Risk', value: '62', icon: AlertTriangle, bg: 'icon-badge-rose', color: 'text-rose-600', detail: 'Left company or changed role' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 icon-badge ${s.bg}`}><s.icon className={`w-3.5 h-3.5 ${s.color}`} /></div>
                    <span className="text-xs text-gray-500 font-medium">{s.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.detail}</p>
                </div>
              ))}
            </div>

            {/* Recent Job Changes table */}
            <div className="gradient-card rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1a1a2e] flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-400" /> Recent Job Changes</h3>
                <span className="text-xs text-gray-400">Last 30 days</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Contact</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Previous Role</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">New Role</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Company</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Change Type</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Date</th>
                  </tr></thead>
                  <tbody>
                    {[
                      { name: 'Sarah Chen', prev: 'VP Marketing', next: 'CMO', company: 'Salesforce', type: 'Promotion', date: 'Mar 12', typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                      { name: 'James Wilson', prev: 'Director IT', next: 'CTO', company: 'HubSpot', type: 'Promotion', date: 'Mar 10', typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                      { name: 'Maria Garcia', prev: 'Head of Sales', next: '—', company: 'Stripe', type: 'Departed', date: 'Mar 8', typeColor: 'bg-red-50 text-red-700 border-red-200' },
                      { name: 'Alex Park', prev: '—', next: 'VP Engineering', company: 'Datadog', type: 'New Hire', date: 'Mar 7', typeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
                      { name: 'Lisa Thompson', prev: 'Sr. Director Ops', next: 'VP Operations', company: 'Shopify', type: 'Promotion', date: 'Mar 5', typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                      { name: 'David Kim', prev: 'CRO', next: '—', company: 'Roche', type: 'Departed', date: 'Mar 3', typeColor: 'bg-red-50 text-red-700 border-red-200' },
                      { name: 'Rachel Adams', prev: '—', next: 'Director of Sales', company: 'UiPath', type: 'New Hire', date: 'Mar 1', typeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
                      { name: 'Michael Roberts', prev: 'VP Product', next: 'CPO', company: 'Celonis', type: 'Promotion', date: 'Feb 28', typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    ].map((c, i) => (
                      <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{c.prev}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{c.next}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{c.company}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium border ${c.typeColor}`}>{c.type}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-400">{c.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Champion Tracking */}
            <div className="gradient-card rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1a1a2e] flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" /> Champion Tracking</h3>
                <span className="text-xs text-gray-400">Last 30 days</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Contact</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Previous Company</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500"></th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">New Company</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">New Role</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Signal</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Date</th>
                  </tr></thead>
                  <tbody>
                    {[
                      { name: 'Maria Garcia', prevCo: 'Stripe', newCo: 'Snowflake', newRole: 'VP of Sales', signal: 'Target Account', signalColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', date: 'Mar 14' },
                      { name: 'David Kim', prevCo: 'Roche', newCo: 'Moderna', newRole: 'CRO', signal: 'ICP Match', signalColor: 'bg-blue-50 text-blue-700 border-blue-200', date: 'Mar 11' },
                      { name: 'Priya Sharma', prevCo: 'Freshworks', newCo: 'Salesforce', newRole: 'Director of CS', signal: 'Target Account', signalColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', date: 'Mar 9' },
                      { name: 'Tom Fischer', prevCo: 'Celonis', newCo: 'Databricks', newRole: 'Head of Engineering', signal: 'ICP Match', signalColor: 'bg-blue-50 text-blue-700 border-blue-200', date: 'Mar 7' },
                      { name: 'Jessica Lee', prevCo: 'HubSpot', newCo: 'Notion', newRole: 'CMO', signal: 'New Opportunity', signalColor: 'bg-violet-50 text-violet-700 border-violet-200', date: 'Mar 5' },
                      { name: 'Carlos Mendes', prevCo: 'Nubank', newCo: 'Stripe', newRole: 'VP of Product', signal: 'Target Account', signalColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', date: 'Mar 3' },
                      { name: 'Anna Kowalski', prevCo: 'Klarna', newCo: 'Revolut', newRole: 'Director of Ops', signal: 'ICP Match', signalColor: 'bg-blue-50 text-blue-700 border-blue-200', date: 'Mar 1' },
                      { name: 'Ryan Mitchell', prevCo: 'Toast', newCo: 'Shopify', newRole: 'CTO', signal: 'Target Account', signalColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', date: 'Feb 27' },
                    ].map((c, i) => (
                      <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{c.prevCo}</td>
                        <td className="px-4 py-1.5"><ArrowRight className="w-3.5 h-3.5 text-[#e85d3a]" /></td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{c.newCo}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{c.newRole}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium border ${c.signalColor}`}>{c.signal}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-400">{c.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB 8: WEBSITE ANALYTICS ═══════════════════ */}
        {(activeTab === 'changes' && changesSubTab === 'webanalytics') && (
          <div className="space-y-5">
            {/* Top stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Identified Visitors (30d)', value: '1,847', icon: Eye, bg: 'icon-badge-indigo', color: 'text-indigo-600', change: '+12%', up: true },
                { label: 'Companies Identified', value: '342', icon: Building2, bg: 'icon-badge-violet', color: 'text-violet-600', change: '+8%', up: true },
                { label: 'ICP Matches', value: '156', icon: Target, bg: 'icon-badge-emerald', color: 'text-emerald-600', change: '+23%', up: true },
                { label: 'High-Intent Visitors', value: '48', icon: Zap, bg: 'icon-badge-amber', color: 'text-amber-600', change: '+5%', up: true },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 icon-badge ${s.bg}`}><s.icon className={`w-3.5 h-3.5 ${s.color}`} /></div>
                    <span className="text-xs text-gray-500 font-medium">{s.label}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    <span className={`text-xs font-medium flex items-center gap-0.5 mb-1 ${s.up ? 'text-emerald-600' : 'text-red-600'}`}>
                      {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{s.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Top visiting companies */}
            <div className="gradient-card rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1a1a2e] flex items-center gap-2"><Globe className="w-4 h-4 text-gray-400" /> Top Visiting Companies</h3>
                <span className="text-xs text-gray-400">Last 30 days</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Company</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 text-right">Visits</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 text-right">Pages</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Top Pages</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Intent</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">ICP Match</th>
                  </tr></thead>
                  <tbody>
                    {[
                      { company: 'Salesforce', domain: 'salesforce.com', visits: 47, pages: 128, topPages: '/pricing, /enterprise, /demo', intent: 'High', icp: true, intentColor: 'bg-red-50 text-red-700 border-red-200' },
                      { company: 'HubSpot', domain: 'hubspot.com', visits: 34, pages: 89, topPages: '/features, /integrations', intent: 'High', icp: true, intentColor: 'bg-red-50 text-red-700 border-red-200' },
                      { company: 'Shopify', domain: 'shopify.com', visits: 28, pages: 64, topPages: '/pricing, /case-studies', intent: 'Medium', icp: true, intentColor: 'bg-amber-50 text-amber-700 border-amber-200' },
                      { company: 'Datadog', domain: 'datadoghq.com', visits: 22, pages: 51, topPages: '/blog, /resources', intent: 'Medium', icp: true, intentColor: 'bg-amber-50 text-amber-700 border-amber-200' },
                      { company: 'Stripe', domain: 'stripe.com', visits: 19, pages: 42, topPages: '/demo, /pricing', intent: 'High', icp: false, intentColor: 'bg-red-50 text-red-700 border-red-200' },
                      { company: 'Notion', domain: 'notion.so', visits: 15, pages: 33, topPages: '/blog, /about', intent: 'Low', icp: false, intentColor: 'bg-gray-100 text-gray-600 border-gray-200' },
                      { company: 'Figma', domain: 'figma.com', visits: 12, pages: 28, topPages: '/features, /pricing', intent: 'Medium', icp: false, intentColor: 'bg-amber-50 text-amber-700 border-amber-200' },
                    ].map((c, i) => (
                      <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-4 py-3"><p className="text-sm font-medium text-gray-900">{c.company}</p><p className="text-xs text-gray-400">{c.domain}</p></td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{c.visits}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">{c.pages}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{c.topPages}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium border ${c.intentColor}`}>{c.intent}</span></td>
                        <td className="px-4 py-3">{c.icp ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <span className="text-xs text-gray-300">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Page performance */}
            <div className="gradient-card rounded-lg p-5">
              <h3 className="text-sm font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-gray-400" /> Top Pages by Identified Visitors</h3>
              <div className="space-y-2.5">
                {[
                  { page: '/pricing', visitors: 423, pct: 100 },
                  { page: '/enterprise', visitors: 312, pct: 74 },
                  { page: '/demo', visitors: 287, pct: 68 },
                  { page: '/features', visitors: 245, pct: 58 },
                  { page: '/case-studies', visitors: 198, pct: 47 },
                  { page: '/integrations', visitors: 156, pct: 37 },
                  { page: '/blog', visitors: 134, pct: 32 },
                ].map(p => (
                  <div key={p.page} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 font-medium w-28 flex-shrink-0 truncate font-mono">{p.page}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-[#1a1a2e] h-full rounded-full" style={{ width: `${p.pct}%` }} /></div>
                    <span className="text-xs text-gray-500 w-16 text-right flex-shrink-0">{p.visitors} visitors</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB 9: TECHNOGRAPHICS ═══════════════════ */}
        {activeTab === 'technographics' && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Technologies Tracked', value: '2,450+', icon: Cpu, bg: 'icon-badge-indigo', color: 'text-indigo-600', detail: 'Across your target accounts' },
                { label: 'Accounts with Tech Data', value: '87%', icon: Server, bg: 'icon-badge-emerald', color: 'text-emerald-600', detail: '174 of 200 target accounts' },
                { label: 'Tech Stack Changes (30d)', value: '38', icon: Activity, bg: 'icon-badge-amber', color: 'text-amber-600', detail: 'New installs & removals' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 icon-badge ${s.bg}`}><s.icon className={`w-3.5 h-3.5 ${s.color}`} /></div>
                    <span className="text-xs text-gray-500 font-medium">{s.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.detail}</p>
                </div>
              ))}
            </div>

            {/* Tech categories */}
            <div className="grid grid-cols-2 gap-4">
              {/* Top technologies by adoption */}
              <div className="gradient-card rounded-lg p-5">
                <h3 className="text-sm font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2"><Cpu className="w-4 h-4 text-gray-400" /> Top Technologies (Target Accounts)</h3>
                <div className="space-y-2.5">
                  {[
                    { name: 'Salesforce CRM', category: 'CRM', adoption: 78, accounts: 156 },
                    { name: 'AWS', category: 'Cloud', adoption: 72, accounts: 144 },
                    { name: 'Google Analytics', category: 'Analytics', adoption: 68, accounts: 136 },
                    { name: 'HubSpot', category: 'Marketing', adoption: 54, accounts: 108 },
                    { name: 'Slack', category: 'Collaboration', adoption: 52, accounts: 104 },
                    { name: 'Snowflake', category: 'Data', adoption: 41, accounts: 82 },
                    { name: 'Okta', category: 'Security', adoption: 38, accounts: 76 },
                    { name: 'Datadog', category: 'Monitoring', adoption: 34, accounts: 68 },
                  ].map(t => (
                    <div key={t.name} className="flex items-center gap-3">
                      <span className="text-xs text-gray-900 font-medium w-32 flex-shrink-0 truncate">{t.name}</span>
                      <span className="text-[10px] text-gray-400 font-medium w-16 flex-shrink-0">{t.category}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2"><div className="bg-[#e85d3a] h-full rounded-full" style={{ width: `${t.adoption}%` }} /></div>
                      <span className="text-xs text-gray-500 w-12 text-right flex-shrink-0">{t.adoption}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech by category */}
              <div className="gradient-card rounded-lg p-5">
                <h3 className="text-sm font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2"><Server className="w-4 h-4 text-gray-400" /> Technology Categories</h3>
                <div className="space-y-3">
                  {[
                    { category: 'CRM & Sales', count: 12, top: 'Salesforce, HubSpot, Pipedrive', icon: Users, color: 'text-blue-600 bg-blue-50' },
                    { category: 'Cloud Infrastructure', count: 8, top: 'AWS, Azure, GCP', icon: Server, color: 'text-violet-600 bg-violet-50' },
                    { category: 'Marketing Automation', count: 10, top: 'HubSpot, Marketo, Pardot', icon: Mail, color: 'text-emerald-600 bg-emerald-50' },
                    { category: 'Analytics & BI', count: 7, top: 'Google Analytics, Tableau, Looker', icon: BarChart3, color: 'text-amber-600 bg-amber-50' },
                    { category: 'Security & Identity', count: 6, top: 'Okta, CrowdStrike, Zscaler', icon: Shield, color: 'text-red-600 bg-red-50' },
                    { category: 'Collaboration', count: 5, top: 'Slack, Teams, Zoom', icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50' },
                  ].map(c => (
                    <div key={c.category} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${c.color.split(' ')[1]}`}>
                        <c.icon className={`w-3.5 h-3.5 ${c.color.split(' ')[0]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{c.category}</p>
                        <p className="text-xs text-gray-400 truncate">{c.top}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{c.count} tools</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent tech changes */}
            <div className="gradient-card rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1a1a2e] flex items-center gap-2"><Activity className="w-4 h-4 text-gray-400" /> Recent Technology Changes</h3>
                <span className="text-xs text-gray-400">Last 30 days</span>
              </div>
              <div>
                {[
                  { company: 'Salesforce', change: 'Added Snowflake', type: 'Install', date: 'Mar 14', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                  { company: 'HubSpot', change: 'Switched from Segment to mParticle', type: 'Switch', date: 'Mar 12', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                  { company: 'Stripe', change: 'Added Datadog', type: 'Install', date: 'Mar 10', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                  { company: 'Shopify', change: 'Removed Marketo', type: 'Removal', date: 'Mar 8', color: 'bg-red-50 text-red-700 border-red-200' },
                  { company: 'Datadog', change: 'Added CrowdStrike', type: 'Install', date: 'Mar 5', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                  { company: 'Roche', change: 'Added Workday', type: 'Install', date: 'Mar 2', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                ].map((c, i) => (
                  <div key={i} className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition ${i < 5 ? 'border-b border-gray-100' : ''}`}>
                    <span className="text-sm font-medium text-gray-900 w-28 flex-shrink-0">{c.company}</span>
                    <p className="text-sm text-gray-600 flex-1">{c.change}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border flex-shrink-0 ${c.color}`}>{c.type}</span>
                    <span className="text-xs text-gray-400 w-16 text-right flex-shrink-0">{c.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
