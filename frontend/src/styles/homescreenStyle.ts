import {StyleSheet} from "react-native";
import {screenHeight} from "../constants/sizes.ts";

export const H_PADDING = 20;
export const FOOTER_HEIGHT = screenHeight * 0.25;
export const SPRINKLER_SIZE = 64;


export const homescreenStyle = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#8D7865',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: H_PADDING,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: '#D8F3DC',
    },
    appName: {
        fontSize: 30,
        fontWeight: '800',
        color: '#1C3D1C',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: '#000000',
        fontWeight: '500',
        marginTop: 2,
    },
    badge: {
        backgroundColor: '#2D6A4F',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    badgeText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    scroll: {
        paddingHorizontal: H_PADDING,
        paddingBottom: 16,
    },
    plantsArea: {
        flex: 1,
        backgroundColor: '#A3E3ED',
        padding: 20,
    },
    shelfSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 0,
        zIndex: 10,
    },
    slot: {
        width: 60,
        height: 80,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    emptyHint: {
        textAlign: 'center',
        color: '#95D5B2',
        fontSize: 14,
        marginTop: 8,
        fontStyle: 'italic',
    },

    /* footer */
    footer: {
        height: FOOTER_HEIGHT,
        overflow: 'visible',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 0,
    },

    fenceWrapper: {
        position: 'absolute',
        top: -36,
        left: 0,
        right: 0,
        zIndex: 1,
    },

    //bottom of the fence flowers
    flowersRow: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 12,
        zIndex: 2,
    },
    leavesLeftCorner: {
        position: 'absolute',
        top: -90,
        left: -15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 12,
        transform: [{ scaleX: -1 }],
        zIndex: 2,
    },
    leavesRightCorner: {
        position: 'absolute',
        top: -90,
        right: -15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 12,
        zIndex: 2,
    },

    footerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        zIndex: 10,
        top: -30,
    },

    footerBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 68,
        height: 68,
        borderRadius: 34,
        zIndex: 10,
    },
    footerBtnDisabled: {
        opacity: 0.5,
    },
    footerBtnEmoji: {
        fontSize: 28,
    },

    sprinklerInFooter: {
        zIndex: 10,
        elevation: 10,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },

    /* active floating sprinkler during drag */
    floatingSprinklerActive: {
        position: 'absolute',
        width: SPRINKLER_SIZE,
        height: SPRINKLER_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        elevation: 60,
    },

    /* individual water drop */
    waterDrop: {
        position: 'absolute',
        bottom: 2,
        width: 5,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#1D3AA5',
    },
});