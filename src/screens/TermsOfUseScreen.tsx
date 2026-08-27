import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TermsOfUseScreenProps {
  onBack: () => void;
}

export default function TermsOfUseScreen({
  onBack,
}: TermsOfUseScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>TH HUNTER</Text>
            <Text style={styles.title}>TERMS OF USE</Text>
          </View>
          <Pressable style={styles.closeButton} onPress={onBack} hitSlop={10}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        <Text style={styles.updated}>Last updated: August 26, 2026</Text>

        <Text style={styles.body}>
          By using Hot Wheels Hunter, you agree to use the app responsibly and
          accept these terms.
        </Text>

        <Section title="Personal use">
          Hot Wheels Hunter is provided for personal collection tracking and
          reference. You may use the app and its features on your own device.
        </Section>

        <Section title="Your content">
          You are responsible for the photos and other information you add to
          the app. Keep your own backup of anything important because uninstalling
          the app or clearing its data may remove locally stored content.
        </Section>

        <Section title="Information and availability">
          Identification tips and collection information are provided for
          convenience and may contain errors or become outdated. The app is
          provided as available, without a guarantee that every feature or piece
          of information will always be available or accurate.
        </Section>

        <Section title="Third-party services">
          Links to external services, including support links, are provided for
          convenience. Those services have their own terms and policies.
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
