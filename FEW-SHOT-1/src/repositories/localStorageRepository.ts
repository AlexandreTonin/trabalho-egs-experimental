export function readFromLocalStorage<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedValue = window.localStorage.getItem(key);

  if (!storedValue) {
    return [];
  }

  try {
    return JSON.parse(storedValue) as T[];
  } catch {
    return [];
  }
}

export function saveToLocalStorage<T>(key: string, data: T) {
  if (typeof window === "undefined") {
    return;
  }

  const existing = readFromLocalStorage<T>(key);
  existing.push(data);

  window.localStorage.setItem(key, JSON.stringify(existing));
}
