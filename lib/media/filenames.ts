type CreateOutputFilenameInput = {
  originalName: string;
  format: string;
  width?: number;
  height?: number;
  index?: number;
  template?: string;
};

export const DEFAULT_FILENAME_TEMPLATE = "{name}-{width}x{height}-converted";

export function createOutputFilename({
  originalName,
  format,
  width,
  height,
  index,
  template = DEFAULT_FILENAME_TEMPLATE,
}: CreateOutputFilenameInput) {
  const lastDot = originalName.lastIndexOf(".");
  const originalBasename = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  const fallbackTemplate = width && height ? DEFAULT_FILENAME_TEMPLATE : "{name}-converted";
  const normalizedTemplate = template.trim();
  const effectiveTemplate =
    !normalizedTemplate || (normalizedTemplate === DEFAULT_FILENAME_TEMPLATE && (!width || !height))
      ? fallbackTemplate
      : normalizedTemplate;
  const rendered = effectiveTemplate
    .replaceAll("{name}", originalBasename)
    .replaceAll("{width}", width ? String(width) : "")
    .replaceAll("{height}", height ? String(height) : "")
    .replaceAll("{format}", format)
    .replaceAll("{index}", index ? String(index) : "");
  const basename = sanitizeFilenameBase(rendered) || sanitizeFilenameBase(`${originalBasename}-converted`) || "converted";

  return `${basename}.${format.toLowerCase()}`;
}

function sanitizeFilenameBase(value: string) {
  return value
    .replace(/[\u0000-\u001f\u007f]+/g, "-")
    .replace(/[\\/:%*?"<>|.]+/g, "-")
    .replace(/\s+-\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[\s-]+|[\s-]+$/g, "");
}
