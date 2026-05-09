"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = exports.setCache = void 0;
// Sistema simple de Caché para ahorrar tokens de la API
const cache = new Map();
const CACHE_DURATION = 30000; // 30 segundos de duración
const setCache = (key, data) => {
    cache.set(key, {
        data,
        timestamp: Date.now(),
    });
};
exports.setCache = setCache;
const getCache = (key) => {
    const cachedItem = cache.get(key);
    if (!cachedItem)
        return null;
    const isExpired = Date.now() - cachedItem.timestamp > CACHE_DURATION;
    if (isExpired) {
        cache.delete(key);
        return null;
    }
    return cachedItem.data;
};
exports.getCache = getCache;
