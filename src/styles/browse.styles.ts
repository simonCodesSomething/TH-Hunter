import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  content: {
    paddingTop: 12,
    paddingBottom: 32,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F1F",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  eyebrow: {
    color: "#FBBF24",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  headerContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },

  subtitle: {
    color: "#A1A1A6",
    fontSize: 14,
    marginTop: 4,
    paddingRight: 12,
  },

  infoButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 12,
  },

  searchContainer: {
    flex: 1,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#343434",
    borderRadius: 13,
  },

  searchIcon: {
    marginRight: 9,
  },

  search: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    paddingVertical: 0,
  },

  typeSelector: {
    flexDirection: "row",
    marginHorizontal: 14,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#343434",
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 12,
  },

  typeSelectorItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },

  typeSelectorItemActive: {
    backgroundColor: "#FBBF24",
  },

  typeSelectorText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  typeSelectorTextActive: {
    color: "#111111",
  },

  yearRow: {
    paddingHorizontal: 14,
    gap: 8,
    paddingBottom: 12,
  },

  yearChip: {
    minWidth: 62,
    height: 42,
    paddingHorizontal: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 10,
  },

  yearChipActive: {
    borderColor: "#FBBF24",
    backgroundColor: "#111111",
  },

  yearChipText: {
    color: "#E5E5E5",
    fontSize: 14,
    fontWeight: "700",
  },

  yearChipTextActive: {
    color: "#FBBF24",
  },

  selectedYearSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 8,
  },

  resultCount: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  resultBreakdown: {
    color: "#77777C",
    fontSize: 12,
  },

  yearSection: {
    marginHorizontal: 14,
    marginBottom: 12,
    backgroundColor: "#050505",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 12,
    overflow: "hidden",
  },

  yearHeader: {
    minHeight: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  yearTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  yearHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  yearTotal: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "600",
  },

  category: {
    borderTopWidth: 1,
    borderTopColor: "#292929",
    paddingTop: 14,
    paddingBottom: 14,
  },

  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  categoryIconText: {
    position: "absolute",
    color: "#111111",
    fontSize: 8,
    fontWeight: "900",
    bottom: 5,
  },

  categoryTitleContainer: {
    flex: 1,
  },

  categoryTitle: {
    fontSize: 17,
    fontWeight: "900",
  },

  categorySubtitle: {
    color: "#8E8E93",
    fontSize: 13,
    marginTop: 2,
  },

  categoryCount: {
    fontSize: 18,
    fontWeight: "800",
    marginRight: 7,
  },

  cardsRow: {
    paddingHorizontal: 12,
    gap: 10,
  },

  carCard: {
    width: 142,
  },

  carImage: {
    height: 104,
    backgroundColor: "#E9E9E9",
    borderRadius: 11,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  cardGraphic: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8D8D8",
  },

  carPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  typeBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 30,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  typeBadgeText: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
  },

  foundBadge: {
    position: "absolute",
    left: 6,
    top: 6,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#34D399",
    alignItems: "center",
    justifyContent: "center",
  },

  photoButton: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(17, 17, 17, 0.78)",
    alignItems: "center",
    justifyContent: "center",
  },

  carName: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    marginTop: 7,
  },

  carNumber: {
    color: "#77777C",
    fontSize: 12,
    marginTop: 3,
  },

  empty: {
    color: "#77777C",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
});