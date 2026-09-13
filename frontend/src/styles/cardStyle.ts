import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../constants/sizes.ts";
import { FONT_FAMILY } from "../constants/theme.ts";

export const cardWidth = 0.8*screenWidth;
export const cardHeight = 0.6*screenHeight;
export const cardBorderRadius = 30;
export const plantWidth = 0.4*cardWidth;
export const plantHeight = 0.3*cardHeight;
export const arrowSize = 16;
export const nameText = 22;
export const specieText = 14;
export const infoText = 16;
export const textColor = 'white';
export const specieColor = 'lightgreen';
export const iconColor = 'white';

export const cardStyle = StyleSheet.create({
    card: {
        width: cardWidth,
        height: cardHeight,
        borderRadius: cardBorderRadius,
        padding: 20,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
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

    content: {
        alignItems: 'center',
        gap: 12,
    },

    //plant image
    imageContainer: {
        alignItems: 'center',
    },
    plantImageBox: {
        width: plantWidth,
        height: plantHeight,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plantEmoji: {
        fontSize: 46,
    },

    //plant name
    nameRow: {
        marginTop: 8,
    },
    nameRowInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    plantName: {
        fontSize: nameText,
        color: textColor,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
    },
    nameInput: {
        fontSize: nameText,
        color: textColor,
        borderBottomWidth: 1.5,
        borderBottomColor: 'rgba(255,255,255,0.6)',
        minWidth: 120,
        paddingVertical: 2,
        fontFamily: FONT_FAMILY,
    },

    //plant specie
    specieRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: -10,
    },
    speciesText: {
        fontSize: specieText,
        color: specieColor,
        fontFamily: FONT_FAMILY,
    },

    //plant info
    plantInfoBlock: {
        alignItems: 'center',
        gap: 5,
        marginTop: 4,
        width: '100%',
    },
    plantInfoText: {
        fontSize: infoText,
        color: textColor,
        textAlign: 'center',
        lineHeight: 18,
        fontFamily: FONT_FAMILY,
    },

    //last watered
    wateringInfo: {
        fontSize: infoText,
        color: textColor,
        fontFamily: FONT_FAMILY,
    },
    wateredRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    wateredLabel: {
        fontSize: infoText,
        color: textColor,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        minWidth: 70,
        textAlign: 'center',
    },
    arrowText: {
        fontSize: arrowSize,
        color: iconColor,
    },
    arrowDisabled: {
        opacity: 0.25,
    },
    dateLabel: {
        fontSize: infoText,
        color: textColor,
        textAlign: 'center',
        minWidth: 70,
        fontFamily: FONT_FAMILY,
    },

    //edit
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    nameEditRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    //save edit
    tickButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        width: 26,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },

    //save
    saveButton: {
        backgroundColor: '#68A64D',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ABCB9F',
        alignSelf: 'center',
        paddingHorizontal: 32,
        paddingVertical: 8,
        marginTop: 40,
    },
    saveText: {
        fontSize: infoText,
        color: textColor,
        fontWeight: '700',
        fontFamily: FONT_FAMILY,
    },

    //delete
    deleteButton: {
        alignSelf: 'center',
        marginTop: 40,
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#7B6B5D',
        alignItems: 'center',
        justifyContent: 'center',
    },



    label: {
        fontSize: infoText,
        color: textColor,
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
        fontSize: infoText,
        color: textColor,
        fontFamily: FONT_FAMILY,
    },
    smallLabel: {
        fontSize: infoText,
        color: textColor,
        fontFamily: FONT_FAMILY,
    },


    // specie picker popup
    pickerBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(10, 30, 10, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerSheet: {
        width: cardWidth,
        maxHeight: 0.5 * cardHeight,
        backgroundColor: '#1C3D1C',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 4,
        elevation: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(104, 167, 77, 0.4)',
    },
    pickerTitle: {
        fontSize: nameText,
        fontWeight: '700',
        color: '#D8F3DC',
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
        backgroundColor: 'rgba(104, 167, 77, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(104, 167, 77, 0.5)',
    },
    pickerEmoji: {
        fontSize: 22,
    },
    pickerLabelGroup: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: specieText,
        color: '#D8F3DC',
        fontWeight: '600',
    },
    pickerLabelActive: {
        color: '#95D5B2',
    },
    pickerSub: {
        fontSize: infoText,
        color: 'rgba(216, 243, 220, 0.6)',
        marginTop: 1,
    },

});