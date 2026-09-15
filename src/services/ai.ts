// AI service for content generation
export const generateContent = async (
  topic: string,
  platform: string
): Promise<string> => {
  // This will call our AI API
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Generated content about "${topic}" for ${platform}`);
    }, 2000);
  });
};