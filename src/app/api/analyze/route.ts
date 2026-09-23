import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { sanitizeInput, isValidLegalText } from '@/lib/utils';

/**
 * Simple in-memory rate limiter.
 * Tracks request timestamps per IP and limits to MAX_REQUESTS per WINDOW_MS.
 */
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) || [];
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  requestLog.set(ip, recentTimestamps);

  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  recentTimestamps.push(now);
  return false;
}

/**
 * POST /api/analyze
 *
 * Accepts a legal document (and optionally a second document for comparison),
 * a chat history, and a user prompt. Returns an AI-generated analysis
 * strictly grounded in the provided text.
 */
export async function POST(req: Request) {
  try {
    // --- Rate Limiting ---
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    // --- API Key Validation ---
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return NextResponse.json(
        { reply: 'Please configure your GEMINI_API_KEY in the .env file to use the assistant.' },
        { status: 500 }
      );
    }

    // --- Parse & Validate Request Body ---
    const { document, documentB, chatHistory, prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'A prompt is required.' }, { status: 400 });
    }

    const sanitizedDoc = sanitizeInput(document || '');
    const sanitizedDocB = documentB ? sanitizeInput(documentB) : null;
    const sanitizedPrompt = sanitizeInput(prompt);

    if (!isValidLegalText(sanitizedDoc)) {
      return NextResponse.json(
        { reply: 'Please provide a legal document with enough substance (at least 50 characters) for me to analyze.' },
        { status: 400 }
      );
    }

    // --- Build System Instruction ---
    let documentBlock = `--- START OF DOCUMENT ---\n${sanitizedDoc}\n--- END OF DOCUMENT ---`;

    if (sanitizedDocB && isValidLegalText(sanitizedDocB)) {
      documentBlock = `--- START OF DOCUMENT A ---\n${sanitizedDoc}\n--- END OF DOCUMENT A ---\n\n--- START OF DOCUMENT B ---\n${sanitizedDocB}\n--- END OF DOCUMENT B ---`;
    }

    const systemInstruction = `You are an expert Legal Document Assistant. Your job is to help users understand, compare, and navigate legal documents.

CRITICAL RULES:
1. GROUNDING: You MUST base your answers STRICTLY on the text provided by the user in the document(s). Do not invent clauses or sections that do not exist.
2. NO HALLUCINATION: If the answer is not present in the provided document(s), you MUST explicitly state: "I don't have enough information in the provided document to answer that." Do NOT guess or use outside knowledge to fill in blanks.
3. CITE SOURCES: Whenever possible, quote the specific clause, section number, or exact phrase from the document to support your answer, formatted as a blockquote.
4. ASSISTANT, NOT COUNSEL: You are an AI assistant providing information, not legal advice. For any question involving legal strategy, disputes, or significant decisions, advise the user to consult a qualified attorney.
5. COMPARISON MODE: If two documents are provided (Document A and Document B), compare them clause-by-clause when asked, highlighting differences, conflicts, and missing terms.
6. FORMATTING: Use Markdown formatting: headings, bullet points, bold text for emphasis, and blockquotes for citing document text.

The document(s) you are analyzing:
${documentBlock}`;

    // --- Build Conversation History for Gemini ---
    const safeHistory = Array.isArray(chatHistory) ? chatHistory : [];
    const historyMessages = safeHistory
      .filter((msg: any) => msg && msg.role && msg.content)
      .slice(0, -1) // Exclude the latest user message; we send it as the final turn
      .map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

    const contents = [
      { role: 'user', parts: [{ text: systemInstruction }] },
      { role: 'model', parts: [{ text: 'Understood. I will strictly follow the rules and only answer based on the provided document(s).' }] },
      ...historyMessages,
      { role: 'user', parts: [{ text: sanitizedPrompt }] },
    ];

    // --- Call Gemini API ---
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents,
      config: {
        temperature: 0.2, // Low temperature for factual, grounded responses
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error?.message || error);
    return NextResponse.json(
      { error: 'An internal error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
