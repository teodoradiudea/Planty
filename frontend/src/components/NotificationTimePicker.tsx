import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ViewToken } from 'react-native';

interface NotificationTimePickerProps {
  visible: boolean;
  currentHour?: number;
  currentMinute?: number;
  onSelect?: (hour: number, minute: number) => void;
  onClose: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const pad = (n: number) => String(n).padStart(2, '0');

const hourLabel = (h: number): string => {
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return display + ' ' + period;
};

const ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 5;
const LIST_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const NotificationTimePicker: React.FC<NotificationTimePickerProps> = ({
  visible,
  currentHour,
  currentMinute,
  onSelect,
  onClose,
}) => {
  const [selectedHour, setSelectedHour] = useState<number>(currentHour ?? 17);
  const [selectedMinute, setSelectedMinute] = useState<number>(currentMinute ?? 0);

  const hourListRef = useRef<FlatList>(null);
  const minuteListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!visible) { return; }
    const h = currentHour ?? 17;
    const m = currentMinute ?? 0;
    setSelectedHour(h);
    setSelectedMinute(m);
    setTimeout(() => {
      hourListRef.current?.scrollToIndex({ index: h, animated: false });
      minuteListRef.current?.scrollToIndex({ index: m, animated: false });
    }, 80);
  }, [visible, currentHour, currentMinute]);

  const handleConfirm = () => {
    onSelect?.(selectedHour, selectedMinute);
    onClose();
  };

  const onViewableHoursChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const mid = viewableItems[Math.floor(viewableItems.length / 2)];
      if (mid?.item !== undefined) { setSelectedHour(mid.item as number); }
    }
  }).current;

  const onViewableMinutesChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const mid = viewableItems[Math.floor(viewableItems.length / 2)];
      if (mid?.item !== undefined) { setSelectedMinute(mid.item as number); }
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const renderHour = ({ item: hour }: { item: number }) => {
    const isSelected = hour === selectedHour;
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => {
          setSelectedHour(hour);
          hourListRef.current?.scrollToIndex({ index: hour, animated: true });
        }}
        activeOpacity={0.7}
      >
        <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
          {hourLabel(hour)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMinute = ({ item: minute }: { item: number }) => {
    const isSelected = minute === selectedMinute;
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => {
          setSelectedMinute(minute);
          minuteListRef.current?.scrollToIndex({ index: minute, animated: true });
        }}
        activeOpacity={0.7}
      >
        <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
          :{pad(minute)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Notification Time</Text>
          <Text style={styles.subtitle}>
            Choose the time to receive watering reminders
          </Text>
          <View style={styles.preview}>
            <Text style={styles.previewText}>
              {hourLabel(selectedHour)} :{pad(selectedMinute)}
            </Text>
          </View>
          <View style={styles.pickerContainer}>
            <View style={styles.selectionBar} pointerEvents="none" />
            <View style={styles.column}>
              <Text style={styles.columnLabel}>Hour</Text>
              <FlatList
                ref={hourListRef}
                data={HOURS}
                keyExtractor={item => 'h-' + item}
                renderItem={renderHour}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })}
                onViewableItemsChanged={onViewableHoursChanged}
                viewabilityConfig={viewabilityConfig}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
              />
            </View>
            <View style={styles.columnDivider} />
            <View style={styles.column}>
              <Text style={styles.columnLabel}>Min</Text>
              <FlatList
                ref={minuteListRef}
                data={MINUTES}
                keyExtractor={item => 'm-' + item}
                renderItem={renderMinute}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index,
                })}
                onViewableItemsChanged={onViewableMinutesChanged}
                viewabilityConfig={viewabilityConfig}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
              />
            </View>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default NotificationTimePicker;