/**
 * Utility functions for Legal.ai
 * Covers validation, security sanitization, delimiter escaping, and document analytics.
 */

export const MAX_DOCUMENT_LENGTH = 100_000; // ~100k chars ≈ ~25k tokens

/**
 * Validates if the provided text has sufficient substance for legal analysis.
 * Prevents empty or trivial inputs from reaching the AI model.
 */
export function isValidLegalText(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  return text.trim().length >= 50;
}

/**
 * Enhanced security sanitization:
 * 1. Strips HTML/XML tags and script patterns to prevent XSS.
 * 2. Neutralizes delimiter injection attempts (e.g., breaking out of document blocks).
 * 3. Removes null bytes and dangerous non-printable control characters.
 */
export function sanitizeInput(text: string): string {
  if (!text || typeof text !== 'string') return '';

  return (
    text
      // Remove null bytes and non-printable control characters (except newline, tab, carriage return)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Strip HTML/XML tags
      .replace(/<[^>]*>?/gm, '')
      // Neutralize delimiter spoofing attempts that might try to escape system prompt boundaries
      .replace(/---+\s*(START|END)\s+OF\s+DOCUMENT[\w\s]*---+/gi, '[DELIMITER_REMOVED]')
      .replace(/<\/?(legal_document|system_instruction|prompt_boundary)[^>]*>/gi, '')
      .trim()
  );
}

/**
 * Truncates a document to a maximum character count to stay within
 * Gemini context window limits and control resource usage.
 */
export function truncateDocument(text: string, maxLength: number = MAX_DOCUMENT_LENGTH): string {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '\n\n[... Document truncated for processing ...]';
}

/**
 * Robust IP extraction to prevent IP spoofing through manipulated proxy headers.
 * Extracts the first non-internal IP from comma-separated x-forwarded-for headers.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((ip) => ip.trim());
    if (ips.length > 0 && ips[0]) {
      return ips[0];
    }
  }

  const realIp = headers.get('x-real-ip');
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp && cfConnectingIp.trim()) {
    return cfConnectingIp.trim();
  }

  return '127.0.0.1';
}

/**
 * Computes document analytics to help users assess contract length and readability.
 */
export interface DocumentStats {
  characters: number;
  words: number;
  readingTimeMinutes: number;
}

export function getDocumentStats(text: string): DocumentStats {
  if (!text || typeof text !== 'string') {
    return { characters: 0, words: 0, readingTimeMinutes: 0 };
  }

  const trimmed = text.trim();
  const characters = trimmed.length;
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  // Average reading speed for legal text: ~180 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 180));

  return {
    characters,
    words,
    readingTimeMinutes,
  };
}

/**
 * Standard sample contract for instant testing and evaluation.
 */
export const SAMPLE_CONTRACT = `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of October 1, 2026 ("Effective Date"), by and between AlphaTech Solutions Inc. ("Party A") and Beta Innovations LLC ("Party B").

1. PURPOSE
The parties wish to explore a potential business partnership regarding artificial intelligence software integration ("Purpose"). In connection with this Purpose, each party may disclose to the other certain proprietary and confidential information.

2. CONFIDENTIAL INFORMATION
"Confidential Information" refers to all non-public information disclosed by one party ("Disclosing Party") to the other party ("Receiving Party"), including but not limited to source code, trade secrets, business models, financial data, customer lists, and product specifications.

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to:
(a) Protect Confidential Information with the same degree of care it uses for its own confidential materials, but not less than reasonable care.
(b) Restrict disclosure solely to employees, contractors, and legal advisors with a strict need-to-know basis who have executed non-disclosure covenants at least as restrictive as this Agreement.
(c) Not reverse-engineer, decompile, or copy any software or proprietary artifacts provided by the Disclosing Party.

4. EXCLUSIONS FROM CONFIDENTIALITY
Confidential Information does not include information that:
(a) Is or becomes publicly known through no breach of this Agreement by the Receiving Party.
(b) Was rightfully known to the Receiving Party prior to disclosure.
(c) Is independently developed by the Receiving Party without reference to or reliance upon Disclosing Party's Confidential Information.

5. TERM AND TERMINATION
This Agreement shall remain in effect for a period of two (2) years from the Effective Date. The confidentiality obligations regarding trade secrets shall survive indefinitely.

6. REMEDIES AND INDEMNIFICATION
The parties acknowledge that unauthorized disclosure or use of Confidential Information will cause irreparable harm for which damages may be inadequate. Accordingly, the Disclosing Party shall be entitled to seek injunctive relief in addition to any other remedies available at law. The breaching party agrees to indemnify and hold harmless the non-breaching party against all direct liabilities, costs, and legal fees resulting from a breach.

7. GOVERNING LAW AND DISPUTE RESOLUTION
This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of law principles. Any dispute arising under this Agreement shall be resolved through binding arbitration in Wilmington, Delaware.`;

export const SAMPLE_CONTRACT_B = `REVISED MUTUAL NON-DISCLOSURE AGREEMENT (AMENDED VERSION)

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of October 1, 2026 ("Effective Date"), by and between AlphaTech Solutions Inc. ("Party A") and Beta Innovations LLC ("Party B").

1. PURPOSE
The parties wish to explore a potential joint venture and cross-licensing arrangement.

2. CONFIDENTIAL INFORMATION
"Confidential Information" refers strictly to materials explicitly marked in writing as "CONFIDENTIAL" at the time of disclosure. Oral disclosures are not protected unless reduced to writing within 5 days.

3. OBLIGATIONS
The Receiving Party shall exercise commercially reasonable care. Disclosures to contractors are permitted without prior written consent.

4. TERM AND SURVIVAL
This Agreement expires after one (1) year. All confidentiality obligations terminate upon expiration of the one-year term, including trade secrets.

5. LIMITATION OF LIABILITY
Neither party shall be liable for indirect, incidental, or consequential damages. Maximum aggregate liability under this agreement is capped at $5,000 USD. Injunctive relief is explicitly waived.

6. GOVERNING LAW
This Agreement shall be governed exclusively by the laws of the State of New York.`;
