import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useCarData } from "../data/CarDataProvider";
import { getFoundIds } from "../utils/storage";
import { styles } from "../styles/progress.styles";
import type { CarType } from "../types";

const COLORS: Record<CarType, string> = {
  TH: "#FBBF24",
  STH: "#EF4444",
};

type Stats = { found: number; total: number; percent: number };

function percentage(found: number, total: number): number {
  return total > 0 ? Math.round((found / total) * 100) : 0;
}

function ProgressBar({ percent, color, thin = false }: { percent: number; color: string; thin?: boolean }) {
  return (
    <View style={[styles.track, thin && styles.trackThin]}>
      <View style={[styles.trackFill, { width: `${Math.max(0, Math.min(percent, 100))}%`, backgroundColor: color }]} />
    </View>
  );
}

function TypeProgress({ title, color, stats }: { title: string; color: string; stats: Stats }) {
  return (
    <View style={styles.typeBlock}>
      <View style={styles.typeTop}>
        <View style={styles.typeInfo}>
          <Text style={[styles.typeName, { color }]}>{title}</Text>
          <Text style={styles.typeCount}>{stats.found} of {stats.total} collected</Text>
        </View>
        <Text style={[styles.typePercent, { color }]}>{stats.percent}%</Text>
      </View>
      <ProgressBar percent={stats.percent} color={color} />
    </View>
  );
}

type IconName = keyof typeof Ionicons.glyphMap;

function Milestone({
  icon,
  title,
  progress,
  unlocked,
}: {
  icon: IconName;
  title: string;
  progress: string;
  unlocked: boolean;
}) {
  return (
    <View style={[styles.milestone, unlocked && styles.milestoneUnlocked]}>
      <Ionicons name={icon} size={23} color={unlocked ? "#FBBF24" : "#85858D"} />
      <Text style={styles.milestoneName} numberOfLines={2}>{title}</Text>
      <View style={styles.milestoneState}>
        <Ionicons
          name={unlocked ? "checkmark-circle" : "lock-closed-outline"}
          size={12}
          color={unlocked ? "#FBBF24" : "#85858D"}
        />
        <Text style={[styles.milestoneProgress, unlocked && styles.milestoneProgressUnlocked]} numberOfLines={1}>
          {unlocked ? "Unlocked" : progress}
        </Text>
      </View>
    </View>
  );
}

interface ProgressScreenProps {
  onClose: () => void;
}

