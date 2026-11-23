import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";

const STORAGE_KEY = "@thhunter_app_review_v1";
const MIN_UNIQUE_CARS = 5;
const MIN_ACTIVE_DAYS = 3;
const MIN_TRACKING_AGE_DAYS = 3;
const COOLDOWN_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

type ReviewState = {
  firstFindAt: number | null;
  uniqueCarIds: string[];
  activeDays: string[];
  lastRequestAt: number | null;
};

let busy = false;

function dayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function loadState(): Promise<ReviewState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw) as ReviewState;
  return {
    firstFindAt: null,
    uniqueCarIds: [],
    activeDays: [],
    lastRequestAt: null,
  };
}

/** Call only after a *new* TH/STH car was successfully marked as found. */
export async function recordNewFoundCarForReview(carId: string): Promise<void> {
  if (!carId.trim()) return;
  try {
    const state = await loadState();
    if (state.uniqueCarIds.includes(carId)) return;

    const now = Date.now();
    const today = dayKey(new Date(now));
    state.firstFindAt ??= now;
    state.uniqueCarIds.push(carId);
    if (!state.activeDays.includes(today)) state.activeDays.push(today);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (__DEV__) {
      console.log("[AppReview] Unique found cars:", state.uniqueCarIds.length);
    }
  } catch (error) {
    console.warn("[AppReview] Could not record found car:", error);
  }
}

/** Request only on a visible, idle Collection screen. */
export async function maybeRequestAppReview(): Promise<void> {
  if (busy) return;
  busy = true;
  try {
    const state = await loadState();
    const now = Date.now();
    const eligible =
      state.firstFindAt !== null &&
      state.uniqueCarIds.length >= MIN_UNIQUE_CARS &&
      state.activeDays.length >= MIN_ACTIVE_DAYS &&
      now - state.firstFindAt >= MIN_TRACKING_AGE_DAYS * DAY_MS &&
      (state.lastRequestAt === null ||
        now - state.lastRequestAt >= COOLDOWN_DAYS * DAY_MS);

    if (__DEV__) {
      console.log("[AppReview] Eligibility:", {
        uniqueCars: state.uniqueCarIds.length,
        activeDays: state.activeDays.length,
        eligible,
      });
    }
    if (!eligible) return;
    if (!(await StoreReview.isAvailableAsync())) return;

    // A successful call does not guarantee the OS actually displayed a dialog.
    await StoreReview.requestReview();
    state.lastRequestAt = Date.now();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // An unsuccessful native request must not start the 90-day cooldown.
    console.warn("[AppReview] Review request failed:", error);
  } finally {
    busy = false;
  }
}
