import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
    marginTop: 1,
    marginBottom: 1,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#031B2A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#18384B",
    paddingHorizontal: 2,
    paddingVertical: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 1,
  },

  tab: {
    flex: 1,
    height: 46,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  tabActive: {
    backgroundColor: "#FBBF24",
    borderRadius: 18,
    shadowColor: "#D79E00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },

  tabPressed: {
    opacity: 0.7,
  },

  tabIcon: {
    opacity: 0.9,
  },
});