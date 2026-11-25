import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../styles/browse.styles";
import {
  getCollectionPhotos,
  getFoundIds,
  saveCollectionPhoto,
  toggleFoundId,
} from "../utils/storage";
import { useCarData } from "../data/CarDataProvider";
import type { Car, CarType } from "../types";
import { getAvailableYears } from "../utils/catalogYears";
import { gridStyles } from "../styles/collectionGrid.styles";
import { styles as collectionStyles } from "../styles/collection.styles";
import { modalLayout } from "../styles/collectionModalLayout.styles";
import { quantityStyles } from "../styles/collectionQuantity.styles";
import { browseGridStyles } from "../styles/browseGrid.styles";
import { getCarQuantities, saveCarQuantity } from "../utils/carQuantities";
interface YearSection {
  year: number;
  cars: Car[];
}
type FilterType = "ALL" | CarType;
const TYPE_META: Record<
  CarType,
  {
    title: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
  }
> = {
  TH: {
    title: "TREASURE HUNTS",
    icon: "fire",
    color: "#FBBF24",
  },
  STH: {
    title: "SUPER TREASURE HUNTS",
    icon: "fire",
    color: "#EF4444",
  },
};
// Browse shows loose catalog images; personal photos always take priority.
const CAR_IMAGE_BASE = "https://lcqurdjjxsxuwdaevchw.supabase.co/storage/v1/object/public/car-images/";

type CarWithLoose = Car & { imageLoose?: string | null; image_loose?: string | null };

