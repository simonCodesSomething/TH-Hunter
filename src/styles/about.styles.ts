
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingBottom: 28,
  },
  eyebrow: {
    color: "#FBBF24",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
  },
  subtitle: {
    maxWidth: 245,
    color: "#A1A1A6",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  infoButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 9,
  },
  supportCard: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 12,
  },
  supportIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBBF24",
    marginRight: 12,
  },
  supportStatus: {
    color: "#FBBF24",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5,
  },
  menuCard: {
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  menuIcon: {
    width: 38,
    alignItems: "flex-start",
  },
  menuText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  itemDivider: {
    height: 1,
    backgroundColor: "#292929",
    marginLeft: 52,
  },
  pressed: {
    opacity: 0.7,
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  linkSubtitle: {
    color: "#77777C",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  footer: {
    color: "#55555A",
    fontSize: 11,
    textAlign: "center",
    marginTop: 28,
  },
});
