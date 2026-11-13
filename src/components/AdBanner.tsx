import { Platform, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

import { adBannerStyles } from "../styles/adBanner.styles";

type AdPlacement = "browse" | "collection" | "hunt";
type AdPlatform = "android" | "ios";

interface AdBannerProps {
  placement: AdPlacement;
  canRequestAds: boolean;
}

const SCREEN_RECORDING_MODE = false;

const AD_UNIT_IDS: Record<
  AdPlatform,
  Record<AdPlacement, string>
> = {
  android: {
    browse: "ca-app-pub-5794787274519836/5300413110",
    collection: "ca-app-pub-5794787274519836/2674249779",
    hunt: "ca-app-pub-5794787274519836/1857549058",
  },
  ios: {
    browse: "ca-app-pub-5794787274519836/8668168286",
    collection: "ca-app-pub-5794787274519836/1325010672",
    hunt: "ca-app-pub-5794787274519836/1484792771",
  },
};

export default function AdBanner({
  placement,
  canRequestAds,
}: AdBannerProps) {
  // Only Android and iOS support native AdMob banners.
if (
  SCREEN_RECORDING_MODE ||
  (Platform.OS !== "android" && Platform.OS !== "ios") ||
  !canRequestAds
) {
  return null;
}

  const platform = Platform.OS as AdPlatform;

  // Use Google's test banners in development.
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : AD_UNIT_IDS[platform][placement];

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