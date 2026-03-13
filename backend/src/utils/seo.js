/**
 * Generate SEO-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} - URL-safe slug
 */
function generateSlug(text) {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generate unique slug by appending number if needed
 * @param {string} baseSlug - Base slug to make unique
 * @param {Function} checkExists - Async function to check if slug exists
 * @param {number} excludeId - ID to exclude from uniqueness check
 * @returns {Promise<string>} - Unique slug
 */
async function generateUniqueSlug(baseSlug, checkExists, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;
  
  while (await checkExists(slug, excludeId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

module.exports = {
  generateSlug,
  generateUniqueSlug
};
