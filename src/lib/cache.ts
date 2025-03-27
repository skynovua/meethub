// Допоміжні функції для кешування в додатку
import type { ReactNode } from "react";
import { cache } from "react";

// React Cache для мемоізації результатів компонентів
export const memoizeComponent = cache((component: () => ReactNode) => component());

// Функція для генерації унікальних ключів кешування
export function generateCacheKey(base: string, params: Record<string, any>): string {
  const paramsString = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("&");

  return `${base}${paramsString ? `?${paramsString}` : ""}`;
}
