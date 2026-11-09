import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Car } from "../types";
import { CAR_QUANTITIES_STORAGE_KEY } from "./carQuantities";

const FOUND_KEY = "hwh_found_ids_v1";
const PHOTO_KEY = "hwh_collection_photos_v1";
const CAR_CATALOG_KEY = "hwh_car_catalog_v1";

const CAR_CATALOG_CACHE_VERSION = 1;

export interface CachedCarCatalog {
  version: number;
  fetchedAt: number;
  serverUpdatedAt: string | null;
  cars: Car[];
}

function isCar(value: unknown): value is Car {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const car = value as Record<string, unknown>;

  return (
    typeof car.id === "string" &&
    typeof car.name === "string" &&
    (car.type === "TH" || car.type === "STH") &&
    typeof car.year === "number" &&
    typeof car.series === "string" &&
    typeof car.caseLetter === "string" &&
    typeof car.imageKey === "string" &&
    typeof car.idTips === "string"
  );
}

/* Car catalog cache */
export async function getCachedCarCatalog(): Promise<CachedCarCatalog | null> {
  try {
    const raw = await AsyncStorage.getItem(CAR_CATALOG_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const cache = parsed as Record<string, unknown>;

    if (
      cache.version !== CAR_CATALOG_CACHE_VERSION ||
      typeof cache.fetchedAt !== "number" ||
      !Number.isFinite(cache.fetchedAt) ||
      !Array.isArray(cache.cars) ||
      cache.cars.length === 0 ||
      !cache.cars.every(isCar)
    ) return null;

    const serverUpdatedAt =
      typeof cache.serverUpdatedAt === "string" &&
      !Number.isNaN(Date.parse(cache.serverUpdatedAt))
        ? cache.serverUpdatedAt
        : null;

    return {
      version: CAR_CATALOG_CACHE_VERSION,
      fetchedAt: cache.fetchedAt,
      serverUpdatedAt,
      cars: cache.cars as Car[],
    };
  } catch (error) {
    console.warn("[CarData] Failed to load cached car catalog", error);
    return null;
  }
}

export async function saveCachedCarCatalog(
  cars: Car[],
  serverUpdatedAt: string | null = null
): Promise<void> {
  if (cars.length === 0) {
    console.warn("[CarData] Skipping empty catalog cache save.");
    return;
  }

  const cache: CachedCarCatalog = {
    version: CAR_CATALOG_CACHE_VERSION,
    fetchedAt: Date.now(),
    serverUpdatedAt,
    cars,
  };

  try {
    await AsyncStorage.setItem(CAR_CATALOG_KEY, JSON.stringify(cache));
    console.log("[CarData] Catalog cache saved.", {
      carCount: cars.length,
      serverUpdatedAt,
    });
  } catch (error) {
    console.warn("[CarData] Failed to save cached car catalog", error);
  }
}

/* Found cars */
export async function getFoundIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(FOUND_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === "string")) return [];
    return parsed;
  } catch (error) {
    console.warn("Failed to load found list", error);
    return [];
  }
}

export async function toggleFoundId(id: string): Promise<string[]> {
  const current = await getFoundIds();
  const next = current.includes(id)
    ? current.filter((existingId) => existingId !== id)
    : [...current, id];

  try {
    await AsyncStorage.setItem(FOUND_KEY, JSON.stringify(next));
  } catch (error) {
    console.warn("Failed to save found list", error);
  }
  return next;
}

/**
 * Reset the user's collection across all years and types.
 * Keep the cached car catalog and user photos intact.
 * Propagate errors so About can report an unsuccessful reset.
 */
export async function resetEntireCollection(): Promise<void> {
  await AsyncStorage.multiRemove([FOUND_KEY, CAR_QUANTITIES_STORAGE_KEY]);
}

/* Personal collection photos */
export async function getCollectionPhotos(): Promise<Record<string, string>> {
  try {
    const raw = await AsyncStorage.getItem(PHOTO_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(([, uri]) => typeof uri === "string")
    );
  } catch (error) {
    console.warn("Failed to load collection photos", error);
    return {};
  }
}

export async function saveCollectionPhoto(
  carId: string,
  uri: string
): Promise<Record<string, string>> {
  const current = await getCollectionPhotos();
  const next = { ...current, [carId]: uri };
  try {
    await AsyncStorage.setItem(PHOTO_KEY, JSON.stringify(next));
  } catch (error) {
    console.warn("Failed to save collection photos", error);
  }
  return next;
}
