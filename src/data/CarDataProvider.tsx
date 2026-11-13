import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
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
  image_key: string | null;
  image_loose: string | null;
  id_tips: string;
}
interface CatalogMetadata {
  updated_at: string;
}
const CarDataContext = createContext<
  CarDataContextValue | undefined
>(undefined);
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
// Maximum age before a full catalog refresh is required.
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_REQUEST_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [5000, 15000];
function getRestUrl(url: string): string {
  return `${url.replace(/\/$/, "").replace(/\/rest\/v1$/, "")}/rest/v1`;
}
function getHeaders() {
  if (!supabaseAnonKey) {
    throw new Error(
      "EXPO_PUBLIC_SUPABASE_ANON_KEY is not configured."
    );
  }
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  };
}
/*
 * Shared Supabase request helper.
 * Preserves the 20-second timeout.
 */
async function fetchSupabase(
  endpoint: string
): Promise<Response> {
  if (!supabaseUrl) {
    throw new Error(
      "EXPO_PUBLIC_SUPABASE_URL is not configured."
    );
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    console.warn(
      `[CarData] Request timed out after ${
        REQUEST_TIMEOUT_MS / 1000
      } seconds.`
    );
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  const startedAt = Date.now();
  try {
    const response = await fetch(
      `${getRestUrl(supabaseUrl)}/${endpoint}`,
      {
        headers: getHeaders(),
        signal: controller.signal,
      }
    );
    console.log("[CarData] Supabase response received.", {
      endpoint: endpoint.split("?")[0],
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
    return response;
  } finally {
    clearTimeout(timeout);
  }
}
/*
 * Fetch the server catalog version.
 */
async function fetchCatalogUpdatedAt(): Promise<string> {
  console.log("[CarData] Checking Supabase catalog version...");
  const response = await fetchSupabase(
    "catalog_metadata?select=updated_at&id=eq.1"
  );
  const rows = (await response.json()) as CatalogMetadata[];
  if (
    !Array.isArray(rows) ||
    rows.length !== 1 ||
    typeof rows[0].updated_at !== "string" ||
    Number.isNaN(Date.parse(rows[0].updated_at))
  ) {
    throw new Error(
      "Supabase returned invalid catalog metadata."
    );
  }
  const updatedAt = rows[0].updated_at;
  console.log("[CarData] Server catalog version received.", {
    updatedAt,
  });
  return updatedAt;
}
/*
 * Fetch the complete car catalog.
 */
async function fetchCars(): Promise<Car[]> {
  console.log("[CarData] Starting Supabase catalog request...");
  const response = await fetchSupabase(
    "cars?select=id,name,type,year,series,case_letter,image_key,image_loose,id_tips&order=year.desc,id.asc"
  );
  const rows = (await response.json()) as SupabaseCar[];
  if (!Array.isArray(rows)) {
    throw new Error("Supabase returned invalid car data.");
  }
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
    imageKey: car.image_key ?? "placeholder",
    imageLoose: car.image_loose ?? "placeholder",
    idTips: car.id_tips,
  }));
  console.log("[CarData] Catalog mapping completed.", {
    carCount: mappedCars.length,
  });
  return mappedCars;
}
/*
 * Retry temporary failures.
 */
