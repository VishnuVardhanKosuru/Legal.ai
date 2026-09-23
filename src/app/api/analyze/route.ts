import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client. It automatically picks up GEMINI_API_KEY from environment variables.
// If it is not set, we'll handle it inside the route to avoid build-time errors if not set yet.

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return NextResponse.json(
        { reply: "Please configure your GEMINI_API_KEY in the .env file to use the assistant." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const { document, chatHistory, prompt } = await req.json();

    if (!document || !prompt) {
      return NextResponse.json({ error: 'Missing document or prompt' }, { status: 400 });
    }

    // System instructions to strictly ground the AI and prevent hallucinations
    const systemInstruction = `You are an expert Legal Assistant. Your job is to help users understand, compare, and navigate legal documents.
    
CRITICAL RULES:
1. GROUNDING: You MUST base your answers STRICTLY on the text provided by the user in the document.
2. NO HALLUCINATION: If the answer is not present in the provided document, you MUST explicitly state: "I don't have enough information in the provided document to answer that." Do NOT guess or use outside knowledge to fill in blanks.
3. QUOTES: Whenever possible, quote the specific clause or section from the document to support your answer.
4. ASSISTANT, NOT COUNSEL: You are an AI assistant. You cannot give professional legal advice. If asked for legal advice or if a user is facing a serious legal situation, advise them to consult a qualified attorney.
5. FORMATTING: Use Markdown to format your responses cleanly (bullet points, bold text for emphasis).

The document you are analyzing is below:
--- START OF DOCUMENT ---
${document}
--- END OF DOCUMENT ---`;

    // Convert chat history to Gemini format, omitting the last user prompt which we handle separately
    const history = (chatHistory || []).slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Start a chat session
    const chat = ai.chats.create({
      model: 'gemini-1.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Low temperature for factual consistency
      }
    });

    // Send the conversation history if any
    for (const msg of history) {
       // Since the new SDK might not have a direct history injection method on `chats.create`,
       // we can either pass it in create or just append it to the prompt.
       // Actually, the new SDK `ai.chats.create({ model, history: [...] })` is supported, let's do it safely.
    }

    // We'll just use a direct generateContent call with history appended as parts to ensure it works flawlessly with the new SDK version.
    
    const messages = [
      { role: 'user', parts: [{ text: systemInstruction }] },
      { role: 'model', parts: [{ text: "Understood. I will strictly follow the document and instructions." }] }
    ];

    for (const msg of history) {
      messages.push(msg);
    }
    
    messages.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: messages,
      config: {
        temperature: 0.2,
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during analysis' }, { status: 500 });
  }
}
