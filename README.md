# Legal.ai - AI Legal Assistant

## Chosen Vertical
**Legal Assistance & Access** - Making complex legal information easy to understand, navigate, and responsibly act on.

## Approach and Logic
Legal.ai uses a split-pane, side-by-side design to emphasize **grounding and verification**. Users paste a legal document on the left and interact with an AI assistant on the right. 

To prevent hallucinations:
1. **Strict System Prompting:** The Gemini 1.5 Flash model is instructed to *only* answer questions based on the provided text, and explicitly state when it doesn't have enough information.
2. **Context Window Injection:** The full text of the user's document is prepended to the system prompt in every API request, ensuring the AI is locked into the specific context of that document.
3. **Role Boundary Enforcement:** The system is prompted to act as an assistant, not counsel. A dedicated "Questions for Lawyer" button reinforces this by helping users prepare for professional legal advice rather than replacing it.

## How the Solution Works
1. **Input Document:** The user pastes their legal text (contracts, privacy policies, etc.) into the left pane.
2. **Quick Actions:** The user can click pre-defined actions to quickly summarize the document, identify risks, simplify terms, or generate questions to ask a real lawyer.
3. **Conversational Q&A:** The user can type custom questions. The backend API route (`/api/analyze`) securely communicates with the Google Gemini API, sending the document and chat history.
4. **Markdown Rendering:** The AI's response is formatted and rendered in clean Markdown for easy reading.

### Running Locally
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory and add your Google Gemini API key:
   ```
   GEMINI_API_KEY="your_api_key_here"
   ```
4. Run `npm run dev` to start the development server.
5. Open `http://localhost:3000` in your browser.
6. Run `npm run test` to execute the Vitest test suite.

## Assumptions Made
* **Input Format:** We assume the user can copy/paste plain text. For this MVP and to strictly adhere to the <10 MB repository limit, bulky PDF-parsing libraries were omitted in favor of direct text input.
* **Document Length:** We assume the provided document fits within the context window limits of Gemini 1.5 Flash (which handles very large documents well).
* **Language:** The MVP is optimized for English legal texts.