function shouldRetryRequest(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : String(error);
  const statusMatch = message.match(/status (\d{3})/i);
  if (statusMatch) {
    const status = Number(statusMatch[1]);
    return status === 408 || status === 429 || status >= 500;
  }
  return true;
}
async function withRetry<T>(
  operation: () => Promise<T>,
  label: string
): Promise<T> {
  let lastError: unknown;
  for (
    let attempt = 1;
    attempt <= MAX_REQUEST_ATTEMPTS;
    attempt++
  ) {
    try {
      console.log(`[CarData] ${label} attempt:`, {
        attempt,
        maxAttempts: MAX_REQUEST_ATTEMPTS,
      });
      const result = await operation();
      console.log(`[CarData] ${label} succeeded.`, {
        attempt,
      });
      return result;
    } catch (error) {
      lastError = error;
      console.error(`[CarData] ${label} failed.`, {
        attempt,
        maxAttempts: MAX_REQUEST_ATTEMPTS,
        error,
      });
      if (
        attempt >= MAX_REQUEST_ATTEMPTS ||
        !shouldRetryRequest(error)
      ) {
        console.error(
          `[CarData] No more ${label} retry attempts.`
        );
        throw error;
      }
      const delay = RETRY_DELAYS_MS[attempt - 1];
      console.warn(`[CarData] Retrying ${label}.`, {
        nextAttempt: attempt + 1,
        delayMs: delay,
      });
      await new Promise<void>((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(`${label} failed.`);
}
/*
 * Car data provider.
 */
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
      console.log("[CarData] Version check: every app launch.");
      console.log("[CarData] ===================================");
      let hasCachedCatalog = false;
      let cachedServerUpdatedAt: string | null = null;
      let cacheExpired = true;
      let cacheMissingLooseImages = false;
      /*
       * Step 1: Load cached catalog immediately.
       */
      try {
        const cachedCatalog = await getCachedCarCatalog();
        if (cachedCatalog && cachedCatalog.cars.length > 0) {
          hasCachedCatalog = true;
          cachedServerUpdatedAt = cachedCatalog.serverUpdatedAt;
          const cacheAge =
            Date.now() - cachedCatalog.fetchedAt;
          cacheExpired =
            cacheAge < 0 ||
            cacheAge >= CACHE_MAX_AGE_MS;
          // Force refresh for cached records saved before image_loose existed.
          cacheMissingLooseImages = cachedCatalog.cars.some(
            (car) => !("imageLoose" in car)
          );
          console.log("[CarData] Using cached catalog.", {
            carCount: cachedCatalog.cars.length,
            cacheAgeHours: (
              cacheAge /
              (1000 * 60 * 60)
            ).toFixed(2),
            cacheValid: !cacheExpired && !cacheMissingLooseImages,
            cacheMissingLooseImages,
            serverUpdatedAt: cachedServerUpdatedAt,
          });
          if (mounted) {
            setCars(cachedCatalog.cars);
            setLoading(false);
            setError(null);
          }
        } else {
          console.log(
            "[CarData] No valid cache. Supabase request required."
          );
        }
      } catch (cacheError) {
        console.error(
          "[CarData] Cache initialization failed:",
          cacheError
        );
      }
      /*
       * Step 2: Check the server catalog version.
       */
      let serverUpdatedAt: string | null = null;
      try {
        serverUpdatedAt = await withRetry(
          fetchCatalogUpdatedAt,
          "Catalog version check"
        );
      } catch (versionError) {
        console.warn(
          "[CarData] Catalog version check unavailable.",
          versionError
        );
      }
      /*
       * Step 3: Determine whether a refresh is needed.
       */
      const catalogChanged =
        serverUpdatedAt !== null &&
        serverUpdatedAt !== cachedServerUpdatedAt;
      const missingVersion =
        cachedServerUpdatedAt === null;
      const shouldRefresh =
        !hasCachedCatalog ||
        cacheExpired ||
        cacheMissingLooseImages ||
        catalogChanged ||
        missingVersion;
      console.log("[CarData] Catalog refresh decision.", {
        hasCachedCatalog,
        cacheExpired,
        cacheMissingLooseImages,
        catalogChanged,
        missingVersion,
        shouldRefresh,
      });
      if (!shouldRefresh) {
        console.log(
          "[CarData] Catalog is current. Skipping full download."
        );
        if (mounted) {
          setLoading(false);
        }
        console.log(
          "[CarData] Catalog initialization finished."
        );
        return;
      }
      /*
       * Step 4: Download the catalog if necessary.
       */
      try {
        const nextCars = await withRetry(
          fetchCars,
          "Catalog download"
        );
        if (nextCars.length === 0) {
          throw new Error(
            "Supabase returned an empty car catalog."
          );
        }
        if (!mounted) {
          console.log(
            "[CarData] Provider unmounted. Ignoring Supabase response."
          );
          return;
        }
        console.log(
          "[CarData] Updating application catalog.",
          {
            previousCache: hasCachedCatalog,
            newCount: nextCars.length,
          }
        );
        setCars(nextCars);
        setError(null);
        /*
         * Step 5: Save the catalog and server version.
         */
        await saveCachedCarCatalog(
          nextCars,
          serverUpdatedAt
        );
        console.log(
          "[CarData] Catalog refresh completed successfully."
        );
      } catch (requestError) {
        console.error(
          "[CarData] Catalog refresh failed:",
          requestError
        );
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
            "[CarData] No cached catalog available.",
            message
          );
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          console.log(
            "[CarData] Catalog initialization finished."
          );
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
    <CarDataContext.Provider
      value={{ cars, loading, error }}
    >
      {children}
    </CarDataContext.Provider>
  );
}
export function useCarData() {
  const context = useContext(CarDataContext);
  if (!context) {
    throw new Error(
      "useCarData must be used inside CarDataProvider."
    );
  }
  return context;
}
