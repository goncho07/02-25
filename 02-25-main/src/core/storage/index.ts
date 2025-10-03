/**
 * Clase para manejar el almacenamiento local con expiración
 */
export class Storage {
  private prefix: string;

  constructor(prefix: string = 'app') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  /**
   * Guarda un valor en el almacenamiento local con tiempo de expiración opcional
   */
  set(key: string, value: any, ttl?: number): void {
    const item = {
      value,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(this.getKey(key), JSON.stringify(item));
  }

  /**
   * Obtiene un valor del almacenamiento local si no ha expirado
   */
  get<T>(key: string): T | null {
    const raw = localStorage.getItem(this.getKey(key));
    if (!raw) return null;

    try {
      const item = JSON.parse(raw);
      if (item.ttl && Date.now() - item.timestamp > item.ttl) {
        this.remove(key);
        return null;
      }
      return item.value as T;
    } catch {
      return null;
    }
  }

  /**
   * Elimina un valor del almacenamiento local
   */
  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  /**
   * Limpia todos los valores almacenados con el prefijo actual
   */
  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
}

/**
 * Cache en memoria con expiración
 */
export class MemoryCache<T> {
  private cache: Map<string, { value: T; timestamp: number; ttl?: number }>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Guarda un valor en la cache con tiempo de expiración opcional
   */
  set(key: string, value: T, ttl?: number): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Obtiene un valor de la cache si no ha expirado
   */
  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Elimina un valor de la cache
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpia toda la cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtiene el tamaño actual de la cache
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * Función para memoizar resultados de funciones con expiración
 */
export function memoize<T>(
  fn: (...args: any[]) => T,
  ttl: number = 60000
): (...args: any[]) => T {
  const cache = new MemoryCache<T>();

  return (...args: any[]): T => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached !== null) {
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result, ttl);
    return result;
  };
}

/**
 * Hook personalizado para persistencia de estado
 */
export function createPersistentStore<T>(
  key: string,
  initialState: T
): [T, (value: T) => void] {
  const storage = new Storage();
  
  const state = storage.get<T>(key) ?? initialState;
  
  const setState = (value: T) => {
    storage.set(key, value);
  };
  
  return [state, setState];
}