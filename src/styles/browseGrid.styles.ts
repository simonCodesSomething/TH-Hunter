import { StyleSheet } from "react-native";

// Browse-specific overrides, layered over the existing Collection grid/modal styles.
export const browseGridStyles = StyleSheet.create({
  grid: { paddingHorizontal: 0, paddingTop: 4, paddingBottom: 8 },
  cardBody: { minHeight: 0, paddingTop: 8, paddingBottom: 10 },
  carName: { minHeight: 0, marginBottom: 0 },
  carSeries: { marginTop: 2 },
  collectedBadge: {
    position: "absolute", top: 7, right: 7,
    flexDirection: "row", alignItems: "center", gap: 3,
    borderRadius: 8, backgroundColor: "#FBBF24",
    paddingHorizontal: 6, paddingVertical: 4,
  },
  collectedBadgeText: { color: "#111111", fontSize: 9, fontWeight: "900" },
  detailModal: { height: undefined, minHeight: 0, maxHeight: "90%", paddingBottom: 16 },
  actionButton: { height: 46, minHeight: 46, borderRadius: 10,
    marginTop: 0, marginBottom: 0, paddingVertical: 0,
    justifyContent: "center", alignItems: "center" },
  yellowAction: { width: "100%", minHeight: 46, height: 46, borderRadius: 10,
    backgroundColor: "#FBBF24", alignItems: "center", justifyContent: "center" },
  removePhotoButton: { height: 46, minHeight: 46, borderRadius: 10,
    borderWidth: 1, borderColor: "#56565B", flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 8 },
  disabledRemovePhoto: { backgroundColor: "#262629", borderColor: "#343438", opacity: 0.55 },
  removePhotoText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  disabledRemovePhotoText: { color: "#88888C" },
  missingHint: { color: "#A1A1A6", fontSize: 11, fontWeight: "700",
    letterSpacing: 0.8, textAlign: "center" },
  tipsButton: { flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, marginTop: 8, minHeight: 22 },
  tipsText: { color: "#FBBF24", fontSize: 10, fontWeight: "700" },
});
