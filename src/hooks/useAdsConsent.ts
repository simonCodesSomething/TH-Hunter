
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { AdsConsent } from "react-native-google-mobile-ads";

export function useAdsConsent() {
  const [canRequestAds, setCanRequestAds] = useState(false);
  const [privacyOptionsRequired, setPrivacyOptionsRequired] =
    useState(false);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    let mounted = true;

    const initializeConsent = async () => {
      try {
        const consentInfo = await AdsConsent.requestInfoUpdate();

        if (!mounted) return;

        setCanRequestAds(consentInfo.canRequestAds);
        setPrivacyOptionsRequired(
          consentInfo.privacyOptionsRequirementStatus === "REQUIRED"
        );

        await AdsConsent.loadAndShowConsentFormIfRequired();

        const updatedInfo = await AdsConsent.getConsentInfo();

        if (!mounted) return;

        setCanRequestAds(updatedInfo.canRequestAds);
        setPrivacyOptionsRequired(
          updatedInfo.privacyOptionsRequirementStatus === "REQUIRED"
        );
      } catch (error) {
        console.warn("[AdsConsent] Consent initialization failed:", error);
      }
    };

    void initializeConsent();

    return () => {
      mounted = false;
    };
  }, []);

  const showPrivacyOptions = useCallback(async () => {
    try {
      await AdsConsent.showPrivacyOptionsForm();

      const updatedInfo = await AdsConsent.getConsentInfo();

      setCanRequestAds(updatedInfo.canRequestAds);
      setPrivacyOptionsRequired(
        updatedInfo.privacyOptionsRequirementStatus === "REQUIRED"
      );
    } catch (error) {
      console.warn("[AdsConsent] Unable to show privacy options:", error);
    }
  }, []);

  return {
    canRequestAds,
    privacyOptionsRequired,
    showPrivacyOptions,
  };
}
