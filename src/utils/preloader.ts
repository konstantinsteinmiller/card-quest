/**
 * Preloads an array of image URLs and resolves when all are loaded.
 */
export const preloadImages = (urls: string[]): Promise<void[]> => {
  const promises = urls.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = () => {
        console.error(`Failed to load image: ${url}`);
        resolve(); // Resolve anyway so the game doesn't hang, or use reject()
      };
    });
  });
  return Promise.all(promises);
};