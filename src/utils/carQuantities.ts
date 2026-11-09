import AsyncStorage from "@react-native-async-storage/async-storage";

// Local-only duplicate counts. A car in getFoundIds() with no count here owns one.
// Keep this separate from Supabase's reference catalog.
export const CAR_QUANTITIES_STORAGE_KEY = "th_hunter_car_quantities_v1";

export async function getCarQuantities(): Promise<Record<string, number>> {
  const value = await AsyncStorage.getItem(CAR_QUANTITIES_STORAGE_KEY);
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    const quantities: Record<string, number> = {};
    for (const [id, count] of Object.entries(parsed)) {
      if (typeof count === "number" && Number.isSafeInteger(count) && count > 0) {
        quantities[id] = count;
      }
    }
    return quantities;
  } catch {
    return {};
  }
}

export async function saveCarQuantity(
  carId: string,
  quantity: number
): Promise<Record<string, number>> {
  if (!Number.isSafeInteger(quantity) || quantity < 0) {
    throw new Error("Quantity must be a nonnegative whole number");
  }
  const quantities = await getCarQuantities();
  if (quantity === 0 || quantity === 1) {
    // One is the default for every collected car; avoid redundant entries.
    delete quantities[carId];
  } else {
    quantities[carId] = quantity;
  }
  await AsyncStorage.setItem(CAR_QUANTITIES_STORAGE_KEY, JSON.stringify(quantities));
  return quantities;
}
