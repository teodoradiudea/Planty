import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ViewToken } from 'react-native';
import {clockStyle, ITEM_HEIGHT} from "../styles/clockStyle.ts";

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
        style={[clockStyle.item, isSelected && clockStyle.itemSelected]}
        onPress={() => {
          setSelectedHour(hour);
          hourListRef.current?.scrollToIndex({ index: hour, animated: true });
        }}
        activeOpacity={0.7}
      >
        <Text style={[clockStyle.itemText, isSelected && clockStyle.itemTextSelected]}>
          {hourLabel(hour)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMinute = ({ item: minute }: { item: number }) => {
    const isSelected = minute === selectedMinute;
    return (
      <TouchableOpacity
        style={[clockStyle.item, isSelected && clockStyle.itemSelected]}
        onPress={() => {
          setSelectedMinute(minute);
          minuteListRef.current?.scrollToIndex({ index: minute, animated: true });
        }}
        activeOpacity={0.7}
      >
        <Text style={[clockStyle.itemText, isSelected && clockStyle.itemTextSelected]}>
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
      <View style={clockStyle.backdrop}>
        <View style={clockStyle.sheet}>
          <View style={clockStyle.handle} />
          <Text style={clockStyle.title}>Notification Time</Text>
          <Text style={clockStyle.subtitle}>
            Choose the time to receive watering reminders
          </Text>
          <View style={clockStyle.preview}>
            <Text style={clockStyle.previewText}>
              {hourLabel(selectedHour)} :{pad(selectedMinute)}
            </Text>
          </View>
          <View style={clockStyle.pickerContainer}>
            <View style={clockStyle.selectionBar} pointerEvents="none" />
            <View style={clockStyle.column}>
              <Text style={clockStyle.columnLabel}>Hour</Text>
              <FlatList
                ref={hourListRef}
                data={HOURS}
                keyExtractor={item => 'h-' + item}
                renderItem={renderHour}
                showsVerticalScrollIndicator={false}
                style={clockStyle.list}
                contentContainerStyle={clockStyle.listContent}
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
            <View style={clockStyle.columnDivider} />
            <View style={clockStyle.column}>
              <Text style={clockStyle.columnLabel}>Min</Text>
              <FlatList
                ref={minuteListRef}
                data={MINUTES}
                keyExtractor={item => 'm-' + item}
                renderItem={renderMinute}
                showsVerticalScrollIndicator={false}
                style={clockStyle.list}
                contentContainerStyle={clockStyle.listContent}
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
          <View style={clockStyle.buttonRow}>
            <TouchableOpacity style={clockStyle.cancelBtn} onPress={onClose}>
              <Text style={clockStyle.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={clockStyle.confirmBtn} onPress={handleConfirm}>
              <Text style={clockStyle.confirmText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationTimePicker;