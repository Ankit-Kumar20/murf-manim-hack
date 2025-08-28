import fs from 'fs';
import path from 'path';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  topic: string;
}

interface ManimCodeCache {
  code: string;
  validatedCode: string;
}

interface VoiceScriptCache {
  script: string;
  segments: Array<{ text: string; duration: number; timestamp: number }>;
  voiceStyle: string;
  speakingRate: number;
}

interface LessonBreakdownCache {
  lessons: Array<{
    part: number;
    script: string;
    manim_code: string;
  }>;
}

class TopicCache {
  private cacheDir: string;
  private maxAge: number; // Cache expiration in milliseconds

  constructor() {
    // Check if we're in a serverless environment or caching is explicitly disabled
    const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
    const isNetlify = process.env.NETLIFY;
    const isServerless = isVercel || isNetlify || process.env.NODE_ENV === 'production';
    const cachingDisabled = process.env.DISABLE_CACHE === 'true';
    
    if (cachingDisabled) {
      console.log('Caching explicitly disabled via DISABLE_CACHE environment variable');
      this.cacheDir = '';
    } else if (isServerless) {
      // Use /tmp directory in serverless environments
      this.cacheDir = path.join('/tmp', '.cache');
      console.log('Using /tmp cache directory for serverless environment');
    } else {
      // Use local .cache directory for development
      this.cacheDir = path.join(process.cwd(), '.cache');
    }
    
    this.maxAge = 24 * 60 * 60 * 1000; // 24 hours
    this.ensureCacheDir();
  }

