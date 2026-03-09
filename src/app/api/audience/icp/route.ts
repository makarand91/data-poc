import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { addLog } from '@/lib/db';

// Module-level storage for ICP definitions (no real persistence for prototype)
const icpStorage: Record<string, any> = {};

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const icp = icpStorage[userId];

  if (!icp) {
    // Return mock default ICP data if none saved
    return NextResponse.json({
      id: 'icp-default',
      industries: ['Technology', 'SaaS', 'Financial Services'],
      companySize: { min: 50, max: 5000 },
      revenueRange: { min: 10000000, max: 500000000 },
      jobTitles: ['Chief Marketing Officer', 'VP of Sales', 'VP of Marketing', 'Sales Director'],
      seniorityLevels: ['Director', 'VP', 'C-Suite'],
      regions: ['North America', 'Europe', 'Asia-Pacific'],
      createdAt: new Date().toISOString(),
      isMockData: true
    });
  }

  return NextResponse.json(icp);
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const body = await req.json();
    const { industries, companySize, revenueRange, jobTitles, seniorityLevels, regions } = body;

    // Validate required fields
    if (!industries || !Array.isArray(industries) || industries.length === 0) {
      return NextResponse.json({ error: 'Industries are required and must be an array' }, { status: 400 });
    }
    if (!companySize || typeof companySize.min !== 'number' || typeof companySize.max !== 'number') {
      return NextResponse.json({ error: 'Company size must have min and max numbers' }, { status: 400 });
    }

    const icpData = {
      id: `icp-${Date.now()}`,
      userId,
      industries: industries || [],
      companySize: companySize || {},
      revenueRange: revenueRange || {},
      jobTitles: jobTitles || [],
      seniorityLevels: seniorityLevels || [],
      regions: regions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to module-level storage
    icpStorage[userId] = icpData;

    // Log the activity
    addLog(userId, 'ICP Definition Saved', 'audience', `ICP created with ${industries.length} industries and ${jobTitles.length} job titles`);

    return NextResponse.json({
      success: true,
      message: 'ICP definition saved',
      icp: icpData
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save ICP' }, { status: 500 });
  }
}
