import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../styles/tabs.styles";
import type { Tab } from "../types/tabs";

interface BottomTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

interface TabItem {
  key: Tab;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabItem[] = [
  {
    key: "hunt",
    icon: "flame-outline",
    activeIcon: "flame",
  },
  {
    key: "collection",
    icon: "cube-outline",
    activeIcon: "cube",
  },
  {
    key: "browse",
    icon: "grid-outline",
    activeIcon: "grid",
  },
  {
    key: "about",
    icon: "information-circle-outline",
    activeIcon: "information-circle",
  },
];

export default function BottomTabs({
  activeTab,
  onTabChange,
}: BottomTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            style={({ pressed }) => [
              styles.tab,
              active && styles.tabActive,
              pressed && styles.tabPressed,
            ]}
            onPress={() => onTabChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{
              selected: active,
            }}
            hitSlop={6}
          >
            <Ionicons
              name={
                active
                  ? tab.activeIcon
                  : tab.icon
              }
              size={30}
              color={
                active
                  ? "#0A1722"
                  : "#F3F7FA"
              }
              style={styles.tabIcon}
            />
          </Pressable>
        );
      })}
    </View>
  );
}