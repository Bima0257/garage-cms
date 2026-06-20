export const SWAL_CONFIRM_COLOR = '#f2a93b'

export function safeImageSrc(image?: string | null, defaultImg = '/default-img/default.jpg'): string {
  if (!image) return defaultImg
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) return image
  return '/' + image
}
