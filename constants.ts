
import { PassportSize, ToolCategory, Tool } from './types.ts';

export const PASSPORT_SIZES: PassportSize[] = [
  { name: 'US_PASSPORT', widthMm: 51, heightMm: 51, label: '2 x 2 inch (US Passport)' },
  { name: 'UK_PASSPORT', widthMm: 35, heightMm: 45, label: '35 x 45 mm (UK/EU/Visa)' },
  { name: 'IN_PASSPORT', widthMm: 35, heightMm: 35, label: '35 x 35 mm (India)' },
  { name: 'CN_PASSPORT', widthMm: 33, heightMm: 48, label: '33 x 48 mm (China)' },
];

export const BG_COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Off White', value: '#F5F5F5' },
  { name: 'Studio Blue', value: '#1E40AF' },
  { name: 'Light Blue', value: '#BFDBFE' },
  { name: 'Formal Grey', value: '#9CA3AF' },
  { name: 'Light Red', value: '#FEE2E2' },
];

export const TOOLS: Tool[] = [
  {
    id: 'passport-maker',
    name: 'Passport Maker',
    description: 'Auto-cutout and center photo',
    icon: '👤',
    category: ToolCategory.CORE,
    path: '/passport',
    ai: true
  },
  {
    id: 'bg-remover',
    name: 'Remove BG',
    description: 'High-quality AI cutout',
    icon: '✨',
    category: ToolCategory.CORE,
    path: '/bg-remover',
    ai: true
  },
  {
    id: 'enhancer',
    name: 'Enhance',
    description: 'One-tap auto quality fix',
    icon: '🪄',
    category: ToolCategory.CORE,
    path: '/enhance',
    ai: true
  },
  {
    id: 'cropper',
    name: 'Crop Image',
    description: 'Free & preset cropping',
    icon: '✂️',
    category: ToolCategory.EDIT,
    path: '/crop'
  },
  {
    id: 'resizer',
    name: 'Resize Image',
    description: 'Change pixel dimensions',
    icon: '📐',
    category: ToolCategory.EDIT,
    path: '/resize'
  },
  {
    id: 'compressor',
    name: 'Compress',
    description: 'Reduce file size',
    icon: '🗜️',
    category: ToolCategory.EDIT,
    path: '/compress'
  },
  {
    id: 'converter',
    name: 'Convert',
    description: 'JPG, PNG, WEBP formats',
    icon: '🔄',
    category: ToolCategory.CONVERT,
    path: '/convert'
  },
  {
    id: 'pdf-maker',
    name: 'To PDF',
    description: 'Images to clean PDF',
    icon: '📄',
    category: ToolCategory.CONVERT,
    path: '/pdf'
  },
  {
    id: 'recent',
    name: 'Recent Files',
    description: 'Your local edit history',
    icon: '🕒',
    category: ToolCategory.EXTRAS,
    path: '/recent'
  }
];

export const FREE_AI_LIMIT = 5;
