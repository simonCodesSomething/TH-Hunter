import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/browse.styles"

import carData from "../data/thstData.json";
import {
  getCollectionPhotos,
  getFoundIds,
  saveCollectionPhoto,
  toggleFoundId,
} from "../utils/storage";

type CarType = "TH" | "STH";

interface Car {
  id: string;
  name: string;
  type: CarType;
  series: string;
  year: number;
  caseLetter: string;
  imageKey: string;
  idTips: string;
  /**
   * Add year to thstData.json when your historical data is ready.
   * Current records without a year are treated as the latest year.
   */
  //year?: number;
}

interface YearSection {
  year: number;
  cars: Car[];
  thCount: number;
  sthCount: number;
}

type FilterType = "ALL" | CarType;

//const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

const typedCarData = carData as Car[];

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
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("ALL");
const [selectedYear, setSelectedYear] = useState<number | null>(null);
const years = useMemo(() => {
  return [...new Set(typedCarData.map((car) => car.year))].sort(
    (a, b) => b - a
  );
}, []);

useEffect(() => {
  if (years.length === 0) {
    return;
  }

  setSelectedYear((current) => current ?? years[0]);
}, [years]);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [collectionPhotos, setCollectionPhotos] = useState<Record<string, string>>({});

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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



const sections = useMemo<YearSection[]>(() => {
  return years.map((year) => {
      const cars = typedCarData.filter(
        (car) => (car.year ?? 2026) === year
      );

      return {
        year,
        cars,
        thCount: cars.filter((car) => car.type === "TH").length,
        sthCount: cars.filter((car) => car.type === "STH").length,
      };
    });
}, [years]);

  const selectedSection = sections.find(
    (section) => section.year === selectedYear
  );

  

  const renderCarCard = (car: Car) => {
    const meta = TYPE_META[car.type];
    const isFound = foundIds.includes(car.id);
    const photoUri = collectionPhotos[car.id];

    return (
      <Pressable
        key={car.id}
        style={styles.carCard}
        onPress={() => void handleToggleFound(car.id)}
      >
        <View style={styles.carImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.carPhoto} />
          ) : (
            <View style={styles.cardGraphic}>
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
              { backgroundColor: meta.color },
            ]}
          >
            <Text style={styles.typeBadgeText}>{car.type}</Text>
          </View>

          {isFound && (
            <View style={styles.foundBadge}>
              <Ionicons name="checkmark" size={13} color="#000" />
            </View>
          )}

          <Pressable
            style={styles.photoButton}
            onPress={(event) => {
              event.stopPropagation();
              void handlePickPhoto(car.id);
            }}
            hitSlop={8}
          >
            <Ionicons
              name={photoUri ? "camera" : "camera-outline"}
              size={16}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        <Text style={styles.carName} numberOfLines={2}>
          {car.name}
        </Text>

<Text style={styles.carNumber}>
  Case {car.caseLetter} · {car.type} #{getCarNumber(car, typedCarData)}
</Text>
      </Pressable>
    );
  };

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

      </View>

      <View style={styles.typeSelector}>
        {(["ALL", "TH", "STH"] as FilterType[]).map((type) => {
          const active = filterType === type;

          return (
            <Pressable
              key={type}
              style={[
                styles.typeSelectorItem,
                active && styles.typeSelectorItemActive,
              ]}
              onPress={() => setFilterType(type)}
            >
              <Text
                style={[
                  styles.typeSelectorText,
                  active && styles.typeSelectorTextActive,
                ]}
              >
                {type}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.yearRow}
      >
        {years.map((year) => {
          const active = selectedYear === year;

          return (
            <Pressable
              key={year}
              style={[
                styles.yearChip,
                active && styles.yearChipActive,
              ]}
              onPress={() => handleYearPress(year)}
            >
              <Text
                style={[
                  styles.yearChipText,
                  active && styles.yearChipTextActive,
                ]}
              >
                {year}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

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
            <View
              style={styles.yearHeader}
            >
              <Text style={styles.yearTitle}>
                {section.year}
              </Text>

              <View style={styles.yearHeaderRight}>
                <Text style={styles.yearTotal}>
                  {section.cars.length} Total
                </Text>

              </View>
            </View>

            <>
                <BrowseCategory
                  type="STH"
                  cars={sectionCars.filter(
                    (car) => car.type === "STH"
                  )}
                  foundIds={foundIds}
                  onToggleFound={handleToggleFound}
                  renderCarCard={renderCarCard}
                />

                <BrowseCategory
                  type="TH"
                  cars={sectionCars.filter(
                    (car) => car.type === "TH"
                  )}
                  foundIds={foundIds}
                  onToggleFound={handleToggleFound}
                  renderCarCard={renderCarCard}
                />

                {sectionCars.length === 0 && (
                  <Text style={styles.empty}>
                    No TH / STH cars match your search.
                  </Text>
                )}
            </>
          </View>
        );
      })}
    </ScrollView>
  </View>
);
}

interface BrowseCategoryProps {
  type: CarType;
  cars: Car[];
  foundIds: string[];
  onToggleFound: (id: string) => Promise<void>;
  renderCarCard: (car: Car) => React.ReactNode;
}

function BrowseCategory({
  type,
  cars,
  renderCarCard,
}: BrowseCategoryProps) {
  if (cars.length === 0) {
    return null;
  }

  const meta = TYPE_META[type];

  return (
    <View style={styles.category}>
      <View style={styles.categoryHeader}>
        <View
          style={[
            styles.categoryIcon,
            { backgroundColor: meta.color },
          ]}
        >
          <MaterialCommunityIcons
            name={meta.icon}
            size={24}
            color="#111111"
          />
          <Text style={styles.categoryIconText}>{type}</Text>
        </View>

        <View style={styles.categoryTitleContainer}>
          <Text
            style={[
              styles.categoryTitle,
              { color: meta.color },
            ]}
          >
            {meta.title}
          </Text>

          <Text style={styles.categorySubtitle}>
            {cars.length} {cars.length === 1 ? "Car" : "Cars"}
          </Text>
        </View>

        <Text
          style={[
            styles.categoryCount,
            { color: meta.color },
          ]}
        >
          {cars.length}
        </Text>

        <Ionicons
          name="chevron-forward"
          size={23}
          color={meta.color}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsRow}
      >
        {cars.map(renderCarCard)}
      </ScrollView>
    </View>
  );
}

function getCarNumber(car: Car, cars: Car[]): number {
  return (
    cars.filter(
      (item) =>
        (item.year ?? 2026) === (car.year ?? 2026) &&
        item.type === car.type
    ).findIndex((item) => item.id === car.id) + 1
  );
}

