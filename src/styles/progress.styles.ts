import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  content: {
    paddingTop: 4,
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  subtitle: {
    color: "#A1A1A6",
    fontSize: 14,
    marginTop: 4,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  /* HERO */

  heroCard: {
    marginHorizontal: 14,
    marginBottom: 22,
    padding: 20,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 18,
  },

  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroEyebrow: {
    color: "#FBBF24",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "900",
    marginTop: 3,
  },

  heroSubtitle: {
    color: "#8E8E93",
    fontSize: 13,
    marginTop: 2,
  },

  heroCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 5,
    borderColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
  },

  heroCircleValue: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
  },

  heroCircleLabel: {
    color: "#77777C",
    fontSize: 7,
    fontWeight: "900",
    marginTop: 1,
  },

  heroTrack: {
    height: 9,
    backgroundColor: "#292929",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 22,
  },

  heroFill: {
    height: "100%",
    backgroundColor: "#FBBF24",
    borderRadius: 5,
  },

  /* SECTIONS */

  sectionHeader: {
    paddingHorizontal: 18,
    marginBottom: 10,
    marginTop: 3,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  sectionSubtitle: {
    color: "#77777C",
    fontSize: 12,
    marginTop: 3,
  },

  /* TYPE PROGRESS */

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
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  progressInfo: {
    flex: 1,
  },

  progressTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  progressSubtitle: {
    color: "#8E8E93",
    fontSize: 11,
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
    marginTop: 14,
  },

  progressFill: {
    height: "100%",
    borderRadius: 4,
  },

  /* YEAR HERO */

  yearHeroCard: {
    marginHorizontal: 14,
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 14,
  },

  yearHeroTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  yearIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  yearInfo: {
    flex: 1,
  },

  yearTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  yearSubtitle: {
    color: "#8E8E93",
    fontSize: 11,
    marginTop: 3,
  },

  yearPercentage: {
    color: "#FBBF24",
    fontSize: 20,
    fontWeight: "900",
  },

  /* YEAR LIST */

  yearList: {
    marginHorizontal: 14,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
  },

  yearRow: {
    minHeight: 70,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#292929",
  },

  yearRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  yearDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  yearDotComplete: {
    backgroundColor: "#FBBF24",
  },

  yearRowInfo: {
    flex: 1,
  },

  yearRowTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  yearRowSubtitle: {
    color: "#77777C",
    fontSize: 10,
    marginTop: 3,
  },

  yearRowRight: {
    width: 90,
    alignItems: "flex-end",
  },

  yearRowPercentage: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 5,
  },

  miniTrack: {
    width: 80,
    height: 4,
    backgroundColor: "#292929",
    borderRadius: 2,
    overflow: "hidden",
  },

  miniFill: {
    height: "100%",
    backgroundColor: "#FBBF24",
    borderRadius: 2,
  },

  /* MILESTONES */

  milestoneGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 20,
  },

  milestone: {
    width: "31.8%",
    minHeight: 126,
    padding: 12,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 13,
    alignItems: "center",
  },

  milestoneUnlocked: {
    borderColor: "#FBBF24",
  },

  milestoneIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  milestoneIconUnlocked: {
    backgroundColor: "#FBBF24",
  },

  milestoneTitle: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },

  milestoneText: {
    color: "#77777C",
    fontSize: 9,
    lineHeight: 12,
    textAlign: "center",
    marginTop: 4,
  },

  /* COMPLETED YEARS */

  completedYears: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 8,
  },

  completedYear: {
    height: 38,
    paddingHorizontal: 13,
    borderRadius: 19,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#FBBF24",
    flexDirection: "row",
    alignItems: "center",
  },

  completedYearText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 6,
  },
  yearSelector: {
  paddingHorizontal: 14,
  paddingBottom: 4,
  gap: 8,
},

yearChip: {
  minWidth: 72,
  height: 38,
  paddingHorizontal: 16,
  borderRadius: 19,
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

yearChipText: {
  color: "#8E8E93",
  fontSize: 13,
  fontWeight: "800",
},

yearChipTextActive: {
  color: "#111111",
},

yearRowActive: {
  borderColor: "#FBBF24",
  borderWidth: 1,
},
});