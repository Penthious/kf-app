import type { ValidImageFile } from '../types';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function extractGearIdFromFileName(fileName: string): string | null {
  // Extract UUID from filename like "gear_abc123-def4-5678-9abc-def456789abc_sword_of_truth.jpg"
  // UUID format: flexible alphanumeric with hyphens (e.g., 6-4-4-4-12 or 8-4-4-4-12)
  const match = fileName.match(
    /^gear_([a-zA-Z0-9]+-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})_(.+)\.(jpg|jpeg|png|webp)$/i
  );
  return match ? match[1] : null;
}

export function extractGearNameFromFileName(fileName: string): string | null {
  // Extract gear name from filename
  // UUID format: flexible alphanumeric with hyphens (e.g., 6-4-4-4-12 or 8-4-4-4-12)
  const match = fileName.match(
    /^gear_[a-zA-Z0-9]+-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}_(.+)\.(jpg|jpeg|png|webp)$/i
  );
  return match ? match[1] : null;
}

export function generateGearImageFileName(
  gearId: string,
  gearName: string,
  extension: string = 'jpg'
): string {
  // Convert gear name to filename-safe format
  const safeName = gearName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/-+/g, '_') // Replace hyphens with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .trim();

  return `gear_${gearId}_${safeName}.${extension}`;
}

export function isValidImageFormat(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  // Check MIME type
  if (validTypes.includes(file.type)) {
    return true;
  }

  // Check file extension as fallback
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  return validExtensions.includes(extension);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function validateZipContents(files: File[]): ValidImageFile[] {
  const validImages: ValidImageFile[] = [];

  for (const file of files) {
    const gearId = extractGearIdFromFileName(file.name);
    const gearName = extractGearNameFromFileName(file.name);

    if (!gearId) {
      continue; // Invalid filename format
    }

    if (!gearName) {
      continue; // Invalid filename format
    }

    if (!isValidImageFormat(file)) {
      continue; // Invalid image format
    }

    if (file.size > MAX_IMAGE_SIZE) {
      continue; // File too large
    }

    validImages.push({
      file,
      gearId,
      gearName,
      fileName: file.name,
    });
  }

  return validImages;
}
