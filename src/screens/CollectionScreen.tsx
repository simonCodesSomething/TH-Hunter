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

import {

  getCollectionPhotos,

  getFoundIds,

  saveCollectionPhoto,

  toggleFoundId,

} from "../utils/storage";

import { styles } from "../styles/collection.styles";

import { gridStyles } from "../styles/collectionGrid.styles";

import { quantityStyles } from "../styles/collectionQuantity.styles";

import { modalLayout } from "../styles/collectionModalLayout.styles";

import { getCarQuantities, saveCarQuantity } from "../utils/carQuantities";

import { useCarData } from "../data/CarDataProvider";

import type { Car, CarType } from "../types";

type FilterType = "ALL" | CarType;

const TYPE_META: Record<

  CarType,

  {

    title: string;

    color: string;

    icon: keyof typeof MaterialCommunityIcons.glyphMap;

  }

> = {

  TH: {

    title: "TREASURE HUNTS",

    color: "#FBBF24",

    icon: "fire",

  },

  STH: {

    title: "SUPER TREASURE HUNTS",

    color: "#EF4444",

    icon: "fire",

  },

};

// Personal photos take priority; otherwise use the full public catalog URL.

// Records without an image retain the existing case placeholder.

function getCarPhoto(

  car: Car | null,

  collectionPhotos: Record<string, string>

): string | undefined {

  if (!car) return undefined;

  const personalPhoto = collectionPhotos[car.id];

  if (personalPhoto) return personalPhoto;

  const imageKey = car.imageKey;

  return typeof imageKey === "string" && /^https?:\/\//i.test(imageKey.trim())

    ? imageKey.trim()

    : undefined;

}

interface CollectionCardProps {

  car: Car;

  photoUri?: string;

  quantity: number;

  showDelete: boolean;

  onRemove: (id: string) => void;

  onSelect: (car: Car) => void;

}

function CollectionCard({

  car,

  photoUri,

  quantity,

  showDelete,

  onRemove,

  onSelect,

}: CollectionCardProps) {

  const accent = TYPE_META[car.type].color;

  const caseLetter = String(car.caseLetter ?? "?").toUpperCase();

  return (

    <Pressable

      style={({ pressed }) => [

        gridStyles.card,

        pressed && gridStyles.cardPressed,

      ]}

      onPress={() => onSelect(car)}

      accessibilityRole="button"

      accessibilityLabel={`${car.name}, ${car.type}, case ${caseLetter}, open details`}

    >

      <View style={[gridStyles.imageWrap, photoUri && { backgroundColor: "#FFFFFF" }]}>

        {photoUri ? (

          <Image

            source={{ uri: photoUri }}

            style={gridStyles.image}

            resizeMode="contain"

          />

        ) : (

          <View

            style={[

              gridStyles.placeholder,

              {

                backgroundColor:

                  car.type === "TH" ? "#282313" : "#2B1717",

              },

            ]}

          >

            <Text style={[gridStyles.placeholderLabel, { color: accent }]}>CASE</Text>

            <Text style={[gridStyles.placeholderLetter, { color: accent }]}>

              {caseLetter}

            </Text>

          </View>

        )}

        {quantity > 1 && (

          <View style={quantityStyles.cardQuantityBadge}>

            <Text style={quantityStyles.cardQuantityText}>×{quantity}</Text>

          </View>

        )}

        {showDelete && (

          <Pressable

            style={gridStyles.deleteButton}

            onPress={(event) => {

              event.stopPropagation();

              onRemove(car.id);

            }}

            hitSlop={6}

            accessibilityRole="button"

            accessibilityLabel={`Remove ${car.name} from collection`}

          >

            <Ionicons name="trash-outline" size={18} color="#FFFFFF" />

          </Pressable>

        )}

      </View>

      <View style={gridStyles.cardBody}>

        <Text style={gridStyles.carName} numberOfLines={2}>

          {car.name}

        </Text>

        <Text style={gridStyles.carSeries} numberOfLines={1}>

          {car.series}

        </Text>

        <View style={gridStyles.cardFooter}>

          <Text style={[gridStyles.typeLabel, { color: accent }]}>

            CASE {caseLetter} - {car.type}

          </Text>

          <Text style={gridStyles.yearLabel}>{car.year}</Text>

        </View>

      </View>

    </Pressable>

  );

}

