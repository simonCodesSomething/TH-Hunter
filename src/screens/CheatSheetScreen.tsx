import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { CheatSheetSection } from "../types";

const SECTIONS: CheatSheetSection[] = [
  {
    title: "Super Treasure Hunt (STH)",
    color: "#e8c400",
    points: [
      "Spectraflame paint job — a translucent, metallic finish over the base metal.",
      "Real Riders — rubber tires instead of the standard hard plastic wheels.",
      "A small green STH logo printed on the underside of the car.",
      "Never called out on the packaging with a printed flame logo the way regular TH cars are.",
    ],
  },
  {
    title: "Treasure Hunt (TH)",
    color: "#ff8c00",
    points: [
      "Look for the small flame logo printed directly on the blister card.",
      "Standard paint and wheels — the packaging callout is the main tell.",
      "Usually one TH car per case, mixed in with regular mainline cars.",
    ],
  },
  {
    title: "General shopping tips",
    color: "#34c759",
    points: [
      "Check pegs early in the week — stores typically restock early morning.",
      "Scan the whole row, not just the front — cases get mixed by other shoppers.",
      "Use the search + filter on the Browse tab to confirm a car before buying.",
    ],
  },
];

interface CheatSheetScreenProps {
  onBack: () => void;
}

export default function CheatSheetScreen({
  onBack,
}: CheatSheetScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>How to spot them</Text>
          <Pressable
            style={styles.closeButton}
            onPress={onBack}
            hitSlop={10}
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: section.color }]}>
              {section.title}
            </Text>

            {section.points.map((point) => (
              <Text key={point} style={styles.point}>
                {"\u2022"} {point}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 18,
    paddingBottom: 20,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
  },
  section: {
    backgroundColor: "#1c1c1e",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  point: {
    color: "#c7c7cc",
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
});
