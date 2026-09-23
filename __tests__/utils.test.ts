import { describe, it, expect } from 'vitest';
import { isValidLegalText, sanitizeInput } from '../src/lib/utils';

describe('Utility Functions', () => {
  describe('isValidLegalText', () => {
    it('should return false for empty or very short strings', () => {
      expect(isValidLegalText('')).toBe(false);
      expect(isValidLegalText('Too short')).toBe(false);
    });

    it('should return true for sufficiently long strings', () => {
      const longText = 'This is a sufficiently long string that could potentially represent a clause in a legal document or contract. It easily exceeds fifty characters.';
      expect(isValidLegalText(longText)).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags from input', () => {
      const dirty = '<script>alert("hack")</script>This is clean.';
      expect(sanitizeInput(dirty)).toBe('alert("hack")This is clean.');
      
      const dirty2 = '<b>Bold text</b>';
      expect(sanitizeInput(dirty2)).toBe('Bold text');
    });
  });
});
