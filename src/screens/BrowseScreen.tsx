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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  filterModalStyle,
  styles,
} from "../styles/browse.styles";

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
  thCount: number;
  sthCount: number;
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

// Browse and Collection show loose images. Personal photos override the catalog.
type CarWithLoose = Car & { imageLoose?: string | null; image_loose?: string | null };
function getPhoto(car: Car | null, photos: Record<string, string>): string | undefined {
  if (!car) return undefined;
  if (photos[car.id]?.trim()) return photos[car.id].trim();
  const record = car as CarWithLoose;
  const candidate = record.imageLoose ?? record.image_loose;
  return typeof candidate === "string" && /^https?:\/\//i.test(candidate.trim())
    ? candidate.trim() : undefined;
}

export default function BrowseScreen() {
  const insets = useSafeAreaInsets();
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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [draftFilterType, setDraftFilterType] = useState<FilterType>("ALL");
  const [draftSelectedYear, setDraftSelectedYear] = useState<number | null>(null);
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

  const handleToggleFound = useCallback(async (id: string) => {
    const next = await toggleFoundId(id);
    setFoundIds(next);
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

  const handleInfoPress = useCallback(() => {
    Alert.alert(
      "Treasure Hunt Guide",
      "TH and STH are collectible Hot Wheels variants. Use the Guide tab for identification tips."
    );
  }, []);

  const handleYearPress = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const toggleCategory = useCallback((type: CarType) => {
    setExpandedCategories((current) => ({
      ...current,
      [type]: !current[type],
    }));
  }, []);

  const hasActiveFilters =
    filterType !== "ALL" ||
    (defaultYear !== null && selectedYear !== null && selectedYear !== defaultYear);

  const openFilterModal = () => {
    setDraftFilterType(filterType);
    setDraftSelectedYear(selectedYear);
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    setFilterType(draftFilterType);
    setSelectedYear(draftSelectedYear ?? defaultYear);
    setShowFilterModal(false);
  };

  const cancelFilters = () => {
    setShowFilterModal(false);
  };

const sections = useMemo<YearSection[]>(() => {
  return years.map((year) => {
    const cars = typedCarData.filter(
      (car) => car.year === year
    );

      return {
        year,
        cars,
        thCount: cars.filter((car) => car.type === "TH").length,
        sthCount: cars.filter((car) => car.type === "STH").length,
      };
    });
  }, [years, typedCarData]);

  const selectedSection = sections.find(
    (section) => section.year === selectedYear
  );

  const selectedCarPhoto = getPhoto(selectedCar, collectionPhotos);
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

        <Pressable
          style={styles.filterButton}
          onPress={openFilterModal}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Filter browse results"
        >
          <Ionicons
            name="options-outline"
            size={19}
            color="#FBBF24"
          />
          {hasActiveFilters && (
            <View style={styles.filterIndicator} />
          )}
        </Pressable>
      </View>

      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={cancelFilters}
      >
        <View style={styles.modalBackdrop}>
          <View style={filterModalStyle(insets.bottom)}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>FILTER OPTIONS</Text>
              <Pressable onPress={cancelFilters} hitSlop={10}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </Pressable>
            </View>

            <Text style={styles.modalSectionTitle}>TYPE</Text>
            <View style={styles.modalChipRow}>
              {(["ALL", "TH", "STH"] as FilterType[]).map((type) => {
                const active = draftFilterType === type;

                return (
                  <Pressable
                    key={type}
                    style={[
                      styles.filterChip,
                      active && styles.filterChipActive,
                    ]}
                    onPress={() => setDraftFilterType(type)}
                  >
                    {type !== "ALL" && (
                      <View
                        style={[
                          styles.filterDot,
                          { backgroundColor: TYPE_META[type].color },
                        ]}
                      />
                    )}
                    <Text
                      style={[
                        styles.filterText,
                        active && styles.filterTextActive,
                      ]}
                    >
                      {type === "ALL" ? "All" : type}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.modalSectionTitle}>YEAR</Text>
            <View style={styles.modalChipRow}>
              {years.map((year) => {
                const active = draftSelectedYear === year;

                return (
                  <Pressable
                    key={year}
                    style={[
                      styles.yearChip,
                      active && styles.yearChipActive,
                    ]}
                    onPress={() => setDraftSelectedYear(year)}
                  >
                    <Text
                      style={[
                        styles.yearText,
                        active && styles.yearTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={cancelFilters}>
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>APPLY</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {selectedSection && (
        <View style={styles.selectedYearSummary}>
          <Text style={styles.resultCount}>
            {selectedSection.cars.length}{" "}
            {selectedSection.cars.length === 1 ? "car" : "cars"}
          </Text>

          <Text style={styles.resultBreakdown}>
            {selectedSection.thCount} TH · {selectedSection.sthCount} STH
          </Text>
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
            <View style={styles.yearHeader}>
              <Text style={styles.yearTitle}>{section.year}</Text>

              <View style={styles.yearHeaderRight}>
                <Text style={styles.yearTotal}>{section.cars.length} Total</Text>
              </View>
            </View>

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
                  {selectedCarPhoto ? (
                    <View style={[collectionStyles.detailPhotoFrame, modalLayout.photoFrame]}>
                      <Image source={{ uri: selectedCarPhoto }}
                        style={collectionStyles.detailImage} resizeMode="contain" />
                    </View>
                  ) : (
                    <View style={[collectionStyles.detailImagePlaceholder, modalLayout.photoFrame]}>
                      <MaterialCommunityIcons name="car-sports" size={42} color="#111111" />
                    </View>
                  )}
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
              {!!selectedCar.idTips?.trim() && (
                <Pressable onPress={() => Alert.alert("Identification Tips", selectedCar.idTips)}
                  style={browseGridStyles.tipsButton}>
                  <Ionicons name="information-circle-outline" size={16} color="#FBBF24" />
                  <Text style={browseGridStyles.tipsText}>VIEW IDENTIFICATION TIPS</Text>
                </Pressable>
              )}
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
          <Text style={styles.categorySubtitle}>
            {cars.length} {cars.length === 1 ? "Car" : "Cars"}
          </Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={23}
          color={meta.color} />
      </Pressable>
      {expanded && (
        <View style={[gridStyles.grid, browseGridStyles.grid]}>
          {cars.map((car) => {
            const photoUri = getPhoto(car, collectionPhotos);
            const collected = foundIds.includes(car.id);
            const accent = TYPE_META[car.type].color;
            const caseLetter = String(car.caseLetter ?? "?").toUpperCase();
            return (
              <Pressable key={car.id} style={({ pressed }) =>
                  [gridStyles.card, pressed && gridStyles.cardPressed]}
                onPress={() => onSelectCar(car)}
                accessibilityRole="button"
                accessibilityLabel={`${car.name}, case ${caseLetter}, ${collected ? "collected" : "missing"}`}>
                <View style={gridStyles.imageWrap}>
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} style={gridStyles.image}
                      resizeMode="contain" />
                  ) : (
                    <View style={[gridStyles.placeholder,
                      { backgroundColor: car.type === "TH" ? "#282313" : "#2B1717" }]}>
                      <Text style={[gridStyles.placeholderLabel, { color: accent }]}>CASE</Text>
                      <Text style={[gridStyles.placeholderLetter, { color: accent }]}>
                        {caseLetter}
                      </Text>
                    </View>
                  )}
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
