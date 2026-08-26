import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#111111",
    borderTopWidth: 1,
    borderTopColor: "#292929",
    paddingBottom: 6,
  },

  tab: {
    flex: 1,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    color: "#77777C",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },

  labelActive: {
    color: "#FBBF24",
  },
});