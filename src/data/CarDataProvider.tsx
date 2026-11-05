
import React, { createContext, useContext, useEffect, useState } from "react";

import type { Car } from "../types";
import {
  getCachedCarCatalog,
  saveCachedCarCatalog,
} from "../utils/storage";

interface CarDataContextValue {
  cars: Car[];
  loading: boolean;
  error: string | null;
}

interface SupabaseCar {
  id: string;
  name: string;
  type: Car["type"];
  year: number;
  series: string;
  case_letter: string;
  image_key: string;
  id_tips: string;
}

const CarDataContext = createContext<CarDataContextValue | undefined>(undefined);

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Keep the local catalog fresh for seven days.
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
//const CACHE_MAX_AGE_MS = 0;
// Supabase may need time to resume a paused project.
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_REQUEST_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [5000, 15000];

function getRestUrl(url: string) {
  return `${url.replace(/\/$/, "").replace(/\/rest\/v1$/, "")}/rest/v1`;
}

async function fetchCars(): Promise<Car[]> {
  console.log("[CarData] Starting Supabase catalog request...");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const requestUrl = `${getRestUrl(supabaseUrl)}/cars?select=id,name,type,year,series,case_letter,image_key,id_tips&order=year.desc,id.asc`;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    console.warn(
      `[CarData] Request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`
    );

    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  const startedAt = Date.now();

  try {
    const response = await fetch(requestUrl, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      signal: controller.signal,
    });

    console.log("[CarData] Supabase response received.", {
      status: response.status,
      ok: response.ok,
      durationMs: Date.now() - startedAt,
    });

    if (!response.ok) {
      const responseBody = await response.text();

      throw new Error(
        `Supabase request failed with status ${response.status}: ${responseBody}`
      );
    }

    const rows = (await response.json()) as SupabaseCar[];

    console.log("[CarData] Supabase catalog received.", {
      rowCount: rows.length,
    });

    const mappedCars: Car[] = rows.map((car) => ({
      id: car.id,
      name: car.name,
      type: car.type,
      year: car.year,
      series: car.series,
      caseLetter: car.case_letter,
      imageKey: car.image_key,
      idTips: car.id_tips,
    }));

    console.log("[CarData] Catalog mapping completed.", {
      carCount: mappedCars.length,
    });

    return mappedCars;
  } finally {
    clearTimeout(timeout);
  }
}

function shouldRetryRequest(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : String(error);

  const statusMatch = message.match(/status (\d{3})/i);

  if (statusMatch) {
    const status = Number(statusMatch[1]);

    // Retry temporary server/rate-limit errors, not permanent client errors.
    return status === 408 || status === 429 || status >= 500;
  }

  // Network errors and request timeouts can be temporary.
  return true;
}

async function fetchCarsWithRetry(): Promise<Car[]> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_REQUEST_ATTEMPTS; attempt++) {
    try {
      console.log("[CarData] Supabase attempt:", {
        attempt,
        maxAttempts: MAX_REQUEST_ATTEMPTS,
      });

      const cars = await fetchCars();

      console.log("[CarData] Supabase request succeeded.", {
        attempt,
        carCount: cars.length,
      });

      return cars;
    } catch (error) {
      lastError = error;

      console.error("[CarData] Supabase attempt failed.", {
        attempt,
        maxAttempts: MAX_REQUEST_ATTEMPTS,
        error,
      });

      if (
        attempt >= MAX_REQUEST_ATTEMPTS ||
        !shouldRetryRequest(error)
      ) {
        console.error("[CarData] No more retry attempts.");
        throw error;
      }

      const delay = RETRY_DELAYS_MS[attempt - 1];

      console.warn("[CarData] Retrying Supabase request.", {
        nextAttempt: attempt + 1,
        delayMs: delay,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unable to load car catalog.");
}

export function CarDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCars = async () => {
      console.log("[CarData] ===================================");
      console.log("[CarData] Catalog initialization started.");
      console.log("[CarData] Cache validity: 7 days.");
      console.log("[CarData] ===================================");

      let hasCachedCatalog = false;

      // Step 1: Read the local catalog.
      try {
        const cachedCatalog = await getCachedCarCatalog();

        if (cachedCatalog && cachedCatalog.cars.length > 0) {
          hasCachedCatalog = true;

          const cacheAge = Date.now() - cachedCatalog.fetchedAt;
          const cacheAgeHours = cacheAge / (1000 * 60 * 60);

          console.log("[CarData] Using cached catalog.", {
            carCount: cachedCatalog.cars.length,
            cacheAgeHours: cacheAgeHours.toFixed(2),
            cacheValid: cacheAge >= 0 && cacheAge < CACHE_MAX_AGE_MS,
          });

          if (mounted) {
            setCars(cachedCatalog.cars);
            setLoading(false);
            setError(null);
          }

          // Step 2: Skip Supabase if the cache is still fresh.
          if (cacheAge >= 0 && cacheAge < CACHE_MAX_AGE_MS) {
            console.log(
              "[CarData] Cache is fresh. Skipping Supabase request."
            );
            console.log("[CarData] Catalog initialization finished.");
            return;
          }

          console.log(
            "[CarData] Cache expired. Starting background refresh."
          );
        } else {
          console.log(
            "[CarData] No valid cache. Supabase request required."
          );
        }
      } catch (cacheError) {
        console.error("[CarData] Cache initialization failed:", cacheError);
      }

      // Step 3: Fetch the latest catalog with retries.
      try {
        const nextCars = await fetchCarsWithRetry();

        if (nextCars.length === 0) {
          throw new Error("Supabase returned an empty car catalog.");
        }

        if (!mounted) {
          console.log(
            "[CarData] Provider unmounted. Ignoring Supabase response."
          );
          return;
        }

        console.log("[CarData] Updating application catalog.", {
          newCount: nextCars.length,
        });

        setCars(nextCars);
        setError(null);

        // Step 4: Save the refreshed catalog locally.
        await saveCachedCarCatalog(nextCars);

        console.log("[CarData] Catalog refresh completed successfully.");
      } catch (requestError: unknown) {
        console.error("[CarData] Catalog refresh failed:", requestError);

        if (mounted && hasCachedCatalog) {
          console.warn(
            "[CarData] Offline fallback active. Keeping cached catalog."
          );
        }

        if (mounted && !hasCachedCatalog) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Unable to load car data.";

          console.error(
            "[CarData] No cached catalog available. Setting error state:",
            message
          );

          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          console.log("[CarData] Catalog initialization finished.");
        }
      }
    };

    void loadCars();

    return () => {
      mounted = false;
      console.log("[CarData] Provider cleanup.");
    };
  }, []);

  return (
    <CarDataContext.Provider value={{ cars, loading, error }}>
      {children}
    </CarDataContext.Provider>
  );
}

export function useCarData() {
  const context = useContext(CarDataContext);

  if (!context) {
    throw new Error("useCarData must be used inside CarDataProvider.");
  }

  return context;
}
