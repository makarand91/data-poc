const ANALYSIS_RESPONSES = [
  {
    title: "ICP Match Analysis",
    summary: "Analysis of how your target accounts match your ideal customer profile.",
    content: `## ICP Match Analysis Report\n\n### Overall Match Score: 87/100\n\nYour ideal customer profile is performing well across target accounts.\n\n**Match Breakdown by Category:**\n\n1. **Industry Alignment:** 92/100\n   - Software & SaaS: 45% of matches (highest)\n   - Financial Services: 28% of matches\n   - Healthcare Tech: 18% of matches\n   - Other: 9% of matches\n\n2. **Company Size Distribution:**\n   - Enterprise (1000+ employees): 42% match\n   - Mid-Market (200-1000): 38% match\n   - SMB (50-200): 20% match\n\n3. **Revenue Band Alignment:**\n   - $50M-$500M: 52% of target accounts\n   - $500M+: 35% of target accounts\n   - <$50M: 13% of target accounts\n\n4. **Geographic Coverage:**\n   - North America: 58% (US: 42%, Canada: 16%)\n   - Europe: 28%\n   - APAC: 14%\n\n5. **Data Completeness:**\n   - Email addresses available: 94%\n   - Direct phone numbers: 67%\n   - Job level enrichment: 88%\n   - Technographic data: 82%\n\n### Total Contacts Available:\n- **Direct Matches (90+ score):** 3,247 contacts\n- **Strong Matches (75-89 score):** 5,891 contacts\n- **Moderate Matches (60-74 score):** 4,123 contacts\n\n**Total Addressable Contacts: 13,261**\n\n### Key Insights:\n- Your ICP is well-represented in the Software/SaaS vertical\n- Mid-market segment shows strongest data quality (92% email verification)\n- European accounts underrepresented in current targeting\n- Finance/compliance titles have highest engagement potential`,
    data: {
      overallScore: 87,
      industryBreakdown: [
        { industry: "Software & SaaS", percentage: 45, contactCount: 5967 },
        { industry: "Financial Services", percentage: 28, contactCount: 3713 },
        { industry: "Healthcare Tech", percentage: 18, contactCount: 2387 },
        { industry: "Other", percentage: 9, contactCount: 1194 }
      ],
      companySizeBreakdown: [
        { size: "Enterprise (1000+)", percentage: 42, contactCount: 5569 },
        { size: "Mid-Market (200-1000)", percentage: 38, contactCount: 5039 },
        { size: "SMB (50-200)", percentage: 20, contactCount: 2653 }
      ],
      totalContactsAvailable: 13261,
      highScoreMatches: 3247,
      dataQuality: {
        emailAvailability: 94,
        phoneAvailability: 67,
        jobLevelEnrichment: 88,
        technographicData: 82
      }
    }
  },
  {
    title: "Audience Overview",
    summary: "Summary of your available database and audience segments.",
    content: `## Audience Database Overview\n\n### Total Database Size: 2,847,593 contacts\n\n**Breakdown by Size:**\n- Verified Email Addresses: 2,681,943 (94%)\n- Direct Phone Numbers: 1,909,727 (67%)\n- Mobile Numbers: 847,263 (30%)\n- LinkedIn URLs: 2,465,892 (87%)\n- Job Title Data: 2,743,854 (96%)\n\n### Enrichment Rates by Category:\n\n**Company Information:**\n- Company size: 99%\n- Industry classification: 98%\n- Annual revenue: 94%\n- Technology stack: 71%\n- Recent funding: 58%\n\n**Individual Data:**\n- Email verified: 94%\n- Phone verified: 67%\n- Current job title: 96%\n- Seniority level: 91%\n- Department: 89%\n- Years in role: 73%\n\n**Firmographic Data:**\n- Company website: 99%\n- Geographic location: 99%\n- Employee count: 99%\n- Industry verticals: 98%\n- Key personnel: 65%\n\n### Popular Segments Available:\n\n**By Industry:**\n- Technology/Software: 523,847 contacts\n- Financial Services: 487,920 contacts\n- Healthcare: 324,856 contacts\n- Manufacturing: 287,450 contacts\n- Professional Services: 267,893 contacts\n- Retail/E-Commerce: 245,632 contacts\n\n**By Job Function:**\n- Sales Leadership: 289,456 contacts\n- Marketing Leadership: 156,234 contacts\n- Finance/CFO: 178,945 contacts\n- IT/CTO: 245,678 contacts\n- Operations: 134,567 contacts\n\n**By Company Size:**\n- Enterprise (1000+ employees): 945,678 contacts\n- Mid-Market (200-1000): 876,543 contacts\n- SMB (50-200): 687,234 contacts\n- Startup (<50): 338,138 contacts\n\n### Data Freshness:\n- Updated in last 30 days: 89%\n- Updated in last 90 days: 97%\n- Last full refresh: 8 days ago\n- Next scheduled refresh: in 7 days`,
    data: {
      totalContacts: 2847593,
      emailAvailable: 2681943,
      phoneAvailable: 1909727,
      mobileAvailable: 847263,
      linkedinAvailable: 2465892,
      jobTitleAvailable: 2743854,
      enrichmentRates: {
        company: {
          size: 99,
          industry: 98,
          revenue: 94,
          technology: 71,
          funding: 58
        },
        individual: {
          emailVerified: 94,
          phoneVerified: 67,
          jobTitle: 96,
          seniority: 91,
          department: 89,
          yearsInRole: 73
        },
        firmographic: {
          website: 99,
          location: 99,
          employeeCount: 99,
          industry: 98,
          keyPersonnel: 65
        }
      },
      topSegments: [
        { name: "Technology/Software", count: 523847 },
        { name: "Financial Services", count: 487920 },
        { name: "Healthcare", count: 324856 },
        { name: "Manufacturing", count: 287450 },
        { name: "Professional Services", count: 267893 }
      ],
      dataFreshness: {
        last30days: 89,
        last90days: 97,
        lastRefresh: "8 days ago",
        nextRefresh: "in 7 days"
      }
    }
  }
];