  private ensureCacheDir() {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }
    } catch (error) {
      console.warn('Could not create cache directory:', error);
      // Fallback to a different directory if cache creation fails
      const fallbackDir = path.join('/tmp', 'cache-fallback');
      try {
        if (!fs.existsSync(fallbackDir)) {
          fs.mkdirSync(fallbackDir, { recursive: true });
        }
        this.cacheDir = fallbackDir;
        console.log('Using fallback cache directory:', this.cacheDir);
      } catch (fallbackError) {
        console.error('Could not create fallback cache directory:', fallbackError);
        // Disable caching if we can't create any directory
        this.cacheDir = '';
      }
    }
  }

  private getCacheFilePath(type: 'manim' | 'voice' | 'lesson', topic: string): string {
    if (!this.cacheDir) {
      // Return empty path if caching is disabled
      return '';
    }
    const safeTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return path.join(this.cacheDir, `${type}_${safeTopic}.json`);
  }

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.maxAge;
  }

  // Manim Code Caching
  async getManimCode(topic: string): Promise<ManimCodeCache | null> {
    try {
      const filePath = this.getCacheFilePath('manim', topic);
      
      // Return null if caching is disabled or file doesn't exist
      if (!filePath || !fs.existsSync(filePath)) {
        return null;
      }

      const cached: CacheEntry<ManimCodeCache> = JSON.parse(
        fs.readFileSync(filePath, 'utf-8')
      );

      if (this.isExpired(cached.timestamp)) {
        console.log(`Cache expired for Manim code: ${topic}`);
        fs.unlinkSync(filePath); // Remove expired cache
        return null;
      }

      console.log(`Cache hit for Manim code: ${topic}`);
      return cached.data;
    } catch (error) {
      console.error('Error reading Manim cache:', error);
      return null;
    }
  }

  async setManimCode(topic: string, code: string, validatedCode: string): Promise<void> {
    try {
      const filePath = this.getCacheFilePath('manim', topic);
      
      // Skip caching if disabled
      if (!filePath) {
        console.log('Caching disabled, skipping setManimCode');
        return;
      }

      const cacheEntry: CacheEntry<ManimCodeCache> = {
        data: { code, validatedCode },
        timestamp: Date.now(),
        topic
      };

      fs.writeFileSync(filePath, JSON.stringify(cacheEntry, null, 2));
      console.log(`Cached Manim code for topic: ${topic}`);
    } catch (error) {
      console.error('Error writing Manim cache:', error);
    }
  }

  // Voice Script Caching
  async getVoiceScript(topic: string): Promise<VoiceScriptCache | null> {
    try {
      const filePath = this.getCacheFilePath('voice', topic);
      
      // Return null if caching is disabled or file doesn't exist
      if (!filePath || !fs.existsSync(filePath)) {
        return null;
      }

      const cached: CacheEntry<VoiceScriptCache> = JSON.parse(
        fs.readFileSync(filePath, 'utf-8')
      );

      if (this.isExpired(cached.timestamp)) {
        console.log(`Cache expired for voice script: ${topic}`);
        fs.unlinkSync(filePath); // Remove expired cache
        return null;
      }

      console.log(`Cache hit for voice script: ${topic}`);
      return cached.data;
    } catch (error) {
      console.error('Error reading voice cache:', error);
      return null;
    }
  }

  async setVoiceScript(topic: string, scriptData: VoiceScriptCache): Promise<void> {
    try {
      const filePath = this.getCacheFilePath('voice', topic);
      
      // Skip caching if disabled
      if (!filePath) {
        console.log('Caching disabled, skipping setVoiceScript');
        return;
      }

      const cacheEntry: CacheEntry<VoiceScriptCache> = {
        data: scriptData,
        timestamp: Date.now(),
        topic
      };

      fs.writeFileSync(filePath, JSON.stringify(cacheEntry, null, 2));
      console.log(`Cached voice script for topic: ${topic}`);
    } catch (error) {
      console.error('Error writing voice cache:', error);
    }
  }

  // Lesson Breakdown Caching
  async getLessonBreakdown(topic: string): Promise<LessonBreakdownCache | null> {
    try {
      const filePath = this.getCacheFilePath('lesson', topic);
      
      // Return null if caching is disabled or file doesn't exist
      if (!filePath || !fs.existsSync(filePath)) {
        return null;
      }

      const cached: CacheEntry<LessonBreakdownCache> = JSON.parse(
        fs.readFileSync(filePath, 'utf-8')
      );

      if (this.isExpired(cached.timestamp)) {
        console.log(`Cache expired for lesson breakdown: ${topic}`);
        fs.unlinkSync(filePath); // Remove expired cache
        return null;
      }

      console.log(`Cache hit for lesson breakdown: ${topic}`);
      return cached.data;
    } catch (error) {
      console.error('Error reading lesson breakdown cache:', error);
      return null;
    }
  }

  async setLessonBreakdown(topic: string, breakdownData: LessonBreakdownCache): Promise<void> {
    try {
      const filePath = this.getCacheFilePath('lesson', topic);
      
      // Skip caching if disabled
      if (!filePath) {
        console.log('Caching disabled, skipping setLessonBreakdown');
        return;
      }

      const cacheEntry: CacheEntry<LessonBreakdownCache> = {
        data: breakdownData,
        timestamp: Date.now(),
        topic
      };

      fs.writeFileSync(filePath, JSON.stringify(cacheEntry, null, 2));
      console.log(`Cached lesson breakdown for topic: ${topic}`);
    } catch (error) {
      console.error('Error writing lesson breakdown cache:', error);
    }
  }

  // Cache Management
  async clearExpiredCache(): Promise<void> {
    try {
      // Skip if caching is disabled
      if (!this.cacheDir || !fs.existsSync(this.cacheDir)) {
        return;
      }

      const files = fs.readdirSync(this.cacheDir);
      let cleared = 0;

      for (const file of files) {
        const filePath = path.join(this.cacheDir, file);
        try {
          const cached: CacheEntry<unknown> = JSON.parse(
            fs.readFileSync(filePath, 'utf-8')
          );

          if (this.isExpired(cached.timestamp)) {
            fs.unlinkSync(filePath);
            cleared++;
          }
        } catch (error) {
          // Invalid cache file, remove it
          fs.unlinkSync(filePath);
          cleared++;
        }
      }

      if (cleared > 0) {
        console.log(`Cleared ${cleared} expired cache entries`);
      }
    } catch (error) {
      console.error('Error clearing expired cache:', error);
    }
  }

  async getCacheStats(): Promise<{ manimEntries: number; voiceEntries: number; lessonEntries: number; totalSize: string }> {
    try {
      // Return empty stats if caching is disabled
      if (!this.cacheDir || !fs.existsSync(this.cacheDir)) {
        return { manimEntries: 0, voiceEntries: 0, lessonEntries: 0, totalSize: '0 KB' };
      }

      const files = fs.readdirSync(this.cacheDir);
      let manimEntries = 0;
      let voiceEntries = 0;
      let lessonEntries = 0;
      let totalSize = 0;

      for (const file of files) {
        const filePath = path.join(this.cacheDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;

        if (file.startsWith('manim_')) manimEntries++;
        if (file.startsWith('voice_')) voiceEntries++;
        if (file.startsWith('lesson_')) lessonEntries++;
      }

      return {
        manimEntries,
        voiceEntries,
        lessonEntries,
        totalSize: `${(totalSize / 1024).toFixed(2)} KB`
      };
    } catch (error) {
      return { manimEntries: 0, voiceEntries: 0, lessonEntries: 0, totalSize: '0 KB' };
    }
  }

  async clearAllCache(): Promise<void> {
    try {
      // Skip if caching is disabled
      if (!this.cacheDir || !fs.existsSync(this.cacheDir)) {
        console.log('Caching disabled, no cache to clear');
        return;
      }

      const files = fs.readdirSync(this.cacheDir);
      for (const file of files) {
        fs.unlinkSync(path.join(this.cacheDir, file));
      }
      console.log('Cleared all cache entries');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

// Singleton instance
export const topicCache = new TopicCache();

// Export types for use in other modules
export type { ManimCodeCache, VoiceScriptCache, LessonBreakdownCache };

