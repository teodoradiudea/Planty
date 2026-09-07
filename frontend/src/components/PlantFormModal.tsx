import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AVAILABLE_SPECIES } from '../constants/plantOptions';
import { computeStatus } from '../services/statusComputer';
import type { Plant, PlantFormData } from '../types/Plant';

interface PlantFormModalProps {
  visible: boolean;
  plant?: Plant | null;
  onSave: (data: PlantFormData) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const MAX_DAYS_AGO = 7;

/** Returns a local YYYY-MM-DD string for `daysAgo` days before today */
const localDateStr = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
};

const dateLabelStr = (daysAgo: number): string => {
  if (daysAgo === 0) { return 'Today'; }
  if (daysAgo === 1) { return 'Yesterday'; }
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
};

/** Returns a fresh default form — called each time the modal opens */
const makeDefaultForm = (): PlantFormData => {
  const specie = AVAILABLE_SPECIES[0];
  const last_watered = localDateStr(0);
  return {
    name: '',
    specie,
    status: computeStatus(last_watered, specie.wateringDays),
    last_watered,
    watering_days: specie.wateringDays,
  };
};

const PlantFormModal: React.FC<PlantFormModalProps> = ({
  visible,
  plant,
  onSave,
  onDelete,
  onClose,
}) => {
  const isEdit = !!plant;
  const [form, setForm] = useState<PlantFormData>(makeDefaultForm);

  useEffect(() => {
    if (visible) {
      if (plant) {
        setForm({
          name: plant.name,
          specie: plant.specie,
          status: plant.status,
          last_watered: plant.last_watered,
          watering_days: plant.watering_days,
        });
      } else {
        setForm(makeDefaultForm());
      }
    }
  }, [plant, visible]);

  const handleSave = () => {
    if (!form.name.trim()) {
      Alert.alert('Missing Field', 'Please enter a plant name.');
      return;
    }
    if (!form.watering_days || form.watering_days < 1) {
      Alert.alert('Missing Field', 'Please enter how often to water (days).');
      return;
    }
    try {
      onSave(form);
    } catch (err: any) {
      Alert.alert('Save Error', err?.message ?? String(err));
    }
  };

  const handleDelete = () => {
    if (!plant) { return; }
    Alert.alert(
      'Delete Plant',
      `Are you sure you want to remove "${plant.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete?.(plant.id),
        },
      ],
    );
  };

  const recentDays = useMemo(() => {
    return Array.from({ length: MAX_DAYS_AGO + 1 }, (_, i) => ({
      date: localDateStr(i),
      label: dateLabelStr(i),
    }));
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.kav}
        >
          <View style={styles.sheet}>
            {/* Handle bar */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {isEdit ? '✏️  Edit Plant' : '🌱  New Plant'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Name */}
              <Text style={styles.label}>Plant Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. My Little Orchid"
                placeholderTextColor="#B0C4B8"
                value={form.name}
                onChangeText={v => setForm(f => ({ ...f, name: v }))}
              />

              {/* Specie */}
              <Text style={styles.label}>Species</Text>
              <View style={styles.segmentRow}>
                {AVAILABLE_SPECIES.map(specie => {
                  const active = form.specie.id === specie.id;
                  return (
                    <TouchableOpacity
                      key={specie.id}
                      style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                      onPress={() => setForm(f => ({
                        ...f,
                        specie,
                        watering_days: specie.wateringDays,
                        status: computeStatus(f.last_watered, specie.wateringDays),
                      }))}
                    >
                      <Text
                        style={[styles.segmentText, active && styles.segmentTextActive]}
                      >
                        {specie.emoji}  {specie.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Last Watered */}
              <Text style={styles.label}>Last Watered</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.presetRow}
              >
                {recentDays.map(day => (
                  <TouchableOpacity
                    key={day.date}
                    style={[
                      styles.presetBtn,
                      form.last_watered === day.date && styles.presetBtnActive,
                    ]}
                    onPress={() => setForm(f => ({
                      ...f,
                      last_watered: day.date,
                      status: computeStatus(day.date, f.watering_days),
                    }))}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        form.last_watered === day.date && styles.presetTextActive,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Watering Days */}
              <Text style={styles.label}>Water Every (days)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 7"
                placeholderTextColor="#B0C4B8"
                value={form.watering_days > 0 ? form.watering_days.toString() : ''}
                onChangeText={v => {
                  const parsed = parseInt(v, 10);
                  const newDays = isNaN(parsed) ? 0 : parsed;
                  setForm(f => ({
                    ...f,
                    watering_days: newDays,
                    status: computeStatus(f.last_watered, newDays),
                  }));
                }}
                keyboardType="numeric"
              />

              {/* Save button */}
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Plant</Text>
              </TouchableOpacity>

              {/* Delete button — edit mode only */}
              {isEdit && (
                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                  <Text style={styles.deleteBtnText}>🗑  Delete Plant</Text>
                </TouchableOpacity>
              )}

              <View style={styles.bottomPad} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 30, 10, 0.55)',
    justifyContent: 'flex-end',
  },
  kav: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 12,
    maxHeight: '92%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1E8D8',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C3D1C',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F0F4F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: '#5A7A5A',
    fontWeight: '600',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D6A4F',
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#C8E6D4',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1C1C1E',
    backgroundColor: '#FAFFFE',
  },
  // Species selector
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C8E6D4',
    alignItems: 'center',
    backgroundColor: '#FAFFFE',
  },
  segmentBtnActive: {
    backgroundColor: '#2D6A4F',
    borderColor: '#2D6A4F',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  // Date presets
  presetRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  presetBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#C8E6D4',
    backgroundColor: '#FAFFFE',
  },
  presetBtnActive: {
    backgroundColor: '#52B788',
    borderColor: '#52B788',
  },
  presetText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  // Buttons
  saveBtn: {
    backgroundColor: '#2D6A4F',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    elevation: 3,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  deleteBtn: {
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
  },
  deleteBtnText: {
    color: '#C62828',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomPad: {
    height: 28,
  },
});

export default PlantFormModal;
