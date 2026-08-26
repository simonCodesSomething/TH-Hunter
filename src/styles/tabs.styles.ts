import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    backgroundColor: "#000000",

    borderTopWidth: 1,
    borderTopColor: "#1F1F1F",

    paddingHorizontal: 8,
  },

  tab: {
    flex: 1,
    height: 62,

    alignItems: "center",
    justifyContent: "center",
  },

  tabPressed: {
    opacity: 0.55,
  },
});