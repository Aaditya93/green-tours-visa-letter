export function generateImageName(): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  return `image_${timestamp}_${randomString}`;
}
