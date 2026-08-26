import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import carData from "../data/thstData.json";
import { getFoundIds } from "../utils/storage";
import { styles } from "../styles/progress.styles";

type CarType = "TH" | "STH";

interface Car {
  id: string;
  name: string;
  type: CarType;
  year: number;
  series: string;
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

export default function ProgressScreen() {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(
    null
  );

  /*
   * Load collection progress
   */
  useEffect(() => {
    void getFoundIds().then(setFoundIds);
  }, []);

  /*
   * Available years
   */
  const years = useMemo(() => {
    return [...new Set(typedCarData.map((car) => car.year))].sort(
      (a, b) => b - a
    );
  }, []);

  /*
   * Default to newest year
   */
  useEffect(() => {
    if (
      selectedYear === null &&
      years.length > 0
    ) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  const currentYear = selectedYear ?? 2026;

  /*
   * Overall collection
   *
   * This intentionally includes every year.
   */
  const totalCars = typedCarData.length;

  const totalFound = useMemo(() => {
    return typedCarData.filter((car) =>
      foundIds.includes(car.id)
    ).length;
  }, [foundIds]);

  const overallPercentage =
    totalCars > 0
      ? Math.round((totalFound / totalCars) * 100)
      : 0;

  /*
   * Cars for selected year
   */
  const selectedYearCars = useMemo(() => {
    return typedCarData.filter(
      (car) => car.year === currentYear
    );
  }, [currentYear]);

  /*
   * Selected year TH
   */
  const thCars = useMemo(() => {
    return selectedYearCars.filter(
      (car) => car.type === "TH"
    );
  }, [selectedYearCars]);

  /*
   * Selected year STH
   */
  const sthCars = useMemo(() => {
    return selectedYearCars.filter(
      (car) => car.type === "STH"
    );
  }, [selectedYearCars]);

  /*
   * Selected year found TH
   */
  const thFound = useMemo(() => {
    return thCars.filter((car) =>
      foundIds.includes(car.id)
    );
  }, [thCars, foundIds]);

  /*
   * Selected year found STH
   */
  const sthFound = useMemo(() => {
    return sthCars.filter((car) =>
      foundIds.includes(car.id)
    );
  }, [sthCars, foundIds]);

  /*
   * Selected year stats
   */
  const currentYearFound =
    thFound.length + sthFound.length;

  const currentYearTotal =
    thCars.length + sthCars.length;

  const currentYearPercentage =
    currentYearTotal > 0
      ? Math.round(
          (currentYearFound / currentYearTotal) * 100
        )
      : 0;

  /*
   * Type percentages
   */
  const thPercentage =
    thCars.length > 0
      ? Math.round(
          (thFound.length / thCars.length) * 100
        )
      : 0;

  const sthPercentage =
    sthCars.length > 0
      ? Math.round(
          (sthFound.length / sthCars.length) * 100
        )
      : 0;

  /*
   * Year statistics
   */
  const getYearStats = (year: number) => {
    const cars = typedCarData.filter(
      (car) => car.year === year
    );

    const found = cars.filter((car) =>
      foundIds.includes(car.id)
    );

    return {
      total: cars.length,
      found: found.length,
      percentage:
        cars.length > 0
          ? Math.round(
              (found.length / cars.length) * 100
            )
          : 0,
    };
  };

  /*
   * Completed years
   */
  const completedYears = years.filter((year) => {
    const stats = getYearStats(year);

    return (
      stats.total > 0 &&
      stats.found === stats.total
    );
  });

  /*
   * Completion milestones
   */
  const allTHCars = typedCarData.filter(
    (car) => car.type === "TH"
  );

  const allSTHCars = typedCarData.filter(
    (car) => car.type === "STH"
  );

  const allTHFound = allTHCars.filter((car) =>
    foundIds.includes(car.id)
  );

  const allSTHFound = allSTHCars.filter((car) =>
    foundIds.includes(car.id)
  );

  const completedTH =
    allTHCars.length > 0 &&
    allTHFound.length === allTHCars.length;

  const completedSTH =
    allSTHCars.length > 0 &&
    allSTHFound.length === allSTHCars.length;

  return (
    <View
      style={styles.container}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            PROGRESS
          </Text>

          <Text style={styles.subtitle}>
            Track your collection journey
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="stats-chart"
            size={23}
            color="#FBBF24"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* YEAR SELECTOR */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            SELECT YEAR
          </Text>

          <Text style={styles.sectionSubtitle}>
            View progress by release year
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.yearSelector}
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

        {/* OVERALL */}

        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroEyebrow}>
                ALL YEARS
              </Text>

              <Text style={styles.heroTitle}>
                {overallPercentage}%
              </Text>

              <Text style={styles.heroSubtitle}>
                {totalFound} of {totalCars} cars
                collected
              </Text>
            </View>

            <View style={styles.heroCircle}>
              <Text
                style={styles.heroCircleValue}
              >
                {overallPercentage}
              </Text>

              <Text
                style={styles.heroCircleLabel}
              >
                PERCENT
              </Text>
            </View>
          </View>

          <View style={styles.heroTrack}>
            <View
              style={[
                styles.heroFill,
                {
                  width: `${overallPercentage}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* SELECTED YEAR */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {currentYear} PROGRESS
          </Text>

          <Text style={styles.sectionSubtitle}>
            Your {currentYear} Treasure Hunt
            collection
          </Text>
        </View>

        <View style={styles.yearHeroCard}>
          <View style={styles.yearHeroTop}>
            <View style={styles.yearIcon}>
              <MaterialCommunityIcons
                name="calendar-star"
                size={25}
                color="#111111"
              />
            </View>

            <View style={styles.yearInfo}>
              <Text style={styles.yearTitle}>
                {currentYear} Collection
              </Text>

              <Text style={styles.yearSubtitle}>
                {currentYearFound} of{" "}
                {currentYearTotal} collected
              </Text>
            </View>

            <Text style={styles.yearPercentage}>
              {currentYearPercentage}%
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${currentYearPercentage}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* TYPE PROGRESS */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            BY TYPE
          </Text>

          <Text style={styles.sectionSubtitle}>
            {currentYear} Treasure Hunts
          </Text>
        </View>

        <ProgressCard
          title={TYPE_META.TH.title}
          color={TYPE_META.TH.color}
          icon={TYPE_META.TH.icon}
          found={thFound.length}
          total={thCars.length}
          percentage={thPercentage}
        />

        <ProgressCard
          title={TYPE_META.STH.title}
          color={TYPE_META.STH.color}
          icon={TYPE_META.STH.icon}
          found={sthFound.length}
          total={sthCars.length}
          percentage={sthPercentage}
        />

        {/* YEAR HISTORY */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            YEAR BY YEAR
          </Text>

          <Text style={styles.sectionSubtitle}>
            Collection progress by release year
          </Text>
        </View>

        <View style={styles.yearList}>
          {years.map((year) => {
            const stats = getYearStats(year);
            const active =
              selectedYear === year;

            return (
              <Pressable
                key={year}
                style={[
                  styles.yearRow,
                  active &&
                    styles.yearRowActive,
                ]}
                onPress={() =>
                  setSelectedYear(year)
                }
              >
                <View
                  style={styles.yearRowLeft}
                >
                  <View
                    style={[
                      styles.yearDot,
                      stats.percentage === 100 &&
                        styles.yearDotComplete,
                    ]}
                  >
                    {stats.percentage ===
                      100 && (
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color="#111111"
                      />
                    )}
                  </View>

                  <View
                    style={styles.yearRowInfo}
                  >
                    <Text
                      style={
                        styles.yearRowTitle
                      }
                    >
                      {year}
                    </Text>

                    <Text
                      style={
                        styles.yearRowSubtitle
                      }
                    >
                      {stats.found} of{" "}
                      {stats.total} collected
                    </Text>
                  </View>
                </View>

                <View
                  style={styles.yearRowRight}
                >
                  <Text
                    style={
                      styles.yearRowPercentage
                    }
                  >
                    {stats.percentage}%
                  </Text>

                  <View
                    style={styles.miniTrack}
                  >
                    <View
                      style={[
                        styles.miniFill,
                        {
                          width: `${stats.percentage}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* MILESTONES */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            MILESTONES
          </Text>

          <Text style={styles.sectionSubtitle}>
            Collection achievements
          </Text>
        </View>

        <View style={styles.milestoneGrid}>
          <Milestone
            icon="trophy-outline"
            title="First Find"
            text={
              totalFound > 0
                ? "Unlocked"
                : "Collect your first car"
            }
            unlocked={totalFound > 0}
          />

          <Milestone
            icon="car-outline"
            title="10 Cars"
            text={
              totalFound >= 10
                ? "Unlocked"
                : `${10 - totalFound} more to go`
            }
            unlocked={totalFound >= 10}
          />

          <Milestone
            icon="layers-outline"
            title="25 Cars"
            text={
              totalFound >= 25
                ? "Unlocked"
                : `${Math.max(
                    25 - totalFound,
                    0
                  )} more to go`
            }
            unlocked={totalFound >= 25}
          />

          <Milestone
            icon="star-outline"
            title="50 Cars"
            text={
              totalFound >= 50
                ? "Unlocked"
                : `${Math.max(
                    50 - totalFound,
                    0
                  )} more to go`
            }
            unlocked={totalFound >= 50}
          />

          <Milestone
            icon="flame-outline"
            title="All TH"
            text={
              completedTH
                ? "Collection complete"
                : `${allTHFound.length} of ${allTHCars.length}`
            }
            unlocked={completedTH}
          />

          <Milestone
            icon="diamond-outline"
            title="All STH"
            text={
              completedSTH
                ? "Collection complete"
                : `${allSTHFound.length} of ${allSTHCars.length}`
            }
            unlocked={completedSTH}
          />
        </View>

        {/* COMPLETED YEARS */}

        {completedYears.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                COMPLETED YEARS
              </Text>

              <Text
                style={styles.sectionSubtitle}
              >
                Years you've completely collected
              </Text>
            </View>

            <View
              style={styles.completedYears}
            >
              {completedYears.map((year) => (
                <Pressable
                  key={year}
                  style={styles.completedYear}
                  onPress={() =>
                    setSelectedYear(year)
                  }
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#FBBF24"
                  />

                  <Text
                    style={
                      styles.completedYearText
                    }
                  >
                    {year}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

/*
 * TYPE PROGRESS CARD
 */

interface ProgressCardProps {
  title: string;
  color: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  found: number;
  total: number;
  percentage: number;
}

function ProgressCard({
  title,
  color,
  icon,
  found,
  total,
  percentage,
}: ProgressCardProps) {
  return (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <View
          style={[
            styles.progressIcon,
            {
              backgroundColor: color,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={23}
            color="#111111"
          />
        </View>

        <View style={styles.progressInfo}>
          <Text
            style={[
              styles.progressTitle,
              { color },
            ]}
          >
            {title}
          </Text>

          <Text style={styles.progressSubtitle}>
            {found} of {total} collected
          </Text>
        </View>

        <Text
          style={[
            styles.progressPercentage,
            { color },
          ]}
        >
          {percentage}%
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

/*
 * MILESTONE
 */

interface MilestoneProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
  unlocked: boolean;
}

function Milestone({
  icon,
  title,
  text,
  unlocked,
}: MilestoneProps) {
  return (
    <View
      style={[
        styles.milestone,
        unlocked &&
          styles.milestoneUnlocked,
      ]}
    >
      <View
        style={[
          styles.milestoneIcon,
          unlocked &&
            styles.milestoneIconUnlocked,
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={
            unlocked
              ? "#111111"
              : "#77777C"
          }
        />
      </View>

      <Text style={styles.milestoneTitle}>
        {title}
      </Text>

      <Text style={styles.milestoneText}>
        {text}
      </Text>
    </View>
  );
}