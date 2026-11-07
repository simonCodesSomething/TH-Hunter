
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../styles/about.styles";

interface AboutScreenProps {
  onCheatSheetPress: () => void;
  onPrivacyPress: () => void;
  onTermsPress: () => void;
  onSupportPress?: () => void;
  supportEnabled?: boolean;
  onPrivacyOptionsPress?: () => void;
  privacyOptionsRequired?: boolean;
}

export default function AboutScreen({
  onCheatSheetPress,
  onPrivacyPress,
  onTermsPress,
  onSupportPress,
  supportEnabled = false,
  onPrivacyOptionsPress,
  privacyOptionsRequired = false,
}: AboutScreenProps) {
  const canSupport = supportEnabled && !!onSupportPress;

  const showPrivacyOptions =
    privacyOptionsRequired && !!onPrivacyOptionsPress;

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
              <Ionicons
                name="heart-outline"
                size={23}
                color="#111111"
              />
            </View>

            <View style={styles.linkInfo}>
              <Text style={styles.linkTitle}>
                Support TH Hunter
              </Text>

              <Text style={styles.linkSubtitle}>
                Help keep TH Hunter updated with new Treasure Hunts.
              </Text>

              {!canSupport && (
                <Text style={styles.supportStatus}>
                  Coming soon
                </Text>
              )}
            </View>

            <Ionicons
              name={
                canSupport
                  ? "chevron-forward"
                  : "time-outline"
              }
              size={22}
              color="#64748B"
            />
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

            {/* GOOGLE ADMOB PRIVACY OPTIONS */}

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
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.menuIcon}>
        <Ionicons
          name={icon}
          size={23}
          color="#FBBF24"
        />
      </View>

      <Text style={styles.menuText}>{label}</Text>

      <Ionicons
        name="chevron-forward"
        size={22}
        color="#64748B"
      />
    </Pressable>
  );
}
