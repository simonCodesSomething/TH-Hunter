import { StyleSheet } from "react-native";

export const quantityStyles = StyleSheet.create({
  container: {
    marginTop: 18,
    marginBottom: 4,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#292929",
    backgroundColor: "#161616",
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.6,
  },
  hint: {
    color: "#88888E",
    fontSize: 11,
    marginTop: 4,
    maxWidth: 135,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  adjustButton: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#FBBF24",
  },
  disabled: { opacity: 0.45 },
  quantityValue: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    minWidth: 24,
    textAlign: "center",
  },
  cardQuantityBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#FBBF24",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cardQuantityText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "900",
  },
});
