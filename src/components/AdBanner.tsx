
import { Platform, StyleSheet, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

type AdPlacement = "browse" | "collection";

interface AdBannerProps {
  placement: AdPlacement;
  canRequestAds: boolean;
}

const AD_UNIT_IDS = {
  browse: "ca-app-pub-5794787274519836/5300413110",
  collection: "ca-app-pub-5794787274519836/2674249779",
};

export default function AdBanner({
  placement,
  canRequestAds,
}: AdBannerProps) {
  if (Platform.OS !== "android" || !canRequestAds) {
    return null;
  }

  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : AD_UNIT_IDS[placement];

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
});
