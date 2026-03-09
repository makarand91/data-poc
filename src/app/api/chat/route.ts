import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { createConversation, getConversations, addMessage, getMessages, addLog, updateCredits, saveABMResults } from '@/lib/db';
import { generateMockResponse } from '@/lib/mock-ai';

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const conversationId = req.nextUrl.searchParams.get('conversationId');
  if (conversationId) {
    const messages = getMessages(conversationId);
    return NextResponse.json({ messages });
  }
  const conversations = getConversations(userId);
  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const { message, conversationId: existingConvId } = await req.json();
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    let conversationId = existingConvId;
    if (!conversationId) {
      const conv = createConversation(userId, message.slice(0, 50) + (message.length > 50 ? '...' : ''));
      conversationId = conv.id;
    }

    // Save user message
    const userMsg = addMessage(conversationId, 'user', message);

    // Generate mock AI response
    const aiResponse = generateMockResponse(message);

    // Handle side effects based on response type
    let metadata: any = { type: aiResponse.type };
    metadata.thinkingSteps = aiResponse.thinkingSteps || [];

    if (aiResponse.type === 'icp_match' && aiResponse.data) {
      updateCredits(userId, 5, 'debit', 'ICP match analysis');
      metadata.creditsUsed = 5;
      addLog(userId, 'ICP Match Analysis', 'data', 'Ran ICP match analysis', {}, 5);
    }

    if (aiResponse.type === 'abm' && aiResponse.data) {
      const saved = saveABMResults(userId, aiResponse.data.companies);
      metadata.creditsUsed = aiResponse.data.creditsUsed;
      updateCredits(userId, aiResponse.data.creditsUsed, 'debit', 'ABM lookalike search');
      addLog(userId, 'ABM Search', 'abm', `Found ${aiResponse.data.companies.length} lookalike companies`, {}, aiResponse.data.creditsUsed);
    }

    if (aiResponse.type === 'download' && aiResponse.data) {
      const creditCost = aiResponse.data.creditsUsed || 0;
      if (creditCost > 0) {
        updateCredits(userId, creditCost, 'debit', 'Data download');
        metadata.creditsUsed = creditCost;
        addLog(userId, 'Data Download', 'data', `Downloaded ${aiResponse.data.recordCount || 0} contacts`, {}, creditCost);
      }
    }

    if (aiResponse.type === 'decision_makers' && aiResponse.data) {
      updateCredits(userId, 3, 'debit', 'Contact search');
      metadata.creditsUsed = 3;
      addLog(userId, 'Contact Search', 'data', 'Searched for decision makers', {}, 3);
    }

    // Save AI response
    const assistantMsg = addMessage(conversationId, 'assistant', aiResponse.content, metadata);

    return NextResponse.json({ userMessage: userMsg, assistantMessage: assistantMsg, conversationId, metadata });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Chat failed' }, { status: 500 });
  }
}
