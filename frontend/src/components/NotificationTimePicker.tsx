import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface NotificationTimePickerProps {
  visible: boolean;
  currentHour: number;
  onSelect: (hour: number) => void;
  onClose: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const formatHour = (h: number): string => {
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:00 ${period}`;
};

const NotificationTimePicker: React.FC<NotificationTimePickerProps> = ({
  visible,
  currentHour,
  onSelect,
  onClose,
}) => {
  const [selected, setSelected] = useState(currentHour);

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
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
          {/* Handle bar */}
          <View style={styles.handle} />

          <Text style={styles.title}>🔔 Notification Time</Text>
          <Text style={styles.subtitle}>
            Choose what hour you'd like to receive watering reminders
          </Text>

          <FlatList
            data={HOURS}
            keyExtractor={item => String(item)}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: hour }) => {
              const isSelected = hour === selected;
              return (
                <TouchableOpacity
                  style={[styles.hourRow, isSelected && styles.hourRowSelected]}
                  onPress={() => setSelected(hour)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.hourText,
                      isSelected && styles.hourTextSelected,
                    ]}
                  >
                    {formatHour(hour)}
                  </Text>
                  {isSelected && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />

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
    maxHeight: '60%',
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
    marginBottom: 16,
  },
  list: {
    flexGrow: 0,
    maxHeight: 280,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  hourRowSelected: {
    backgroundColor: '#D8F3DC',
  },
  hourText: {
    fontSize: 16,
    color: '#1C3D1C',
    fontWeight: '500',
  },
  hourTextSelected: {
    fontWeight: '700',
    color: '#2D6A4F',
  },
  check: {
    fontSize: 18,
    color: '#2D6A4F',
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
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
