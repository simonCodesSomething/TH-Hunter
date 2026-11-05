import React from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AboutScreenProps {
  onCheatSheetPress: () => void;
  onPrivacyPress: () => void;
  onTermsPress: () => void;
}

export default function AboutScreen({
  onCheatSheetPress,
  onPrivacyPress,
  onTermsPress,
}: AboutScreenProps) {
  const openCoffeeLink = () => {
    void Linking.openURL("https://buymeacoffee.com/scan.minifigs");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>TH HUNTER</Text>
            <Text style={styles.title}>APP INFO</Text>
            <Text style={styles.subtitle}>
              Your pocket guide for Treasure Hunt collecting.
            </Text>
          </View>
          <View style={styles.infoButton}>
            <Ionicons
              name="information-circle-outline"
              size={31}
              color="#FBBF24"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <Pressable
            style={({ pressed }) => [styles.supportCard, pressed && styles.pressed]}
            onPress={openCoffeeLink}
          >
            <View style={styles.supportIcon}>
              <Ionicons name="cafe-outline" size={23} color="#111111" />
            </View>
            <View style={styles.linkInfo}>
              <Text style={styles.linkTitle}>Support TH Hunter</Text>
              <Text style={styles.linkSubtitle}>
                Help keep the app updated with new Treasure Hunts.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#64748B" />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="list-outline"
              label="Treasure Hunt Cheat Sheet"
              onPress={onCheatSheetPress}
            />
            <View style={styles.itemDivider} />
            <MenuItem
              icon="shield-checkmark-outline"
              label="Privacy Policy"
              onPress={onPrivacyPress}
            />
            <View style={styles.itemDivider} />
            <MenuItem
              icon="document-text-outline"
              label="Terms of Use"
              onPress={onTermsPress}
            />
          </View>
        </View>

        <Text style={styles.footer}>
          Your collection data stays on this device.
        </Text>
      </ScrollView>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
    >
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={23} color="#FBBF24" />
      </View>
      <Text style={styles.menuText}>{label}</Text>
      <Ionicons name="chevron-forward" size={22} color="#64748B" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingBottom: 28,
  },
  eyebrow: {
    color: "#FBBF24",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
  },
  subtitle: {
    maxWidth: 245,
    color: "#A1A1A6",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  infoButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 9,
  },
  supportCard: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 12,
  },
  supportIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBBF24",
    marginRight: 12,
  },
  menuCard: {
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  menuIcon: {
    width: 38,
    alignItems: "flex-start",
  },
  menuText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  itemDivider: {
    height: 1,
    backgroundColor: "#292929",
    marginLeft: 52,
  },
  pressed: {
    opacity: 0.7,
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  linkSubtitle: {
    color: "#77777C",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  footer: {
    color: "#55555A",
    fontSize: 11,
    textAlign: "center",
    marginTop: 28,
  },
});
