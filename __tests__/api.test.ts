import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Tests for the /api/analyze route handler logic.
 * We mock the Google GenAI SDK to test our route logic in isolation.
 */

// Mock the @google/genai module with a proper class constructor
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class MockGoogleGenAI {
      models = {
        generateContent: vi.fn().mockResolvedValue({
          text: 'Mocked AI response based on the document.',
        }),
      };
    },
  };
});

// Set the env variable before importing the route
vi.stubEnv('GEMINI_API_KEY', 'test-api-key-12345');

// Dynamically import the route handler after mocks are set up
const { POST } = await import('../src/app/api/analyze/route');

describe('POST /api/analyze', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when prompt is missing', async () => {
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document: 'Some long legal text that is well over fifty characters for validation purposes.',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns 400 when document is too short', async () => {
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document: 'Short', prompt: 'Summarize this.' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns 200 with a valid request', async () => {
    const validDoc =
      'This is a sufficiently long legal document text that exceeds the fifty character minimum requirement for validation purposes.';
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document: validDoc,
        prompt: 'Summarize this.',
        chatHistory: [],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.reply).toBeDefined();
    expect(typeof data.reply).toBe('string');
  });
});
