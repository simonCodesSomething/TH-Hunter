import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  content: {
    paddingTop: 12,
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
    marginBottom: 18,
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

  infoButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  subtitle: {
    color: "#A1A1A6",
    fontSize: 14,
    marginTop: 4,
  },

  /* HERO */

  heroCard: {
    marginHorizontal: 14,
    marginBottom: 24,
    padding: 20,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 18,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroEyebrow: {
    color: "#FBBF24",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 43,
    fontWeight: "900",
    marginTop: 4,
  },

  heroSubtitle: {
    color: "#8E8E93",
    fontSize: 14,
    marginTop: 2,
  },

  progressCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 5,
    borderColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
  },

  progressCircleValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  progressCircleLabel: {
    color: "#8E8E93",
    fontSize: 7,
    fontWeight: "800",
    marginTop: 1,
  },

  heroTrack: {
    height: 8,
    backgroundColor: "#292929",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 22,
  },

  heroFill: {
    height: "100%",
    backgroundColor: "#FBBF24",
    borderRadius: 4,
  },

  /* SECTION HEADERS */

  sectionHeader: {
    paddingHorizontal: 18,
    marginBottom: 10,
    marginTop: 4,
  },

  nextSectionHeader: {
    marginTop: 0,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  sectionSubtitle: {
    color: "#77777C",
    fontSize: 13,
    marginTop: 3,
  },

  /* PROGRESS CARDS */

  progressCard: {
    marginHorizontal: 14,
    marginBottom: 10,
    padding: 16,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 14,
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  progressTitleContainer: {
    flex: 1,
  },

  progressTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  progressSubtitle: {
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 3,
  },

  progressPercentage: {
    fontSize: 20,
    fontWeight: "900",
  },

  progressTrack: {
    height: 7,
    backgroundColor: "#292929",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 15,
  },

  progressFill: {
    height: "100%",
    borderRadius: 4,
  },

  /* HUNT SECTIONS */

  huntSection: {
    marginBottom: 12,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: "#050505",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#292929",
  },

  huntSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  smallTypeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  smallTypeIconText: {
    color: "#111111",
    fontSize: 9,
    fontWeight: "900",
  },

  huntSectionTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  huntSectionCount: {
    fontSize: 18,
    fontWeight: "900",
    marginRight: 4,
  },

  cardsRow: {
    paddingHorizontal: 12,
    gap: 10,
  },

  /* CAR CARDS */

  carCard: {
    width: 142,
  },

  carCardFound: {
    opacity: 0.75,
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

  carGraphic: {
    width: "100%",
    height: "100%",
    backgroundColor: "#D8D8D8",
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    marginTop: 7,
  },

  carSeries: {
    color: "#77777C",
    fontSize: 11,
    marginTop: 3,
  },

  /* COMPLETE */

  completeCard: {
    marginHorizontal: 14,
    marginTop: 8,
    marginBottom: 22,
    padding: 22,
    borderRadius: 16,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#FBBF24",
    alignItems: "center",
  },

  completeIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  completeTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  completeText: {
    color: "#8E8E93",
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },

  /* RECENT FINDS */

  recentList: {
    marginHorizontal: 14,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 14,
    overflow: "hidden",
  },

  recentRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#292929",
  },

  recentIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  recentPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 21,
  },

  recentInfo: {
    flex: 1,
  },

  recentName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  recentMeta: {
    color: "#77777C",
    fontSize: 11,
    marginTop: 3,
  },

  /* RESET */

  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 14,
    marginTop: 24,
    paddingVertical: 14,
  },

  resetText: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 7,
  },

  /* EMPTY STATE */

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 16,
  },

  emptyText: {
    color: "#8E8E93",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },
  yearSection: {
  marginBottom: 18,
},

yearSectionHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 14,
  marginBottom: 10,
},

yearSelectedLabel: {
  color: "#FBBF24",
  fontSize: 14,
  fontWeight: "900",
},

yearHeaderAction: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
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
  backgroundColor: "#FBBF24",
  borderColor: "#FBBF24",
},

yearChipText: {
  color: "#E5E5E5",
  fontSize: 14,
  fontWeight: "700",
},

yearChipTextActive: {
  color: "#111111",
  fontWeight: "900",
},

typeRow: {
  flexDirection: "row",
  gap: 8,
  paddingHorizontal: 12,
  paddingTop: 6,
},

typeChip: {
  flex: 1,
  height: 36,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#111111",
  borderWidth: 1,
  borderColor: "#292929",
  borderRadius: 10,
},

typeChipActive: {
  backgroundColor: "#FBBF24",
  borderColor: "#FBBF24",
},

typeChipText: {
  color: "#8E8E93",
  fontSize: 12,
  fontWeight: "900",
},

typeChipTextActive: {
  color: "#111111",
},
});