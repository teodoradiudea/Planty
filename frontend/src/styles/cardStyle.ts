import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../constants/sizes.ts";
import { FONT_FAMILY } from "../constants/theme.ts";

export const cardStyle = StyleSheet.create({
    // --- SHARED/MERGED BACKDROPS ---
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(10, 30, 10, 0.55)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backdropBottom: { // Formerly backdrop2
        flex: 1,
        backgroundColor: 'rgba(10, 30, 10, 0.55)',
        justifyContent: 'flex-end',
    },

    // --- SHARED/MERGED ELEMENTS ---
    plantEmoji: { // Formerly plantEmoji and plantEmoji3
        fontSize: 46,
    },
    arrowText: { // Formerly arrowText and arrowText3
        fontSize: 11,
        color: 'rgba(255,255,255,0.85)',
    },
    arrowDisabled: { // Formerly arrowDisabled and arrowDisabled3
        opacity: 0.25,
    },
    wateredRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    wateredRowCentered: { // Formerly wateredRow3
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    // --- MAIN CARD ---
    card: {
        width: 0.8 * screenWidth,
        height: 0.7 * screenHeight,
        borderRadius: 18,
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 20,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 12,
    },
    closeIconBtn: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        width: 26,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        gap: 12,
    },
    imageContainer: {
        alignItems: 'center',
    },
    plantImageBox: {
        width: 90,
        height: 90,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameRow: {
        marginTop: 8,
    },
    nameRowInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    plantName: {
        fontSize: 16,
        color: '#fff',
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
    },
    nameInput: {
        fontSize: 16,
        color: '#fff',
        borderBottomWidth: 1.5,
        borderBottomColor: 'rgba(255,255,255,0.6)',
        minWidth: 120,
        paddingVertical: 2,
        fontFamily: FONT_FAMILY,
    },
    specieRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    label: {
        fontSize: 12,
        color: '#fff',
        fontFamily: FONT_FAMILY,
    },
    selectBadge: {
        backgroundColor: 'rgba(158, 162, 159, 0.58)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#586458',
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    selectText: {
        fontSize: 12,
        color: '#fff',
        fontFamily: FONT_FAMILY,
    },
    wateringHint: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: FONT_FAMILY,
    },
    dateLabel: {
        fontSize: 11,
        color: '#fff',
        textAlign: 'center',
        minWidth: 70,
        fontFamily: FONT_FAMILY,
    },
    smallLabel: {
        fontSize: 11,
        color: '#fff',
        fontFamily: FONT_FAMILY,
    },
    saveButton: {
        backgroundColor: '#68A64D',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ABCB9F',
        alignSelf: 'center',
        paddingHorizontal: 32,
        paddingVertical: 8,
        marginTop: 16,
    },
    saveText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '700',
        fontFamily: FONT_FAMILY,
    },

    // --- SPECIE PICKER ---
    pickerBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(10, 30, 10, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerSheet: {
        width: 280,
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 4,
        maxHeight: 400,
        elevation: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
    },
    pickerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1C3D1C',
        textAlign: 'center',
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 12,
        borderRadius: 12,
        marginHorizontal: 8,
    },
    pickerRowActive: {
        backgroundColor: '#F0FFF4',
    },
    pickerEmoji: {
        fontSize: 22,
    },
    pickerLabelGroup: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: 15,
        color: '#2D6A4F',
        fontWeight: '600',
    },
    pickerLabelActive: {
        color: '#68A64D',
    },
    pickerSub: {
        fontSize: 11,
        color: '#9E9E9E',
        marginTop: 1,
    },

    // --- FORM MODAL ---
    kav: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 22,
        paddingTop: 12,
        maxHeight: '92%',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#D1E8D8',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    header2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1C3D1C',
        letterSpacing: -0.3,
    },
    closeBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#F0F4F1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: {
        fontSize: 14,
        color: '#5A7A5A',
        fontWeight: '600',
    },
    label2: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2D6A4F',
        marginBottom: 8,
        marginTop: 16,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#C8E6D4',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 13,
        fontSize: 15,
        color: '#1C1C1E',
        backgroundColor: '#FAFFFE',
    },

    // --- SPECIES SELECTOR (FORM) ---
    segmentRow: {
        flexDirection: 'row',
        gap: 10,
    },
    segmentBtn: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#C8E6D4',
        alignItems: 'center',
        backgroundColor: '#FAFFFE',
    },
    segmentBtnActive: {
        backgroundColor: '#2D6A4F',
        borderColor: '#2D6A4F',
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D6A4F',
    },
    segmentTextActive: {
        color: '#FFFFFF',
    },

    // --- DATE PRESETS (FORM) ---
    presetRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    presetBtn: {
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: '#C8E6D4',
        backgroundColor: '#FAFFFE',
    },
    presetBtnActive: {
        backgroundColor: '#52B788',
        borderColor: '#52B788',
    },
    presetText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2D6A4F',
    },
    presetTextActive: {
        color: '#FFFFFF',
    },

    // --- BUTTONS (FORM) ---
    saveBtn: {
        backgroundColor: '#2D6A4F',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 28,
        elevation: 3,
        shadowColor: '#2D6A4F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    deleteBtn: {
        backgroundColor: '#FFF5F5',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1.5,
        borderColor: '#FFCDD2',
    },
    deleteBtnText: {
        color: '#C62828',
        fontSize: 15,
        fontWeight: '700',
    },
    bottomPad: {
        height: 28,
    },

    // --- INFO CARD ---
    card3: {
        width: 320,
        borderRadius: 18,
        padding: 20,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
    },
    closeButton: {
        position: 'absolute',
        top: 14,
        right: 14,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    content3: {
        alignItems: 'center',
        paddingTop: 12,
        gap: 10,
    },
    imagePlaceholder: {
        width: 90,
        height: 90,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nameRow3: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    plantName3: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        maxWidth: 220,
        fontFamily: FONT_FAMILY,
    },
    pencilIcon: {
        fontSize: 12,
    },
    nameEditRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    nameInput3: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(255,255,255,0.7)',
        minWidth: 120,
        maxWidth: 200,
        paddingVertical: 2,
        paddingHorizontal: 4,
        fontFamily: FONT_FAMILY,
    },
    tickButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        width: 26,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tickIcon: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    speciesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    speciesText: {
        fontSize: 13,
        color: '#D3EDD3',
        fontFamily: FONT_FAMILY,
    },
    speciesDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    infoBlock: {
        alignItems: 'center',
        gap: 5,
        marginTop: 4,
        width: '100%',
    },
    infoText: {
        fontSize: 12,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 18,
        fontFamily: FONT_FAMILY,
    },
    wateredLabel: {
        fontSize: 12,
        color: '#FFFFFF',
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        minWidth: 70,
        textAlign: 'center',
    },
    deleteButton: {
        alignSelf: 'flex-end',
        marginTop: 16,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#7B6B5D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteIcon: {
        fontSize: 16,
    },
});