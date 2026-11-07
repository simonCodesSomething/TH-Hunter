
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import BrowseScreen from "./src/screens/BrowseScreen";
import HuntScreen from "./src/screens/HuntScreen";
import CollectionScreen from "./src/screens/CollectionScreen";
import CheatSheetScreen from "./src/screens/CheatSheetScreen";
import AboutScreen from "./src/screens/AboutScreen";
import PrivacyPolicyScreen from "./src/screens/PrivacyPolicyScreen";
import TermsOfUseScreen from "./src/screens/TermsOfUseScreen";
import ProgressScreen from "./src/screens/ProgressScreen";

import BottomTabs from "./src/components/BottomTabs";
import AdBanner from "./src/components/AdBanner";

import type { Tab } from "./src/types/tabs";

import {
  CarDataProvider,
  useCarData,
} from "./src/data/CarDataProvider";

import { useSupportPurchase } from "./src/hooks/useSupportPurchase";
import { useAdsConsent } from "./src/hooks/useAdsConsent";

const { width } = Dimensions.get("window");

function AppContent() {
  const { loading, error } = useCarData();

  const {
    supportEnabled,
    purchaseSupport,
  } = useSupportPurchase();

const {
  canRequestAds,
  privacyOptionsRequired,
  showPrivacyOptions,
} = useAdsConsent();

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

  // Display banners only on Browse and Collection.
  // Hide them whenever the Progress overlay is active.
  const showBanner =
    !showProgress &&
    (activeTab === "browse" ||
      activeTab === "collection");

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

  if (loading || error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Animated.Text
            style={{
              color: "#FBBF24",
              fontSize: 24,
              fontWeight: "900",
            }}
          >
            {error
              ? "CAR DATA UNAVAILABLE"
              : "LOADING CAR DATA"}
          </Animated.Text>

          {error ? (
            <Animated.Text
              style={{
                color: "#A1A1A6",
                fontSize: 14,
                textAlign: "center",
                marginTop: 10,
              }}
            >
              {error}
            </Animated.Text>
          ) : null}
        </View>
      </View>
    );
  }

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
          return (
            <PrivacyPolicyScreen
              onBack={() => setLegalScreen(null)}
            />
          );
        }

        if (legalScreen === "terms") {
          return (
            <TermsOfUseScreen
              onBack={() => setLegalScreen(null)}
            />
          );
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
  onPrivacyPress={() =>
    setLegalScreen("privacy")
  }
  onTermsPress={() =>
    setLegalScreen("terms")
  }
  onSupportPress={purchaseSupport}
  supportEnabled={supportEnabled}
  onPrivacyOptionsPress={showPrivacyOptions}
  privacyOptionsRequired={privacyOptionsRequired}
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

          <View style={{ flex: 1 }}>
            {renderTabScreen()}
          </View>

          {/* BANNER ADS */}

          {showBanner && canRequestAds && (
            <AdBanner
              placement={
                activeTab === "browse"
                  ? "browse"
                  : "collection"
              }
              canRequestAds={canRequestAds}
            />
          )}

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

export default function App() {
  return (
    <CarDataProvider>
      <AppContent />
    </CarDataProvider>
  );
}
