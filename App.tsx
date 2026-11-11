import React, { useRef, useState } from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import AboutScreen from "./src/screens/AboutScreen";
import BrowseScreen from "./src/screens/BrowseScreen";
import CheatSheetScreen from "./src/screens/CheatSheetScreen";
import CollectionScreen from "./src/screens/CollectionScreen";
import HuntScreen from "./src/screens/HuntScreen";
import PrivacyPolicyScreen from "./src/screens/PrivacyPolicyScreen";
import ProgressScreen from "./src/screens/ProgressScreen";
import TermsOfUseScreen from "./src/screens/TermsOfUseScreen";

import AdBanner from "./src/components/AdBanner";
import BottomTabs from "./src/components/BottomTabs";
import { CarDataProvider, useCarData } from "./src/data/CarDataProvider";
import { useAdsConsent } from "./src/hooks/useAdsConsent";
import { useSupportPurchase } from "./src/hooks/useSupportPurchase";
import type { Tab } from "./src/types/tabs";
import { styles } from "./src/styles/app.styles";

const { width } = Dimensions.get("window");
type LegalScreen = "privacy" | "terms" | null;

function AppContent() {
  const { loading, error } = useCarData();
  const { supportEnabled, purchaseSupport } = useSupportPurchase();
  const { canRequestAds, privacyOptionsRequired, showPrivacyOptions } = useAdsConsent();

  const [activeTab, setActiveTab] = useState<Tab>("hunt");
  const [showProgress, setShowProgress] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [legalScreen, setLegalScreen] = useState<LegalScreen>(null);

  // Increment after a successful collection reset. This remounts each
  // collection-dependent screen next time it is rendered, forcing it to
  // reload found IDs and quantities from local storage.
  const [collectionRevision, setCollectionRevision] = useState(0);
  const onCollectionReset = () => {
    setCollectionRevision((revision) => revision + 1);
  };

  const progressTranslateX = useRef(new Animated.Value(width)).current;
  const showBanner = !showProgress && (activeTab === "browse" || activeTab === "collection");

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
      if (finished) setShowProgress(false);
    });
  };

  const handleTabChange = (tab: Tab) => {
    setShowCheatSheet(false);
    setLegalScreen(null);
    setActiveTab(tab);
  };

  const renderTabScreen = () => {
    switch (activeTab) {
      case "browse":
        return <BrowseScreen key={`browse-${collectionRevision}`} />;
      case "hunt":
        return (
          <HuntScreen
            key={`hunt-${collectionRevision}`}
            canRequestAds={canRequestAds}
          />
        );
      case "collection":
        return (
          <CollectionScreen
            key={`collection-${collectionRevision}`}
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
        if (showCheatSheet) {
          return <CheatSheetScreen onBack={() => setShowCheatSheet(false)} />;
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
            onCollectionReset={onCollectionReset}
          />
        );
      default:
        return <BrowseScreen key={`browse-${collectionRevision}`} />;
    }
  };

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: "#000000" }} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>CAR DATA UNAVAILABLE</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.container}>
          <View style={styles.content}>{renderTabScreen()}</View>

          {showBanner && canRequestAds && (
            <AdBanner
              placement={activeTab === "browse" ? "browse" : "collection"}
              canRequestAds={canRequestAds}
            />
          )}

          {!showProgress && (
            <BottomTabs activeTab={activeTab} onTabChange={handleTabChange} />
          )}

          {showProgress && (
            <Animated.View
              style={[
                styles.progressOverlay,
                { transform: [{ translateX: progressTranslateX }] },
              ]}
            >
              <ProgressScreen key={`progress-${collectionRevision}`} onClose={closeProgress} />
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

