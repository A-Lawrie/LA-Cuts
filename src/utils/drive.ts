export function extractDriveFileId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/, // drive.google.com/file/d/ID/view
    /[?&]id=([a-zA-Z0-9_-]+)/, // drive.google.com/open?id=ID or /uc?id=ID
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getDriveEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}
export function getDriveThumbnail(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w640`;
}