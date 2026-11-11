import React, { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../styles/about.styles";
import { resetStyles } from "../styles/aboutReset.styles";
import { resetEntireCollection } from "../utils/storage";

interface AboutScreenProps {
  onCheatSheetPress: () => void;
  onPrivacyPress: () => void;
  onTermsPress: () => void;
  onSupportPress?: () => void;
  supportEnabled?: boolean;
  onPrivacyOptionsPress?: () => void;
  privacyOptionsRequired?: boolean;
  /** Optional: refresh collection-related screens immediately after reset. */
  onCollectionReset?: () => void;
}

export default function AboutScreen({
  onCheatSheetPress,
  onPrivacyPress,
  onTermsPress,
  onSupportPress,
  supportEnabled = false,
  onPrivacyOptionsPress,
  privacyOptionsRequired = false,
  onCollectionReset,
}: AboutScreenProps) {
  const [resetting, setResetting] = useState(false);
  const canSupport = supportEnabled && !!onSupportPress;
  const showPrivacyOptions = privacyOptionsRequired && !!onPrivacyOptionsPress;

  const confirmReset = useCallback(() => {
    if (resetting) return;

    Alert.alert(
      "Reset Entire Collection?",
      "This will permanently clear all collected TH and STH cars and duplicate quantities across every year. Your personal photos and catalog data will be kept. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Collection",
          style: "destructive",
          onPress: () => {
            setResetting(true);
            void (async () => {
              try {
                await resetEntireCollection();
                onCollectionReset?.();
                Alert.alert(
                  "Collection Reset",
                  "All collected cars and saved quantities have been cleared. Your photos were kept."
                );
              } catch (error) {
                console.error("[About] Collection reset failed:", error);
                Alert.alert(
                  "Reset Failed",
                  "Could not reset the collection. Please try again."
                );
              } finally {
                setResetting(false);
              }
            })();
          },
        },
      ]
    );
  }, [resetting, onCollectionReset]);

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
            <Ionicons name="information-circle-outline" size={31} color="#FBBF24" />
          </View>
        </View>

        {/* SUPPORT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <Pressable
            disabled={!canSupport}
            onPress={onSupportPress}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSupport }}
            style={({ pressed }) => [
              styles.supportCard,
              pressed && canSupport && styles.pressed,
            ]}
          >
            <View style={styles.supportIcon}>
              <Ionicons name="heart-outline" size={23} color="#111111" />
            </View>
            <View style={styles.linkInfo}>
              <Text style={styles.linkTitle}>Support TH Hunter</Text>
              <Text style={styles.linkSubtitle}>
                Help keep TH Hunter updated with new Treasure Hunts.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#64748B" />
          </Pressable>
        </View>

        {/* ABOUT */}
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
            {showPrivacyOptions && (
              <>
                <View style={styles.itemDivider} />
                <MenuItem
                  icon="options-outline"
                  label="Privacy choices"
                  onPress={onPrivacyOptionsPress!}
                />
              </>
            )}
            <View style={styles.itemDivider} />
            <MenuItem
              icon="document-text-outline"
              label="Terms of Use"
              onPress={onTermsPress}
            />
          </View>
        </View>

        {/* DATA MANAGEMENT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA MANAGEMENT</Text>
          <View style={resetStyles.card}>
            <Pressable
              onPress={confirmReset}
              disabled={resetting}
              accessibilityRole="button"
              accessibilityLabel="Reset entire collection"
              accessibilityHint="Clears found cars and quantities across all years, but retains your photos"
              accessibilityState={{ disabled: resetting }}
              style={({ pressed }) => [
                resetStyles.action,
                pressed && resetStyles.actionPressed,
                resetting && resetStyles.disabled,
              ]}
            >
              <View style={resetStyles.iconWrap}>
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
              </View>
              <View style={resetStyles.info}>
                <Text style={resetStyles.label}>
                  {resetting ? "Resetting Collection…" : "Reset Entire Collection"}
                </Text>
                <Text style={resetStyles.description}>
                  Clear all found cars and duplicate quantities. Photos are kept.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#64748B" />
            </Pressable>
          </View>
        </View>

        <Text style={styles.footer}>Your collection data stays on this device.</Text>
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
      accessibilityRole="button"
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
