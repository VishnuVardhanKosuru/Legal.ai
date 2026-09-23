/**
 * Validates if the provided text is substantial enough for legal analysis.
 * Prevents trivial text (like "hello") from being sent to the AI,
 * saving API resources and avoiding hallucinatory answers.
 */
export function isValidLegalText(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  return text.trim().length >= 50;
}

/**
 * Strips potentially dangerous HTML tags from text before processing.
 * This is a basic XSS / prompt-injection mitigation layer.
 */
export function sanitizeInput(text: string): string {
  return text.replace(/<[^>]*>?/gm, '');
}

/**
 * Truncates a document to a maximum character count to stay within
 * Gemini context window limits and prevent excessive API costs.
 */
export const MAX_DOCUMENT_LENGTH = 100_000; // ~100k chars ≈ ~25k tokens
export function truncateDocument(text: string): string {
  if (text.length <= MAX_DOCUMENT_LENGTH) return text;
  return text.slice(0, MAX_DOCUMENT_LENGTH) + '\n\n[... Document truncated for processing ...]';
}
