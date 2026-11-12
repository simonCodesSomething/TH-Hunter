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

  summaryProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#292929",
  },

  summaryProgressIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  summaryProgressInfo: {
    flex: 1,
  },

  summaryProgressTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  summaryProgressSubtitle: {
    color: "#77777C",
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },

  /* SEARCH */

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 14,
    gap: 8,
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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

  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  filterIndicator: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FBBF24",
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.62)",
  },

  filterModal: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
    backgroundColor: "#101010",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: "#292929",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  modalSectionTitle: {
    color: "#77777C",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 9,
  },

  modalChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },

  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: "#A1A1A6",
    fontSize: 12,
    fontWeight: "900",
  },

  applyButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
  },

  applyButtonText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "900",
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
    marginTop: 10,
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

  /* LIST */

  list: {
    paddingHorizontal: 14,
    gap: 5,
  },

  carRow: {
    minHeight: 62,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
  },

  carInfo: {
    flex: 1,
    marginHorizontal: 10,
  },

  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  editButton: {
    alignSelf: "center",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  editButtonText: {
    color: "#FBBF24",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.6,
  },

  detailModalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  detailModal: {
    backgroundColor: "#101010",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: "#292929",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
  },

  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  detailTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    flex: 1,
    marginRight: 12,
  },

detailImageWrap: {
  width: "100%",
  height: 340,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12,
},

detailPhotoFrame: {
  height: "100%",
  aspectRatio: 3 / 4,
  borderRadius: 18,
  overflow: "hidden",
  backgroundColor: "#FFFFFF",
},

detailImage: {
  width: "100%",
  height: "100%",
},

  detailImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#D8D8D8",
    alignItems: "center",
    justifyContent: "center",
  },

  detailMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  detailTypeBadge: {
    minWidth: 48,
    height: 26,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  detailTypeBadgeText: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
  },

  detailYear: {
    color: "#FBBF24",
    fontSize: 18,
    fontWeight: "900",
  },

  detailSeries: {
    color: "#A1A1A6",
    fontSize: 13,
    marginBottom: 12,
  },

  detailGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  detailStat: {
    flex: 1,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 10,
    padding: 10,
  },

  detailStatLabel: {
    color: "#77777C",
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 5,
  },

  detailStatValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  detailNotesTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 6,
  },

  detailNotes: {
    color: "#A1A1A6",
    fontSize: 12,
    lineHeight: 18,
  },

detailActions: {
  flexDirection: "column",
  width: "100%",
  gap: 12,
  marginTop: 20,
},

detailPhotoButton: {
  width: "100%",
  minHeight: 52,
  backgroundColor: "#FBBF24",
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
},

  detailPhotoButtonText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "900",
  },

  typeBadge: {
    width: 48,
    height: 48,
    paddingHorizontal: 5,
    borderRadius: 10,
    flexShrink: 0,
    flexDirection: "column",
    gap: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  typeBadgeText: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
  },

  carName: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
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