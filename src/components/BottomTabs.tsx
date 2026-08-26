import React from "react";
import {
  Pressable,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../styles/tabs.styles";

type Tab = "browse" | "cheatsheet" | "hunt";

interface BottomTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

interface TabItem {
  key: Tab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabItem[] = [
  {
    key: "browse",
    label: "Browse",
    icon: "grid-outline",
    activeIcon: "grid",
  },

  {
    key: "hunt",
    label: "Hunt",
    icon: "flame-outline",
    activeIcon: "flame",
  },
    {
    key: "cheatsheet",
    label: "Cheat Sheet",
    icon: "list-outline",
    activeIcon: "list",
  },
];

export default function BottomTabs({
  activeTab,
  onTabChange,
}: BottomTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active =
          activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() =>
              onTabChange(tab.key)
            }
          >
            <Ionicons
              name={
                active
                  ? tab.activeIcon
                  : tab.icon
              }
              size={24}
              color={
                active
                  ? "#FBBF24"
                  : "#77777C"
              }
            />

            <Text
              style={[
                styles.label,
                active
                  ? styles.labelActive
                  : undefined,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}