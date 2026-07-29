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

export function pathToLogName(path) {
  return path.replace(/^\/+|\/+$/g, "").replace(/\//g, "-") + ".log";
}

export function buildNewBlock(templateBlock, oldPath, newPath) {
  const oldLogName = pathToLogName(oldPath);
  const newLogName = pathToLogName(newPath);

  return templateBlock
    .replaceAll(oldPath, newPath)
    .replaceAll(oldLogName, newLogName);
}
