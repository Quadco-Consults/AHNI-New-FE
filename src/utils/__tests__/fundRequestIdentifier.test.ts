/**
 * Test file for Fund Request Identifier Generation
 *
 * Note: These are unit tests for the identifier generation logic.
 * The API integration tests should be run separately once the backend endpoint is implemented.
 */

import {
  generateFundRequestIdentifier,
  parseFundRequestIdentifier,
  getLocationCode,
  generateLocationCodeFromName,
  validateFundRequestIdentifier,
  examples
} from '../fundRequestIdentifier';

describe('Fund Request Identifier Generation', () => {
  describe('generateFundRequestIdentifier', () => {
    it('should generate correct identifier format', () => {
      const result = generateFundRequestIdentifier({
        projectId: 'ACE1-1001000',
        locationCode: 'ASO',
        year: 2025,
        month: 11,
        sequence: 1
      });

      expect(result).toBe('ACE1-1001000-ASO-25-11-01');
    });

    it('should handle single digit months and sequences', () => {
      const result = generateFundRequestIdentifier({
        projectId: 'TEST-123',
        locationCode: 'LOC',
        year: 2024,
        month: 5,
        sequence: 3
      });

      expect(result).toBe('TEST-123-LOC-24-05-03');
    });

    it('should use defaults for year, month, and sequence', () => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      const result = generateFundRequestIdentifier({
        projectId: 'DEFAULT-TEST',
        locationCode: 'DEF'
      });

      const expectedYear = String(currentYear).slice(-2);
      const expectedMonth = String(currentMonth).padStart(2, '0');

      expect(result).toBe(`DEFAULT-TEST-DEF-${expectedYear}-${expectedMonth}-01`);
    });
  });

  describe('parseFundRequestIdentifier', () => {
    it('should correctly parse valid identifier', () => {
      const identifier = 'ACE1-1001000-ASO-25-11-01';
      const result = parseFundRequestIdentifier(identifier);

      expect(result).toEqual({
        projectId: 'ACE1-1001000',
        locationCode: 'ASO',
        year: 2025,
        month: 11,
        sequence: 1
      });
    });

    it('should handle different year formats', () => {
      const identifier = 'TEST-123-LOC-24-05-03';
      const result = parseFundRequestIdentifier(identifier);

      expect(result).toEqual({
        projectId: 'TEST-123',
        locationCode: 'LOC',
        year: 2024,
        month: 5,
        sequence: 3
      });
    });

    it('should throw error for invalid format', () => {
      expect(() => {
        parseFundRequestIdentifier('INVALID-FORMAT');
      }).toThrow('Invalid fund request identifier format');
    });
  });

  describe('getLocationCode', () => {
    it('should use code field when available', () => {
      const location = {
        id: '1',
        name: 'Adamawa State Office',
        code: 'ASO'
      };

      const result = getLocationCode(location);
      expect(result).toBe('ASO');
    });

    it('should use unique_code field when code is not available', () => {
      const location = {
        id: '1',
        name: 'Lagos State Office',
        unique_code: 'LSO-001'
      };

      const result = getLocationCode(location);
      expect(result).toBe('LSO001');
    });

    it('should fallback to name when neither code nor unique_code available', () => {
      const location = {
        id: '1',
        name: 'Kano State Office'
      };

      const result = getLocationCode(location);
      expect(result).toBe('KAN');
    });

    it('should handle names with special characters', () => {
      const location = {
        id: '1',
        name: 'Cross-River State Office'
      };

      const result = getLocationCode(location);
      expect(result).toBe('CRO');
    });
  });

  describe('generateLocationCodeFromName', () => {
    it('should generate code from multiple words', () => {
      const result = generateLocationCodeFromName('Adamawa State Office');
      expect(result).toBe('ASO');
    });

    it('should handle single word', () => {
      const result = generateLocationCodeFromName('Lagos');
      expect(result).toBe('LAG');
    });

    it('should limit to 3 characters', () => {
      const result = generateLocationCodeFromName('Very Long Location Name Here');
      expect(result).toBe('VLL');
    });
  });

  describe('validateFundRequestIdentifier', () => {
    it('should validate correct format', () => {
      expect(validateFundRequestIdentifier('ACE1-1001000-ASO-25-11-01')).toBe(true);
      expect(validateFundRequestIdentifier('TEST123-LOC-24-05-03')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(validateFundRequestIdentifier('INVALID')).toBe(false);
      expect(validateFundRequestIdentifier('ACE1-ASO-25-11')).toBe(false);
      expect(validateFundRequestIdentifier('ACE1-ASO-2025-11-01')).toBe(false); // 4-digit year
    });
  });

  describe('examples', () => {
    it('should generate correct example identifiers', () => {
      expect(examples.basic).toBe('ACE1-1001000-ASO-25-11-01');
      expect(examples.secondRequest).toBe('ACE1-1001000-ASO-25-11-02');
      expect(examples.differentLocation).toBe('ACE1-1001000-LSO-25-11-01');
    });
  });
});

// Integration test placeholder (requires backend API to be implemented)
describe('Fund Request Identifier API Integration', () => {
  // Note: These tests should be enabled once the backend API endpoint is implemented

  it.skip('should get next sequence number from API', async () => {
    // This test will be enabled when the API endpoint is ready
    // const { getNextSequenceNumber } = await import('../fundRequestIdentifier');
    // const sequence = await getNextSequenceNumber('ACE1-1001000', 'ASO', 2025, 11);
    // expect(typeof sequence).toBe('number');
    // expect(sequence).toBeGreaterThan(0);
  });

  it.skip('should generate complete identifier with API sequence', async () => {
    // This test will be enabled when the API endpoint is ready
    // const { generateFundRequestIdentifierAuto } = await import('../fundRequestIdentifier');
    // const projectData = { id: '1', project_id: 'ACE1-1001000', title: 'Test Project' };
    // const locationData = { id: '1', name: 'Adamawa State Office', code: 'ASO' };
    //
    // const identifier = await generateFundRequestIdentifierAuto(projectData, locationData, 2025, 11);
    // expect(validateFundRequestIdentifier(identifier)).toBe(true);
    // expect(identifier).toMatch(/^ACE1-1001000-ASO-25-11-\d{2}$/);
  });
});