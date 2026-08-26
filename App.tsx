import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import BrowseScreen from "./src/screens/BrowseScreen";
import CheatSheetScreen from "./src/screens/CheatSheetScreen";
import HuntScreen from "./src/screens/HuntScreen";
import BottomTabs from "./src/components/BottomTabs";

type Tab = "browse" | "cheatsheet" | "hunt";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("browse");

  const renderScreen = () => {
    switch (activeTab) {
      case "browse":
        return <BrowseScreen />;

      case "cheatsheet":
        return <CheatSheetScreen />;

      case "hunt":
        return <HuntScreen />;

      default:
        return <BrowseScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.screen}>
          {renderScreen()}
        </View>

        <BottomTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  screen: {
    flex: 1,
  },
});