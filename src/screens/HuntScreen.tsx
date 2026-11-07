import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  getCollectionPhotos,
  getFoundIds,
  toggleFoundId,
} from "../utils/storage";
import { styles } from "../styles/hunt.styles";
import { useCarData } from "../data/CarDataProvider";
import type { Car } from "../types";

type CarType = "TH" | "STH";
type HuntView = CarType;

const CURRENT_YEAR = new Date().getFullYear();

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

export default function HuntScreen() {
  const { cars } = useCarData();
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [collectionPhotos, setCollectionPhotos] = useState<Record<string, string>>({});
  const [selectedYear, setSelectedYear] =
    useState<number>(CURRENT_YEAR);
  const [selectedType, setSelectedType] =
    useState<HuntView>("STH");
  const [selectedCase, setSelectedCase] =
    useState<string | "ALL">("ALL");
  const [caseDropdownOpen, setCaseDropdownOpen] =
    useState(false);
  const [showYearChips, setShowYearChips] =
    useState(false);
  const caseCarouselRef = useRef<ScrollView | null>(null);

  /*
   * Available years
   */
  const years = useMemo(() => {
    return [...new Set(cars.map((car) => car.year ?? CURRENT_YEAR))]
      .sort((a, b) => b - a);
  }, []);

  /*
   * Load saved hunt progress
   */
  useEffect(() => {
    const loadProgress = async () => {
      const ids = await getFoundIds();
      setFoundIds(ids);
    };

    void loadProgress();
    void getCollectionPhotos().then(setCollectionPhotos);
  }, []);

    /*
     * Toggle a car as found
     */
    const handleToggleFound = useCallback(
      async (id: string) => {
        const nextIds = await toggleFoundId(id);
        setFoundIds(nextIds);
      },
      []
    );

    /*
     * Cars for selected year
     */
    const selectedYearCars = useMemo(() => {
      return cars.filter(
        (car) =>
          (car.year ?? CURRENT_YEAR) === selectedYear
      );
    }, [selectedYear]);

    const thCars = useMemo(
      () => selectedYearCars.filter((car) => car.type === "TH"),
      [selectedYearCars]
    );

    const sthCars = useMemo(
      () => selectedYearCars.filter((car) => car.type === "STH"),
      [selectedYearCars]
    );

    const foundCars = useMemo(
      () => selectedYearCars.filter((car) => foundIds.includes(car.id)),
      [selectedYearCars, foundIds]
    );

    const foundTH = useMemo(
      () => thCars.filter((car) => foundIds.includes(car.id)),
      [thCars, foundIds]
    );

    const foundSTH = useMemo(() => sthCars.filter((car) => foundIds.includes(car.id)), [sthCars, foundIds]);

    /*
     * Missing cars
     */
    const missingTH = useMemo(
      () => thCars.filter((car) => !foundIds.includes(car.id)),
      [thCars, foundIds]
    );

    const missingSTH = useMemo(
      () => sthCars.filter((car) => !foundIds.includes(car.id)),
      [sthCars, foundIds]
    );

    const filteredMissingTH = useMemo(
      () => missingTH.filter((car) => selectedCase === "ALL" || car.caseLetter === selectedCase),
      [missingTH, selectedCase]
    );

    const filteredMissingSTH = useMemo(
      () => missingSTH.filter((car) => selectedCase === "ALL" || car.caseLetter === selectedCase),
      [missingSTH, selectedCase]
    );

    /*
     * Selected type progress
     */
    const caseOptions = useMemo(() => {
      const options = (selectedType === "TH" ? thCars : sthCars).map((car) => car.caseLetter);
      return [...new Set(options)].sort((a, b) => a.localeCompare(b));
    }, [selectedType, thCars, sthCars]);

    const caseItems = useMemo(
      () => [
        { label: "ALL CASES", value: "ALL" },
        ...caseOptions.map((caseLetter) => ({
          label: `CASE ${caseLetter}`,
          value: caseLetter,
        })),
      ],
      [caseOptions]
    );

    useEffect(() => {
      if (selectedCase !== "ALL" && !caseOptions.includes(selectedCase)) {
        setSelectedCase("ALL");
      }
    }, [caseOptions, selectedCase]);

    const filteredTypeCars = useMemo(() => {
      return (selectedType === "TH" ? thCars : sthCars).filter(
        (car) => selectedCase === "ALL" || car.caseLetter === selectedCase
      );
    }, [selectedCase, selectedType, thCars, sthCars]);

    const filteredTypeFound = useMemo(() => {
      return (selectedType === "TH" ? foundTH : foundSTH).filter(
        (car) => selectedCase === "ALL" || car.caseLetter === selectedCase
      );
    }, [selectedCase, selectedType, foundTH, foundSTH]);

    const selectedTypeCars = filteredTypeCars;
    const selectedTypeFound = filteredTypeFound;
    const selectedTypeProgress = selectedTypeCars.length > 0
      ? Math.round((selectedTypeFound.length / selectedTypeCars.length) * 100)
      : 0;
    /*
     * Reset hunt progress
     */
    const handleResetHunt = useCallback(() => {
      if (foundCars.length === 0) {
        return;
      }

      Alert.alert(
        "Reset Hunt",
        `This will remove all ${selectedYear} TH and STH finds from your hunt progress.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Reset",
            style: "destructive",
            onPress: async () => {
              for (const car of foundCars) {
                await toggleFoundId(car.id);
              }
              setFoundIds(await getFoundIds());
            },
          },
        ]
      );
    }, [foundCars, selectedYear]);

    /*
     * Car card
     */
    const renderCarCard = (car: Car) => {
      const isFound = foundIds.includes(car.id);
      const photoUri = collectionPhotos[car.id];

      return (
        <Pressable
          key={car.id}
          style={[styles.carCard, isFound ? styles.carCardFound : undefined]}
          onPress={() => void handleToggleFound(car.id)}
        >
          <View style={styles.carImage}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.carPhoto} />
            ) : (
              <View style={styles.carGraphic}>
                <MaterialCommunityIcons name="car-sports" size={42} color="#111111" />
              </View>
            )}

            {isFound ? (
              <View style={styles.foundBadge}>
                <Ionicons name="checkmark" size={16} color="#111111" />
              </View>
            ) : null}

          </View>

          <Text style={styles.carName} numberOfLines={2}>
            {car.name}
          </Text>

          <Text style={styles.carSeries}>{car.series}</Text>
        </Pressable>
      );
    };

  /*
   * Empty state
   */
  if (selectedYearCars.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              HUNT
            </Text>

            <Text style={styles.subtitle}>
              Track your Treasure Hunt finds
            </Text>
          </View>

          <Pressable
            hitSlop={10}
            onPress={() =>
              Alert.alert(
                "How Hunt Works",
                "Tap a TH or STH to mark it as found. Your progress is saved automatically."
              )
            }
          >
            <Ionicons
              name="information-circle-outline"
              size={30}
              color="#FBBF24"
            />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.yearRow}
        >
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
                    styles.yearChipText,
                    active &&
                      styles.yearChipTextActive,
                  ]}
                >
                  {year}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="car-outline"
            size={54}
            color="#FBBF24"
          />

          <Text style={styles.emptyTitle}>
            No Hunt Data
          </Text>

          <Text style={styles.emptyText}>
            No {selectedYear} Treasure Hunt data
            is available yet.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>TH HUNTER</Text>
          <Text style={styles.title}>
            HUNT
          </Text>

          <Text style={styles.subtitle}>
            Track your Treasure Hunt finds
          </Text>
        </View>

        <Pressable
          style={styles.infoButton}
          hitSlop={10}
          onPress={() =>
            Alert.alert(
              "How Hunt Works",
              "Tap a TH or STH to mark it as found. Your progress is saved automatically."
            )
          }
        >
          <Ionicons
            name="information-circle-outline"
            size={31}
            color="#FBBF24"
          />
        </Pressable>
      </View>

      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* YEAR SELECTOR */}

        <View style={styles.yearSection}>
          <Pressable
            style={styles.yearSectionHeader}
            onPress={() => setShowYearChips((visible) => !visible)}
          >
            <Text style={styles.sectionTitle}>
              HUNT YEAR
            </Text>

            <View style={styles.yearHeaderAction}>
              <Text
                style={[
                  styles.yearSelectedLabel,
                  { color: TYPE_META[selectedType].color },
                ]}
              >
                {selectedYear}
              </Text>
              <Ionicons
                name={showYearChips ? "chevron-down" : "chevron-up"}
                size={20}
                color={TYPE_META[selectedType].color}
              />
            </View>
          </Pressable>

          {showYearChips && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.yearRow}
            >
              {years.map((year) => {
                const active =
                  selectedYear === year;

                return (
                  <Pressable
                    key={year}
                    style={[
                      styles.yearChip,
                      active && {
                        backgroundColor: "#111111",
                        borderColor: TYPE_META[selectedType].color,
                      },
                    ]}
                    onPress={() =>
                      setSelectedYear(year)
                    }
                  >
                    <Text
                      style={[
                        styles.yearChipText,
                          active && {
                            color: TYPE_META[selectedType].color,
                          },
                      ]}
                    >
                      {year}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <View style={styles.typeRow}>
            {(["STH", "TH"] as HuntView[]).map((type) => {
              const active = selectedType === type;

              return (
                <Pressable
                  key={type}
                  style={[
                    styles.typeChip,
                    active && {
                      backgroundColor: TYPE_META[type].color,
                      borderColor: TYPE_META[type].color,
                    },
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      active && styles.typeChipTextActive,
                    ]}
                  >
                    {type === "TH" ? "TREASURE HUNTS" : "SUPER TREASURE HUNTS"}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.caseDropdownWrap}>
            <Pressable
              style={styles.caseDropdown}
              onPress={() => setCaseDropdownOpen(true)}
            >
              <Text style={styles.caseDropdownText}>
                {selectedCase === "ALL" ? "ALL CASES" : `CASE ${selectedCase}`}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
            </Pressable>

            <Modal
              visible={caseDropdownOpen}
              transparent
              animationType="slide"
              onRequestClose={() => setCaseDropdownOpen(false)}
            >
              <View style={styles.caseModalOverlay}>
                <Pressable
                  style={styles.caseModalBackdrop}
                  onPress={() => setCaseDropdownOpen(false)}
                />

                <View style={styles.caseModalContent}>
                  <View style={styles.caseModalHeader}>
                    <Text style={styles.caseModalTitle}>SELECT CASE</Text>
                    <Pressable
                      style={styles.caseModalClose}
                      onPress={() => setCaseDropdownOpen(false)}
                      hitSlop={8}
                    >
                      <Ionicons name="close" size={22} color="#FFFFFF" />
                    </Pressable>
                  </View>

                  <ScrollView
                    ref={caseCarouselRef}
                    onLayout={() => {
                      const selectedIndex = caseItems.findIndex(
                        (item) => item.value === selectedCase
                      );

                      caseCarouselRef.current?.scrollTo({
                        y: Math.max(selectedIndex, 0) * 56,
                        animated: false,
                      });
                    }}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={56}
                    snapToAlignment="center"
                    decelerationRate="fast"
                    contentContainerStyle={styles.caseCarousel}
                  >
                    {caseItems.map((item) => {
                      const active = item.value === selectedCase;

                      return (
                        <Pressable
                          key={item.value}
                          style={[
                            styles.caseCarouselItem,
                            active && {
                              backgroundColor: TYPE_META[selectedType].color,
                              borderColor: TYPE_META[selectedType].color,
                            },
                          ]}
                          onPress={() => {
                            setSelectedCase(item.value);
                            setCaseDropdownOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.caseCarouselText,
                              active && styles.caseCarouselTextActive,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </View>
        </View>

        {/* OVERALL PROGRESS */}

        <View
          style={[
            styles.heroCard,
            { borderColor: TYPE_META[selectedType].color },
          ]}
        >
          <View style={styles.heroTop}>
            <View>
              <Text
                style={[styles.heroEyebrow,
                  { color: TYPE_META[selectedType].color },
                ]}
              >
                {selectedYear} {TYPE_META[selectedType].title}
              </Text>

              <Text
                style={[
                  styles.heroTitle,
                  { color: TYPE_META[selectedType].color },
                ]}
              >
                {selectedTypeFound.length} / {selectedTypeCars.length}
              </Text>

              <Text
                style={styles.heroSubtitle}
              >
                {TYPE_META[selectedType].title} found
              </Text>
            </View>

            <View
                style={[
                  styles.progressCircle,
                  { borderColor: TYPE_META[selectedType].color },
                ]}
            >
              <Text
                style={
                  styles.progressCircleValue
                }
              >
                {selectedTypeProgress}%
              </Text>

              <Text
                style={
                  styles.progressCircleLabel
                }
              >
                COMPLETE
              </Text>
            </View>
          </View>

          <View style={styles.heroTrack}>
            <View
              style={[
                styles.heroFill,
                {
                  width: `${selectedTypeProgress}%`,
                  backgroundColor: TYPE_META[selectedType].color,
                },
              ]}
            />
          </View>
        </View>

        {/* NEXT TO HUNT */}

        <View
          style={[
            styles.sectionHeader,
            styles.nextSectionHeader,
          ]}
        >
          <Text style={styles.sectionTitle}>
            NEXT TO HUNT
          </Text>
        </View>

        {/* TH */}

        {selectedType === "TH" &&
        filteredMissingTH.length > 0 ? (
          <View style={styles.huntSection}>
            <View
              style={styles.huntSectionHeader}
            >
              <View
                style={[
                  styles.smallTypeIcon,
                  {
                    backgroundColor:
                      TYPE_META.TH.color,
                  },
                ]}
              >
                <Text
                  style={
                    styles.smallTypeIconText
                  }
                >
                  TH
                </Text>
              </View>

              <Text
                style={styles.huntSectionTitle}
              >
                Treasure Hunts
              </Text>

              <Text
                style={[
                  styles.huntSectionCount,
                  {
                    color:
                      TYPE_META.TH.color,
                  },
                ]}
              >
                {filteredMissingTH.length}
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.cardsRow
              }
            >
              {filteredMissingTH
                .slice(0, 10)
                .map(renderCarCard)}
            </ScrollView>
          </View>
        ) : null}

        {/* STH */}

        {selectedType === "STH" &&
        filteredMissingSTH.length > 0 ? (
          <View style={styles.huntSection}>
            <View
              style={styles.huntSectionHeader}
            >
              <View
                style={[
                  styles.smallTypeIcon,
                  {
                    backgroundColor:
                      TYPE_META.STH.color,
                  },
                ]}
              >
                <Text
                  style={
                    styles.smallTypeIconText
                  }
                >
                  STH
                </Text>
              </View>

              <Text
                style={styles.huntSectionTitle}
              >
                Super Treasure Hunts
              </Text>

              <Text
                style={[
                  styles.huntSectionCount,
                  {
                    color:
                      TYPE_META.STH.color,
                  },
                ]}
              >
                {filteredMissingSTH.length}
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.cardsRow
              }
            >
              {filteredMissingSTH
                .slice(0, 10)
                .map(renderCarCard)}
            </ScrollView>
          </View>
        ) : null}

        {/* COMPLETE */}

        {selectedTypeFound.length === selectedTypeCars.length &&
        selectedTypeCars.length > 0 ? (
          <View
            style={[
              styles.completeCard,
              { borderColor: TYPE_META[selectedType].color },
            ]}
          >
            <View
              style={[
                styles.completeIcon,
                { backgroundColor: TYPE_META[selectedType].color },
              ]}
            >
              <Ionicons
                name="checkmark"
                size={28}
                color="#111111"
              />
            </View>

            <Text
              style={styles.completeTitle}
            >
              Hunt Complete!
            </Text>

            <Text
              style={styles.completeText}
            >
              You've found every {selectedYear}{" "}
              {TYPE_META[selectedType].title}.
            </Text>
          </View>
        ) : null}

        {/* RECENT FINDS */}

        {selectedTypeFound.length > 0 ? (
          <>
            <View
              style={styles.sectionHeader}
            >
              <Text
                style={styles.sectionTitle}
              >
                YOUR FINDS
              </Text>

              <Text
                style={styles.sectionSubtitle}
              >
                {selectedTypeFound.length} found
              </Text>
            </View>

            <View
              style={styles.recentList}
            >
              {selectedTypeFound
                .slice()
                .reverse()
                .slice(0, 5)
                .map((car) => {
                  const meta =
                    TYPE_META[car.type];

                  return (
                    <Pressable
                      key={car.id}
                      style={
                        styles.recentRow
                      }
                      onPress={() =>
                        void handleToggleFound(
                          car.id
                        )
                      }
                    >
                      <View
                        style={[
                          styles.recentIcon,
                          {
                            backgroundColor:
                              meta.color,
                          },
                        ]}
                      >
                        {collectionPhotos[car.id] ? (
                          <Image
                            source={{ uri: collectionPhotos[car.id] }}
                            style={styles.recentPhoto}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="car-sports"
                            size={22}
                            color="#111111"
                          />
                        )}
                      </View>

                      <View
                        style={
                          styles.recentInfo
                        }
                      >
                        <Text
                          style={
                            styles.recentName
                          }
                          numberOfLines={1}
                        >
                          {car.name}
                        </Text>

                        <Text
                          style={
                            styles.recentMeta
                          }
                        >
                          {car.type} ·{" "}
                          {car.series}
                        </Text>
                      </View>

                      <Ionicons
                        name="checkmark-circle"
                        size={23}
                        color={meta.color}
                      />
                    </Pressable>
                  );
                })}
            </View>
          </>
        ) : null}

        {/* RESET */}

        {foundCars.length > 0 ? (
          <Pressable
            style={styles.resetButton}
            onPress={handleResetHunt}
          >
            <Ionicons
              name="refresh-outline"
              size={19}
              color="#8E8E93"
            />

            <Text
              style={styles.resetText}
            >
              Reset {selectedYear} Hunt Progress
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}