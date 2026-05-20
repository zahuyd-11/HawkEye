// Simple in-memory rate limiter
// For production, consider using Redis or a dedicated service

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

export function rateLimit(options: RateLimitOptions) {
  return {
    check: (limit: number, identifier: string): boolean => {
      const now = Date.now();
      const windowStart = now - options.interval;

      // Clean up old entries
      Object.keys(store).forEach((key) => {
        if (store[key].resetTime < now) {
          delete store[key];
        }
      });

      // Get or create entry
      if (!store[identifier] || store[identifier].resetTime < now) {
        store[identifier] = {
          count: 1,
          resetTime: now + options.interval,
        };
        return true;
      }

      // Check limit
      if (store[identifier].count >= limit) {
        return false;
      }

      // Increment count
      store[identifier].count++;
      return true;
    },
  };
}

// Pre-configured rate limiters
export const apiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // 500 requests per minute
});

export const authRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5, // 5 attempts per 15 minutes
});

