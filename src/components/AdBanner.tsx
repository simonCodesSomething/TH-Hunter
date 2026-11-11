import { Platform, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

import { adBannerStyles } from "../styles/adBanner.styles";

type AdPlacement = "browse" | "collection" | "hunt";

interface AdBannerProps {
  placement: AdPlacement;
  canRequestAds: boolean;
}

const AD_UNIT_IDS: Record<AdPlacement, string> = {
  browse: "ca-app-pub-5794787274519836/5300413110",
  collection: "ca-app-pub-5794787274519836/2674249779",
  hunt: "ca-app-pub-5794787274519836/1857549058",
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
    <View style={adBannerStyles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}
