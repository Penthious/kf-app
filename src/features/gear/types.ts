export type ValidImageFile = {
  file: File;
  gearId: string;
  gearName: string;
  fileName: string;
};

export type UploadProgress = {
  fileName: string;
  gearId: string;
  gearName: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
};

export type GearFilter = {
  selectedKingdom?: string;
  selectedType?: string;
  searchQuery: string;
  expandedSections: Set<string>;
};
