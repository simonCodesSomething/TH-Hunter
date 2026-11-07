
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

// Screens
import AboutScreen from "./src/screens/AboutScreen";
import BrowseScreen from "./src/screens/BrowseScreen";
import CheatSheetScreen from "./src/screens/CheatSheetScreen";
import CollectionScreen from "./src/screens/CollectionScreen";
import HuntScreen from "./src/screens/HuntScreen";
import PrivacyPolicyScreen from "./src/screens/PrivacyPolicyScreen";
import ProgressScreen from "./src/screens/ProgressScreen";
import TermsOfUseScreen from "./src/screens/TermsOfUseScreen";

// Components
import AdBanner from "./src/components/AdBanner";
import BottomTabs from "./src/components/BottomTabs";

// Data
import {
  CarDataProvider,
  useCarData,
} from "./src/data/CarDataProvider";

// Hooks
import { useAdsConsent } from "./src/hooks/useAdsConsent";
import { useSupportPurchase } from "./src/hooks/useSupportPurchase";

// Types
import type { Tab } from "./src/types/tabs";

const { width } = Dimensions.get("window");

const SPLASH_DURATION = 1200;

type LegalScreen = "privacy" | "terms" | null;

function AppContent() {
  // ---------------------------------------------------------
  // DATA & SERVICES
  // ---------------------------------------------------------

  const { loading, error } = useCarData();

  const { supportEnabled, purchaseSupport } =
    useSupportPurchase();

  const {
    canRequestAds,
    privacyOptionsRequired,
    showPrivacyOptions,
  } = useAdsConsent();

  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------

  const [activeTab, setActiveTab] = useState<Tab>("hunt");

  const [showProgress, setShowProgress] = useState(false);

  const [showCheatSheet, setShowCheatSheet] = useState(false);

  const [legalScreen, setLegalScreen] =
    useState<LegalScreen>(null);

  const progressTranslateX = useRef(
    new Animated.Value(width)
  ).current;


  // ---------------------------------------------------------
  // BANNER VISIBILITY
  // ---------------------------------------------------------

  const showBanner =
    !showProgress &&
    (activeTab === "browse" || activeTab === "collection");

  // ---------------------------------------------------------
  // PROGRESS SCREEN
  // ---------------------------------------------------------

  const openProgress = () => {
    progressTranslateX.setValue(width);
    setShowProgress(true);

    Animated.timing(progressTranslateX, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const closeProgress = () => {
    Animated.timing(progressTranslateX, {
      toValue: width,
      duration: 250,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setShowProgress(false);
      }
    });
  };

  // ---------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------

  const handleTabChange = (tab: Tab) => {
    setShowCheatSheet(false);
    setLegalScreen(null);
    setActiveTab(tab);
  };

  const renderTabScreen = () => {
    switch (activeTab) {
      case "browse":
        return <BrowseScreen />;

      case "hunt":
        return <HuntScreen />;

      case "collection":
        return (
          <CollectionScreen onProgressPress={openProgress} />
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

        if (showCheatSheet) {
          return (
            <CheatSheetScreen
              onBack={() => setShowCheatSheet(false)}
            />
          );
        }

        return (
          <AboutScreen
            onCheatSheetPress={() => setShowCheatSheet(true)}
            onPrivacyPress={() => setLegalScreen("privacy")}
            onTermsPress={() => setLegalScreen("terms")}
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

  // ---------------------------------------------------------
  // SPLASH & ERROR STATES
  // ---------------------------------------------------------

if (loading) {
  return <View style={{ flex: 1, backgroundColor: "#000000" }} />;
}

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          CAR DATA UNAVAILABLE
        </Text>

        <Text style={styles.errorMessage}>
          {error}
        </Text>
      </View>
    );
  }

  // ---------------------------------------------------------
  // MAIN APP
  // ---------------------------------------------------------

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "bottom"]}
      >
        <View style={styles.container}>
          {/* MAIN TAB CONTENT */}

          <View style={styles.content}>
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

          {/* PROGRESS OVERLAY */}

          {showProgress && (
            <Animated.View
              style={[
                styles.progressOverlay,
                {
                  transform: [
                    { translateX: progressTranslateX },
                  ],
                },
              ]}
            >
              <ProgressScreen onClose={closeProgress} />

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

// ---------------------------------------------------------
// ROOT APP
// ---------------------------------------------------------

export default function App() {
  return (
    <CarDataProvider>
      <AppContent />
    </CarDataProvider>
  );
}

// ---------------------------------------------------------
// STYLES
// ---------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },

  container: {
    flex: 1,
    overflow: "hidden",
  },

  content: {
    flex: 1,
  },

progressOverlay: {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: "#000000",
},

  errorContainer: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  errorTitle: {
    color: "#FBBF24",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },

  errorMessage: {
    color: "#A1A1A6",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});
