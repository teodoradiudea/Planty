import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../constants/sizes.ts";
import { FONT_FAMILY } from "../constants/theme.ts";

export const cardStyle = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(10, 30, 10, 0.55)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 12,
    },
    closeButton: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '900',
    },
    plantEmoji: {
        fontSize: 46,
    },
    arrowText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.85)',
    },
    arrowDisabled: {
        opacity: 0.25,
    },
    wateredRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dateLabel: {
        fontSize: 11,
        color: '#fff',
        textAlign: 'center',
        minWidth: 70,
        fontFamily: FONT_FAMILY,
    },

    // ─── ADD PLANT CARD ─────────────────────────────────────────────────

    card: {
        width: 0.7 * screenWidth,
        height: 0.5 * screenHeight,
        // borderColor: 'rgba(255,255,255,0.5)',
        // borderWidth: 3,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 20,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    content: {
        alignItems: 'center',
        gap: 12,
    },
    imageContainer: {
        alignItems: 'center',
    },
    plantImageBox: {
        width: 100,
        height: 120,
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
        fontSize: 16,
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
        fontSize: 16,
        color: '#fff',
        fontFamily: FONT_FAMILY,
    },
    wateringHint: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: FONT_FAMILY,
    },
    smallLabel: {
        fontSize: 14,
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

    // ─── SPECIE PICKER ──────────────────────────────────────────────────

    pickerBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(10, 30, 10, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerSheet: {
        width: 0.7 * screenWidth,
        maxHeight: 0.5 * screenHeight,
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 4,
        elevation: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
    },
    pickerTitle: {
        fontSize: 16,
        fontWeight: '700',
        // color: '#1C3D1C',
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
        backgroundColor: 'rgb(31 188 13 / 0.3)',
    },
    pickerEmoji: {
        fontSize: 22,
    },
    pickerLabelGroup: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: 16,
        // color: '#2D6A4F',
        fontWeight: '600',
    },
    pickerLabelActive: {
        // color: '#68A64D',
    },
    pickerSub: {
        fontSize: 14,
        // color: '#9E9E9E',
        marginTop: 1,
    },

    // ─── PLANT INFO CARD ────────────────────────────────────────────────
    pencilIcon: {
        fontSize: 12,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    nameEditRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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
        alignSelf: 'center',
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