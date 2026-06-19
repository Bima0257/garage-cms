export function safeImageSrc(image?: string | null, defaultImg = '/default.jpg'): string {
  if (!image) return defaultImg
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) return image
  return '/' + image
}
