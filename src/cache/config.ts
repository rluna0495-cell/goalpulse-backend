// Sistema simple de Caché para ahorrar tokens de la API
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 segundos de duración

export const setCache = (key: string, data: any) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const getCache = (key: string) => {
  const cachedItem = cache.get(key);
  if (!cachedItem) return null;

  const isExpired = Date.now() - cachedItem.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return cachedItem.data;
};