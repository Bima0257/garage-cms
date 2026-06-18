export function safeImageSrc(image?: string | null): string | null {
  if (!image) return null
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) return image
  return '/' + image
}
