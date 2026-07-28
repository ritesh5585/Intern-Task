/**
 * Converts a free-text string like "ABC Pharma" into a clean,
 * URL-safe slug like "abc-pharma".
 *
 * Steps:
 *  1. lowercase everything
 *  2. trim leading/trailing spaces
 *  3. replace any run of non-alphanumeric characters with a single hyphen
 *  4. strip any leading/trailing hyphens left over from step 3
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
