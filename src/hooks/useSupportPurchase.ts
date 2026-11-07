
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { useIAP } from "expo-iap";

const SUPPORT_PRODUCT_ID = "support_th_hunter_199";

export function useSupportPurchase() {
  const [purchasing, setPurchasing] = useState(false);

  const {
    connected,
    products,
    fetchProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      if (purchase.productId !== SUPPORT_PRODUCT_ID) {
        return;
      }

      try {
        // TODO: Verify the purchase with a trusted backend
        // before finalizing it in production.
        await finishTransaction({
          purchase,
          isConsumable: true,
        });

        setPurchasing(false);

        Alert.alert(
          "Thank you!",
          "Your support helps keep TH Hunter updated."
        );
      } catch (error) {
        console.error(
          "[SupportPurchase] Transaction completion failed:",
          error
        );

        setPurchasing(false);

        Alert.alert(
          "Purchase processing",
          "Your purchase could not be completed. Please try again later."
        );
      }
    },

    onPurchaseError: (error) => {
      setPurchasing(false);

      if (error.code === "user-cancelled") {
        return;
      }

      console.error("[SupportPurchase] Purchase failed:", error);

      Alert.alert(
        "Purchase unavailable",
        error.message || "Unable to complete your purchase."
      );
    },
  });

  useEffect(() => {
    if (!connected) {
      return;
    }

    void fetchProducts({
      skus: [SUPPORT_PRODUCT_ID],
      type: "in-app",
    }).catch((error) => {
      console.warn(
        "[SupportPurchase] Unable to load support product:",
        error
      );
    });
  }, [connected, fetchProducts]);

  const supportProduct = products.find(
    (product) => product.id === SUPPORT_PRODUCT_ID
  );

  const supportEnabled =
    Platform.OS === "android" &&
    connected &&
    !!supportProduct &&
    !purchasing;

  const purchaseSupport = useCallback(async () => {
    if (!supportEnabled) {
      return;
    }

    setPurchasing(true);

    try {
      await requestPurchase({
        request: {
          google: {
            skus: [SUPPORT_PRODUCT_ID],
          },
        },
        type: "in-app",
      });
    } catch (error) {
      setPurchasing(false);

      console.error(
        "[SupportPurchase] Unable to start purchase:",
        error
      );

      Alert.alert(
        "Purchase unavailable",
        "Unable to start the Google Play purchase."
      );
    }
  }, [requestPurchase, supportEnabled]);

  return {
    supportEnabled,
    purchasing,
    purchaseSupport,
    supportProduct,
  };
}