export default function ProgressScreen({ onClose }: ProgressScreenProps) {
  const { cars } = useCarData();
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    void getFoundIds().then((ids) => {
      if (mounted) setFoundIds(ids);
    });
    return () => { mounted = false; };
  }, []);

  const foundSet = useMemo(() => new Set(foundIds), [foundIds]);
  const years = useMemo(
    () => [...new Set(cars.map((car) => car.year))].sort((a, b) => b - a),
    [cars]
  );

  useEffect(() => {
    const calendarYear = new Date().getFullYear();
    const defaultYear = years.includes(calendarYear) ? calendarYear : (years[0] ?? null);
    setSelectedYear((previous) =>
      previous !== null && years.includes(previous) ? previous : defaultYear
    );
  }, [years]);

  const activeYear = selectedYear !== null && years.includes(selectedYear)
    ? selectedYear
    : (years.includes(new Date().getFullYear()) ? new Date().getFullYear() : (years[0] ?? null));

  const overall = useMemo<Stats>(() => {
    const found = cars.filter((car) => foundSet.has(car.id)).length;
    return { found, total: cars.length, percent: percentage(found, cars.length) };
  }, [cars, foundSet]);

  const selectedYearStats = useMemo<Stats>(() => {
    const matching = cars.filter((car) => car.year === activeYear);
    const found = matching.filter((car) => foundSet.has(car.id)).length;
    return { found, total: matching.length, percent: percentage(found, matching.length) };
  }, [cars, foundSet, activeYear]);

  const byType = useMemo(() => {
    const result = {} as Record<CarType, Stats>;
    for (const type of ["TH", "STH"] as CarType[]) {
      const matching = cars.filter((car) => car.year === activeYear && car.type === type);
      const found = matching.filter((car) => foundSet.has(car.id)).length;
      result[type] = { found, total: matching.length, percent: percentage(found, matching.length) };
    }
    return result;
  }, [cars, foundSet, activeYear]);

  const allTypeStats = useMemo(() => {
    const result = {} as Record<CarType, Stats>;
    for (const type of ["TH", "STH"] as CarType[]) {
      const matching = cars.filter((car) => car.type === type);
      const found = matching.filter((car) => foundSet.has(car.id)).length;
      result[type] = { found, total: matching.length, percent: percentage(found, matching.length) };
    }
    return result;
  }, [cars, foundSet]);

  const milestones = [
    { icon: "trophy-outline" as IconName, title: "First Find", target: 1 },
    { icon: "car-sport-outline" as IconName, title: "10 Cars", target: 10 },
    { icon: "layers-outline" as IconName, title: "25 Cars", target: 25 },
    { icon: "star-outline" as IconName, title: "50 Cars", target: 50 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>TH HUNTER</Text>
          <Text style={styles.title}>PROGRESS</Text>
          <Text style={styles.subtitle}>Your collection at a glance</Text>
        </View>
        <Pressable style={styles.closeButton} onPress={onClose} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close progress">
          <Ionicons name="close" size={27} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardEyebrow}>OVERALL COLLECTION</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryLeft}>
              <View style={styles.summaryNumbers}>
                <Text style={styles.summaryFound}>{overall.found}</Text>
                <Text style={styles.summaryTotal}> / {overall.total}</Text>
              </View>
              <Text style={styles.summaryCaption}>Cars collected across all years</Text>
            </View>
            <Text style={styles.summaryPercent}>{overall.percent}%</Text>
          </View>
          <ProgressBar percent={overall.percent} color="#FBBF24" />
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>{activeYear === null ? "YEAR COLLECTION" : `${activeYear} COLLECTION`}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.yearSelector}>
          {years.map((year) => {
            const active = year === activeYear;
            return (
              <Pressable
                key={year}
                style={[styles.yearChip, active && styles.yearChipActive]}
                onPress={() => setSelectedYear(year)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.yearChipText, active && styles.yearChipTextActive]}>{year}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.yearProgressCard}>
          <View style={styles.yearProgressTop}>
            <Text style={styles.yearProgressCount}>
              {selectedYearStats.found} of {selectedYearStats.total} collected
            </Text>
            <Text style={styles.yearProgressPercent}>{selectedYearStats.percent}%</Text>
          </View>
          <ProgressBar percent={selectedYearStats.percent} color="#FBBF24" />
        </View>
        <View style={styles.typeCard}>
          <TypeProgress title="TREASURE HUNTS" color={COLORS.TH} stats={byType.TH} />
          <View style={styles.cardDivider} />
          <TypeProgress title="SUPER TREASURE HUNTS" color={COLORS.STH} stats={byType.STH} />
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>MILESTONES</Text>
        </View>
        <View style={styles.milestoneGrid}>
          {milestones.map((milestone) => (
            <Milestone
              key={milestone.title}
              icon={milestone.icon}
              title={milestone.title}
              unlocked={overall.found >= milestone.target}
              progress={`${Math.max(milestone.target - overall.found, 0)} to go`}
            />
          ))}
          <Milestone
            icon="flame-outline"
            title="All TH"
            unlocked={allTypeStats.TH.total > 0 && allTypeStats.TH.found === allTypeStats.TH.total}
            progress={`${allTypeStats.TH.found}/${allTypeStats.TH.total}`}
          />
          <Milestone
            icon="diamond-outline"
            title="All STH"
            unlocked={allTypeStats.STH.total > 0 && allTypeStats.STH.found === allTypeStats.STH.total}
            progress={`${allTypeStats.STH.found}/${allTypeStats.STH.total}`}
          />
        </View>
      </ScrollView>
    </View>
  );
}
