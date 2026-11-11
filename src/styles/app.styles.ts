import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000000" },
  container: { flex: 1, overflow: "hidden" },
  content: { flex: 1 },
  progressOverlay: {
    position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
    backgroundColor: "#000000",
  },
  errorContainer: {
    flex: 1, backgroundColor: "#000000", alignItems: "center",
    justifyContent: "center", padding: 24,
  },
  errorTitle: {
    color: "#FBBF24", fontSize: 24, fontWeight: "900", textAlign: "center",
  },
  errorMessage: {
    color: "#A1A1A6", fontSize: 14, textAlign: "center", marginTop: 10,
  },
});
