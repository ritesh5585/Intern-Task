/**
 * Extracts one `location <path> { ... }` block from the full Nginx
 * config text, matching braces so nested `{ }` inside the block
 * (if any) don't cut it short.
 *
 * Returns the block as a string, e.g.:
 *   location /soumalya/indoco/wazzuppapdemo {
 *       alias /var/www/Videos/Wazzuppap;
 *       index video.html;
 *       access_log /var/log/custom/soumalya-indoco-wazzuppap.log;
 *   }
 */
export function extractLocationBlock(configText, oldPath) {
  const startMarker = `location ${oldPath}`;
  const startIndex = configText.indexOf(startMarker);

  if (startIndex === -1) {
    throw new Error(`Template block for path "${oldPath}" not found in config`);
  }

  const openBraceIndex = configText.indexOf("{", startIndex);
  if (openBraceIndex === -1) {
    throw new Error(
      `Malformed config: no opening brace found for "${oldPath}"`,
    );
  }

  // walk forward counting braces so a nested `{ }` doesn't end the match early
  let depth = 1;
  let i = openBraceIndex + 1;
  while (depth > 0 && i < configText.length) {
    if (configText[i] === "{") depth++;
    if (configText[i] === "}") depth--;
    i++;
  }

  if (depth !== 0) {
    throw new Error(`Malformed config: unmatched braces for "${oldPath}"`);
  }

  return configText.slice(startIndex, i);
}

/**
 * Builds the log filename Nginx convention uses in this project:
 * a path like "/rahul/abc-pharma/wazzuppapdemo" becomes
 * "rahul-abc-pharma-wazzuppapdemo.log"
 */
export function pathToLogName(path) {
  return path.replace(/^\/+|\/+$/g, "").replace(/\//g, "-") + ".log";
}

/**
 * Takes the extracted template block and produces a NEW block with
 * the old path swapped for the new one — both in the `location` line
 * and in the `access_log` filename. The alias/index lines are left
 * untouched since the underlying video files don't move.
 */
export function buildNewBlock(templateBlock, oldPath, newPath) {
  const oldLogName = pathToLogName(oldPath);
  const newLogName = pathToLogName(newPath);

  return templateBlock
    .replaceAll(oldPath, newPath)
    .replaceAll(oldLogName, newLogName);
}