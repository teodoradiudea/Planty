import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { AVAILABLE_SPECIES } from '../constants/plantOptions';
import { localDateStr } from '../constants/formatting.ts';
import { computeStatus } from '../services/statusComputer';
import type { PlantFormData } from '../types/Plant';
import {cardStyle} from "../styles/cardStyle.ts";

interface AddPlantCardProps {
  visible: boolean;
  onSave: (data: PlantFormData) => void;
  onClose: () => void;
}

const MAX_DAYS_AGO = 7;

const dateLabelStr = (daysAgo: number): string => {
  if (daysAgo === 0) { return 'Today'; }
  if (daysAgo === 1) { return 'Yesterday'; }
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
};

const makeDefaultForm = (): PlantFormData => {
  const firstSpecie = AVAILABLE_SPECIES[0];
  const lastWatered = localDateStr(0);
  return {
    name: '',
    specie: firstSpecie,
    status: computeStatus(lastWatered, firstSpecie.wateringDays),
    last_watered: lastWatered,
    watering_days: firstSpecie.wateringDays,
  };
};

const AddPlantCard: React.FC<AddPlantCardProps> = ({ visible, onSave, onClose }) => {
  const [form, setForm] = useState<PlantFormData>(makeDefaultForm);
  const [daysAgo, setDaysAgo] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showSpeciePicker, setShowSpeciePicker] = useState(false);

  // Reset form when modal opens and immediately show name input
  React.useEffect(() => {
    if (visible) {
      setForm(makeDefaultForm());
      setDaysAgo(0);
      setIsEditingName(true);
      setShowSpeciePicker(false);
    }
  }, [visible]);

  const handleSave = () => {
    if (!form.name.trim()) {
      Alert.alert('Missing Field', 'Please enter a plant name.');
      return;
    }
    try {
      onSave(form);
    } catch (err: any) {
      Alert.alert('Save Error', err?.message ?? String(err));
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={cardStyle.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Stop propagation so tapping the card itself doesn't close */}
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <LinearGradient
            colors={['#68A64D', '#F4A261']}
            style={cardStyle.card}
          >
            {/* ── Header ── */}
            <View style={cardStyle.header}>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={cardStyle.closeButton}>
                <Text style={cardStyle.closeIcon}>x</Text>
              </TouchableOpacity>
            </View>

            {/* ── Plant Image + Name ── */}
            <View style={cardStyle.content}>
              <View style={cardStyle.imageContainer}>
                <View style={cardStyle.plantImageBox}>
                  <Text style={cardStyle.plantEmoji}>{form.specie.emoji}</Text>
                </View>

                {/* Plant Name – tap pencil to edit */}
                <View style={cardStyle.nameRow}>
                  {isEditingName ? (
                    <TextInput
                      autoFocus
                      style={cardStyle.nameInput}
                      value={form.name}
                      placeholder="Plant Name"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      onChangeText={v => setForm(f => ({ ...f, name: v }))}
                      onSubmitEditing={() => setIsEditingName(false)}
                      returnKeyType="done"
                    />
                  ) : (
                    <TouchableOpacity
                      style={cardStyle.nameRowInner}
                      onPress={() => setIsEditingName(true)}
                    >
                      <Text style={cardStyle.plantName}>
                        {form.name || 'Plant Name'}
                      </Text>
                      <Text style={cardStyle.pencilIcon}>✏️</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* ── Specie ── */}
              <View style={cardStyle.specieRow}>
                <Text style={cardStyle.label}>Specie:</Text>
                <TouchableOpacity
                  style={cardStyle.selectBadge}
                  onPress={() => setShowSpeciePicker(true)}
                >
                  <Text style={cardStyle.selectText}>
                    {form.specie.name}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Watering days auto-derived — shown read-only */}
              <Text style={cardStyle.wateringHint}>
                Water every {form.watering_days} days
              </Text>

              {/* ── Last Watered ── */}
              <View style={cardStyle.wateredRow}>
                <Text style={cardStyle.smallLabel}>Watered:</Text>
                <TouchableOpacity
                  onPress={() => {
                    const next = Math.min(daysAgo + 1, MAX_DAYS_AGO);
                    setDaysAgo(next);
                    const newDate = localDateStr(next);
                    setForm(f => ({
                      ...f,
                      last_watered: newDate,
                      status: computeStatus(newDate, f.watering_days),
                    }));
                  }}
                  disabled={daysAgo >= MAX_DAYS_AGO}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={[cardStyle.arrowText, daysAgo >= MAX_DAYS_AGO && cardStyle.arrowDisabled]}>
                    ◀
                  </Text>
                </TouchableOpacity>
                <Text style={cardStyle.dateLabel} numberOfLines={1}>
                  {dateLabelStr(daysAgo)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const next = Math.max(daysAgo - 1, 0);
                    setDaysAgo(next);
                    const newDate = localDateStr(next);
                    setForm(f => ({
                      ...f,
                      last_watered: newDate,
                      status: computeStatus(newDate, f.watering_days),
                    }));
                  }}
                  disabled={daysAgo <= 0}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={[cardStyle.arrowText, daysAgo <= 0 && cardStyle.arrowDisabled]}>
                    ▶
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Save Button ── */}
            <TouchableOpacity style={cardStyle.saveButton} onPress={handleSave}>
              <Text style={cardStyle.saveText}>Save</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* ── Specie Picker Sub-modal ── */}
      <SpeciePicker
        visible={showSpeciePicker}
        selected={form.specie}
        onSelect={specie => {
          setForm(f => ({
            ...f,
            specie,
            watering_days: specie.wateringDays,
            status: computeStatus(f.last_watered, specie.wateringDays),
          }));
          setShowSpeciePicker(false);
        }}
        onClose={() => setShowSpeciePicker(false)}
      />
    </Modal>
  );
};

/* ─── Specie Picker ─────────────────────────────────────────────────────── */
interface SpeciePickerProps {
  visible: boolean;
  selected: PlantFormData['specie'];
  onSelect: (s: PlantFormData['specie']) => void;
  onClose: () => void;
}

const SpeciePicker: React.FC<SpeciePickerProps> = ({
  visible,
  selected,
  onSelect,
  onClose,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity style={cardStyle.pickerBackdrop} activeOpacity={1} onPress={onClose}>
      <View style={cardStyle.pickerSheet}>
        <Text style={cardStyle.pickerTitle}>Choose a Species</Text>
        <ScrollView>
          {AVAILABLE_SPECIES.map(specie => {
            const active = selected?.id === specie.id;
            return (
              <TouchableOpacity
                key={specie.id}
                style={[cardStyle.pickerRow, active && cardStyle.pickerRowActive]}
                onPress={() => onSelect(specie)}
              >
                <Text style={cardStyle.pickerEmoji}>{specie.emoji}</Text>
                <View style={cardStyle.pickerLabelGroup}>
                  <Text style={[cardStyle.pickerLabel, active && cardStyle.pickerLabelActive]}>
                    {specie.name}
                  </Text>
                  <Text style={cardStyle.pickerSub}>every {specie.wateringDays} days</Text>
                </View>

              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </TouchableOpacity>
  </Modal>
);

export default AddPlantCard;

