import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { addLog, updateCredits, getUserById } from '@/lib/db';

// Mock contact data generator
function generateMockContacts(count: number) {
  const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'Michael', 'Jennifer', 'David', 'Linda', 'Richard', 'Barbara'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const titles = ['Chief Marketing Officer', 'VP of Sales', 'Director of Marketing', 'Sales Director', 'Marketing Manager', 'Business Development Manager', 'Account Executive', 'Sales Manager'];
  const companies = ['TechVision Inc', 'CloudScale Solutions', 'DataFlow Systems', 'SecureNet Corp', 'Innovation Labs', 'Global Financial Tech', 'Enterprise Solutions', 'Digital Transformation Co', 'AI Pioneers Group', 'Marketplace Innovations'];
  const industries = ['Technology', 'SaaS', 'Financial Services', 'Healthcare', 'E-commerce', 'Cybersecurity', 'Data Analytics', 'FinTech', 'Enterprise Software', 'AI/ML'];
  const locations = ['New York, NY', 'San Francisco, CA', 'Boston, MA', 'Chicago, IL', 'Austin, TX', 'Seattle, WA', 'London, UK', 'Toronto, Canada', 'Singapore', 'Sydney, Australia'];

  const contacts = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];

    contacts.push({
      id: `contact-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      title: titles[Math.floor(Math.random() * titles.length)],
      company: company,
      industry: industries[Math.floor(Math.random() * industries.length)],
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 99999)}`,
      location: locations[Math.floor(Math.random() * locations.length)]
    });
  }

  return contacts;
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const body = await req.json();
    const { type, format } = body;

    // Validate input
    if (!type || !['sample', 'full'].includes(type)) {
      return NextResponse.json({ error: 'Type must be "sample" or "full"' }, { status: 400 });
    }
    if (!format || !['csv', 'json'].includes(format)) {
      return NextResponse.json({ error: 'Format must be "csv" or "json"' }, { status: 400 });
    }

    if (type === 'sample') {
      // Sample download - free, no credit deduction
      const sampleContacts = generateMockContacts(25);

      addLog(userId, 'Sample Download', 'audience', 'Downloaded 25 sample contacts', {
        format,
        contactCount: 25
      });

      return NextResponse.json({
        success: true,
        downloadType: 'sample',
        format,
        contactCount: 25,
        contacts: sampleContacts,
        creditsUsed: 0,
        message: 'Sample download complete. 25 contacts included.'
      });
    }

    if (type === 'full') {
      // Full download - requires credits
      const user = getUserById(userId);
      const creditsRequired = 125;

      if (!user || user.credits < creditsRequired) {
        return NextResponse.json(
          {
            error: `Insufficient credits. You have ${user?.credits || 0} credits but need ${creditsRequired}`,
            creditsAvailable: user?.credits || 0,
            creditsRequired
          },
          { status: 402 }
        );
      }

      // Generate full dataset
      const fullContacts = generateMockContacts(12450);

      // Deduct credits
      const creditResult = updateCredits(userId, creditsRequired, 'debit', `Full audience download: 12,450 contacts in ${format.toUpperCase()} format`);

      // Log the activity
      addLog(
        userId,
        'Full Download',
        'audience',
        `Downloaded 12,450 contacts in ${format.toUpperCase()} format`,
        {
          format,
          contactCount: 12450,
          creditsDeducted: creditsRequired
        },
        creditsRequired
      );

      return NextResponse.json({
        success: true,
        downloadType: 'full',
        format,
        contactCount: 12450,
        contacts: fullContacts,
        creditsUsed: creditsRequired,
        creditsRemaining: creditResult?.credits || 0,
        message: `Full download complete. ${creditsRequired} credits deducted.`
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process download' }, { status: 500 });
  }
}
