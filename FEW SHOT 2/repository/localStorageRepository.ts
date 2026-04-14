const isBrowser = typeof window !== "undefined";

export function getFromLocalStorage<T>(key: string): T[] {
  if (!isBrowser) {
    return [];
  }

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as T[];
  } catch {
    return [];
  }
}

export function saveToLocalStorage<T>(key: string, data: T) {
  if (!isBrowser) {
    return;
  }

  const existing = getFromLocalStorage<T>(key);
  existing.unshift(data);
  window.localStorage.setItem(key, JSON.stringify(existing));
}
