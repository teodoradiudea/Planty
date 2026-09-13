import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ViewToken } from 'react-native';
import { clockStyle, ITEM_H, PAD } from '../styles/clockStyle.ts';

interface NotificationTimePickerProps {
  visible: boolean;
  currentHour?: number;
  currentMinute?: number;
  onSelect?: (hour: number, minute: number) => void;
  onClose: () => void;
}

const HOURS   = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const pad = (n: number) => String(n).padStart(2, '0');
const periodLabel = (h: number) => (h >= 12 ? 'PM' : 'AM');

/* ─── DrumColumn ─────────────────────────────────────────────────────────── */

interface DrumColumnProps {
  data: number[];
  selected: number;
  onSelect: (val: number) => void;
  format: (val: number) => string;
  keyPrefix: string;
  listRef: React.RefObject<FlatList<number> | null>;
}

const DrumColumn: React.FC<DrumColumnProps> = ({
  data,
  selected,
  onSelect,
  format,
  keyPrefix,
  listRef,
}) => {
  // Fires while the user is scrolling; picks the centred item.
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const mid = viewableItems[Math.floor(viewableItems.length / 2)];
        if (mid?.item !== undefined) {
          onSelect(mid.item as number);
        }
      }
    },
    [onSelect],
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = useCallback(
    ({ item }: { item: number }) => {
      const isSelected = item === selected;
      return (
        <TouchableOpacity
          style={clockStyle.drumItem}
          onPress={() => {
            onSelect(item);
            listRef.current?.scrollToIndex({ index: item, animated: true });
          }}
          activeOpacity={0.6}
        >
          <Text
            style={[
              clockStyle.drumText,
              isSelected && clockStyle.drumTextSelected,
            ]}
          >
            {format(item)}
          </Text>
        </TouchableOpacity>
      );
    },
    [selected, format, onSelect, listRef],
  );

  return (
    <View style={clockStyle.drumWrapper}>
      {/* highlight behind the centre row */}
      <View style={clockStyle.selectionOverlay} pointerEvents="none" />
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={item => keyPrefix + item}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={clockStyle.drumList}
        contentContainerStyle={clockStyle.drumContent}
        getItemLayout={(_, index) => ({
          length: ITEM_H,
          // offset must account for the top padding so scrollToIndex lands correctly
          offset: PAD + ITEM_H * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        initialNumToRender={24}
        maxToRenderPerBatch={24}
      />
    </View>
  );
};

/* ─── NotificationTimePicker ─────────────────────────────────────────────── */

const NotificationTimePicker: React.FC<NotificationTimePickerProps> = ({
  visible,
  currentHour,
  currentMinute,
  onSelect,
  onClose,
}) => {
  const [selectedHour, setSelectedHour]     = useState<number>(currentHour   ?? 17);
  const [selectedMinute, setSelectedMinute] = useState<number>(currentMinute ?? 0);

  const hourListRef   = useRef<FlatList<number>>(null);
  const minuteListRef = useRef<FlatList<number>>(null);

  useEffect(() => {
    if (!visible) { return; }
    const h = currentHour   ?? 17;
    const m = currentMinute ?? 0;
    setSelectedHour(h);
    setSelectedMinute(m);
    // Small delay lets the modal finish mounting before scrolling
    setTimeout(() => {
      hourListRef.current?.scrollToIndex({ index: h, animated: false });
      minuteListRef.current?.scrollToIndex({ index: m, animated: false });
    }, 100);
  }, [visible, currentHour, currentMinute]);

  const handleConfirm = () => {
    onSelect?.(selectedHour, selectedMinute);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={clockStyle.backdrop}>
        <View style={clockStyle.sheet}>

          {/* drag handle */}
          <View style={clockStyle.handle} />

          {/* header */}
          <View style={clockStyle.headerRow}>
            <Text style={clockStyle.alarmIcon}>⏰</Text>
            <View style={clockStyle.headerRight}>
              <Text style={clockStyle.title}>Reminder Time</Text>
              <Text style={clockStyle.subtitle}>daily watering alert</Text>
            </View>
          </View>

          {/* live time preview */}
          <View style={clockStyle.previewBox}>
            <Text style={clockStyle.previewTime}>
              {pad(selectedHour)}:{pad(selectedMinute)}
            </Text>
            <Text style={clockStyle.previewPeriod}>
              {periodLabel(selectedHour)}
            </Text>
          </View>

          {/* drum-roll pickers */}
          <View style={clockStyle.drumRow}>
            {/* Hour */}
            <View style={clockStyle.drumColumn}>
              <Text style={clockStyle.columnLabel}>Hour</Text>
              <DrumColumn
                data={HOURS}
                selected={selectedHour}
                onSelect={setSelectedHour}
                format={pad}
                keyPrefix="h"
                listRef={hourListRef}
              />
            </View>

            {/* colon — vertically centred on the selection row */}
            <View style={clockStyle.colonWrapper}>
              <Text style={clockStyle.colonText}>:</Text>
            </View>

            {/* Minute */}
            <View style={clockStyle.drumColumn}>
              <Text style={clockStyle.columnLabel}>Min</Text>
              <DrumColumn
                data={MINUTES}
                selected={selectedMinute}
                onSelect={setSelectedMinute}
                format={pad}
                keyPrefix="m"
                listRef={minuteListRef}
              />
            </View>
          </View>

          {/* buttons */}
          <View style={clockStyle.buttonRow}>
            <TouchableOpacity style={clockStyle.cancelBtn} onPress={onClose}>
              <Text style={clockStyle.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={clockStyle.confirmBtn} onPress={handleConfirm}>
              <Text style={clockStyle.confirmText}>Set Alarm</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default NotificationTimePicker;