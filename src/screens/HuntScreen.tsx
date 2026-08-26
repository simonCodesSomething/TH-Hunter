
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import carData from "../data/thstData.json";
import {
  getFoundIds,
  toggleFoundId,
} from "../utils/storage";
import { styles } from "../styles/hunt.styles";

type CarType = "TH" | "STH";

interface Car {
  id: string;
  name: string;
  type: CarType;
  series: string;
  caseLetter: string;
  imageKey: string;
  idTips: string;
  year?: number;
}

const cars = carData as Car[];

const CURRENT_YEAR = 2026;

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
  const [foundIds, setFoundIds] = useState<string[]>([]);

  /*
   * Load saved hunt progress
   */
  useEffect(() => {
    const loadProgress = async () => {
      const ids = await getFoundIds();
      setFoundIds(ids);
    };

    void loadProgress();
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
   * Current year cars
   */
  const currentYearCars = useMemo(() => {
    return cars.filter(
      (car) => (car.year ?? CURRENT_YEAR) === CURRENT_YEAR
    );
  }, []);

  /*
   * TH cars
   */
  const thCars = useMemo(() => {
    return currentYearCars.filter(
      (car) => car.type === "TH"
    );
  }, [currentYearCars]);

  /*
   * STH cars
   */
  const sthCars = useMemo(() => {
    return currentYearCars.filter(
      (car) => car.type === "STH"
    );
  }, [currentYearCars]);

  /*
   * Found cars
   */
  const foundCars = useMemo(() => {
    return currentYearCars.filter((car) =>
      foundIds.includes(car.id)
    );
  }, [currentYearCars, foundIds]);

  /*
   * Found TH
   */
  const foundTH = useMemo(() => {
    return thCars.filter((car) =>
      foundIds.includes(car.id)
    );
  }, [thCars, foundIds]);

  /*
   * Found STH
   */
  const foundSTH = useMemo(() => {
    return sthCars.filter((car) =>
      foundIds.includes(car.id)
    );
  }, [sthCars, foundIds]);

  /*
   * Missing TH
   */
  const missingTH = useMemo(() => {
    return thCars.filter(
      (car) => !foundIds.includes(car.id)
    );
  }, [thCars, foundIds]);

  /*
   * Missing STH
   */
  const missingSTH = useMemo(() => {
    return sthCars.filter(
      (car) => !foundIds.includes(car.id)
    );
  }, [sthCars, foundIds]);

  /*
   * Overall progress
   */
  const totalCars = thCars.length + sthCars.length;
  const totalFound = foundTH.length + foundSTH.length;

  const overallProgress =
    totalCars > 0
      ? Math.round((totalFound / totalCars) * 100)
      : 0;

  /*
   * TH progress
   */
  const thProgress =
    thCars.length > 0
      ? Math.round(
          (foundTH.length / thCars.length) * 100
        )
      : 0;

  /*
   * STH progress
   */
  const sthProgress =
    sthCars.length > 0
      ? Math.round(
          (foundSTH.length / sthCars.length) * 100
        )
      : 0;

  /*
   * Reset hunt progress
   */
  const handleResetHunt = useCallback(() => {
    Alert.alert(
      "Reset Hunt",
      "This will remove all TH and STH finds from your hunt progress.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            for (const car of foundCars) {
              await toggleFoundId(car.id);
            }

            const nextIds = await getFoundIds();
            setFoundIds(nextIds);
          },
        },
      ]
    );
  }, [foundCars]);

  /*
   * Car card
   */
  const renderCarCard = (car: Car) => {
    const isFound = foundIds.includes(car.id);
    const meta = TYPE_META[car.type];

    return (
      <Pressable
        key={car.id}
        style={[
          styles.carCard,
          isFound
            ? styles.carCardFound
            : undefined,
        ]}
        onPress={() =>
          void handleToggleFound(car.id)
        }
      >
        <View style={styles.carImage}>
          <View style={styles.carGraphic}>
            <MaterialCommunityIcons
              name="car-sports"
              size={42}
              color="#111111"
            />
          </View>

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

          {isFound ? (
            <View style={styles.foundBadge}>
              <Ionicons
                name="checkmark"
                size={16}
                color="#111111"
              />
            </View>
          ) : null}
        </View>

        <Text
          style={styles.carName}
          numberOfLines={2}
        >
          {car.name}
        </Text>

        <Text style={styles.carSeries}>
          {car.series}
        </Text>
      </Pressable>
    );
  };

  /*
   * Progress card
   */
  const renderProgressCard = (
    type: CarType,
    total: number,
    found: number,
    progress: number
  ) => {
    const meta = TYPE_META[type];

    return (
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View
            style={[
              styles.progressIcon,
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
          </View>

          <View
            style={styles.progressTitleContainer}
          >
            <Text
              style={[
                styles.progressTitle,
                {
                  color: meta.color,
                },
              ]}
            >
              {meta.title}
            </Text>

            <Text
              style={styles.progressSubtitle}
            >
              {found} of {total} found
            </Text>
          </View>

          <Text
            style={[
              styles.progressPercentage,
              {
                color: meta.color,
              },
            ]}
          >
            {progress}%
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: meta.color,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  /*
   * Empty state
   */
  if (totalCars === 0) {
    return (
      <View style={styles.container}>
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
            No {CURRENT_YEAR} Treasure Hunt data is
            available yet.
          </Text>
        </View>
      </View>
    );
  }

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}



        {/* OVERALL PROGRESS */}

        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text
                style={styles.heroEyebrow}
              >
                {CURRENT_YEAR} HUNT
              </Text>

              <Text style={styles.heroTitle}>
                {totalFound} / {totalCars}
              </Text>

              <Text
                style={styles.heroSubtitle}
              >
                Treasure Hunts collected
              </Text>
            </View>

            <View
              style={styles.progressCircle}
            >
              <Text
                style={
                  styles.progressCircleValue
                }
              >
                {overallProgress}%
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
                  width: `${overallProgress}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* YOUR PROGRESS */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            YOUR PROGRESS
          </Text>

          <Text
            style={styles.sectionSubtitle}
          >
            {CURRENT_YEAR} Treasure Hunts
          </Text>
        </View>

        {renderProgressCard(
          "TH",
          thCars.length,
          foundTH.length,
          thProgress
        )}

        {renderProgressCard(
          "STH",
          sthCars.length,
          foundSTH.length,
          sthProgress
        )}

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

          <Text
            style={styles.sectionSubtitle}
          >
            Cars still missing
          </Text>
        </View>

        {/* TH */}

        {missingTH.length > 0 ? (
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
                {missingTH.length}
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
              {missingTH
                .slice(0, 10)
                .map(renderCarCard)}
            </ScrollView>
          </View>
        ) : null}

        {/* STH */}

        {missingSTH.length > 0 ? (
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
                {missingSTH.length}
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
              {missingSTH
                .slice(0, 10)
                .map(renderCarCard)}
            </ScrollView>
          </View>
        ) : null}

        {/* COMPLETE */}

        {totalFound === totalCars ? (
          <View style={styles.completeCard}>
            <View
              style={styles.completeIcon}
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
              You've found every{" "}
              {CURRENT_YEAR} TH and STH.
            </Text>
          </View>
        ) : null}

        {/* RECENT FINDS */}

        {foundCars.length > 0 ? (
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
                {foundCars.length} found
              </Text>
            </View>

            <View
              style={styles.recentList}
            >
              {foundCars
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
                        <MaterialCommunityIcons
                          name="car-sports"
                          size={22}
                          color="#111111"
                        />
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

        {foundIds.length > 0 ? (
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
              Reset Hunt Progress
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}
