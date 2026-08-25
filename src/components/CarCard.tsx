import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

import type { Car, CarType } from "../types";

const TYPE_COLORS: Record<CarType, string> = {
  TH: "#ff8c00",
  STH: "#e8c400",
};

interface CarCardProps {
  car: Car;
  isFound: boolean;
  onToggleFound: () => void;
}

export default function CarCard({
  car,
  isFound,
  onToggleFound,
}: CarCardProps) {
  const badgeColor = TYPE_COLORS[car.type] ?? "#888";

  return (
    <Pressable style={styles.card} onPress={onToggleFound}>
      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        <Text style={styles.badgeText}>{car.type}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{car.name}</Text>
        <Text style={styles.meta}>
          {car.series} · Case {car.caseLetter}
        </Text>
        <Text style={styles.tips} numberOfLines={2}>
          {car.idTips}
        </Text>
      </View>

      <View style={[styles.checkbox, isFound && styles.checkboxChecked]}>
        {isFound ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  badgeText: {
    fontWeight: "700",
    fontSize: 12,
    color: "#111",
  },
  info: {
    flex: 1,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    color: "#9a9a9e",
    fontSize: 12,
    marginTop: 2,
  },
  tips: {
    color: "#c7c7cc",
    fontSize: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#555",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  checkboxChecked: {
    backgroundColor: "#34c759",
    borderColor: "#34c759",
  },
  checkmark: {
    color: "#111",
    fontWeight: "700",
  },
});