const ABM_COMPANIES = [
  { companyName: "TechVision Analytics", industry: "Enterprise Software", size: "500-1000", revenue: "$120M", matchScore: 94, signals: ["Recent funding round", "Hiring sales team", "Tech stack match"], website: "techvision.io", location: "San Francisco, CA" },
  { companyName: "DataStream Corp", industry: "Data Infrastructure", size: "200-500", revenue: "$85M", matchScore: 91, signals: ["Product launch", "Expansion to EMEA", "CRM migration"], website: "datastream.com", location: "Austin, TX" },
  { companyName: "CloudBridge Solutions", industry: "Cloud Services", size: "1000-5000", revenue: "$340M", matchScore: 89, signals: ["New CTO appointed", "Digital transformation initiative", "Budget increase"], website: "cloudbridge.io", location: "Seattle, WA" },
  { companyName: "NexGen Financial", industry: "FinTech", size: "100-200", revenue: "$45M", matchScore: 87, signals: ["Series B funding", "Compliance requirements", "Stack modernization"], website: "nexgenfinancial.com", location: "New York, NY" },
  { companyName: "MedTech Innovations", industry: "Healthcare Tech", size: "200-500", revenue: "$92M", matchScore: 85, signals: ["HIPAA compliance needs", "Platform migration", "Growth phase"], website: "medtechinno.com", location: "Boston, MA" },
  { companyName: "RetailEdge Platform", industry: "E-Commerce", size: "500-1000", revenue: "$210M", matchScore: 83, signals: ["Omnichannel strategy", "Data integration needs", "Customer experience focus"], website: "retailedge.io", location: "Chicago, IL" },
  { companyName: "GreenEnergy Systems", industry: "Clean Energy", size: "100-200", revenue: "$67M", matchScore: 81, signals: ["Government contracts", "Rapid scaling", "CRM implementation"], website: "greenenergy-sys.com", location: "Denver, CO" },
  { companyName: "LogiFlow AI", industry: "Supply Chain", size: "200-500", revenue: "$110M", matchScore: 79, signals: ["AI adoption", "Process automation", "Vendor consolidation"], website: "logiflow.ai", location: "Atlanta, GA" },
];

