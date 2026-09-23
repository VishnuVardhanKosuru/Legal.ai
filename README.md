# Legal.ai — AI-Powered Legal Document Assistant

> ⚖️ **This tool provides information only — it does not constitute legal advice.** Always consult a qualified attorney for legal decisions.

## Chosen Vertical

**AI for Legal Assistance & Access** — Making complex legal information easy to understand, navigate, compare, and responsibly act on.

## Approach and Logic

Legal.ai is designed around three core principles drawn directly from the problem statement:

### 1. Grounding & Anti-Hallucination (High Impact)

The Gemini model receives strict system instructions that force it to:

- **Only** answer based on the text in the uploaded document(s)
- **Quote** specific clauses or sections to support its claims
- **Explicitly state** "I don't have enough information in the provided document to answer that" when information is missing — rather than guessing

This is enforced by injecting the document directly into the system prompt with clear boundary markers (`--- START OF DOCUMENT ---` / `--- END OF DOCUMENT ---`), and setting a low temperature (0.2) for factual consistency.

### 2. Assistance, Not Replacement

The tool is intentionally positioned as an **assistant**, not a lawyer:

- A persistent disclaimer banner states this is not legal advice
- A dedicated **"Questions for Lawyer"** button generates clarifying questions the user should ask a real attorney
- The system prompt explicitly instructs the AI to recommend consulting an attorney for serious decisions

### 3. Side-by-Side Verification

The split-pane UI keeps the original document visible at all times while the user interacts with the AI, enabling users to **verify** any claim the AI makes by cross-referencing the source text.

## Features

| Feature                  | Description                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| **Summarize**            | Generate a plain-language summary of the document                           |
| **Identify Risks**       | Highlight potential risks, liabilities, and unusual obligations              |
| **Simplify Terms**       | Explain the agreement in everyday language for non-lawyers                   |
| **Generate Checklist**   | Produce an actionable checklist of obligations, deadlines, and action items  |
| **Compare Documents**    | Toggle comparison mode to upload two documents and compare them side-by-side |
| **Questions for Lawyer** | Generate clarifying questions to prepare for a legal consultation            |
| **Conversational Q&A**   | Ask free-form questions, all grounded in the provided document               |

## Tech Stack

- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** Vanilla CSS with glassmorphism effects (no Tailwind)
- **AI:** Google Gemini API (`@google/genai` SDK, `gemini-3.5-flash-lite`)
- **Testing:** Vitest with React Testing Library
- **Icons:** Lucide React

## GenAI Services Used

| Service                     | Where Used                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------- |
| **Google Gemini API** (gemini-3.5-flash-lite) | Backend API route (`/api/analyze`) — document analysis, summarization, risk identification, comparison, Q&A |

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/analyze/route.ts   # Backend: Gemini integration, rate limiting, sanitization
│   │   ├── globals.css            # Design system (vanilla CSS)
│   │   ├── layout.tsx             # Root layout with SEO metadata
│   │   └── page.tsx               # Main app page (orchestrator)
│   ├── components/
│   │   ├── ChatInputBar.tsx       # Chat text input + send button
│   │   ├── ChatMessage.tsx        # Single message bubble (Markdown rendering)
│   │   ├── DocumentInput.tsx      # Document textarea + comparison mode toggle
│   │   └── QuickActions.tsx       # Pre-built prompt shortcut buttons
│   └── lib/
│       └── utils.ts               # Validation, sanitization, truncation utilities
├── __tests__/
│   ├── utils.test.ts              # Unit tests for utility functions
│   └── api.test.ts                # Integration tests for API route
├── .env                           # API key (gitignored)
├── .gitignore
├── README.md
├── vitest.config.ts
└── package.json
```

## Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/Legal.ai.git
cd Legal.ai

# 2. Install dependencies
npm install

# 3. Add your Gemini API key
# Create a .env file in the root:
echo 'GEMINI_API_KEY="your_api_key_here"' > .env

# 4. Start the development server
npm run dev

# 5. Open in browser
# http://localhost:3000

# 6. Run tests
npm run test
```

## Security Measures

- **API key isolation:** Keys are stored in `.env` (gitignored) and only accessed server-side
- **Input sanitization:** All user input is sanitized to strip HTML tags before processing
- **Input validation:** Documents must meet a minimum length threshold to prevent trivial API calls
- **Rate limiting:** In-memory rate limiter restricts requests to 15 per minute per IP
- **Document truncation:** Oversized documents are truncated to prevent context window abuse

## Assumptions

- Users provide text in English
- Documents are copy/pasted as plain text (PDF parsing omitted to stay under the 10 MB repo limit)
- The document fits within Gemini's context window (~100k characters max, enforced by truncation)
