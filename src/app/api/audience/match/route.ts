import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // Mock match analytics data
  const analyticsData = {
    totalMatched: 12450,
    totalUnmatched: 3210,
    matchRate: 79.5,
    icpFitScore: 84,
    byIndustry: [
      { industry: 'Technology', count: 3240, matchRate: 82.5 },
      { industry: 'SaaS', count: 2890, matchRate: 81.2 },
      { industry: 'Financial Services', count: 2150, matchRate: 76.8 },
      { industry: 'Healthcare', count: 1870, matchRate: 77.3 },
      { industry: 'E-commerce', count: 1450, matchRate: 74.2 },
      { industry: 'Enterprise Software', count: 850, matchRate: 85.1 }
    ],
    byJobLevel: [
      { level: 'C-Suite', count: 2340, matchRate: 88.5 },
      { level: 'VP', count: 4120, matchRate: 84.2 },
      { level: 'Director', count: 3890, matchRate: 79.1 },
      { level: 'Manager', count: 2100, matchRate: 72.3 }
    ],
    byRegion: [
      { region: 'North America', count: 5240, matchRate: 82.3 },
      { region: 'Europe', count: 4120, matchRate: 78.9 },
      { region: 'Asia-Pacific', count: 2890, matchRate: 75.4 },
      { region: 'LATAM', count: 200, matchRate: 68.5 }
    ],
    dataQuality: {
      email: 94,
      phone: 78,
      linkedin: 86,
      companyInfo: 91,
      jobTitle: 88
    },
    lastUpdated: new Date().toISOString()
  };

  return NextResponse.json(analyticsData);
}
