import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Comprehensive integration tests for /api/analyze route handler.
 * Tests validation, caching, security headers, rate limiting, and comparison mode.
 */

// Mock the @google/genai module with a proper class constructor
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class MockGoogleGenAI {
      models = {
        generateContent: vi.fn().mockResolvedValue({
          text: '### Mocked Legal Analysis\n\nBased on Section 1 of the Agreement, obligations are mutual.',
        }),
      };
    },
  };
});

// Set the env variable before importing the route
vi.stubEnv('GEMINI_API_KEY', 'test-api-key-12345');

// Dynamically import the route handler after mocks are set up
const { POST, GET } = await import('../src/app/api/analyze/route');

describe('API Route /api/analyze', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects GET requests with 405 Method Not Allowed', async () => {
    const response = await GET();
    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
  });

  it('returns 415 when Content-Type is not application/json', async () => {
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'Some text',
    });

    const response = await POST(request);
    expect(response.status).toBe(415);
  });

  it('returns 400 when prompt is missing or whitespace', async () => {
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document: 'This is a sufficiently long legal document text that exceeds fifty characters.',
        prompt: '   ',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns 400 when document is under 50 characters', async () => {
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document: 'Too short contract',
        prompt: 'Summarize this agreement',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns 200 with valid legal text and prompt', async () => {
    const validDoc =
      'This Mutual Non-Disclosure Agreement is entered into by and between AlphaTech and Beta Innovations.';
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.1',
      },
      body: JSON.stringify({
        document: validDoc,
        prompt: 'Identify the governing law',
        chatHistory: [],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.reply).toContain('Mocked Legal Analysis');
    expect(response.headers.get('X-Cache')).toBe('MISS');
  });

  it('serves cached response on identical request for high efficiency', async () => {
    const doc =
      'This Agreement shall remain in effect for a period of two years from the Effective Date.';
    const makeReq = () =>
      new Request('http://localhost/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '198.51.100.2',
        },
        body: JSON.stringify({
          document: doc,
          prompt: 'Summarize the term clause',
        }),
      });

    // First call: MISS
    const res1 = await POST(makeReq());
    expect(res1.status).toBe(200);
    expect(res1.headers.get('X-Cache')).toBe('MISS');

    // Second call: HIT
    const res2 = await POST(makeReq());
    expect(res2.status).toBe(200);
    expect(res2.headers.get('X-Cache')).toBe('HIT');
    const data2 = await res2.json();
    expect(data2.cached).toBe(true);
  });

  it('supports compare mode with documentB', async () => {
    const docA =
      'Contract A: The parties agree to Delaware jurisdiction and binding arbitration.';
    const docB =
      'Contract B: The parties agree to New York jurisdiction and court litigation.';
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.3',
      },
      body: JSON.stringify({
        document: docA,
        documentB: docB,
        prompt: 'Compare jurisdiction clauses in Document A and Document B',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.reply).toBeDefined();
  });

  it('enforces rate limiting when request threshold is exceeded', async () => {
    const uniqueIp = '203.0.113.88';
    const doc =
      'Standard contract text with plenty of legal terminology exceeding fifty characters in total length.';

    let lastStatus = 200;
    // Send 25 rapid requests from the same IP (threshold is 20)
    for (let i = 0; i < 25; i++) {
      const req = new Request('http://localhost/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': uniqueIp,
        },
        body: JSON.stringify({ document: doc, prompt: `Prompt query ${i}` }),
      });
      const res = await POST(req);
      lastStatus = res.status;
    }

    expect(lastStatus).toBe(429);
  });
});
