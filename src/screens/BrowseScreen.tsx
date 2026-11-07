import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  detailModalStyle,
  detailActionsStyle,
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

  const selectedCarPhoto = selectedCar ? collectionPhotos[selectedCar.id] : null;
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

      <Pressable
        style={styles.infoButton}
        onPress={handleInfoPress}
        hitSlop={10}
      >
        <Ionicons
          name="information-circle-outline"
          size={31}
          color="#FBBF24"
        />
      </Pressable>
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

    <Modal
      visible={selectedCar !== null}
      transparent
      animationType="slide"
      onRequestClose={() => setSelectedCar(null)}
    >
      <View style={styles.detailModalBackdrop}>
        <View style={detailModalStyle(insets.bottom)}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>{selectedCar?.name ?? "Car Details"}</Text>
            <Pressable onPress={() => setSelectedCar(null)} hitSlop={10}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.detailImageWrap}>
            {selectedCarPhoto ? (
              <Image source={{ uri: selectedCarPhoto }} style={styles.detailImage} />
            ) : (
              <View style={styles.detailImagePlaceholder}>
                <MaterialCommunityIcons name="car-sports" size={52} color="#111111" />
              </View>
            )}
          </View>

          {selectedCar && (
            <>
              <View style={styles.detailMetaRow}>
                <View
                  style={[
                    styles.detailTypeBadge,
                    { backgroundColor: TYPE_META[selectedCar.type].color },
                  ]}
                >
                  <Text style={styles.detailTypeBadgeText}>{selectedCar.type}</Text>
                </View>
                <Text style={styles.detailYear}>{selectedCar.year}</Text>
              </View>

              <Text style={styles.detailSeries}>{selectedCar.series}</Text>

              <View style={styles.detailGrid}>
                <View style={styles.detailStat}>
                  <Text style={styles.detailStatLabel}>Case</Text>
                  <Text style={styles.detailStatValue}>{selectedCar.caseLetter}</Text>
                </View>
                <View style={styles.detailStat}>
                  <Text style={styles.detailStatLabel}>Number</Text>
                  <Text style={styles.detailStatValue}>
                    {getCarNumber(selectedCar, typedCarData)}
                  </Text>
                </View>
                <View style={styles.detailStat}>
                  <Text style={styles.detailStatLabel}>Status</Text>
                  <Text style={styles.detailStatValue}>
                    {selectedCarIsFound ? "Collected" : "Missing"}
                  </Text>
                </View>
              </View>

              <Text style={styles.detailNotesTitle}>Notes</Text>
              <Text style={styles.detailNotes}>{selectedCar.idTips}</Text>
            </>
          )}

          <View style={detailActionsStyle(insets.bottom)}>
            {selectedCar && (
              <Pressable
                style={[
                  styles.detailToggleButton,
                  selectedCarIsFound && styles.detailToggleButtonActive,
                ]}
                onPress={() => {
                  void handleToggleFound(selectedCar.id);
                }}
              >
                <Text style={styles.detailToggleButtonText}>
                  {selectedCarIsFound ? "MARK MISSING" : "MARK FOUND"}
                </Text>
              </Pressable>
            )}

            {selectedCar && (
              <Pressable
                style={styles.detailPhotoButton}
                onPress={() => void handlePickPhoto(selectedCar.id)}
              >
                <Text style={styles.detailPhotoButtonText}>ADD PHOTO</Text>
              </Pressable>
            )}
          </View>
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

function BrowseCategory({
  type,
  cars,
  foundIds,
  collectionPhotos,
  onSelectCar,
  expanded,
  onToggle,
}: BrowseCategoryProps) {
  if (cars.length === 0) {
    return null;
  }

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
          <Text style={styles.categorySubtitle}>{cars.length} {cars.length === 1 ? "Car" : "Cars"}</Text>
        </View>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={23}
          color={meta.color}
        />
      </Pressable>

      {expanded && (
        <View style={styles.listContainer}>
          {cars.map((car) => {
            const photoUri = collectionPhotos[car.id];

            return (
              <Pressable
                key={car.id}
                style={styles.listItem}
                onPress={() => onSelectCar(car)}
              >
                <View style={styles.listThumb}>
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.listThumbImage} />
                  ) : (
                    <View style={styles.listThumbPlaceholder}>
                      <MaterialCommunityIcons name="car-sports" size={28} color="#111111" />
                    </View>
                  )}
                </View>

                <View style={styles.listInfo}>
                  <Text style={styles.listName} numberOfLines={1}>{car.name}</Text>
                  <Text style={styles.listMeta}>{car.series}</Text>
                  <Text style={styles.listCase}>Case {car.caseLetter}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

function getCarNumber(car: Car, cars: Car[]): number {
  return (
    cars
      .filter(
        (item) =>
          item.year === car.year &&
          item.type === car.type
      )
      .findIndex((item) => item.id === car.id) + 1
  );
}