interface CollectionScreenProps {

  onProgressPress: () => void;

  //onProgressPress={()=>setActiveTab("collection")};

}

export default function CollectionScreen({

  onProgressPress,

}: CollectionScreenProps) {

  const { cars: typedCarData } = useCarData();

  const [foundIds, setFoundIds] = useState<string[]>([]);

  const [query, setQuery] = useState("");

  const [filterType, setFilterType] =

    useState<FilterType>("ALL");

  const [selectedYear, setSelectedYear] =

    useState<number | null>(null);

  const [showFilterModal, setShowFilterModal] =

    useState(false);

  const [draftFilterType, setDraftFilterType] =

    useState<FilterType>("ALL");

  const [draftSelectedYear, setDraftSelectedYear] =

    useState<number | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const [collectionPhotos, setCollectionPhotos] = useState<Record<string, string>>({});

  const [carQuantities, setCarQuantities] = useState<Record<string, number>>({});

  const [savingQuantity, setSavingQuantity] = useState(false);

  const quantityLock = useRef(false);

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

  // Quantities are stored locally, separately from the catalog and found-ID list.

  // A found car without a stored quantity represents one copy (migration-safe).

  const quantityOf = useCallback(

    (id: string) => foundIds.includes(id) ? Math.max(1, carQuantities[id] ?? 1) : 0,

    [foundIds, carQuantities]

  );

  const removeCar = useCallback(async (id: string) => {

    if (quantityLock.current) return;

    quantityLock.current = true;

    setSavingQuantity(true);

    try {

      // Only toggle if this car is still collected, avoiding accidental re-adds.

      if (foundIds.includes(id)) {

        const nextIds = await toggleFoundId(id);

        setFoundIds(nextIds);

      }

      const next = await saveCarQuantity(id, 0);

      setCarQuantities(next);

      setSelectedCar(null);

    } catch (error) {

      console.error("[Collection] Unable to remove car:", error);

      Alert.alert("Unable to update", "Please try again.");

    } finally {

      quantityLock.current = false;

      setSavingQuantity(false);

    }

  }, [foundIds]);

  const handleRemoveFromCollection = useCallback(

    (car: Car) => {

      Alert.alert(

        "Remove from Collection?",

        `Remove all copies of ${car.name} from your collection?`,

        [

          { text: "Cancel", style: "cancel" },

          { text: "Remove All", style: "destructive", onPress: () => void removeCar(car.id) },

        ]

      );

    },

    [removeCar]

  );

  const changeQuantity = useCallback(async (car: Car, difference: number) => {

    if (quantityLock.current) return;

    const current = quantityOf(car.id);

    const nextQuantity = current + difference;

    if (nextQuantity <= 0) {

      handleRemoveFromCollection(car);

      return;

    }

    quantityLock.current = true;

    setSavingQuantity(true);

    try {

      const next = await saveCarQuantity(car.id, nextQuantity);

      setCarQuantities(next);

    } catch (error) {

      console.error("[Collection] Unable to save quantity:", error);

      Alert.alert("Unable to update quantity", "Please try again.");

    } finally {

      quantityLock.current = false;

      setSavingQuantity(false);

    }

  }, [quantityOf, handleRemoveFromCollection]);

  const collectedCars = useMemo(() => {

    return typedCarData.filter((car) =>

      foundIds.includes(car.id)

    );

  }, [typedCarData, foundIds]);

  const filteredCars = useMemo(() => {

    const normalizedQuery = query.trim().toLowerCase();

    return collectedCars.filter((car) => {

      if (

        filterType !== "ALL" &&

        car.type !== filterType

      ) {

        return false;

      }

      if (

        selectedYear !== null &&

        car.year !== selectedYear

      ) {

        return false;

      }

      if (!normalizedQuery) {

        return true;

      }

      return [

        car.name,

        car.series,

        car.type,

        car.caseLetter,

        String(car.year),

      ]

        .join(" ")

        .toLowerCase()

        .includes(normalizedQuery);

    });

  }, [

    collectedCars,

    filterType,

    query,

    selectedYear,

  ]);

  const years = useMemo(() => {

    return [

      ...new Set(

        collectedCars.map((car) => car.year)

      ),

    ].sort((a, b) => b - a);

  }, [collectedCars]);

  const thCount = useMemo(

    () =>

      collectedCars.filter(

        (car) => car.type === "TH"

      ).length,

    [collectedCars]

  );

  const sthCount = useMemo(

    () =>

      collectedCars.filter(

        (car) => car.type === "STH"

      ).length,

    [collectedCars]

  );

  const totalCount = collectedCars.length; // unique models, used for collection progress

  const totalCopies = collectedCars.reduce((sum, car) => sum + quantityOf(car.id), 0);

  const hasActiveFilters =

    query.length > 0 ||

    filterType !== "ALL" ||

    selectedYear !== null;

  const openFilterModal = () => {

    setDraftFilterType(filterType);

    setDraftSelectedYear(selectedYear);

    setShowFilterModal(true);

  };

  const applyFilters = () => {

    setFilterType(draftFilterType);

    setSelectedYear(draftSelectedYear);

    setShowFilterModal(false);

  };

  const cancelFilters = () => {

    setShowFilterModal(false);

  };

  return (

    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <View>

          <Text style={styles.eyebrow}>TH HUNTER</Text>

          <Text style={styles.title}>

            TREASURE BOX

          </Text>

          <Text style={styles.subtitle}>

            Everything you've collected

          </Text>

        </View>

        <View style={styles.headerCount}>

          <Text style={styles.headerCountValue}>

            {totalCount}

          </Text>

          <Text style={styles.headerCountLabel}>

            ITEMS

          </Text>

        </View>

      </View>

      <ScrollView

        showsVerticalScrollIndicator={false}

        contentContainerStyle={

          styles.content

        }

        keyboardShouldPersistTaps="handled"

      >

        {/* SUMMARY */}

        <Pressable

          style={styles.summaryCard}

          onPress={onProgressPress}

          hitSlop={8}

          accessibilityRole="button"

          accessibilityLabel="Open collection progress"

        >

          <View style={styles.summaryMain}>

            <View style={styles.summaryIcon}>

              <Ionicons

                name="cube-outline"

                size={30}

                color="#FBBF24"

              />

            </View>

            <View>

              <Text style={styles.summaryTitle}>

                My Collection

              </Text>

              <Text style={styles.summarySubtitle}>

                {totalCount} models · {totalCopies} total cars

              </Text>

            </View>

          </View>

          <View style={styles.summaryStats}>

            <View style={styles.summaryStat}>

              <Text

                style={[

                  styles.summaryStatValue,

                  {

                    color:

                      TYPE_META.TH.color,

                  },

                ]}

              >

                {thCount}

              </Text>

              <Text style={styles.summaryStatLabel}>

                TH

              </Text>

            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryStat}>

              <Text

                style={[

                  styles.summaryStatValue,

                  {

                    color:

                      TYPE_META.STH.color,

                  },

                ]}

              >

                {sthCount}

              </Text>

              <Text style={styles.summaryStatLabel}>

                STH

              </Text>

            </View>

          </View>

          <View style={styles.summaryProgressRow}>

            <View style={styles.summaryProgressIcon}>

              <Ionicons

                name="stats-chart"

                size={18}

                color="#111111"

              />

            </View>

            <View style={styles.summaryProgressInfo}>

              <Text style={styles.summaryProgressTitle}>

                Collection Progress

              </Text>

              <Text style={styles.summaryProgressSubtitle}>

                View your collection statistics and milestones

              </Text>

            </View>

            <Ionicons

              name="chevron-forward"

              size={22}

              color="#77777C"

            />

          </View>

        </Pressable>

        {/* SEARCH */}

        <View style={styles.searchRow}>

          <View style={styles.searchContainer}>

            <Ionicons

              name="search"

              size={22}

              color="#8E8E93"

            />

            <TextInput

              style={styles.searchInput}

              placeholder="Search your collection..."

              placeholderTextColor="#77777C"

              value={query}

              onChangeText={setQuery}

              returnKeyType="search"

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

            accessibilityLabel="Filter options"

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

            <View style={styles.filterModal}>

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

                        onPress={() => setDraftFilterType(type)}

                      >

                        {type !== "ALL" && (

                          <View

                            style={[

                              styles.filterDot,

                              {

                                backgroundColor: TYPE_META[type].color,

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

              {years.length > 0 && (

                <>

                  <Text style={styles.modalSectionTitle}>

                    YEAR

                  </Text>

                  <View style={styles.modalChipRow}>

                    <Pressable

                      style={[

                        styles.yearChip,

                        draftSelectedYear === null &&

                          styles.yearChipActive,

                      ]}

                      onPress={() => setDraftSelectedYear(null)}

                    >

                      <Text

                        style={[

                          styles.yearText,

                          draftSelectedYear === null &&

                            styles.yearTextActive,

                        ]}

                      >

                        All Years

                      </Text>

                    </Pressable>

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

                </>

              )}

              <View style={styles.modalActions}>

                <Pressable

                  style={styles.cancelButton}

                  onPress={cancelFilters}

                >

                  <Text style={styles.cancelButtonText}>CANCEL</Text>

                </Pressable>

                <Pressable

                  style={styles.applyButton}

                  onPress={applyFilters}

                >

                  <Text style={styles.applyButtonText}>APPLY</Text>

                </Pressable>

              </View>

            </View>

          </View>

        </Modal>

        {/* RESULT HEADER */}

        {totalCount > 0 && (

          <View style={styles.resultHeader}>

            <Text style={styles.resultTitle}>

              {filteredCars.length}{" "}

              {filteredCars.length === 1

                ? "CAR"

                : "CARS"}

            </Text>

            {hasActiveFilters && (

              <Pressable

                onPress={() => {

                  setQuery("");

                  setFilterType("ALL");

                  setSelectedYear(null);

                }}

              >

                <Text style={styles.clearText}>

                  Clear Filters

                </Text>

              </Pressable>

            )}

          </View>

        )}

        {/* EMPTY COLLECTION */}

        {totalCount === 0 && (

          <View style={styles.emptyState}>

            <View style={styles.emptyIcon}>

              <Ionicons

                name="cube-outline"

                size={42}

                color="#FBBF24"

              />

            </View>

            <Text style={styles.emptyTitle}>

              Your Collection Is Empty

            </Text>

            <Text style={styles.emptyText}>

              Cars you mark as collected in

              Browse and Hunt will appear here.

            </Text>

          </View>

        )}

        {/* NO FILTER RESULTS */}

        {totalCount > 0 &&

          filteredCars.length === 0 && (

            <View style={styles.emptyState}>

              <Ionicons

                name="search-outline"

                size={48}

                color="#77777C"

              />

              <Text style={styles.emptyTitle}>

                Nothing Found

              </Text>

              <Text style={styles.emptyText}>

                No cars in your collection match

                your current filters.

              </Text>

            </View>

          )}

        {/* COLLECTION LIST */}

        {filteredCars.length > 0 && (

          <View style={gridStyles.grid}>

            {filteredCars.map((car) => (

              <CollectionCard

                key={car.id}

                car={car}

                photoUri={getCarPhoto(car, collectionPhotos)}

                quantity={quantityOf(car.id)}

                showDelete={isEditing}

                onRemove={(id) => {

                  const car = typedCarData.find((item) => item.id === id);

                  if (car) handleRemoveFromCollection(car);

                }}

                onSelect={setSelectedCar}

              />

            ))}

          </View>

        )}

        {totalCount > 0 && filteredCars.length > 0 && (

          <Pressable

            style={styles.editButton}

            onPress={() => setIsEditing((editing) => !editing)}

            accessibilityRole="button"

            accessibilityLabel={isEditing ? "Done editing collection" : "Edit collection"}

          >

            <Text style={styles.editButtonText}>

              {isEditing ? "DONE" : "EDIT"}

            </Text>

          </Pressable>

        )}

        {/* FOOTER */}

      </ScrollView>

      <Modal

        visible={selectedCar !== null}

        transparent

        animationType="slide"

        onRequestClose={() => setSelectedCar(null)}

      >

        <View style={styles.detailModalBackdrop}>

          <View style={styles.detailModal}>

            <View style={styles.detailHeader}>

              <Text style={styles.detailTitle}>CAR DETAILS</Text>

              <Pressable onPress={() => setSelectedCar(null)} hitSlop={10}>

                <Ionicons name="close" size={24} color="#FFFFFF" />

              </Pressable>

            </View>

            {selectedCar && (

              <>

                {/* Photo and details side by side. Original component styles retained. */}

                <View style={modalLayout.mainRow}>

                  <View style={[styles.detailImageWrap, modalLayout.imageColumn]}>

                    {getCarPhoto(selectedCar, collectionPhotos) ? (

                      <View style={[styles.detailPhotoFrame, modalLayout.photoFrame]}>

                        <Image

                          source={{ uri: getCarPhoto(selectedCar, collectionPhotos)! }}

                          style={styles.detailImage}

                          resizeMode="contain"

                        />

                      </View>

                    ) : (

                      <View style={[styles.detailImagePlaceholder, modalLayout.photoFrame]}>

                        <MaterialCommunityIcons

                          name="car-sports"

                          size={52}

                          color="#111111"

                        />

                      </View>

                    )}

                  </View>

                  <View style={modalLayout.infoColumn}>

                    <View style={[styles.detailMetaRow, modalLayout.metaRow]}>

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

                    <View style={modalLayout.nameBlock}>

                      <Text

                        style={[styles.detailSeries, modalLayout.seriesEyebrow]}

                        numberOfLines={2}

                      >

                        {selectedCar.series.toUpperCase()}

                      </Text>

                      <Text

                        style={modalLayout.carName}

                        numberOfLines={3}

                      >

                        {selectedCar.name}

                      </Text>

                    </View>

                    <View style={[styles.detailGrid, modalLayout.detailsGrid]}>

                      <View style={[styles.detailStat, modalLayout.detailStat]}>

                        <Text style={styles.detailStatLabel}>Case</Text>

                        <Text style={styles.detailStatValue}>

                          {selectedCar.caseLetter}

                        </Text>

                      </View>

                      <View style={[styles.detailStat, modalLayout.detailStat]}>

                        <Text style={styles.detailStatLabel}>Status</Text>

                        <Text style={styles.detailStatValue}>Collected</Text>

                      </View>

                    </View>

                    <View style={[quantityStyles.container, modalLayout.quantityContainer]}>

                      <View style={[quantityStyles.headingRow, modalLayout.quantityRow]}>

                        <View style={[quantityStyles.controls, modalLayout.quantityControls]}>

                          <Pressable

                            style={[

                              quantityStyles.adjustButton,

                              savingQuantity && quantityStyles.disabled,

                            ]}

                            disabled={savingQuantity}

                            onPress={() => void changeQuantity(selectedCar, -1)}

                            accessibilityRole="button"

                            accessibilityLabel={`Remove one ${selectedCar.name}`}

                          >

                            <Ionicons name="remove" size={21} color="#FFFFFF" />

                          </Pressable>

                          <Text

                            style={quantityStyles.quantityValue}

                            accessibilityLabel={`${quantityOf(selectedCar.id)} owned`}

                          >

                            {quantityOf(selectedCar.id)}

                          </Text>

                          <Pressable

                            style={[

                              quantityStyles.adjustButton,

                              quantityStyles.addButton,

                              savingQuantity && quantityStyles.disabled,

                            ]}

                            disabled={savingQuantity}

                            onPress={() => void changeQuantity(selectedCar, 1)}

                            accessibilityRole="button"

                            accessibilityLabel={`Add one ${selectedCar.name}`}

                          >

                            <Ionicons name="add" size={21} color="#111111" />

                          </Pressable>

                        </View>

                      </View>

                    </View>

                  </View>

                </View>

                {/* Both original buttons remain full modal width, below the two columns. */}

                <View style={[styles.detailActions, modalLayout.fullWidthActions]}>

                  <Pressable

                    style={[styles.detailPhotoButton, modalLayout.fullWidthButton]}

                    onPress={() => void handlePickPhoto(selectedCar.id)}

                  >

                    <Text style={styles.detailPhotoButtonText}>ADD PHOTO</Text>

                  </Pressable>

                  <Pressable

                    style={[gridStyles.detailRemoveButton, modalLayout.fullWidthButton]}

                    onPress={() => handleRemoveFromCollection(selectedCar)}

                  >

                    <Ionicons name="trash-outline" size={20} color="#EF4444" />

                    <Text style={gridStyles.detailRemoveText}>

                      REMOVE FROM COLLECTION

                    </Text>

                  </Pressable>

                </View>

              </>

            )}

          </View>

        </View>

      </Modal>

    </View>

  );

}
