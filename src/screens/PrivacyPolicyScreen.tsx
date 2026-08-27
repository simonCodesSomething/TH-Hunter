import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export default function PrivacyPolicyScreen({
  onBack,
}: PrivacyPolicyScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>TH HUNTER</Text>
            <Text style={styles.title}>PRIVACY POLICY</Text>
          </View>
          <Pressable style={styles.closeButton} onPress={onBack} hitSlop={10}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        <Text style={styles.updated}>Last updated: August 26, 2026</Text>

        <Text style={styles.body}>
          Hot Wheels Hunter is designed to keep your collection information on
          your device. This policy explains what the app stores and how it is
          used.
        </Text>

        <Section title="Information stored on your device">
          The app stores your found-car selections, and any collection photos
          you choose, locally on your device. These items are used only to show
          your collection and progress.
        </Section>

        <Section title="Photos">
          Photos are selected through your device photo library. Hot Wheels
          Hunter does not upload your photos to a server or share them with us.
        </Section>

        <Section title="Data sharing">
          The app does not sell, rent, or share your collection data. Opening an
          external support link may be handled by your browser and is subject to
          that service's privacy policy.
        </Section>

        <Section title="Changes to this policy">
          This policy may be updated as the app changes. The latest version will
          be included in the app.
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { padding: 18, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  eyebrow: {
    color: "#FBBF24",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
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
  updated: { color: "#77777C", fontSize: 11, marginBottom: 18 },
  section: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#292929",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 6,
  },
  body: { color: "#A1A1A6", fontSize: 14, lineHeight: 21 },
});
