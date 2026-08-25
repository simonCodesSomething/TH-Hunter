import AsyncStorage from "@react-native-async-storage/async-storage";

const FOUND_KEY = "hwh_found_ids_v1";

export async function getFoundIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(FOUND_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === "string")) {
      return [];
    }

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
