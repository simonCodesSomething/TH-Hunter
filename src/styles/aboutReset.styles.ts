import { StyleSheet } from "react-native";

export const resetStyles = StyleSheet.create({
  card: {
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 14,
    overflow: "hidden",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 14,
    gap: 12,
  },
  actionPressed: { opacity: 0.65 },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#2B1717",
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  label: { color: "#EF4444", fontSize: 15, fontWeight: "800" },
  description: { color: "#A1A1A6", fontSize: 12, lineHeight: 18, marginTop: 4 },
  disabled: { opacity: 0.5 },
});
