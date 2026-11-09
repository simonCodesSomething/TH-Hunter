import { StyleSheet } from "react-native";

// Styles specific to the two-column Treasure Box gallery.
// Existing CollectionScreen styles remain in collection.styles.ts.
export const gridStyles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    rowGap: 12,
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  card: {
    width: "48%",
    backgroundColor: "#191919",
    borderColor: "#292929",
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.82,
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#242424",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },
  placeholderLetter: {
    fontSize: 46,
    lineHeight: 52,
    fontWeight: "900",
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(15, 15, 15, 0.88)",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#EF4444",
    borderWidth: 1,
  },
  cardBody: {
    paddingHorizontal: 11,
    paddingTop: 10,
    paddingBottom: 11,
    minHeight: 102,
  },
  carName: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    minHeight: 36,
  },
  carSeries: {
    color: "#A1A1A6",
    fontSize: 11,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  detailRemoveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 46,
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#713333",
    backgroundColor: "#241414",
  },
  detailRemoveText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  yearLabel: {
    color: "#77777C",
    fontSize: 11,
    fontWeight: "700",
  },
  removeButton: {
  width: "100%",
  minHeight: 52,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  backgroundColor: "#241414",
  borderWidth: 1,
  borderColor: "#713333",
  borderRadius: 12,
},

removeButtonText: {
  color: "#EF4444",
  fontSize: 13,
  fontWeight: "800",
  textAlign: "center",
},
});
