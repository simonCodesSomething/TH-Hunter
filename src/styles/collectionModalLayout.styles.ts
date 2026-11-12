import { StyleSheet } from "react-native";

// Layout overrides only: colors, type, borders and button visuals still come
// from collection.styles, collectionGrid.styles and collectionQuantity.styles.
export const modalLayout = StyleSheet.create({
  mainRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
    marginBottom: 6,
  },
  imageColumn: {
    width: "45%",
    height: undefined,
    aspectRatio: 3 / 4,
    marginBottom: 0,
    flexShrink: 0,
  },
  photoFrame: {
    width: "100%",
    height: "100%",
    aspectRatio: undefined,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  infoColumn: {
    flex: 1,
    minWidth: 0,
    alignSelf: "stretch",
    justifyContent: "flex-start",
    gap: 8,
  },
  metaRow: {
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 0,
  },
  nameBlock: {
    gap: 3,
    minWidth: 0,
  },
  seriesEyebrow: {
    marginTop: 0,
    marginBottom: 0,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  carName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 0,
    marginBottom: 0,
    flexShrink: 1,
    textAlign: "left",
  },
  detailsGrid: {
    flexDirection: "column",
    gap: 8,
    // Push Case, Status, and the following Quantity frame down together.
    // The column gap still gives Status-to-Quantity exactly 8px.
    marginTop: "auto",
    marginBottom: 0,
  },
  detailStat: {
    flex: 0,
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 9,
    minHeight: 0,
  },
  quantityContainer: {
    marginTop: 0,
    marginBottom: 0,
    paddingHorizontal: 4,
    paddingVertical: 6,
    minHeight: 0,
    alignItems: "center",
  },
  quantityRow: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    paddingVertical: 0,
  },
  quantityControls: {
    alignSelf: "center",
    justifyContent: "center",
  },
  fullWidthActions: {
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  fullWidthButton: {
    width: "100%",
    flex: 0,
    alignSelf: "stretch",
  },
});
