
import type { Car } from "../types";

export function getAvailableYears(cars: Car[]): number[] {
  return [...new Set(cars.map((car) => car.year))]
    .filter((year) => Number.isInteger(year))
    .sort((a, b) => b - a);
}

export function getLatestCatalogYear(
  cars: Car[]
): number | null {
  return getAvailableYears(cars)[0] ?? null;
}
