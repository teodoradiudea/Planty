import { StyleSheet } from 'react-native';
import { FONT_FAMILY } from '../constants/theme.ts';

export const ITEM_H = 56;
export const VISIBLE = 3;
export const HALF = Math.floor(VISIBLE / 2);
export const DRUM_H = ITEM_H * VISIBLE;
export const PAD = ITEM_H * HALF;

export const clockStyle = StyleSheet.create({
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
        marginBottom: 54,
    },
    handle: {
        alignSelf: 'center',
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
        marginBottom: 16,
    },

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

    drumRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
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
    drumWrapper: {
        width: '100%',
        height: DRUM_H,
        overflow: 'hidden',
        position: 'relative',
    },
    selectionOverlay: {
        position: 'absolute',
        left: 6,
        right: 6,
        top: ITEM_H * HALF,
        height: ITEM_H,
        borderRadius: 12,
        backgroundColor: '#D8F3DC',
        borderWidth: 1.5,
        borderColor: '#95D5B2',
        zIndex: 0,
    },
    drumList: {
    },
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

    colonWrapper: {
        width: 32,
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