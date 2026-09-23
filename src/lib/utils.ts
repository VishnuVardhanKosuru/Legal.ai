/**
 * Validates if the provided text is substantial enough for legal analysis.
 * We want to prevent users from sending trivial text (like "hello") to the AI
 * and wasting resources or getting hallucinatory answers.
 */
export function isValidLegalText(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  // A very basic check: at least 50 characters long to be considered a "document" segment
  return text.trim().length >= 50;
}

/**
 * Strips potentially dangerous HTML from text before processing, 
 * just as a basic sanitization step for the MVP.
 */
export function sanitizeInput(text: string): string {
  return text.replace(/<[^>]*>?/gm, '');
}
