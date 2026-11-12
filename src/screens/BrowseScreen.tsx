
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
  browseDetailStyles,
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

// ---------------------------------------------------------
// CATALOG IMAGE HANDLING
// ---------------------------------------------------------

function getCatalogPhoto(car: Car | null): string | null {
  if (!car) {
    return null;
  }

  // Support either the mapped camelCase property or
  // the original Supabase database column name.
  const imageCar = car as Car & {
    imageKey?: string | null;
    image_key?: string | null;
  };

  const imageKey = imageCar.imageKey ?? imageCar.image_key;

  if (typeof imageKey !== "string") {
    return null;
  }

  const url = imageKey.trim();

  // Placeholder and empty values have no catalog image.
  if (!/^https?:\/\//i.test(url)) {
    return null;
  }

  return url;
}

function getCarPhoto(
  car: Car | null,
  collectionPhotos: Record<string, string>
): string | null {
  if (!car) {
    return null;
  }

  // Personal collection photos always take priority.
  const personalPhoto = collectionPhotos[car.id];

  if (personalPhoto) {
    return personalPhoto;
  }

  // Fall back to the Supabase catalog photograph.
  return getCatalogPhoto(car);
}

// ---------------------------------------------------------
// BROWSE SCREEN
// ---------------------------------------------------------

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
      current !== null && years.includes(current)
        ? current
        : defaultYear
    );
  }, [years, defaultYear]);

  const [foundIds, setFoundIds] = useState<string[]>([]);

  const [collectionPhotos, setCollectionPhotos] = useState<
    Record<string, string>
  >({});

  const [showFilterModal, setShowFilterModal] = useState(false);

  const [draftFilterType, setDraftFilterType] =
    useState<FilterType>("ALL");

  const [draftSelectedYear, setDraftSelectedYear] =
    useState<number | null>(null);

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const [expandedCategories, setExpandedCategories] = useState<
    Record<CarType, boolean>
  >({
    TH: true,
    STH: true,
  });

  const scrollRef = useRef<ScrollView>(null);

  // -------------------------------------------------------
  // LOAD COLLECTION DATA
  // -------------------------------------------------------

  useEffect(() => {
    void getFoundIds().then(setFoundIds);
    void getCollectionPhotos().then(setCollectionPhotos);
  }, []);

  // -------------------------------------------------------
  // PERSONAL PHOTO PICKER
  // -------------------------------------------------------

  const handlePickPhoto = useCallback(async (carId: string) => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (result.canceled) {
      return;
    }

    const next = await saveCollectionPhoto(
      carId,
      result.assets[0].uri
    );

    setCollectionPhotos(next);
  }, []);

  // -------------------------------------------------------
  // COLLECTION ACTIONS
  // -------------------------------------------------------

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

  // -------------------------------------------------------
  // FILTERS
  // -------------------------------------------------------

  const hasActiveFilters =
    filterType !== "ALL" ||
    (defaultYear !== null &&
      selectedYear !== null &&
      selectedYear !== defaultYear);

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

  // -------------------------------------------------------
  // YEAR SECTIONS
  // -------------------------------------------------------

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

  // Personal photo -> catalog photo -> placeholder.
  const selectedCarPhoto = getCarPhoto(
    selectedCar,
    collectionPhotos
  );

  const selectedCarIsFound = selectedCar
    ? foundIds.includes(selectedCar.id)
    : false;

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

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
        {/* SEARCH */}

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

        {/* FILTER MODAL */}

        <Modal
          visible={showFilterModal}
          transparent
          animationType="slide"
          onRequestClose={cancelFilters}
        >
          <View style={styles.modalBackdrop}>
            <View style={filterModalStyle(insets.bottom)}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  FILTER OPTIONS
                </Text>

                <Pressable
                  onPress={cancelFilters}
                  hitSlop={10}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>

              <Text style={styles.modalSectionTitle}>
                TYPE
              </Text>

              <View style={styles.modalChipRow}>
                {(["ALL", "TH", "STH"] as FilterType[]).map(
                  (type) => {
                    const active = draftFilterType === type;

                    return (
                      <Pressable
                        key={type}
                        style={[
                          styles.filterChip,
                          active && styles.filterChipActive,
                        ]}
                        onPress={() =>
                          setDraftFilterType(type)
                        }
                      >
                        {type !== "ALL" && (
                          <View
                            style={[
                              styles.filterDot,
                              {
                                backgroundColor:
                                  TYPE_META[type].color,
                              },
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
                  }
                )}
              </View>

              <Text style={styles.modalSectionTitle}>
                YEAR
              </Text>

              <View style={styles.modalChipRow}>
                {years.map((year) => {
                  const active =
                    draftSelectedYear === year;

                  return (
                    <Pressable
                      key={year}
                      style={[
                        styles.yearChip,
                        active && styles.yearChipActive,
                      ]}
                      onPress={() =>
                        setDraftSelectedYear(year)
                      }
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
                <Pressable
                  style={styles.cancelButton}
                  onPress={cancelFilters}
                >
                  <Text style={styles.cancelButtonText}>
                    CANCEL
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.applyButton}
                  onPress={applyFilters}
                >
                  <Text style={styles.applyButtonText}>
                    APPLY
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* SELECTED YEAR SUMMARY */}

        {selectedSection && (
          <View style={styles.selectedYearSummary}>
            <Text style={styles.resultCount}>
              {selectedSection.cars.length}{" "}
              {selectedSection.cars.length === 1
                ? "car"
                : "cars"}
            </Text>

            <Text style={styles.resultBreakdown}>
              {selectedSection.thCount} TH ·{" "}
              {selectedSection.sthCount} STH
            </Text>
          </View>
        )}

        {/* YEAR AND CATEGORY LIST */}

        {sections
          .filter(
            (section) =>
              section.year === selectedYear
          )
          .map((section) => {
            const sectionCars = section.cars.filter(
              (car) => {
                if (
                  filterType !== "ALL" &&
                  car.type !== filterType
                ) {
                  return false;
                }

                const normalizedQuery = query
                  .trim()
                  .toLowerCase();

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
              }
            );

            return (
              <View
                key={section.year}
                style={styles.yearSection}
              >
                <View style={styles.yearHeader}>
                  <Text style={styles.yearTitle}>
                    {section.year}
                  </Text>

                  <View
                    style={styles.yearHeaderRight}
                  >
                    <Text style={styles.yearTotal}>
                      {section.cars.length} Total
                    </Text>
                  </View>
                </View>

                <BrowseCategory
                  type="STH"
                  cars={sectionCars.filter(
                    (car) => car.type === "STH"
                  )}
                  foundIds={foundIds}
                  collectionPhotos={collectionPhotos}
                  onSelectCar={setSelectedCar}
                  expanded={expandedCategories.STH}
                  onToggle={() =>
                    toggleCategory("STH")
                  }
                />

                <BrowseCategory
                  type="TH"
                  cars={sectionCars.filter(
                    (car) => car.type === "TH"
                  )}
                  foundIds={foundIds}
                  collectionPhotos={collectionPhotos}
                  onSelectCar={setSelectedCar}
                  expanded={expandedCategories.TH}
                  onToggle={() =>
                    toggleCategory("TH")
                  }
                />

                {sectionCars.length === 0 && (
                  <Text style={styles.empty}>
                    No TH / STH cars match your search.
                  </Text>
                )}
              </View>
            );
          })}
      </ScrollView>

      {/* CAR DETAILS MODAL */}

      <Modal
        visible={selectedCar !== null}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setSelectedCar(null)
        }
      >
        <View style={browseDetailStyles.backdrop}>
          <View
            style={[
              browseDetailStyles.sheet,
              {
                paddingBottom:
                  Math.max(insets.bottom, 12) + 14,
              },
            ]}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                browseDetailStyles.sheetContent
              }
            >
              <View style={browseDetailStyles.header}>
                <Text
                  style={browseDetailStyles.title}
                  numberOfLines={2}
                >
                  {selectedCar?.name ?? "Car Details"}
                </Text>

                <Pressable
                  onPress={() =>
                    setSelectedCar(null)
                  }
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Close car details"
                >
                  <Ionicons
                    name="close"
                    size={27}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>

              {/* PERSONAL OR CATALOG PHOTO */}

              <View style={browseDetailStyles.imageWrap}>
                {selectedCarPhoto ? (
                  <Image
                    source={{
                      uri: selectedCarPhoto,
                    }}
                    style={browseDetailStyles.image}
                    resizeMode="contain"
                  />
                ) : (
                  <View
                    style={
                      browseDetailStyles.imagePlaceholder
                    }
                  >
                    <MaterialCommunityIcons
                      name="car-sports"
                      size={52}
                      color="#111111"
                    />
                  </View>
                )}
              </View>

              {selectedCar && (
                <>
                  <View
                    style={browseDetailStyles.metaRow}
                  >
                    <View
                      style={[
                        browseDetailStyles.typeBadge,
                        {
                          backgroundColor:
                            TYPE_META[selectedCar.type]
                              .color,
                        },
                      ]}
                    >
                      <Text
                        style={
                          browseDetailStyles.typeText
                        }
                      >
                        {selectedCar.type}
                      </Text>
                    </View>

                    <Text
                      style={browseDetailStyles.year}
                    >
                      {selectedCar.year}
                    </Text>
                  </View>

                  <Text
                    style={browseDetailStyles.series}
                  >
                    {selectedCar.series}
                  </Text>

                  <View
                    style={browseDetailStyles.statsRow}
                  >
                    <View
                      style={browseDetailStyles.statCard}
                    >
                      <Text
                        style={
                          browseDetailStyles.statLabel
                        }
                      >
                        Case
                      </Text>

                      <Text
                        style={
                          browseDetailStyles.statValue
                        }
                      >
                        {selectedCar.caseLetter}
                      </Text>
                    </View>

                    <View
                      style={browseDetailStyles.statCard}
                    >
                      <Text
                        style={
                          browseDetailStyles.statLabel
                        }
                      >
                        Status
                      </Text>

                      <Text
                        style={
                          browseDetailStyles.statValue
                        }
                      >
                        {selectedCarIsFound
                          ? "Collected"
                          : "Missing"}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={
                      browseDetailStyles.notesTitle
                    }
                  >
                    Notes
                  </Text>

                  <Text
                    style={browseDetailStyles.notes}
                  >
                    {selectedCar.idTips}
                  </Text>

                  <View
                    style={browseDetailStyles.actions}
                  >
                    {selectedCarIsFound ? (
                      <>
                        <Pressable
                          style={
                            browseDetailStyles.photoButton
                          }
                          onPress={() =>
                            void handlePickPhoto(
                              selectedCar.id
                            )
                          }
                          accessibilityRole="button"
                        >
                          <Text
                            style={
                              browseDetailStyles.photoButtonText
                            }
                          >
                            ADD PHOTO
                          </Text>
                        </Pressable>

                        <Pressable
                          style={
                            browseDetailStyles.removeButton
                          }
                          onPress={() => {
                            const car = selectedCar;

                            Alert.alert(
                              "Remove from collection?",
                              `Remove ${car.name} from your collected cars?`,
                              [
                                {
                                  text: "Cancel",
                                  style: "cancel",
                                },
                                {
                                  text: "Remove",
                                  style: "destructive",
                                  onPress: () => {
                                    void handleToggleFound(
                                      car.id
                                    );
                                    setSelectedCar(null);
                                  },
                                },
                              ]
                            );
                          }}
                          accessibilityRole="button"
                          accessibilityLabel={`Remove ${selectedCar.name} from collection`}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="#EF4444"
                          />

                          <Text
                            style={
                              browseDetailStyles.removeButtonText
                            }
                          >
                            REMOVE FROM COLLECTION
                          </Text>
                        </Pressable>
                      </>
                    ) : (
                      <>
                        <Pressable
                          style={
                            browseDetailStyles.photoButton
                          }
                          onPress={() =>
                            void handleToggleFound(
                              selectedCar.id
                            )
                          }
                          accessibilityRole="button"
                        >
                          <Text
                            style={
                              browseDetailStyles.photoButtonText
                            }
                          >
                            MARK FOUND
                          </Text>
                        </Pressable>

                        <Pressable
                          style={
                            browseDetailStyles.secondaryButton
                          }
                          onPress={() =>
                            void handlePickPhoto(
                              selectedCar.id
                            )
                          }
                          accessibilityRole="button"
                        >
                          <Text
                            style={
                              browseDetailStyles.secondaryButtonText
                            }
                          >
                            ADD PHOTO
                          </Text>
                        </Pressable>
                      </>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ---------------------------------------------------------
// BROWSE CATEGORY COMPONENT
// ---------------------------------------------------------

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
      <Pressable
        style={styles.categoryHeader}
        onPress={onToggle}
      >
        <View
          style={[
            styles.categoryIcon,
            {
              backgroundColor: meta.color,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={meta.icon}
            size={24}
            color="#111111"
          />

          <Text style={styles.categoryIconText}>
            {type}
          </Text>
        </View>

        <View
          style={styles.categoryTitleContainer}
        >
          <Text
            style={[
              styles.categoryTitle,
              {
                color: meta.color,
              },
            ]}
          >
            {meta.title}
          </Text>

          <Text
            style={styles.categorySubtitle}
          >
            {cars.length}{" "}
            {cars.length === 1 ? "Car" : "Cars"}
          </Text>
        </View>

        <Ionicons
          name={
            expanded
              ? "chevron-up"
              : "chevron-down"
          }
          size={23}
          color={meta.color}
        />
      </Pressable>

      {expanded && (
        <View style={styles.listContainer}>
          {cars.map((car) => {
            const photoUri = getCarPhoto(
              car,
              collectionPhotos
            );

            return (
              <Pressable
                key={car.id}
                style={styles.listItem}
                onPress={() =>
                  onSelectCar(car)
                }
              >
                {/* PERSONAL OR CATALOG THUMBNAIL */}

                <View style={styles.listThumb}>
                  {photoUri ? (
                    <Image
                      source={{
                        uri: photoUri,
                      }}
                      style={
                        styles.listThumbImage
                      }
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={
                        styles.listThumbPlaceholder
                      }
                    >
                      <MaterialCommunityIcons
                        name="car-sports"
                        size={28}
                        color="#111111"
                      />
                    </View>
                  )}
                </View>

                <View style={styles.listInfo}>
                  <Text
                    style={styles.listName}
                    numberOfLines={1}
                  >
                    {car.name}
                  </Text>

                  <Text
                    style={styles.listMeta}
                  >
                    {car.series}
                  </Text>

                  <Text
                    style={styles.listCase}
                  >
                    Case {car.caseLetter}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
