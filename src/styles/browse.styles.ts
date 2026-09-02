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

  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#343434",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
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

  yearText: {
    color: "#E5E5E5",
    fontSize: 14,
    fontWeight: "700",
  },

  yearTextActive: {
    color: "#FBBF24",
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

  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 6,
    gap: 8,
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 12,
    padding: 10,
  },

  listThumb: {
    width: 62,
    height: 62,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#D8D8D8",
    marginRight: 12,
  },

  listThumbImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  listThumbPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8D8D8",
  },

  listInfo: {
    flex: 1,
    minWidth: 0,
  },

  listName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  listMeta: {
    color: "#8E8E93",
    fontSize: 11,
    marginTop: 2,
  },

  listCase: {
    color: "#77777C",
    fontSize: 10,
    marginTop: 2,
    fontWeight: "700",
  },

  listActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 8,
  },

  listFoundButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  listFoundButtonActive: {
    backgroundColor: "#FBBF24",
    borderColor: "#FBBF24",
  },

  listPhotoButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
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
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#D8D8D8",
    marginBottom: 14,
  },

  detailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  detailToggleButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    alignItems: "center",
    justifyContent: "center",
  },

  detailToggleButtonActive: {
    backgroundColor: "#FBBF24",
    borderColor: "#FBBF24",
  },

  detailToggleButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  detailPhotoButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
  },

  detailPhotoButtonText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "900",
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