import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import BrowseScreen from "./src/screens/BrowseScreen";
import HuntScreen from "./src/screens/HuntScreen";
import CollectionScreen from "./src/screens/CollectionScreen";
import CheatSheetScreen from "./src/screens/CheatSheetScreen";
import ProgressScreen from "./src/screens/ProgressScreen";

import BottomTabs from "./src/components/BottomTabs";

import type { Tab } from "./src/types/tabs";

const { width } = Dimensions.get("window");

export default function App() {
  const [activeTab, setActiveTab] =
    useState<Tab>("browse");

  const [showProgress, setShowProgress] =
    useState(false);

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

      case "cheatsheet":
        return <CheatSheetScreen />;

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
            onTabChange={setActiveTab}
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
            {/* BACK BUTTON */}

            <View
              style={{
                position: "absolute",
                top: 8,
                left: 14,
                zIndex: 10,
              }}
            >
              <Pressable
                onPress={closeProgress}
                hitSlop={10}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <ProgressScreen />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}