# Legal.ai — AI-Powered Legal Document Assistant

> ⚖️ **This tool provides information only — it does not constitute legal advice.** Always consult a qualified attorney for legal decisions.

## Chosen Vertical

**AI for Legal Assistance & Access** — Making complex legal information easy to understand, navigate, compare, and responsibly act on.

---

## Approach and Core Architecture

Legal.ai is architected around four core pillars designed to maximize trust, factual accuracy, and security:

### 1. Strict Grounding & Anti-Hallucination Shield
The Google Gemini model (`gemini-3.5-flash-lite`) receives strict, sandboxed system instructions enforced through isolated XML boundaries (`<legal_document_content>`):
- **Document-Only Context:** Instructed to answer **only** based on the text provided inside the document enclosure.
- **Mandatory Clause Citations:** Cites and quotes verbatim sections using Markdown blockquotes (`> "quoted clause"`).
- **Explicit Ignorance Disclosure:** Required to explicitly state *"I don't have enough information in the provided document to answer that"* when text is absent, rather than speculating.
- **Anti-Prompt-Injection Guardrails:** Input sanitization neutralizes delimiter collisions (e.g., attempts to escape system boundaries or inject instructions).

### 2. Assistance, Not Replacement
Positioned as an assistive partner, not legal counsel:
- Persistent, high-contrast legal disclaimer banner across all viewports.
- Dedicated **"Questions for Lawyer"** engine generating high-value clarifying questions for legal consultations.
- System prompt enforces attorney consultation warnings for disputes, penalties, and material covenants.

### 3. Dual-Pane Side-by-Side Verification
- Side-by-side layout keeps source documents permanently visible while interacting with the AI assistant.
- Users can cross-reference citations directly against source clauses in real time.
- Integrated **Clause-by-Clause Comparison Mode** evaluates two contracts side-by-side (e.g., standard vs. amended).

### 4. Enterprise-Grade Security & Performance
- **HTTP Security Headers:** Strict Content Security Policy (CSP), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and Referrer Policy.
- **Smart Response Caching:** In-memory SHA-256 LRU cache for identical queries, reducing repeated analysis latency from seconds to <5ms.
- **Self-Hosted Zero-Runtime Fonts:** Preloaded via Next.js Font Optimization to eliminate render-blocking external network requests.
- **WCAG 2.1 AA/AAA Accessibility:** Skip-to-content links, screen-reader status announcements, full keyboard navigation, and reduced-motion adaptation.

---

## Features

| Feature | Description |
| :--- | :--- |
| **Summarize** | Plain-language executive summary highlighting parties, purpose, effective dates, and core terms |
| **Identify Risks** | Identifies liabilities, indemnity clauses, penalty terms, and unusual covenants with clause citations |
| **Simplify Terms** | Translates complex legalese into clear, everyday language for non-lawyers |
| **Action Checklist** | Generates structured Markdown checkboxes (`- [ ]`) of deadlines, deliverables, and obligations |
| **Compare Documents** | Compares Document A and Document B clause-by-clause, highlighting conflicting terms and favorability |
| **Questions for Lawyer** | Formulates 5 high-impact questions to ask an attorney before signing |
| **Conversational Q&A** | Free-form legal document queries strictly grounded in the source text |
| **Sample NDA Loader** | 1-Click sample contract loader enabling immediate testing and evaluation without manual copying |
| **Document Analytics** | Real-time word count, character count, and estimated reading time statistics |
| **Export & Copy** | 1-Click copy-to-clipboard and markdown export (`.md`) of analysis reports |

---

## GenAI Services Used

| Service | Model | Implementation Details |
| :--- | :--- | :--- |
| **Google Gemini API** | `gemini-3.5-flash-lite` | Integrated via `@google/genai` SDK in `/api/analyze` route handler with low temperature (0.2) for deterministic, factual legal analysis. |

---

## Tech Stack & Quality Standards

- **Framework:** Next.js 16 (App Router) + TypeScript 5 (Strict Mode, 0 `any` types)
- **Styling:** Vanilla CSS with custom glassmorphism design system (no Tailwind)
- **Performance:** `next/font/google` self-hosting, React memoization, SWC compression
- **Testing:** Vitest + React Testing Library (55 automated tests across 7 test suites)
- **Security:** CSP headers, rate-limiting with true client IP resolution, delimiter injection defense
- **Accessibility:** WCAG 2.1 compliant (contrast, skip link, ARIA live regions, prefers-reduced-motion)

---

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/analyze/route.ts   # Backend: Gemini API, rate-limiting, response caching, security
│   │   ├── error.tsx              # Next.js Error Boundary
│   │   ├── globals.css            # Accessible Design System & CSS variables
│   │   ├── layout.tsx             # Root layout with next/font, SEO, & skip-link
│   │   ├── loading.tsx            # Suspense loading fallback
│   │   ├── not-found.tsx          # 404 handler
│   │   └── page.tsx               # Orchestrator & interactive consultation view
│   ├── components/
│   │   ├── ChatInputBar.tsx       # Text input, keyboard Enter handling, accessibility
│   │   ├── ChatMessage.tsx        # Markdown rendering, copy-to-clipboard, export report
│   │   ├── DocumentInput.tsx      # Textarea, word stats, compare mode, sample NDA loader
│   │   └── QuickActions.tsx       # Grounded action shortcut buttons
│   └── lib/
│       └── utils.ts               # Input sanitization, delimiter defense, IP extraction, stats
├── __tests__/
│   ├── api.test.ts                # API integration: caching, rate-limiting, 405/415 handling
│   ├── security.test.ts           # Security suite: prompt injection, delimiter tampering, XSS
│   ├── utils.test.ts              # Unit tests for text validation, stats, truncation
│   └── components/
│       ├── ChatInputBar.test.tsx  # Component tests: keyboard, form submit, disabled states
│       ├── ChatMessage.test.tsx   # Component tests: markdown, copy, export
│       ├── DocumentInput.test.tsx # Component tests: sample loading, clear, compare mode
│       └── QuickActions.test.tsx  # Component tests: action dispatch, accessibility
├── next.config.ts                 # HTTP Security Headers (CSP, HSTS, X-Frame-Options) & compression
├── tsconfig.json                  # Strict TypeScript configuration
├── vitest.config.ts               # Test runner configuration (JSDOM)
└── package.json
```

---

## Running Locally

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/Legal.ai.git
cd Legal.ai

# 2. Install dependencies
npm install

# 3. Add Gemini API Key to .env
echo 'GEMINI_API_KEY="your_gemini_api_key_here"' > .env

# 4. Run automated test suite (55 tests)
npm test

# 5. Run linter (0 errors, 0 warnings)
npm run lint

# 6. Start development server
npm run dev

# 7. Build for production
npm run build
```

---

## Automated Test Verification

Legal.ai includes **55 automated tests** across **7 test suites**:

```
✓ __tests__/components/ChatInputBar.test.tsx  (5 tests)
✓ __tests__/components/ChatMessage.test.tsx   (3 tests)
✓ __tests__/components/DocumentInput.test.tsx (5 tests)
✓ __tests__/components/QuickActions.test.tsx  (4 tests)
✓ __tests__/security.test.ts                 (7 tests)
✓ __tests__/utils.test.ts                    (23 tests)
✓ __tests__/api.test.ts                      (8 tests)

Test Files:  7 passed (7)
Tests:       55 passed (55)
Status:      100% Passing
```
