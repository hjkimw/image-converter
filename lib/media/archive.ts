import type { UploadedMedia } from "@/types/media";

export function getFileRelativePath(file: File) {
  const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath;

  return relativePath && relativePath !== file.name ? relativePath : undefined;
}

export function getZipOutputPath(item: UploadedMedia) {
  const relativePath = getFileRelativePath(item.file);

  if (!relativePath || !item.result) {
    return item.result?.outputName ?? item.name;
  }

  const lastSlash = relativePath.lastIndexOf("/");

  if (lastSlash === -1) {
    return item.result.outputName;
  }

  return `${relativePath.slice(0, lastSlash)}/${item.result.outputName}`;
}

export function createUniqueArchivePath(path: string, usedPaths: Set<string>) {
  if (!usedPaths.has(path)) {
    usedPaths.add(path);
    return path;
  }

  const slashIndex = path.lastIndexOf("/");
  const directory = slashIndex === -1 ? "" : `${path.slice(0, slashIndex + 1)}`;
  const filename = slashIndex === -1 ? path : path.slice(slashIndex + 1);
  const dotIndex = filename.lastIndexOf(".");
  const baseName = dotIndex === -1 ? filename : filename.slice(0, dotIndex);
  const extension = dotIndex === -1 ? "" : filename.slice(dotIndex);
  let nextIndex = 2;
  let candidate = `${directory}${baseName}-${nextIndex}${extension}`;

  while (usedPaths.has(candidate)) {
    nextIndex += 1;
    candidate = `${directory}${baseName}-${nextIndex}${extension}`;
  }

  usedPaths.add(candidate);
  return candidate;
}
