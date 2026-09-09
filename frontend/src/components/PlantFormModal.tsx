import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AVAILABLE_SPECIES } from '../constants/plantOptions';
import { computeStatus } from '../services/statusComputer';
import type { Plant, PlantFormData } from '../types/Plant';
import {cardStyle} from "../styles/cardStyle.ts";

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
      <View style={cardStyle.backdrop}>
        <KeyboardAvoidingView
          behavior="padding"
          style={cardStyle.kav}
        >
          <View style={cardStyle.sheet}>
            {/* Handle bar */}
            <View style={cardStyle.handle} />

            {/* Header */}
            <View style={cardStyle.header}>
              <Text style={cardStyle.title}>
                {isEdit ? '✏️  Edit Plant' : '🌱  New Plant'}
              </Text>
              <TouchableOpacity onPress={onClose} style={cardStyle.closeBtn}>
                <Text style={cardStyle.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Name */}
              <Text style={cardStyle.label}>Plant Name</Text>
              <TextInput
                style={cardStyle.input}
                placeholder="e.g. My Little Orchid"
                placeholderTextColor="#B0C4B8"
                value={form.name}
                onChangeText={v => setForm(f => ({ ...f, name: v }))}
              />

              {/* Specie */}
              <Text style={cardStyle.label}>Species</Text>
              <View style={cardStyle.segmentRow}>
                {AVAILABLE_SPECIES.map(specie => {
                  const active = form.specie.id === specie.id;
                  return (
                    <TouchableOpacity
                      key={specie.id}
                      style={[cardStyle.segmentBtn, active && cardStyle.segmentBtnActive]}
                      onPress={() => setForm(f => ({
                        ...f,
                        specie,
                        watering_days: specie.wateringDays,
                        status: computeStatus(f.last_watered, specie.wateringDays),
                      }))}
                    >
                      <Text
                        style={[cardStyle.segmentText, active && cardStyle.segmentTextActive]}
                      >
                        {specie.emoji}  {specie.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Last Watered */}
              <Text style={cardStyle.label}>Last Watered</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={cardStyle.presetRow}
              >
                {recentDays.map(day => (
                  <TouchableOpacity
                    key={day.date}
                    style={[
                      cardStyle.presetBtn,
                      form.last_watered === day.date && cardStyle.presetBtnActive,
                    ]}
                    onPress={() => setForm(f => ({
                      ...f,
                      last_watered: day.date,
                      status: computeStatus(day.date, f.watering_days),
                    }))}
                  >
                    <Text
                      style={[
                        cardStyle.presetText,
                        form.last_watered === day.date && cardStyle.presetTextActive,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Watering Days */}
              <Text style={cardStyle.label}>Water Every (days)</Text>
              <TextInput
                style={cardStyle.input}
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
              <TouchableOpacity style={cardStyle.saveBtn} onPress={handleSave}>
                <Text style={cardStyle.saveBtnText}>Save Plant</Text>
              </TouchableOpacity>

              {/* Delete button — edit mode only */}
              {isEdit && (
                <TouchableOpacity style={cardStyle.deleteBtn} onPress={handleDelete}>
                  <Text style={cardStyle.deleteBtnText}>🗑  Delete Plant</Text>
                </TouchableOpacity>
              )}

              <View style={cardStyle.bottomPad} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default PlantFormModal;
