import {StyleSheet} from "react-native";

export const ITEM_HEIGHT = 52;
export const VISIBLE_ITEMS = 5;
export const LIST_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export const clockStyle = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    handle: {
        alignSelf: 'center',
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#D1D5DB',
        marginTop: 12,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C3D1C',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: '#74C69D',
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 12,
    },
    preview: {
        alignSelf: 'center',
        backgroundColor: '#D8F3DC',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 8,
        marginBottom: 16,
    },
    previewText: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1C3D1C',
        letterSpacing: 1,
    },
    pickerContainer: {
        flexDirection: 'row',
        height: LIST_HEIGHT,
        position: 'relative',
        marginBottom: 16,
        overflow: 'hidden',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectionBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: ITEM_HEIGHT * 2,
        height: ITEM_HEIGHT,
        backgroundColor: '#D8F3DC',
        zIndex: 0,
    },
    column: {
        flex: 1,
        alignItems: 'center',
    },
    columnLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        paddingVertical: 6,
        backgroundColor: '#FFFFFF',
        alignSelf: 'stretch',
        textAlign: 'center',
    },
    columnDivider: {
        width: 1,
        backgroundColor: '#E5E7EB',
    },
    list: {
        flex: 1,
        width: '100%',
    },
    listContent: {
        paddingVertical: ITEM_HEIGHT * 2,
    },
    item: {
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    itemSelected: {},
    itemText: {
        fontSize: 17,
        color: '#6B7280',
        fontWeight: '500',
    },
    itemTextSelected: {
        fontSize: 19,
        fontWeight: '800',
        color: '#2D6A4F',
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
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#2D6A4F',
        alignItems: 'center',
    },
    confirmText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});