function getAnalysisResponse() {
  const responses = ANALYSIS_RESPONSES;
  return responses[Math.floor(Math.random() * responses.length)];
}

export function getABMCompanies(count?: number) {
  if (count) return ABM_COMPANIES.slice(0, count);
  return ABM_COMPANIES;
}

export function generateMockResponse(userMessage: string): { content: string; type: string; data?: any; thinkingSteps?: string[] } {
  const msg = userMessage.toLowerCase();

  // 1. ICP / Match Analysis
  if (msg.includes('icp') || msg.includes('match') || msg.includes('ideal customer')) {
    const analysis = getAnalysisResponse();
    if (analysis.title.includes('ICP')) {
      return {
        content: analysis.content,
        type: 'icp_match',
        data: analysis.data,
        thinkingSteps: [
          'Accessing your ICP profile...',
          'Scanning database for matching accounts...',
          'Analyzing industry and company size distributions...',
          'Calculating match scores...',
          'Compiling availability metrics...'
        ]
      };
    }
  }

  // 2. Audience / Data Overview
  if (msg.includes('audience') || msg.includes('database') || msg.includes('overview') || msg.includes('available data')) {
    const analysis = ANALYSIS_RESPONSES.find(a => a.title.includes('Audience'));
    if (analysis) {
      return {
        content: analysis.content,
        type: 'audience',
        data: analysis.data,
        thinkingSteps: [
          'Connecting to data warehouse...',
          'Calculating total database size...',
          'Analyzing enrichment rates...',
          'Segmenting by industry and function...',
          'Compiling availability report...'
        ]
      };
    }
  }

  // 3. Download / Data Export
  if (msg.includes('download') || msg.includes('export') || msg.includes('pull data') || msg.includes('get contacts')) {
    const downloadSize = Math.floor(Math.random() * 900000) + 100000;
    const creditCost = Math.ceil(downloadSize / 10000);
    const content = `## Download Initiated\n\n**Records Selected:** ${downloadSize.toLocaleString()} contacts\n**Format:** CSV (with all enrichment fields)\n**File Size:** ~${Math.round(downloadSize / 50000)}MB\n**Credit Cost:** ${creditCost} credits\n**Your Balance:** 500 credits\n\n### Download Includes:\n✓ Email addresses (verified)\n✓ Direct phone numbers (where available)\n✓ Job titles and seniority levels\n✓ Company name and size\n✓ Industry classification\n✓ LinkedIn profile URLs\n✓ Geographic location\n✓ Technology stack data\n\n**Status:** Ready to download\n**Expires:** In 7 days\n\nThe file is preparing in the background. You can download it from your Files dashboard or we can schedule an automated delivery to your preferred location.`;

    return {
      content,
      type: 'download',
      data: {
        recordsSelected: downloadSize,
        creditCost,
        fileFormat: 'CSV',
        estimatedFileSize: `${Math.round(downloadSize / 50000)}MB`,
        currentBalance: 500
      },
      thinkingSteps: [
        'Validating download parameters...',
        'Querying data warehouse...',
        'Building export file...',
        'Calculating credit cost...',
        'Preparing download link...'
      ]
    };
  }

  // 4. Segment-specific Data
  if (msg.includes('segment') && (msg.includes('data') || msg.includes('contacts') || msg.includes('available'))) {
    const segments = [
      { name: 'Enterprise Tech', contacts: 245678, quality: 94, verified: 91 },
      { name: 'Financial Services', contacts: 187456, quality: 89, verified: 86 },
      { name: 'Healthcare', contacts: 156234, quality: 92, verified: 88 },
      { name: 'Manufacturing', contacts: 134567, quality: 85, verified: 79 }
    ];

    const segmentList = segments.map(s => `### ${s.name}\n- **Available Contacts:** ${s.contacts.toLocaleString()}\n- **Data Quality Score:** ${s.quality}%\n- **Email Verification Rate:** ${s.verified}%`).join('\n\n');

    const content = `## Segment Data Availability\n\n${segmentList}\n\n---\n\n### What You Can Do:\n- Download contacts from any segment\n- Filter by job title, company size, or location\n- Apply custom enrichment\n- Schedule automated updates\n\nSelect a segment to see more details or proceed with download.`;

    return {
      content,
      type: 'segment_data',
      data: { segments },
      thinkingSteps: [
        'Loading segment data...',
        'Calculating contact counts...',
        'Assessing data quality metrics...',
        'Compiling availability report...'
      ]
    };
  }

  // 5. Contact Availability / Pricing
  if (msg.includes('contact') || msg.includes('decision maker') || msg.includes('pricing') || msg.includes('how much')) {
    const content = `## Contact Data & Pricing\n\n### Decision Makers Available:\n\n**By Function:**\n- Sales Leaders: 289,456 contacts @ 0.50 credits per contact\n- Marketing Leaders: 156,234 contacts @ 0.50 credits per contact\n- Finance/CFO: 178,945 contacts @ 0.75 credits per contact\n- IT/CTO: 245,678 contacts @ 0.75 credits per contact\n- Operations: 134,567 contacts @ 0.50 credits per contact\n\n**By Seniority:**\n- C-Level: 87,654 contacts @ 1.00 credit per contact\n- VP-Level: 234,567 contacts @ 0.75 credits per contact\n- Director-Level: 456,789 contacts @ 0.50 credits per contact\n- Manager-Level: 678,901 contacts @ 0.35 credits per contact\n\n**By Vertical:**\n- Enterprise Tech: 95,432 contacts @ 0.50 credits per contact\n- Financial Services: 78,234 contacts @ 0.75 credits per contact\n- Healthcare: 65,123 contacts @ 0.75 credits per contact\n- Manufacturing: 54,321 contacts @ 0.50 credits per contact\n\n### Pricing Structure:\n- **100 contacts:** 35-100 credits (depending on seniority)\n- **1,000 contacts:** 350-1,000 credits\n- **10,000 contacts:** 3,500-10,000 credits\n- **100,000+ contacts:** Custom pricing (contact sales)\n\n### What's Included:\n✓ Verified email addresses\n✓ Direct phone numbers\n✓ Current job title\n✓ Company and industry\n✓ Seniority level\n✓ Geographic location\n✓ Job history (30-day old)\n\nYour Current Balance: **500 credits**`;

    return {
      content,
      type: 'contact_pricing',
      data: {
        salesLeaders: 289456,
        marketingLeaders: 156234,
        finance: 178945,
        it: 245678,
        operations: 134567,
        currentBalance: 500
      },
      thinkingSteps: [
        'Loading contact database...',
        'Analyzing available decision makers...',
        'Calculating pricing tiers...',
        'Verifying contact quality...',
        'Preparing summary...'
      ]
    };
  }

  // 6. Credit Balance / Account Info
  if (msg.includes('credit') || msg.includes('balance') || msg.includes('account') || msg.includes('usage')) {
    const content = `## Account & Credit Summary\n\n### Current Credits: 500\n\n**Monthly Plan:** Growth Plan ($149/month)\n- Included Credits: 2,000 per month\n- Credits Used This Month: 1,500\n- Credits Remaining: 500\n- Reset Date: April 1, 2026\n\n### Usage Breakdown (This Month):\n- Data Downloads: 1,000 credits\n- ABM Company Analysis: 300 credits\n- Segment Research: 200 credits\n\n### Recent Transactions:\n1. Downloaded 100K enterprise contacts (100 credits) - Mar 7\n2. ABM analysis for Tech segment (75 credits) - Mar 5\n3. Segment data export - Manufacturing (125 credits) - Mar 3\n\n### Upgrade Options:\n- **Starter Plan:** $49/month (500 credits) - For testing\n- **Growth Plan:** $149/month (2,000 credits) - Current plan\n- **Scale Plan:** $299/month (5,000 credits) - 50% more value\n- **Enterprise:** $899/month (20,000 credits) - Unlimited downloads\n\nNeed more credits? Upgrade anytime or purchase a one-time credit bundle.`;

    return {
      content,
      type: 'credits',
      data: {
        currentBalance: 500,
        monthlyPlan: 'Growth',
        monthlyAllowance: 2000,
        usedThisMonth: 1500,
        resetDate: 'April 1, 2026'
      },
      thinkingSteps: [
        'Checking account status...',
        'Loading credit balance...',
        'Calculating monthly usage...',
        'Compiling transaction history...'
      ]
    };
  }

  // 7. ABM / Companies / Lookalike
  if (msg.includes('abm') || msg.includes('similar') || msg.includes('lookalike') || msg.includes('companies')) {
    const companies = getABMCompanies();
    const content = `## ABM Lookalike Companies Found\n\nI've identified **${companies.length} companies** that match your ideal customer profile:\n\n${companies.map((c, i) => `### ${i + 1}. ${c.companyName}\n- **Industry:** ${c.industry}\n- **Size:** ${c.size} employees\n- **Revenue:** ${c.revenue}\n- **Match Score:** ${c.matchScore}%\n- **Intent Signals:** ${c.signals.join(', ')}\n- **Location:** ${c.location}\n- **Available Contacts:** ~${Math.floor(Math.random() * 50) + 10} decision makers`).join('\n\n')}\n\n*This search consumed 10 credits from your account.*\n\n### Next Steps:\n- Download contact list for matched companies\n- Analyze by industry or geography\n- Create targeted outreach list`;
    return {
      content,
      type: 'abm',
      data: { companies, creditsUsed: 10, companyCount: companies.length },
      thinkingSteps: [
        'Accessing ABM Intelligence Engine...',
        'Loading your ideal customer profile...',
        'Scanning firmographic database for matches...',
        'Analyzing intent signals and technographics...',
        'Ranking companies by match score...'
      ]
    };
  }

  // 8. Help / General Capabilities
  if (msg.includes('help') || msg.includes('what can') || msg.includes('how') || msg.includes('capabilities')) {
    return {
      content: `## Here's what I can help you with:\n\n**📊 Find Data**\n- "Find companies matching my ICP" → Get ABM lookalike analysis\n- "Show me audience overview" → See total database and segments\n- "What decision makers are available?" → View contact availability and pricing\n\n**📥 Download Data**\n- "Download Enterprise Tech contacts" → Export segment data\n- "Get 50K finance leaders" → Pull specific contact lists\n- "Export matched accounts" → Download ABM results\n\n**🔍 Analyze Availability**\n- "Show ICP match analysis" → See how well accounts match your profile\n- "What's in my database?" → Full database overview and stats\n- "Segment analysis" → Data quality and contact counts by segment\n\n**💰 Account & Billing**\n- "What's my credit balance?" → Check usage and billing\n- "How much do contacts cost?" → Pricing information\n- "Upgrade my plan" → See plan options\n\n**🎯 Data Quality**\n- "What data do you have?" → Overview of enriched fields\n- "How fresh is the data?" → Data freshness and update schedules\n- "Data completeness" → Verification rates by field\n\nJust ask about finding, checking availability, or downloading your target contacts!`,
      type: 'general',
      thinkingSteps: ['Loading available tools and capabilities...']
    };
  }

  // 9. Fallback - Helpful response
  return {
    content: `I can help you find and download B2B contact data. Here are some things I can do:\n\n**Find Data:**\n- Search for companies matching your ideal customer profile\n- Analyze how well your targets match your ICP\n- View available segments and decision makers\n\n**Download Contacts:**\n- Export contacts by industry, job function, or company size\n- Download decision maker lists with verified contact info\n- Get ABM account lists with enriched company data\n\n**Check Availability:**\n- See total database size and what's available\n- View pricing for different contact types\n- Check your credit balance and plan options\n\nTry asking:\n- "Find ABM companies matching my ICP"\n- "Show me available decision makers"\n- "Download Enterprise Tech contacts"\n- "What's my credit balance?"`,
    type: 'general',
    thinkingSteps: ['Processing your request...', 'Analyzing intent...', 'Preparing response...']
  };
}
