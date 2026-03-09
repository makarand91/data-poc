import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { addLog } from '@/lib/db';

// Mock company data for preview
const mockCompanies = [
  { id: 'comp-1', name: 'TechVision Inc', industry: 'Technology', size: 350, revenue: 45000000, matchScore: 94 },
  { id: 'comp-2', name: 'CloudScale Solutions', industry: 'SaaS', size: 580, revenue: 78000000, matchScore: 92 },
  { id: 'comp-3', name: 'DataFlow Systems', industry: 'Data Analytics', size: 290, revenue: 32000000, matchScore: 88 },
  { id: 'comp-4', name: 'SecureNet Corp', industry: 'Cybersecurity', size: 420, revenue: 55000000, matchScore: 91 },
  { id: 'comp-5', name: 'Innovation Labs', industry: 'Technology', size: 150, revenue: 18000000, matchScore: 85 },
  { id: 'comp-6', name: 'Global Financial Tech', industry: 'FinTech', size: 720, revenue: 95000000, matchScore: 93 },
  { id: 'comp-7', name: 'Enterprise Solutions Ltd', industry: 'Enterprise Software', size: 890, revenue: 125000000, matchScore: 89 },
  { id: 'comp-8', name: 'Digital Transformation Co', industry: 'Technology Consulting', size: 310, revenue: 38000000, matchScore: 87 },
  { id: 'comp-9', name: 'AI Pioneers Group', industry: 'Artificial Intelligence', size: 200, revenue: 25000000, matchScore: 90 },
  { id: 'comp-10', name: 'Marketplace Innovations', industry: 'E-commerce', size: 540, revenue: 72000000, matchScore: 86 }
];

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const body = await req.json();
    const { fileName, fileSize } = body;

    // Simulate TAL file processing
    const totalAccounts = 156;
    const matched = 123;
    const unmatched = totalAccounts - matched;
    const matchRate = parseFloat(((matched / totalAccounts) * 100).toFixed(1));

    // Log the upload activity
    addLog(
      userId,
      'TAL File Uploaded',
      'audience',
      `Uploaded file: ${fileName} (${fileSize} bytes). Processed ${totalAccounts} accounts.`,
      { fileName, fileSize, totalAccounts, matched }
    );

    return NextResponse.json({
      success: true,
      totalAccounts,
      matched,
      unmatched,
      matchRate,
      preview: mockCompanies,
      message: `Successfully processed ${totalAccounts} accounts. ${matched} matched to ICP.`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process upload' }, { status: 500 });
  }
}
