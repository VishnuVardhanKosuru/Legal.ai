import { describe, it, expect } from 'vitest';
import { isValidLegalText, sanitizeInput, truncateDocument, MAX_DOCUMENT_LENGTH } from '../src/lib/utils';

describe('isValidLegalText', () => {
  it('returns false for null, undefined, and non-string inputs', () => {
    expect(isValidLegalText('')).toBe(false);
    expect(isValidLegalText(null as any)).toBe(false);
    expect(isValidLegalText(undefined as any)).toBe(false);
    expect(isValidLegalText(123 as any)).toBe(false);
  });

  it('returns false for strings shorter than 50 characters', () => {
    expect(isValidLegalText('Too short')).toBe(false);
    expect(isValidLegalText('A'.repeat(49))).toBe(false);
  });

  it('returns false for whitespace-only strings under 50 chars', () => {
    expect(isValidLegalText('   ')).toBe(false);
  });

  it('returns true for strings with exactly 50 characters', () => {
    expect(isValidLegalText('A'.repeat(50))).toBe(true);
  });

  it('returns true for long legal-like text', () => {
    const clause = 'This Agreement shall be governed by and construed in accordance with the laws of the State of California.';
    expect(isValidLegalText(clause)).toBe(true);
  });
});

describe('sanitizeInput', () => {
  it('removes basic HTML tags', () => {
    expect(sanitizeInput('<b>Bold</b>')).toBe('Bold');
    expect(sanitizeInput('<p>Hello</p>')).toBe('Hello');
  });

  it('removes script tags (XSS prevention)', () => {
    const xss = '<script>alert("xss")</script>Safe text';
    expect(sanitizeInput(xss)).toBe('alert("xss")Safe text');
  });

  it('preserves text without HTML', () => {
    const clean = 'This is a normal legal clause with no HTML.';
    expect(sanitizeInput(clean)).toBe(clean);
  });

  it('handles self-closing tags', () => {
    expect(sanitizeInput('Line1<br/>Line2')).toBe('Line1Line2');
  });
});

describe('truncateDocument', () => {
  it('returns the same text if under the limit', () => {
    const short = 'A short document.';
    expect(truncateDocument(short)).toBe(short);
  });

  it('truncates text that exceeds MAX_DOCUMENT_LENGTH', () => {
    const long = 'A'.repeat(MAX_DOCUMENT_LENGTH + 500);
    const result = truncateDocument(long);
    expect(result.length).toBeLessThan(long.length);
    expect(result).toContain('[... Document truncated for processing ...]');
  });

  it('does not truncate text exactly at the limit', () => {
    const exact = 'A'.repeat(MAX_DOCUMENT_LENGTH);
    expect(truncateDocument(exact)).toBe(exact);
  });
});
