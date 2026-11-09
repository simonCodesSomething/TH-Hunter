import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AppState, Platform } from "react-native";
import { ErrorCode, useIAP } from "expo-iap";
import type { Purchase } from "expo-iap";

const SUPPORT_PRODUCT_ID = "support_th_hunter_199";

export function useSupportPurchase() {
  const [purchasing, setPurchasing] = useState(false);

  // A purchase can be sent both to the success callback and to the
  // recovery query. Do not consume the same transaction concurrently.
  const processingPurchasesRef = useRef<Set<string>>(new Set());
  const completedPurchasesRef = useRef<Set<string>>(new Set());
  const startedPurchaseRef = useRef(false);
  const pendingNoticeShownRef = useRef(false);

  // The hook manages the store connection and updates availablePurchases
  // after getAvailablePurchases() completes.
  const {
    connected,
    products,
    availablePurchases,
    fetchProducts,
    getAvailablePurchases,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      if (purchase.productId !== SUPPORT_PRODUCT_ID) return;

      // Never consume pending or unknown-state payments.
      if (purchase.purchaseState === "pending") {
        setPurchasing(false);
        startedPurchaseRef.current = false;

        if (!pendingNoticeShownRef.current) {
          pendingNoticeShownRef.current = true;
          Alert.alert(
            "Payment pending",
            "Google Play hasn't completed this payment yet. TH Hunter will check for it again when you open the app."
          );
        }
        return;
      }

      if (purchase.purchaseState !== "purchased") {
        setPurchasing(false);
        startedPurchaseRef.current = false;
        console.warn(
          "[SupportPurchase] Ignoring purchase with unknown state:",
          purchase.purchaseState
        );
        return;
      }

      const purchaseKey = purchase.purchaseToken || purchase.id;
      if (
        !purchaseKey ||
        processingPurchasesRef.current.has(purchaseKey) ||
        completedPurchasesRef.current.has(purchaseKey)
      ) {
        return;
      }

      processingPurchasesRef.current.add(purchaseKey);
      const showThankYou = startedPurchaseRef.current;

      try {
        // Optional future improvement: verify this token with a trusted
        // backend before consuming it. No premium features are unlocked.
        await finishTransaction({ purchase, isConsumable: true });
        completedPurchasesRef.current.add(purchaseKey);
        setPurchasing(false);
        startedPurchaseRef.current = false;
        pendingNoticeShownRef.current = false;

        if (showThankYou) {
          Alert.alert(
            "Thank you!",
            "Your support helps keep TH Hunter updated."
          );
        } else {
          console.log(
            "[SupportPurchase] Finished an outstanding support purchase."
          );
        }
      } catch (error) {
        console.error(
          "[SupportPurchase] Transaction completion failed:",
          error
        );
        setPurchasing(false);
        startedPurchaseRef.current = false;
        Alert.alert(
          "Purchase processing",
          "Your payment may have succeeded, but TH Hunter could not finish processing it. Please reopen the app when you're connected to the internet. Do not purchase again yet."
        );
      } finally {
        processingPurchasesRef.current.delete(purchaseKey);
      }
    },

    onPurchaseError: (error) => {
      setPurchasing(false);
      startedPurchaseRef.current = false;

      if (error.code === ErrorCode.UserCancelled) return;

      console.error("[SupportPurchase] Purchase failed:", error);
      Alert.alert(
        "Purchase unavailable",
        error.message || "Unable to complete your purchase."
      );
    },
  });

  useEffect(() => {
    if (!connected || Platform.OS !== "android") return;

    void fetchProducts({
      skus: [SUPPORT_PRODUCT_ID],
      type: "in-app",
    }).catch((error) => {
      console.warn("[SupportPurchase] Unable to load support product:", error);
    });
  }, [connected, fetchProducts]);

  // Check on connection and again when TH Hunter comes back to the
  // foreground (e.g., after the user completes a delayed payment).
  useEffect(() => {
    if (!connected || Platform.OS !== "android") return;

    const checkUnfinishedPurchases = () => {
      void getAvailablePurchases().catch((error) => {
        console.warn(
          "[SupportPurchase] Unable to check unfinished purchases:",
          error
        );
      });
    };

    checkUnfinishedPurchases();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") checkUnfinishedPurchases();
    });

    return () => subscription.remove();
  }, [connected, getAvailablePurchases]);

  // The hook's getAvailablePurchases() updates state asynchronously.
  // Process only completed support purchases; never consume pending ones.
  useEffect(() => {
    if (!connected || Platform.OS !== "android") return;

    for (const purchase of availablePurchases) {
      if (purchase.productId !== SUPPORT_PRODUCT_ID) continue;
      if (purchase.purchaseState !== "purchased") continue;

      const purchaseKey = purchase.purchaseToken || purchase.id;
      if (
        !purchaseKey ||
        processingPurchasesRef.current.has(purchaseKey) ||
        completedPurchasesRef.current.has(purchaseKey)
      ) {
        continue;
      }

      processingPurchasesRef.current.add(purchaseKey);
      void (async (restoredPurchase: Purchase, key: string) => {
        try {
          // Complete a previously paid, unconsumed support transaction.
          await finishTransaction({
            purchase: restoredPurchase,
            isConsumable: true,
          });
          completedPurchasesRef.current.add(key);
          if (startedPurchaseRef.current) {
            setPurchasing(false);
            startedPurchaseRef.current = false;
            pendingNoticeShownRef.current = false;
            Alert.alert("Thank you!", "Your support helps keep TH Hunter updated.");
          }
          console.log(
            "[SupportPurchase] Recovered and consumed a completed purchase."
          );
        } catch (error) {
          console.error(
            "[SupportPurchase] Could not recover outstanding purchase:",
            error
          );
          // Leave unconsumed so the next app launch can retry.
        } finally {
          processingPurchasesRef.current.delete(key);
        }
      })(purchase, purchaseKey);
    }
  }, [availablePurchases, connected, finishTransaction]);

  const supportProduct = products.find(
    (product) => product.id === SUPPORT_PRODUCT_ID
  );

  const supportEnabled =
    Platform.OS === "android" &&
    connected &&
    !!supportProduct &&
    !purchasing;

  const purchaseSupport = useCallback(async () => {
    if (!supportEnabled) return;

    setPurchasing(true);
    startedPurchaseRef.current = true;
    pendingNoticeShownRef.current = false;

    try {
      // Resolving this call only means the native purchase flow was opened.
      // The final result arrives via onPurchaseSuccess/onPurchaseError.
      await requestPurchase({
        request: {
          google: { skus: [SUPPORT_PRODUCT_ID] },
        },
        type: "in-app",
      });
    } catch (error) {
      setPurchasing(false);
      startedPurchaseRef.current = false;
      console.error("[SupportPurchase] Unable to start purchase:", error);
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
