import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import carData from "../data/thstData.json";
import {
  getCollectionPhotos,
  getFoundIds,
  saveCollectionPhoto,
  toggleFoundId,
} from "../utils/storage";
import { styles } from "../styles/collection.styles";

type CarType = "TH" | "STH";

type FilterType = "ALL" | CarType;

interface Car {
  id: string;
  name: string;
  type: CarType;
  series: string;
  year: number;
  caseLetter: string;
  imageKey: string;
  idTips: string;
}

const typedCarData = carData as Car[];

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

interface CollectionScreenProps {
    
  onProgressPress: () => void;
  //onProgressPress={()=>setActiveTab("collection")};
}

export default function CollectionScreen({
  onProgressPress,
}: CollectionScreenProps) {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [collectionPhotos, setCollectionPhotos] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] =
    useState<FilterType>("ALL");
  const [selectedYear, setSelectedYear] =
    useState<number | null>(null);

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleToggleFound = useCallback(
    async (id: string) => {
      const next = await toggleFoundId(id);
      setFoundIds(next);
    },
    []
  );

  const collectedCars = useMemo(() => {
    return typedCarData.filter((car) =>
      foundIds.includes(car.id)
    );
  }, [foundIds]);

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

  const totalCount = collectedCars.length;

  const renderCarCard = (car: Car) => {
    const meta = TYPE_META[car.type];
    const photoUri = collectionPhotos[car.id];

    return (
      <Pressable
        key={car.id}
        style={styles.carCard}
        onPress={() =>
          void handleToggleFound(car.id)
        }
      >
        <View style={styles.carImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.carPhoto} />
          ) : (
            <View style={styles.carGraphic}>
              <MaterialCommunityIcons
                name="car-sports"
                size={44}
                color="#111111"
              />
            </View>
          )}

          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor: meta.color,
              },
            ]}
          >
            <Text style={styles.typeBadgeText}>
              {car.type}
            </Text>
          </View>

          <View style={styles.collectedBadge}>
            <Ionicons
              name="checkmark"
              size={14}
              color="#111111"
            />
          </View>

          <Pressable
            style={styles.photoButton}
            onPress={() => void handlePickPhoto(car.id)}
            hitSlop={8}
          >
            <Ionicons
              name={photoUri ? "camera" : "camera-outline"}
              size={16}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        <Text
          style={styles.carName}
          numberOfLines={2}
        >
          {car.name}
        </Text>

        <Text style={styles.carMeta}>
          {car.series}
        </Text>

        <Text style={styles.carNumber}>
          Case {car.caseLetter}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>TH HUNTER</Text>
          <Text style={styles.title}>
            COLLECTION
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

        <View style={styles.summaryCard}>
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
                {totalCount} cars collected
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
        </View>

        <Pressable
  style={styles.progressCard}
  onPress={onProgressPress}
>
  <View style={styles.progressCardIcon}>
    <Ionicons
      name="stats-chart"
      size={24}
      color="#111111"
    />
  </View>

  <View style={styles.progressCardInfo}>
    <Text style={styles.progressCardTitle}>
      Collection Progress
    </Text>

    <Text style={styles.progressCardSubtitle}>
      View your collection statistics and milestones
    </Text>
  </View>

  <Ionicons
    name="chevron-forward"
    size={22}
    color="#77777C"
  />
</Pressable>

        {/* SEARCH */}

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

        {/* TYPE FILTER */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.filterRow
          }
        >
          {(
            ["ALL", "TH", "STH"] as FilterType[]
          ).map((type) => {
            const active =
              filterType === type;

            return (
              <Pressable
                key={type}
                style={[
                  styles.filterChip,
                  active &&
                    styles.filterChipActive,
                ]}
                onPress={() =>
                  setFilterType(type)
                }
              >
                {type !== "ALL" && (
                  <View
                    style={[
                      styles.filterDot,
                      {
                        backgroundColor:
                          TYPE_META[type]
                            .color,
                      },
                    ]}
                  />
                )}

                <Text
                  style={[
                    styles.filterText,
                    active &&
                      styles.filterTextActive,
                  ]}
                >
                  {type === "ALL"
                    ? "All"
                    : type}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* YEAR FILTER */}

        {years.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.yearRow
            }
          >
            <Pressable
              style={[
                styles.yearChip,
                selectedYear === null &&
                  styles.yearChipActive,
              ]}
              onPress={() =>
                setSelectedYear(null)
              }
            >
              <Text
                style={[
                  styles.yearText,
                  selectedYear === null &&
                    styles.yearTextActive,
                ]}
              >
                All Years
              </Text>
            </Pressable>

            {years.map((year) => {
              const active =
                selectedYear === year;

              return (
                <Pressable
                  key={year}
                  style={[
                    styles.yearChip,
                    active &&
                      styles.yearChipActive,
                  ]}
                  onPress={() =>
                    setSelectedYear(year)
                  }
                >
                  <Text
                    style={[
                      styles.yearText,
                      active &&
                        styles.yearTextActive,
                    ]}
                  >
                    {year}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* RESULT HEADER */}

        {totalCount > 0 && (
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>
              {filteredCars.length}{" "}
              {filteredCars.length === 1
                ? "CAR"
                : "CARS"}
            </Text>

            {(query.length > 0 ||
              filterType !== "ALL" ||
              selectedYear !== null) && (
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

        {/* COLLECTION GRID */}

        {filteredCars.length > 0 && (
          <View style={styles.grid}>
            {filteredCars.map(renderCarCard)}
          </View>
        )}

        {/* FOOTER */}

        {totalCount > 0 && (
          <Text style={styles.footerText}>
            Tap a car to remove it from your
            collection.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}