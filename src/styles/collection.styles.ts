import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  content: {
    paddingTop: 4,
    paddingBottom: 32,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
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

  subtitle: {
    color: "#A1A1A6",
    fontSize: 14,
    marginTop: 4,
  },

  headerCount: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
  },

  headerCountValue: {
    color: "#FBBF24",
    fontSize: 19,
    fontWeight: "900",
  },

  headerCountLabel: {
    color: "#77777C",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginTop: 1,
  },

  /* SUMMARY */

  summaryCard: {
    marginHorizontal: 14,
    marginBottom: 14,
    padding: 17,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 16,
  },

  summaryMain: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#24200F",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  summarySubtitle: {
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 3,
  },

  summaryStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 17,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#292929",
  },

  summaryStat: {
    flex: 1,
    alignItems: "center",
  },

  summaryStatValue: {
    fontSize: 20,
    fontWeight: "900",
  },

  summaryStatLabel: {
    color: "#77777C",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2,
  },

  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#292929",
  },

  /* SEARCH */

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 14,
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 12,
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 10,
  },

  /* FILTERS */

  filterRow: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 3,
    gap: 8,
  },

  filterChip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  filterChipActive: {
    backgroundColor: "#FBBF24",
    borderColor: "#FBBF24",
  },

  filterDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 7,
  },

  filterText: {
    color: "#A1A1A6",
    fontSize: 12,
    fontWeight: "800",
  },

  filterTextActive: {
    color: "#111111",
  },

  yearRow: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },

  yearChip: {
    height: 34,
    paddingHorizontal: 13,
    borderRadius: 17,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  yearChipActive: {
    backgroundColor: "#FBBF24",
    borderColor: "#FBBF24",
  },

  yearText: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "800",
  },

  yearTextActive: {
    color: "#111111",
  },

  /* RESULTS */

  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: 4,
    marginBottom: 10,
  },

  resultTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  clearText: {
    color: "#FBBF24",
    fontSize: 12,
    fontWeight: "800",
  },

  /* GRID */

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    columnGap: 10,
    rowGap: 20,
  },

  carCard: {
    width: "31.8%",
  },

  carImage: {
    height: 105,
    backgroundColor: "#E9E9E9",
    borderRadius: 11,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  carGraphic: {
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
    height: 23,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  typeBadgeText: {
    color: "#111111",
    fontSize: 9,
    fontWeight: "900",
  },

  collectedBadge: {
    position: "absolute",
    left: 6,
    top: 6,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#FBBF24",
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
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    marginTop: 7,
  },

  carMeta: {
    color: "#77777C",
    fontSize: 10,
    marginTop: 3,
  },

  carNumber: {
    color: "#55555A",
    fontSize: 9,
    marginTop: 2,
  },

  /* EMPTY */

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 55,
    paddingBottom: 60,
  },

  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#24200F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },

  emptyText: {
    color: "#8E8E93",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 7,
  },

  footerText: {
    color: "#55555A",
    fontSize: 11,
    textAlign: "center",
    marginTop: 24,
    paddingHorizontal: 30,
  },
  progressCard: {
  marginHorizontal: 14,
  marginBottom: 16,
  padding: 15,
  backgroundColor: "#111111",
  borderWidth: 1,
  borderColor: "#292929",
  borderRadius: 14,
  flexDirection: "row",
  alignItems: "center",
},

progressCardIcon: {
  width: 46,
  height: 46,
  borderRadius: 23,
  backgroundColor: "#FBBF24",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
},

progressCardInfo: {
  flex: 1,
},

progressCardTitle: {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "900",
},

progressCardSubtitle: {
  color: "#77777C",
  fontSize: 11,
  lineHeight: 15,
  marginTop: 3,
},
});