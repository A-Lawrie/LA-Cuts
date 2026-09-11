export type MainCategory = "longform" | "shortform";

export interface Project {
  id: string;
  title: string;
  mainCategory: MainCategory;
  subcategory: string;
  youtubeId: string;
  thumbnailUrl?: string;
  description: string;
  featured: boolean;
  workItems: string[];
  createdAt: string;
}

export const LONGFORM_SUBCATEGORIES = [
  { id: "all", label: "All" },
  { id: "real-estate", label: "Real Estate" },
  { id: "vlogs", label: "Vlogs" },
  { id: "youtube", label: "YouTube" },
  { id: "documentary", label: "Documentary" },
  { id: "talking-head", label: "Talking Head" },
  { id: "commercial", label: "Commercial" },
];

export const SHORTFORM_SUBCATEGORIES = [
  { id: "all", label: "All" },
  { id: "real-estate", label: "Real Estate" },
  { id: "talking-head", label: "Talking Head" },
  { id: "product", label: "Product" },
  { id: "social-media", label: "Social Media" },
  { id: "color-grading", label: "Color Grading" },
  { id: "cinematic", label: "Cinematic" },
  { id: "commercial", label: "Commercial" },
];

export const WORK_ITEMS = [
  "Editing",
  "Pacing",
  "Color Grading",
  "Sound Design",
  "Motion Graphics",
  "Story Structure",
  "Transitions",
  "Screen Recording",
];
