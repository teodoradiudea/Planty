import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../constants/theme.ts';

// ── drum-roll geometry ───────────────────────────────────────────────────────
// VISIBLE must be odd so the selected item is always the centre row.
export const ITEM_H   = 56;   // height of each row in the drum
export const VISIBLE  = 5;    // rows shown (odd)
export const HALF     = Math.floor(VISIBLE / 2);   // rows above/below centre = 2
export const DRUM_H   = ITEM_H * VISIBLE;          // total visible height = 280
// Padding lets the first and last real items scroll to the centre slot.
export const PAD      = ITEM_H * HALF;             // = 112

export const clockStyle = StyleSheet.create({

    // ── modal backdrop + floating card ───────────────────────────────────────
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 28,
        marginHorizontal: 12,
        marginBottom: 24,
    },
    handle: {
        alignSelf: 'center',
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
        marginBottom: 16,
    },

    // ── header row ───────────────────────────────────────────────────────────
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    alarmIcon: {
        fontSize: 28,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1C3D1C',
        fontFamily: FONT_FAMILY,
    },
    subtitle: {
        fontSize: 12,
        color: '#74C69D',
        fontFamily: FONT_FAMILY,
        marginTop: 2,
    },

    // ── time preview pill ────────────────────────────────────────────────────
    previewBox: {
        alignSelf: 'center',
        backgroundColor: '#1C3D1C',
        borderRadius: 18,
        paddingHorizontal: 28,
        paddingVertical: 12,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    previewTime: {
        fontSize: 42,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        fontFamily: FONT_FAMILY,
    },
    previewPeriod: {
        fontSize: 18,
        fontWeight: '700',
        color: '#74C69D',
        letterSpacing: 1,
        fontFamily: FONT_FAMILY,
    },

    // ── drum-roll columns ────────────────────────────────────────────────────
    drumRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',        // align labels at top, drums fill below
        justifyContent: 'center',
        marginBottom: 20,
    },
    drumColumn: {
        flex: 1,
        alignItems: 'center',
    },
    columnLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 8,
        fontFamily: FONT_FAMILY,
    },
    // The wrapper must have an explicit height — do NOT use flex here,
    // or the FlatList will collapse to 0 inside a flex-row parent.
    drumWrapper: {
        width: '100%',
        height: DRUM_H,
        overflow: 'hidden',
        position: 'relative',
    },
    // Green highlight behind the centre row
    selectionOverlay: {
        position: 'absolute',
        left: 6,
        right: 6,
        top: ITEM_H * HALF,   // e.g. 56*2 = 112 for VISIBLE=5
        height: ITEM_H,
        borderRadius: 12,
        backgroundColor: '#D8F3DC',
        borderWidth: 1.5,
        borderColor: '#95D5B2',
        zIndex: 0,
    },
    drumList: {
        // no flex — let the parent drumWrapper's explicit height control size
    },
    // paddingVertical = PAD makes the first & last items centre-able
    drumContent: {
        paddingVertical: PAD,
    },
    drumItem: {
        height: ITEM_H,
        alignItems: 'center',
        justifyContent: 'center',
    },
    drumText: {
        fontSize: 22,
        fontWeight: '500',
        color: '#9CA3AF',
        fontFamily: FONT_FAMILY,
    },
    drumTextSelected: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1C3D1C',
        fontFamily: FONT_FAMILY,
    },

    // ── colon separator ───────────────────────────────────────────────────────
    colonWrapper: {
        width: 32,
        // vertically align with the drum centre row
        marginBottom: (DRUM_H - ITEM_H) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        height: ITEM_H,
    },
    colonText: {
        fontSize: 30,
        fontWeight: '800',
        color: '#1C3D1C',
    },

    // ── action buttons ────────────────────────────────────────────────────────
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
        fontFamily: FONT_FAMILY,
    },
    confirmBtn: {
        flex: 2,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#2D6A4F',
        alignItems: 'center',
    },
    confirmText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.3,
        fontFamily: FONT_FAMILY,
    },
});