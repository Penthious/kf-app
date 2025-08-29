import { describe, expect, it } from 'vitest';
import {
  extractGearIdFromFileName,
  extractGearNameFromFileName,
  formatFileSize,
  generateGearImageFileName,
  isValidImageFormat,
  validateZipContents,
} from './gear-helpers';

describe('Gear Helpers', () => {
  describe('extractGearIdFromFileName', () => {
    it('should extract UUID from valid filename', () => {
      const fileName = 'gear_abc123-def4-5678-9abc-def456789abc_sword_of_truth.jpg';
      const gearId = extractGearIdFromFileName(fileName);
      expect(gearId).toBe('abc123-def4-5678-9abc-def456789abc');
    });

    it('should extract UUID from filename with different extensions', () => {
      const jpgFile = 'gear_def456-7890-abcd-ef12-345678901234_iron_helmet.jpg';
      const pngFile = 'gear_ghi789-bcde-f123-4567-89abcdef0123_healing_potion.png';
      const webpFile = 'gear_jkl012-3456-789a-bcde-f01234567890_magic_ring.webp';

      expect(extractGearIdFromFileName(jpgFile)).toBe('def456-7890-abcd-ef12-345678901234');
      expect(extractGearIdFromFileName(pngFile)).toBe('ghi789-bcde-f123-4567-89abcdef0123');
      expect(extractGearIdFromFileName(webpFile)).toBe('jkl012-3456-789a-bcde-f01234567890');
    });

    it('should return null for invalid filename format', () => {
      const invalidFiles = [
        'gear_invalid_uuid_sword.jpg',
        'gear_abc123-def4-5678-9abc-def456789abc.jpg', // missing gear name
        'gear_abc123-def4-5678-9abc-def456789abc_sword_of_truth.txt', // wrong extension
        'sword_of_truth.jpg', // missing gear_ prefix
        'gear_abc123-def4-5678-9abc-def456789abc_sword_of_truth', // missing extension
      ];

      invalidFiles.forEach(fileName => {
        expect(extractGearIdFromFileName(fileName)).toBeNull();
      });
    });

    it('should handle case insensitive extensions', () => {
      const upperCase = 'gear_abc123-def4-5678-9abc-def456789abc_sword_of_truth.JPG';
      const mixedCase = 'gear_abc123-def4-5678-9abc-def456789abc_sword_of_truth.PnG';

      expect(extractGearIdFromFileName(upperCase)).toBe('abc123-def4-5678-9abc-def456789abc');
      expect(extractGearIdFromFileName(mixedCase)).toBe('abc123-def4-5678-9abc-def456789abc');
    });
  });

  describe('extractGearNameFromFileName', () => {
    it('should extract gear name from valid filename', () => {
      const fileName = 'gear_abc123-def4-5678-9abc-def456789abc_sword_of_truth.jpg';
      const gearName = extractGearNameFromFileName(fileName);
      expect(gearName).toBe('sword_of_truth');
    });

    it('should extract gear name with underscores', () => {
      const fileName = 'gear_def456-7890-abcd-ef12-345678901234_iron_helmet_of_power.jpg';
      const gearName = extractGearNameFromFileName(fileName);
      expect(gearName).toBe('iron_helmet_of_power');
    });

    it('should return null for invalid filename format', () => {
      const invalidFiles = [
        'gear_invalid_uuid_sword.jpg',
        'gear_abc123-def4-5678-9abc-def456789abc.jpg', // missing gear name
        'sword_of_truth.jpg', // missing gear_ prefix
      ];

      invalidFiles.forEach(fileName => {
        expect(extractGearNameFromFileName(fileName)).toBeNull();
      });
    });
  });

  describe('generateGearImageFileName', () => {
    it('should generate valid filename with default extension', () => {
      const gearId = 'abc123-def4-5678-9abc-def456789abc';
      const gearName = 'Sword of Truth';
      const fileName = generateGearImageFileName(gearId, gearName);
      expect(fileName).toBe('gear_abc123-def4-5678-9abc-def456789abc_sword_of_truth.jpg');
    });

    it('should generate filename with custom extension', () => {
      const gearId = 'def456-7890-abcd-ef12-345678901234';
      const gearName = 'Iron Helmet';
      const fileName = generateGearImageFileName(gearId, gearName, 'png');
      expect(fileName).toBe('gear_def456-7890-abcd-ef12-345678901234_iron_helmet.png');
    });

    it('should sanitize gear name for filename', () => {
      const gearId = 'ghi789-bcde-f123-4567-89abcdef0123';
      const gearName = 'Magic Ring of Power!';
      const fileName = generateGearImageFileName(gearId, gearName);
      expect(fileName).toBe('gear_ghi789-bcde-f123-4567-89abcdef0123_magic_ring_of_power.jpg');
    });

    it('should handle special characters in gear name', () => {
      const gearId = 'jkl012-3456-789a-bcde-f01234567890';
      const gearName = 'Healing Potion (Rare)';
      const fileName = generateGearImageFileName(gearId, gearName);
      expect(fileName).toBe('gear_jkl012-3456-789a-bcde-f01234567890_healing_potion_rare.jpg');
    });

    it('should handle multiple spaces and hyphens', () => {
      const gearId = 'mno345-6789-cdef-1234-567890123456';
      const gearName = 'Enchanted Bow - Long Range';
      const fileName = generateGearImageFileName(gearId, gearName);
      expect(fileName).toBe('gear_mno345-6789-cdef-1234-567890123456_enchanted_bow_long_range.jpg');
    });
  });

  describe('isValidImageFormat', () => {
    it('should accept valid image formats', () => {
      const validFiles = [
        { name: 'image.jpg', type: 'image/jpeg' },
        { name: 'image.jpeg', type: 'image/jpeg' },
        { name: 'image.png', type: 'image/png' },
        { name: 'image.webp', type: 'image/webp' },
        { name: 'image.JPG', type: 'image/jpeg' },
        { name: 'image.PNG', type: 'image/png' },
      ];

      validFiles.forEach(file => {
        expect(isValidImageFormat(file as File)).toBe(true);
      });
    });

    it('should reject invalid image formats', () => {
      const invalidFiles = [
        { name: 'image.txt', type: 'text/plain' },
        { name: 'image.pdf', type: 'application/pdf' },
        { name: 'image.gif', type: 'image/gif' },
        { name: 'image.bmp', type: 'image/bmp' },
        { name: 'image', type: 'application/octet-stream' },
      ];

      invalidFiles.forEach(file => {
        expect(isValidImageFormat(file as File)).toBe(false);
      });
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should format decimal sizes correctly', () => {
      expect(formatFileSize(1500)).toBe('1.5 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
    });

    it('should handle large files', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB');
    });
  });

  describe('validateZipContents', () => {
    it('should validate valid image files', () => {
      const mockFiles = [
        {
          name: 'gear_abc123-def4-5678-9abc-def456789abc_sword_of_truth.jpg',
          size: 1024 * 1024, // 1MB
          type: 'image/jpeg',
        },
        {
          name: 'gear_def456-7890-abcd-ef12-345678901234_iron_helmet.png',
          size: 512 * 1024, // 512KB
          type: 'image/png',
        },
      ] as File[];

      const result = validateZipContents(mockFiles);
      expect(result).toHaveLength(2);
      expect(result[0].gearId).toBe('abc123-def4-5678-9abc-def456789abc');
      expect(result[0].gearName).toBe('sword_of_truth');
      expect(result[1].gearId).toBe('def456-7890-abcd-ef12-345678901234');
      expect(result[1].gearName).toBe('iron_helmet');
    });

    it('should reject files with invalid names', () => {
      const mockFiles = [
        {
          name: 'invalid_filename.jpg',
          size: 1024 * 1024,
          type: 'image/jpeg',
        },
      ] as File[];

      const result = validateZipContents(mockFiles);
      expect(result).toHaveLength(0);
    });

    it('should reject files that are too large', () => {
      const mockFiles = [
        {
          name: 'gear_abc123-def4-5678-9abc-def456789abc_sword_of_truth.jpg',
          size: 10 * 1024 * 1024, // 10MB (assuming max is 5MB)
          type: 'image/jpeg',
        },
      ] as File[];

      const result = validateZipContents(mockFiles);
      expect(result).toHaveLength(0);
    });

    it('should reject files with invalid formats', () => {
      const mockFiles = [
        {
          name: 'gear_abc123-def4-5678-9abc-def456789abc_sword_of_truth.txt',
          size: 1024,
          type: 'text/plain',
        },
      ] as File[];

      const result = validateZipContents(mockFiles);
      expect(result).toHaveLength(0);
    });
  });
});