function isPlaceholderImage(value: string): boolean {
  return /(?:^|\/)placeholder-[a-q]\.webp(?:[?#].*)?$/i.test(value);
}

function getPhoto(car: Car, photos: Record<string, string>) {
  const personal = photos[car.id]?.trim();
  if (personal) return { uri: personal, isPlaceholder: false };

  const record = car as CarWithLoose;
  const loose = (record.imageLoose ?? record.image_loose ?? "").trim();
  const key = car.imageKey?.trim() ?? "";
  // Prefer a real loose photo, never substitute a packaged car photo.
  if (/^https?:\/\//i.test(loose) && !isPlaceholderImage(loose)) {
    return { uri: loose, isPlaceholder: false };
  }
  for (const candidate of [loose, key]) {
    if (!isPlaceholderImage(candidate)) continue;
    if (/^https?:\/\//i.test(candidate)) {
      return { uri: candidate, isPlaceholder: true };
    }
    if (/^placeholders\/placeholder-[a-q]\.webp$/i.test(candidate)) {
      return { uri: CAR_IMAGE_BASE + candidate, isPlaceholder: true };
    }
  }
  return { uri: undefined, isPlaceholder: false };
}

function BrowseCarImage({ car, photos, detail = false }: {
  car: Car;
  photos: Record<string, string>;
  detail?: boolean;
}) {
  const { uri, isPlaceholder } = getPhoto(car, photos);
  const [failedUri, setFailedUri] = useState<string | undefined>();
  useEffect(() => setFailedUri(undefined), [uri]);
  const accent = TYPE_META[car.type].color;
  const backgroundColor = car.type === "TH" ? "#282313" : "#2B1717";
  const showPhoto = !!uri && failedUri !== uri;

  if (showPhoto && uri) {
    const image = (
      <Image
        source={{ uri }}
        style={[
          detail ? collectionStyles.detailImage : gridStyles.image,
          isPlaceholder && { tintColor: accent, backgroundColor: "transparent" },
        ]}
        resizeMode="contain"
        onError={() => setFailedUri(uri)}
      />
    );
    if (detail) {
      return (
        <View style={[
          collectionStyles.detailPhotoFrame,
          modalLayout.photoFrame,
          isPlaceholder && { backgroundColor },
        ]}>
          {image}
        </View>
      );
    }
    return isPlaceholder ? (
      <View style={[gridStyles.placeholder, { backgroundColor }]}>{image}</View>
    ) : image;
  }

  if (detail) {
    return (
      <View style={[collectionStyles.detailImagePlaceholder, modalLayout.photoFrame, { backgroundColor }]}>
        <Text style={[gridStyles.placeholderLabel, { color: accent }]}>CASE</Text>
        <Text style={[gridStyles.placeholderLetter, { color: accent }]}>
          {String(car.caseLetter ?? "?").toUpperCase()}
        </Text>
      </View>
    );
  }
  return (
    <View style={[gridStyles.placeholder, { backgroundColor }]}>
      <Text style={[gridStyles.placeholderLabel, { color: accent }]}>CASE</Text>
      <Text style={[gridStyles.placeholderLetter, { color: accent }]}>
        {String(car.caseLetter ?? "?").toUpperCase()}
      </Text>
    </View>
  );
}

export default function BrowseScreen() {
  const { cars: typedCarData } = useCarData();
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const years = useMemo(
    () => getAvailableYears(typedCarData),
    [typedCarData]
  );
  const defaultYear = useMemo(() => {
    const currentYear = new Date().getFullYear();
    if (years.includes(currentYear)) {
      return currentYear;
    }
    return years.length > 0 ? Math.max(...years) : null;
  }, [years]);
  useEffect(() => {
    setSelectedYear((current) =>
      current !== null && years.includes(current) ? current : defaultYear
    );
  }, [years, defaultYear]);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [collectionPhotos, setCollectionPhotos] = useState<Record<string, string>>({});
  const [carQuantities, setCarQuantities] = useState<Record<string, number>>({});
  const [savingQuantity, setSavingQuantity] = useState(false);
  const quantityLock = useRef(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<CarType, boolean>>({
    TH: true,
    STH: true,
  });
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    void getFoundIds().then(setFoundIds);
    void getCollectionPhotos().then(setCollectionPhotos);
    void getCarQuantities().then(setCarQuantities);
  }, []);
  const handlePickPhoto = useCallback(async (carId: string) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }
const result = await ImagePicker.launchImageLibraryAsync({
   mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.85,
});
    if (result.canceled) {
      return;
    }
    const next = await saveCollectionPhoto(carId, result.assets[0].uri);
    setCollectionPhotos(next);
  }, []);
  const quantityOf = (id: string) =>
    foundIds.includes(id) ? Math.max(1, carQuantities[id] ?? 1) : 0;
  const removeCar = async (car: Car) => {
    if (quantityLock.current) return;
    quantityLock.current = true;
    setSavingQuantity(true);
    try {
      if (foundIds.includes(car.id)) {
        const updatedIds = await toggleFoundId(car.id);
        setFoundIds(updatedIds);
      }
      setCarQuantities(await saveCarQuantity(car.id, 0));
      setSelectedCar(null);
    } catch (error) {
      console.error("[Browse] Could not remove car", error);
      Alert.alert("Unable to update", "Please try again.");
    } finally {
      quantityLock.current = false;
      setSavingQuantity(false);
    }
  };
  const confirmRemove = (car: Car) => {
    Alert.alert("Remove from Collection?", `Remove all copies of ${car.name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove All", style: "destructive", onPress: () => void removeCar(car) },
    ]);
  };
  const changeQuantity = async (car: Car, delta: number) => {
    if (quantityLock.current) return;
    const next = quantityOf(car.id) + delta;
    if (next <= 0) { confirmRemove(car); return; }
    quantityLock.current = true;
    setSavingQuantity(true);
    try {
      setCarQuantities(await saveCarQuantity(car.id, next));
    } catch (error) {
      console.error("[Browse] Could not update quantity", error);
      Alert.alert("Unable to update quantity", "Please try again.");
    } finally {
      quantityLock.current = false;
      setSavingQuantity(false);
    }
  };
  const markFound = async (car: Car) => {
    if (savingQuantity || foundIds.includes(car.id)) return;
    try {
      const updated = await toggleFoundId(car.id);
      setFoundIds(updated);
      setCarQuantities(await saveCarQuantity(car.id, 1));
    } catch (error) {
      console.error("[Browse] Could not mark car found", error);
      Alert.alert("Unable to update", "Please try again.");
    }
  };
  const handleRemovePhoto = async (id: string) => {
    try {
      const updated = await saveCollectionPhoto(id, "");
      setCollectionPhotos(updated);
    } catch (error) {
      console.error("[Browse] Could not remove personal photo", error);
      Alert.alert("Unable to remove photo", "Please try again.");
    }
  };
  const handleYearSelect = useCallback((year: number) => {
    setSelectedYear(year);
    setYearDropdownOpen(false);
  }, []);
  const toggleCategory = useCallback((type: CarType) => {
    setExpandedCategories((current) => ({
      ...current,
      [type]: !current[type],
    }));
  }, []);
const sections = useMemo<YearSection[]>(() => {
  return years.map((year) => {
    const cars = typedCarData.filter(
      (car) => car.year === year
    );
      return {
        year,
        cars,
      };
    });
  }, [years, typedCarData]);
  const selectedCarIsFound = selectedCar ? foundIds.includes(selectedCar.id) : false;
  return (
    <View style={styles.container}>
    {/* FIXED HEADER */}
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.eyebrow}>TH HUNTER</Text>
        <Text style={styles.title}>BROWSE</Text>
        <Text style={styles.subtitle}>
          Treasure Hunts (TH) & Super Treasure Hunts (STH)
        </Text>
      </View>
    </View>
    {/* SCROLLING CONTENT */}
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={25}
            color="#8E8E93"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.search}
            placeholder="Search TH / STH by name or series..."
            placeholderTextColor="#8E8E93"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="never"
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery("")}
              hitSlop={10}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#77777C"
              />
            </Pressable>
          )}
        </View>
      </View>
      {/* Filters sit outside the bordered TH / STH category container. */}
      {selectedYear !== null && (
        <View style={styles.yearDropdownHeader}>
        <View style={styles.yearHeader}>
          <View style={styles.yearDropdownContainer}>
            <Pressable
              style={styles.yearDropdownTrigger}
              onPress={() => setYearDropdownOpen((open) => !open)}
              accessibilityRole="button"
              accessibilityLabel={`Select year, currently ${selectedYear}`}
              accessibilityState={{ expanded: yearDropdownOpen }}
            >
              <Text style={styles.yearDropdownText}>{selectedYear}</Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color="#FFFFFF"
              />
            </Pressable>
            {yearDropdownOpen && (
              <ScrollView
                style={styles.yearDropdownMenu}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {years.map((year) => (
                  <Pressable
                    key={year}
                    style={[
                      styles.yearDropdownOption,
                      year === selectedYear && styles.yearDropdownOptionActive,
                    ]}
                    onPress={() => handleYearSelect(year)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: year === selectedYear }}
                  >
                    <Text
                      style={[
                        styles.yearDropdownOptionText,
                        year === selectedYear && styles.yearDropdownOptionTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                    {year === selectedYear && (
                      <Ionicons name="checkmark" size={17} color="#FBBF24" />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
        <View style={styles.typePillRow}>
          {(["ALL", "STH", "TH"] as FilterType[]).map((type) => {
            const active = filterType === type;
            return (
              <Pressable
                key={type}
                style={[
                  styles.typePill,
                  active && styles.typePillActive,
                  active && type === "STH" && styles.typePillActiveSTH,
                ]}
                onPress={() => setFilterType(type)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={type === "ALL" ? "All cars" : type === "TH" ? "Treasure Hunts" : "Super Treasure Hunts"}
              >
                <Text
                  style={[
                    styles.typePillText,
                    type === "TH" && styles.typePillTextTH,
                    type === "STH" && styles.typePillTextSTH,
                    active && styles.typePillTextActive,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            );
          })}
        </View>
        </View>
      )}
      {sections
              .filter((section) => section.year === selectedYear)
              .map((section) => {
        const sectionCars = section.cars.filter((car) => {
          if (filterType !== "ALL" && car.type !== filterType) {
            return false;
          }
          const normalizedQuery = query.trim().toLowerCase();
          if (!normalizedQuery) {
            return true;
          }
          return [
            car.name,
            car.series,
            car.caseLetter,
            car.type,
            String(car.year),
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);
        });
        return (
          <View key={section.year} style={styles.yearSection}>
            <>
              <BrowseCategory
                type="STH"
                cars={sectionCars.filter((car) => car.type === "STH")}
                foundIds={foundIds}
                collectionPhotos={collectionPhotos}
                onSelectCar={setSelectedCar}
                expanded={expandedCategories.STH}
                onToggle={() => toggleCategory("STH")}
              />
              <BrowseCategory
                type="TH"
                cars={sectionCars.filter((car) => car.type === "TH")}
                foundIds={foundIds}
                collectionPhotos={collectionPhotos}
                onSelectCar={setSelectedCar}
                expanded={expandedCategories.TH}
                onToggle={() => toggleCategory("TH")}
              />
              {sectionCars.length === 0 && (
                <Text style={styles.empty}>No TH / STH cars match your search.</Text>
              )}
            </>
          </View>
        );
        })}
    </ScrollView>
    {/* CAR DETAILS — same grouped frameless layout as Collection */}
    <Modal visible={selectedCar !== null} transparent animationType="slide"
      onRequestClose={() => setSelectedCar(null)}>
      <View style={collectionStyles.detailModalBackdrop}>
        <View style={[collectionStyles.detailModal, browseGridStyles.detailModal]}>
          <View style={collectionStyles.detailHeader}>
            <Text style={collectionStyles.detailTitle}>CAR DETAILS</Text>
            <Pressable onPress={() => setSelectedCar(null)} hitSlop={10}
              accessibilityLabel="Close car details">
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
          {selectedCar && (
            <View style={{ width: "100%" }}>
              <View style={modalLayout.mainRow}>
                <View style={[collectionStyles.detailImageWrap, modalLayout.imageColumn]}>
                  <BrowseCarImage car={selectedCar} photos={collectionPhotos} detail />
                </View>
                <View style={modalLayout.infoColumn}>
                  <View style={[collectionStyles.detailMetaRow, modalLayout.metaRow]}>
                    <View style={[collectionStyles.detailTypeBadge,
                      { backgroundColor: TYPE_META[selectedCar.type].color }]}>
                      <Text style={collectionStyles.detailTypeBadgeText}>{selectedCar.type}</Text>
                    </View>
                    <Text style={collectionStyles.detailYear}>{selectedCar.year}</Text>
                  </View>
                  <View style={modalLayout.nameBlock}>
                    <Text style={[collectionStyles.detailSeries, modalLayout.seriesEyebrow]}
                      numberOfLines={2}>{selectedCar.series.toUpperCase()}</Text>
                    <Text style={modalLayout.carName} numberOfLines={3}>{selectedCar.name}</Text>
                  </View>
                  <View style={modalLayout.sectionDivider} />
                  <View style={[collectionStyles.detailGrid, modalLayout.detailsGrid]}>
                    <View style={[collectionStyles.detailStat, modalLayout.detailStat]}>
                      <Text style={[collectionStyles.detailStatLabel, modalLayout.statLabel]}>CASE</Text>
                      <Text style={[collectionStyles.detailStatValue, modalLayout.statValue]}>
                        {selectedCar.caseLetter}
                      </Text>
                    </View>
                    <View style={[collectionStyles.detailStat, modalLayout.detailStat]}>
                      <Text style={[collectionStyles.detailStatLabel, modalLayout.statLabel]}>STATUS</Text>
                      <Text style={[collectionStyles.detailStatValue,
                        selectedCarIsFound ? modalLayout.statusValue : modalLayout.statValue]}>
                        {selectedCarIsFound ? "Collected" : "Missing"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={modalLayout.sectionDivider} />
              <View style={[quantityStyles.container, modalLayout.quantityContainer]}>
                {selectedCarIsFound ? (
                  <View style={[quantityStyles.headingRow, modalLayout.quantityRow]}>
                    <View style={[quantityStyles.controls, modalLayout.quantityControls]}>
                      <Pressable style={[quantityStyles.adjustButton,
                          savingQuantity && quantityStyles.disabled]}
                        disabled={savingQuantity}
                        onPress={() => void changeQuantity(selectedCar, -1)}
                        accessibilityLabel={`Remove one ${selectedCar.name}`}>
                        <Ionicons name="remove" size={21} color="#FFFFFF" />
                      </Pressable>
                      <Text style={quantityStyles.quantityValue}>{quantityOf(selectedCar.id)}</Text>
                      <Pressable style={[quantityStyles.adjustButton, quantityStyles.addButton,
                          savingQuantity && quantityStyles.disabled]}
                        disabled={savingQuantity}
                        onPress={() => void changeQuantity(selectedCar, 1)}
                        accessibilityLabel={`Add one ${selectedCar.name}`}>
                        <Ionicons name="add" size={21} color="#111111" />
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Text style={browseGridStyles.missingHint}>NOT YET COLLECTED</Text>
                )}
              </View>
              <View style={[collectionStyles.detailActions, modalLayout.fullWidthActions,
                { marginTop: 8, gap: 8, marginBottom: 0 }]}>
                {!selectedCarIsFound && (
                  <Pressable style={browseGridStyles.yellowAction}
                    onPress={() => void markFound(selectedCar)}>
                    <Text style={collectionStyles.detailPhotoButtonText}>MARK FOUND</Text>
                  </Pressable>
                )}
                <Pressable style={[collectionStyles.detailPhotoButton,
                    modalLayout.fullWidthButton, browseGridStyles.actionButton]}
                  onPress={() => void handlePickPhoto(selectedCar.id)}>
                  <Text style={collectionStyles.detailPhotoButtonText}>
                    {collectionPhotos[selectedCar.id] ? "CHANGE PHOTO" : "ADD PHOTO"}
                  </Text>
                </Pressable>
                <Pressable style={[modalLayout.fullWidthButton, browseGridStyles.removePhotoButton,
                    !collectionPhotos[selectedCar.id] && browseGridStyles.disabledRemovePhoto]}
                  disabled={!Boolean(collectionPhotos[selectedCar.id])}
                  onPress={() => Alert.alert("Remove personal photo?",
                    "The catalog loose photo or case placeholder will be displayed.", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Remove Photo", onPress: () => void handleRemovePhoto(selectedCar.id) },
                    ])}
                  accessibilityState={{ disabled: !Boolean(collectionPhotos[selectedCar.id]) }}>
                  <Ionicons name="image-outline" size={18}
                    color={collectionPhotos[selectedCar.id] ? "#FFFFFF" : "#88888C"} />
                  <Text style={[browseGridStyles.removePhotoText,
                    !collectionPhotos[selectedCar.id] && browseGridStyles.disabledRemovePhotoText]}>
                    REMOVE PHOTO
                  </Text>
                </Pressable>
                {selectedCarIsFound && (
                  <Pressable style={[gridStyles.detailRemoveButton,
                      modalLayout.fullWidthButton, browseGridStyles.actionButton]}
                    onPress={() => confirmRemove(selectedCar)}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    <Text style={gridStyles.detailRemoveText}>REMOVE FROM COLLECTION</Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
    </View>
  );
}
interface BrowseCategoryProps {
  type: CarType;
  cars: Car[];
  foundIds: string[];
  collectionPhotos: Record<string, string>;
  onSelectCar: (car: Car) => void;
  expanded: boolean;
  onToggle: () => void;
}
function BrowseCategory({ type, cars, foundIds, collectionPhotos, onSelectCar,
  expanded, onToggle }: BrowseCategoryProps) {
  if (cars.length === 0) return null;
  const meta = TYPE_META[type];
  return (
    <View style={styles.category}>
      <Pressable style={styles.categoryHeader} onPress={onToggle}>
        <View style={[styles.categoryIcon, { backgroundColor: meta.color }]}>
          <MaterialCommunityIcons name={meta.icon} size={24} color="#111111" />
          <Text style={styles.categoryIconText}>{type}</Text>
        </View>
        <View style={styles.categoryTitleContainer}>
          <Text style={[styles.categoryTitle, { color: meta.color }]}>{meta.title}</Text>
        </View>
        <Text style={styles.categorySubtitle}>
          {cars.length} {cars.length === 1 ? "car" : "cars"}
        </Text>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={23}
          color={meta.color} />
      </Pressable>
      {expanded && (
        <View style={[gridStyles.grid, browseGridStyles.grid]}>
          {cars.map((car) => {
              const collected = foundIds.includes(car.id);
            const accent = TYPE_META[car.type].color;
            const caseLetter = String(car.caseLetter ?? "?").toUpperCase();
            return (
              <Pressable key={car.id} style={({ pressed }) => [
                  gridStyles.card,
                  { borderColor: accent, borderWidth: 2 },
                  pressed && gridStyles.cardPressed,
                ]}
                onPress={() => onSelectCar(car)}
                accessibilityRole="button"
                accessibilityLabel={`${car.name}, case ${caseLetter}, ${collected ? "collected" : "missing"}`}>
                <View style={gridStyles.imageWrap}>
                  <BrowseCarImage car={car} photos={collectionPhotos} />
                  {collected && (
                    <View style={browseGridStyles.collectedBadge}>
                      <Ionicons name="checkmark" size={12} color="#111111" />
                      <Text style={browseGridStyles.collectedBadgeText}>FOUND</Text>
                    </View>
                  )}
                </View>
                <View style={[gridStyles.cardBody, browseGridStyles.cardBody]}>
                  <Text style={[gridStyles.carName, browseGridStyles.carName]}
                    numberOfLines={2}>{car.name}</Text>
                  <Text style={[gridStyles.carSeries, browseGridStyles.carSeries]}
                    numberOfLines={1}>{car.series}</Text>
                  <View style={gridStyles.cardFooter}>
                    <Text style={[gridStyles.typeLabel, { color: accent }]}>
                      CASE {caseLetter} - {car.type}
                    </Text>
                    <Text style={gridStyles.yearLabel}>{car.year}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
