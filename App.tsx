import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import BrowseScreen from "./src/screens/BrowseScreen";
import HuntScreen from "./src/screens/HuntScreen";
import CollectionScreen from "./src/screens/CollectionScreen";
import CheatSheetScreen from "./src/screens/CheatSheetScreen";
import AboutScreen from "./src/screens/AboutScreen";
import PrivacyPolicyScreen from "./src/screens/PrivacyPolicyScreen";
import TermsOfUseScreen from "./src/screens/TermsOfUseScreen";
import ProgressScreen from "./src/screens/ProgressScreen";

import BottomTabs from "./src/components/BottomTabs";

import type { Tab } from "./src/types/tabs";

const { width } = Dimensions.get("window");

export default function App() {
  const [activeTab, setActiveTab] =
    useState<Tab>("hunt");

  const [showProgress, setShowProgress] =
    useState(false);
  const [showCheatSheet, setShowCheatSheet] =
    useState(false);
  const [legalScreen, setLegalScreen] = useState<
    "privacy" | "terms" | null
  >(null);

  const progressTranslateX = useRef(
    new Animated.Value(width)
  ).current;

  /*
   * Open Progress screen
   */
  const openProgress = () => {
    setShowProgress(true);

    progressTranslateX.setValue(width);

    Animated.timing(progressTranslateX, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  /*
   * Close Progress screen
   */
  const closeProgress = () => {
    Animated.timing(progressTranslateX, {
      toValue: width,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowProgress(false);
    });
  };

  const handleTabChange = (tab: Tab) => {
    setShowCheatSheet(false);
    setLegalScreen(null);
    setActiveTab(tab);
  };

  /*
   * Render bottom-tab screen
   */
  const renderTabScreen = () => {
    switch (activeTab) {
      case "browse":
        return <BrowseScreen />;

      case "hunt":
        return <HuntScreen />;

      case "collection":
        return (
          <CollectionScreen
            onProgressPress={openProgress}
          />
        );

      case "about":
        if (legalScreen === "privacy") {
          return <PrivacyPolicyScreen onBack={() => setLegalScreen(null)} />;
        }

        if (legalScreen === "terms") {
          return <TermsOfUseScreen onBack={() => setLegalScreen(null)} />;
        }

        return showCheatSheet ? (
          <CheatSheetScreen
            onBack={() => setShowCheatSheet(false)}
          />
        ) : (
          <AboutScreen
            onCheatSheetPress={() =>
              setShowCheatSheet(true)
            }
            onPrivacyPress={() => setLegalScreen("privacy")}
            onTermsPress={() => setLegalScreen("terms")}
          />
        );

      default:
        return <BrowseScreen />;
    }
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000000",
      }}
      edges={["top", "bottom"]}
    >
      <View
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* MAIN TAB CONTENT */}

        <View
          style={{
            flex: 1,
          }}
        >
          {renderTabScreen()}
        </View>

        {/* BOTTOM TABS */}

        {!showProgress && (
          <BottomTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}

        {/* PROGRESS SCREEN */}

        {showProgress && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "#000000",
              transform: [
                {
                  translateX:
                    progressTranslateX,
                },
              ],
            }}
          >
            <ProgressScreen
              onClose={closeProgress}
            />

            <BottomTabs
              activeTab={activeTab}
              onTabChange={(tab) => {
                handleTabChange(tab);
                closeProgress();
              }}
            />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}