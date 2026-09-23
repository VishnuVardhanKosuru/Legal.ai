# Legal.ai — AI-Powered Legal Document Assistant

> ⚖️ **This tool provides information only — it does not constitute legal advice.** Always consult a qualified attorney for legal decisions.

## Chosen Vertical

**AI for Legal Assistance & Access** — Making complex legal information easy to understand, navigate, compare, and responsibly act on.

---

## Approach and Core Architecture

Legal.ai is architected around four core pillars designed to maximize trust, factual accuracy, security, and cloud deployment efficiency:

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

### 4. Cloud Efficiency & DevOps Infrastructure (GCP Ready)
- **Google Cloud Run Serverless:** Multi-stage containerized architecture (`Dockerfile`) using Next.js `standalone` mode, yielding an ultra-lightweight ~120MB image with sub-second cold starts and concurrency of 80 requests per container.
- **Google Cloud Build CI/CD:** Fully automated build and deployment pipeline (`cloudbuild.yaml`) for zero-downtime rolling updates.
- **Google App Engine:** Standard environment fallback configuration (`app.yaml`).
- **HTTP Security Headers:** Strict Content Security Policy (CSP), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and Referrer Policy.
- **Smart Response Caching:** In-memory SHA-256 LRU cache for identical queries, reducing repeated analysis latency from seconds to <5ms with `X-Cache: HIT`.
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

## Google Cloud & GenAI Services Used

| Service | Category | Implementation Details |
| :--- | :--- | :--- |
| **Google Gemini API** | GenAI Intelligence | `gemini-3.5-flash-lite` via `@google/genai` SDK in `/api/analyze` route handler (temperature: 0.2, maxOutputTokens: 2048). |
| **Google Cloud Run** | Serverless Compute | Knative-based auto-scaling container service (`cloudrun.yaml`), scaling from 0 to 10 instances with 512Mi memory and 1 vCPU. |
| **Google Cloud Build** | CI/CD Automation | Automated test-then-deploy pipeline (`cloudbuild.yaml`) executing Vitest test suites prior to pushing images. |
| **Google App Engine** | Web Hosting | Node.js 20 standard environment configuration (`app.yaml`) with automatic CPU-based autoscaling. |
| **Google Artifact Registry** | Container Registry | Secure Docker image repository hosting production container builds. |

---

## Tech Stack & Quality Standards

- **Framework:** Next.js 16 (App Router) + TypeScript 5 (Strict Mode, 0 `any` types)
- **Styling:** Vanilla CSS with custom glassmorphism design system (no Tailwind)
- **Performance:** `next/font/google` self-hosting, React memoization, SWC compression, standalone output
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
├── .github/workflows/
│   └── deploy.yml                 # GitHub Actions automated GCP deployment pipeline
├── Dockerfile                     # Multi-stage production container build (Alpine + Standalone)
├── .dockerignore                  # Container build context optimization
├── cloudbuild.yaml                # Google Cloud Build CI/CD pipeline
├── cloudrun.yaml                  # Google Cloud Run Knative service manifest
├── app.yaml                       # Google App Engine deployment configuration
├── deploy-gcp.sh                  # 1-Click GCP Cloud Run deployment script
├── next.config.ts                 # Security headers, standalone output, asset caching
├── tsconfig.json                  # Strict TypeScript configuration
├── vitest.config.ts               # Test runner configuration (JSDOM)
└── package.json
```

---

## Deployment & Running Instructions

### 1. Running Locally

```bash
# Clone repository
git clone https://github.com/<your-username>/Legal.ai.git
cd Legal.ai

# Install dependencies
npm install

# Configure Gemini API key
echo 'GEMINI_API_KEY="your_api_key_here"' > .env

# Run automated tests (55 tests across 7 suites)
npm test

# Run linter (0 errors, 0 warnings)
npm run lint

# Start dev server
npm run dev
```

### 2. Deploying to Google Cloud Run

```bash
# 1-Click deployment via script
chmod +x deploy-gcp.sh
./deploy-gcp.sh

# Or directly via npm script
npm run deploy:gcp
```

### 3. Deploying via Google Cloud Build

```bash
npm run deploy:cloudbuild
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
