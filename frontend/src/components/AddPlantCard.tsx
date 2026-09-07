import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { AVAILABLE_SPECIES } from '../constants/plantOptions';
import { FONT_FAMILY } from '../constants/theme';
import { localDateStr } from '../utils/formatting';
import { computeStatus } from '../services/statusComputer';
import type { PlantFormData } from '../types/Plant';

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
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Stop propagation so tapping the card itself doesn't close */}
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <LinearGradient
            colors={['#68A64D', '#F4A261']}
            style={styles.card}
          >
            {/* ── Header ── */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.closeIconBtn}>
                <Icon name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* ── Plant Image + Name ── */}
            <View style={styles.content}>
              <View style={styles.imageContainer}>
                <View style={styles.plantImageBox}>
                  <Text style={styles.plantEmoji}>{form.specie.emoji}</Text>
                </View>

                {/* Plant Name – tap pencil to edit */}
                <View style={styles.nameRow}>
                  {isEditingName ? (
                    <TextInput
                      autoFocus
                      style={styles.nameInput}
                      value={form.name}
                      placeholder="Plant Name"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      onChangeText={v => setForm(f => ({ ...f, name: v }))}
                      onSubmitEditing={() => setIsEditingName(false)}
                      returnKeyType="done"
                    />
                  ) : (
                    <TouchableOpacity
                      style={styles.nameRowInner}
                      onPress={() => setIsEditingName(true)}
                    >
                      <Text style={styles.plantName}>
                        {form.name || 'Plant Name'}
                      </Text>
                      <Icon name="pencil" size={10} color="#68A64D" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* ── Specie ── */}
              <View style={styles.specieRow}>
                <Text style={styles.label}>Specie:</Text>
                <TouchableOpacity
                  style={styles.selectBadge}
                  onPress={() => setShowSpeciePicker(true)}
                >
                  <Text style={styles.selectText}>
                    {form.specie.name}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Watering days auto-derived — shown read-only */}
              <Text style={styles.wateringHint}>
                💧 every {form.watering_days} days
              </Text>

              {/* ── Last Watered ── */}
              <View style={styles.wateredRow}>
                <Text style={styles.smallLabel}>Watered:</Text>
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
                  <Text style={[styles.arrowText, daysAgo >= MAX_DAYS_AGO && styles.arrowDisabled]}>
                    ◀
                  </Text>
                </TouchableOpacity>
                <Text style={styles.dateLabel} numberOfLines={1}>
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
                  <Text style={[styles.arrowText, daysAgo <= 0 && styles.arrowDisabled]}>
                    ▶
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Save Button ── */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
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
    <TouchableOpacity style={styles.pickerBackdrop} activeOpacity={1} onPress={onClose}>
      <View style={styles.pickerSheet}>
        <Text style={styles.pickerTitle}>Choose a Species</Text>
        <ScrollView>
          {AVAILABLE_SPECIES.map(specie => {
            const active = selected?.id === specie.id;
            return (
              <TouchableOpacity
                key={specie.id}
                style={[styles.pickerRow, active && styles.pickerRowActive]}
                onPress={() => onSelect(specie)}
              >
                <Text style={styles.pickerEmoji}>{specie.emoji}</Text>
                <View style={styles.pickerLabelGroup}>
                  <Text style={[styles.pickerLabel, active && styles.pickerLabelActive]}>
                    {specie.name}
                  </Text>
                  <Text style={styles.pickerSub}>every {specie.wateringDays} days</Text>
                </View>
                {active && <Icon name="checkmark" size={16} color="#68A64D" />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </TouchableOpacity>
  </Modal>
);

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 30, 10, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 320,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
  },
  closeIconBtn: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  imageContainer: {
    alignItems: 'center',
  },
  plantImageBox: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantEmoji: {
    fontSize: 46,
  },
  nameRow: {
    marginTop: 8,
  },
  nameRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  plantName: {
    fontSize: 16,
    color: '#fff',
    fontFamily: FONT_FAMILY,
    fontWeight: '600',
  },
  nameInput: {
    fontSize: 16,
    color: '#fff',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255,255,255,0.6)',
    minWidth: 120,
    paddingVertical: 2,
    fontFamily: FONT_FAMILY,
  },
  specieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: '#fff',
    fontFamily: FONT_FAMILY,
  },
  selectBadge: {
    backgroundColor: 'rgba(158, 162, 159, 0.58)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#586458',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  selectText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: FONT_FAMILY,
  },
  wateringHint: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONT_FAMILY,
  },
  wateredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
  },
  arrowDisabled: {
    opacity: 0.25,
  },
  dateLabel: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
    minWidth: 70,
    fontFamily: FONT_FAMILY,
  },
  smallLabel: {
    fontSize: 11,
    color: '#fff',
    fontFamily: FONT_FAMILY,
  },
  saveButton: {
    backgroundColor: '#68A64D',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ABCB9F',
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 8,
    marginTop: 16,
  },
  saveText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
    fontFamily: FONT_FAMILY,
  },
  // Specie Picker
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 30, 10, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerSheet: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    maxHeight: 400,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C3D1C',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  pickerRowActive: {
    backgroundColor: '#F0FFF4',
  },
  pickerEmoji: {
    fontSize: 22,
  },
  pickerLabelGroup: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 15,
    color: '#2D6A4F',
    fontWeight: '600',
  },
  pickerLabelActive: {
    color: '#68A64D',
  },
  pickerSub: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 1,
  },
});

export default AddPlantCard;

