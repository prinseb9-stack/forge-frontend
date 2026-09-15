import { useState } from 'react';
import { generateContent } from '../services/ai';
import type { Platform } from '../types';

export const useContentGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async (topic: string, platform: Platform) => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateContent(topic, platform);
      setContent(result);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setContent(null);
    setError(null);
  };

  return {
    content,
    isLoading,
    error,
    generate,
    clear,
  };
};