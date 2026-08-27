import AsyncStorage from "@react-native-async-storage/async-storage";

const FOUND_KEY = "hwh_found_ids_v1";
const PHOTO_KEY = "hwh_collection_photos_v1";

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

export async function getCollectionPhotos(): Promise<Record<string, string>> {
  try {
    const raw = await AsyncStorage.getItem(PHOTO_KEY);

    if (!raw) {
      return {};
    }

    const parsed: unknown = JSON.parse(raw);

    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, uri]) => typeof uri === "string"
      )
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
    console.warn("Failed to save collection photo", error);
  }

  return next;
}
