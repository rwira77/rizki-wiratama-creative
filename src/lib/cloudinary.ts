/**
 * Cloudinary Transformation Utility
 * Helps in generating optimized image URLs for different use cases.
 */

export type TransformType = 'thumb' | 'hero' | 'gallery' | 'blur';

export const getOptimizedUrl = (url: string, type: TransformType = 'thumb') => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Split URL into parts: base, upload, and path
  // Standard format: https://res.cloudinary.com/[cloud_name]/image/upload/[version]/[public_id].[ext]
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const base = parts[0];
  const path = parts[1];

  let transformation = '';

  switch (type) {
    case 'thumb':
      // Optimized for initial grid loading
      transformation = 'upload/c_fill,g_auto,w_800,q_auto,f_auto';
      break;
    case 'hero':
      // Ultra high quality for hero sections
      transformation = 'upload/c_limit,w_1920,q_90,f_auto';
      break;
    case 'gallery':
      // Balanced high quality for vertical scrolling
      transformation = 'upload/c_limit,w_1400,q_auto,f_auto';
      break;
    case 'blur':
      // Tiny version for LQIP placeholder
      transformation = 'upload/c_fill,w_50,e_blur:1000,q_10,f_auto';
      break;
  }

  return `${base}/${transformation}/${path}`;
};
