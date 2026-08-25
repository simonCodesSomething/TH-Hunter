import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import carData from "../data/thstData.json";
import { getFoundIds, toggleFoundId } from "../utils/storage";

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
const [expandedYears, setExpandedYears] = useState<number[]>([]);
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

  setExpandedYears((current) =>
    current.length > 0 ? current : [years[0]]
  );
}, [years]);
  const [foundIds, setFoundIds] = useState<string[]>([]);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    void getFoundIds().then(setFoundIds);
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

    setExpandedYears((current) =>
      current.includes(year)
        ? current
        : [...current, year]
    );
  }, []);

  const toggleYear = useCallback((year: number) => {
    setExpandedYears((current) =>
      current.includes(year)
        ? current.filter((item) => item !== year)
        : [...current, year]
    );
  }, []);

  const filteredCars = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return typedCarData.filter((car) => {
      const carYear = car.year ?? 2026;
 const matchesYear =
  selectedYear === null || carYear === selectedYear;
      const matchesType =
        filterType === "ALL" || car.type === filterType;

      const searchableText = [
        car.name,
        car.series,
        car.caseLetter,
        car.type,
        String(carYear),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        normalizedQuery.length === 0 ||
        searchableText.includes(normalizedQuery);

      return matchesYear && matchesType && matchesQuery;
    });
  }, [filterType, query, selectedYear]);

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

    return (
      <Pressable
        key={car.id}
        style={styles.carCard}
        onPress={() => void handleToggleFound(car.id)}
      >
        <View style={styles.carImage}>
          <View style={styles.cardGraphic}>
            <MaterialCommunityIcons
              name="car-sports"
              size={44}
              color="#111111"
            />
          </View>

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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
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
            onPress={() =>
              setFilterType((current) =>
                current === "ALL"
                  ? "TH"
                  : current === "TH"
                    ? "STH"
                    : "ALL"
              )
            }
          >
            <Ionicons
              name="options-outline"
              size={25}
              color="#FFFFFF"
            />
          </Pressable>
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

        {sections.map((section) => {
          const isExpanded = expandedYears.includes(section.year);
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
            ]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery);
          });

          return (
            <View key={section.year} style={styles.yearSection}>
              <Pressable
                style={styles.yearHeader}
                onPress={() => toggleYear(section.year)}
              >
                <Text style={styles.yearTitle}>{section.year}</Text>

                <View style={styles.yearHeaderRight}>
                  <Text style={styles.yearTotal}>
                    {section.cars.length} Total
                  </Text>

                  <Ionicons
                    name={
                      isExpanded
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={23}
                    color="#FFFFFF"
                  />
                </View>
              </Pressable>

              {isExpanded && (
                <>
                  <BrowseCategory
                    type="TH"
                    cars={sectionCars.filter(
                      (car) => car.type === "TH"
                    )}
                    foundIds={foundIds}
                    onToggleFound={handleToggleFound}
                    renderCarCard={renderCarCard}
                  />

                  <BrowseCategory
                    type="STH"
                    cars={sectionCars.filter(
                      (car) => car.type === "STH"
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
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  content: {
    paddingTop: 12,
    paddingBottom: 32,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 16,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  subtitle: {
    color: "#A1A1A6",
    fontSize: 14,
    marginTop: 4,
    paddingRight: 12,
  },

  infoButton: {
    marginTop: 1,
  },

  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 12,
  },

  searchContainer: {
    flex: 1,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#343434",
    borderRadius: 13,
  },

  searchIcon: {
    marginRight: 9,
  },

  search: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    paddingVertical: 0,
  },

  filterButton: {
    width: 54,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#343434",
    borderRadius: 13,
  },

  typeSelector: {
    flexDirection: "row",
    marginHorizontal: 14,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#343434",
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 12,
  },

  typeSelectorItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },

  typeSelectorItemActive: {
    backgroundColor: "#FBBF24",
  },

  typeSelectorText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  typeSelectorTextActive: {
    color: "#111111",
  },

  yearRow: {
    paddingHorizontal: 14,
    gap: 8,
    paddingBottom: 12,
  },

  yearChip: {
    minWidth: 62,
    height: 42,
    paddingHorizontal: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 10,
  },

  yearChipActive: {
    borderColor: "#FBBF24",
    backgroundColor: "#111111",
  },

  yearChipText: {
    color: "#E5E5E5",
    fontSize: 14,
    fontWeight: "700",
  },

  yearChipTextActive: {
    color: "#FBBF24",
  },

  selectedYearSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 8,
  },

  resultCount: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  resultBreakdown: {
    color: "#77777C",
    fontSize: 12,
  },

  yearSection: {
    marginHorizontal: 14,
    marginBottom: 12,
    backgroundColor: "#050505",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 12,
    overflow: "hidden",
  },

  yearHeader: {
    minHeight: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  yearTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  yearHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  yearTotal: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "600",
  },

  category: {
    borderTopWidth: 1,
    borderTopColor: "#292929",
    paddingTop: 14,
    paddingBottom: 14,
  },

  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  categoryIconText: {
    position: "absolute",
    color: "#111111",
    fontSize: 8,
    fontWeight: "900",
    bottom: 5,
  },

  categoryTitleContainer: {
    flex: 1,
  },

  categoryTitle: {
    fontSize: 17,
    fontWeight: "900",
  },

  categorySubtitle: {
    color: "#8E8E93",
    fontSize: 13,
    marginTop: 2,
  },

  categoryCount: {
    fontSize: 18,
    fontWeight: "800",
    marginRight: 7,
  },

  cardsRow: {
    paddingHorizontal: 12,
    gap: 10,
  },

  carCard: {
    width: 142,
  },

  carImage: {
    height: 104,
    backgroundColor: "#E9E9E9",
    borderRadius: 11,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  cardGraphic: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8D8D8",
  },

  typeBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 30,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  typeBadgeText: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
  },

  foundBadge: {
    position: "absolute",
    left: 6,
    top: 6,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#34D399",
    alignItems: "center",
    justifyContent: "center",
  },

  carName: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    marginTop: 7,
  },

  carNumber: {
    color: "#77777C",
    fontSize: 12,
    marginTop: 3,
  },

  empty: {
    color: "#77777C",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 22,
  },

});