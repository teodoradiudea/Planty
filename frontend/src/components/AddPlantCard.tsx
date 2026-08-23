import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  AVAILABLE_SPECIES,
  SPECIE_EMOJI,
} from '../constants/plantOptions';
import { computeStatus } from '../services/statusComputer';
import type { PlantFormData } from '../types/Plant';

interface AddPlantCardProps {
  visible: boolean;
  onSave: (data: PlantFormData) => void;
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

const makeDefaultForm = (): PlantFormData => {
  const lastWatered = localDateStr(0);
  const wateringDays = 7;
  return {
    name: '',
    specie: AVAILABLE_SPECIES[0],
    status: computeStatus(lastWatered, wateringDays),
    last_watered: lastWatered,
    watering_days: wateringDays,
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
      setIsEditingName(true);   // open keyboard immediately
      setShowSpeciePicker(false);
    }
  }, [visible]);

  const handleSave = () => {
    if (!form.name.trim()) {
      Alert.alert('Missing Field', 'Please enter a plant name.');
      return;
    }
    try {
      console.log('[AddPlantCard] calling onSave with form:', JSON.stringify(form));
      onSave(form);
    } catch (err: any) {
      Alert.alert('Save Error', err?.message ?? String(err));
    }
  };


  const selectedEmoji = SPECIE_EMOJI[form.specie.name.toLowerCase()] ?? '🌿';

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
              <Text style={styles.cancelText}>Cancel</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon name="close" size={12} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* ── Plant Image ── */}
            <View style={styles.content}>
              <View style={styles.imageContainer}>
                <View style={styles.plantImageBox}>
                  <Text style={styles.plantEmoji}>{selectedEmoji}</Text>
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
                      blurOnSubmit={false}
                    />
                  ) : (
                    <TouchableOpacity
                      style={styles.nameRowInner}
                      onPress={() => setIsEditingName(true)}
                    >
                      <Text style={styles.plantName}>
                        {form.name || 'Plant Name'}
                      </Text>
                      <Icon name="pencil" size={8} color="#68A64D" />
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
                    {form.specie ? form.specie.name : 'Select'}
                  </Text>
                </TouchableOpacity>
              </View>

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
          setForm(f => ({ ...f, specie }));
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
            const emoji = SPECIE_EMOJI[specie.name.toLowerCase()] ?? '🌿';
            const active = selected?.id === specie.id;
            return (
              <TouchableOpacity
                key={specie.id}
                style={[styles.pickerRow, active && styles.pickerRowActive]}
                onPress={() => onSelect(specie)}
              >
                <Text style={styles.pickerEmoji}>{emoji}</Text>
                <Text style={[styles.pickerLabel, active && styles.pickerLabelActive]}>
                  {specie.name}
                </Text>
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
    width: 156,
    height: 205,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
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
    gap: 6,
    marginBottom: 8,
  },
  cancelText: {
    fontSize: 8,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : undefined,
  },
  content: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
  },
  plantImageBox: {
    width: 66,
    height: 74,
    borderRadius: 9,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantEmoji: {
    fontSize: 36,
  },
  nameRow: {
    marginTop: 4,
  },
  nameRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  plantName: {
    fontSize: 12,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : undefined,
  },
  nameInput: {
    fontSize: 12,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.6)',
    minWidth: 80,
    paddingVertical: 0,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : undefined,
  },
  specieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : undefined,
  },
  selectBadge: {
    backgroundColor: 'rgba(158, 162, 159, 0.58)',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#586458',
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  selectText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : undefined,
  },
  wateredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  arrowText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.85)',
  },
  arrowDisabled: {
    opacity: 0.25,
  },
  dateLabel: {
    fontSize: 8,
    color: '#fff',
    textAlign: 'center',
    minWidth: 52,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : undefined,
  },
  smallLabel: {
    fontSize: 8,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : undefined,
  },
  saveButton: {
    backgroundColor: '#68A64D',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ABCB9F',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 2,
    marginTop: 8,
  },
  saveText: {
    fontSize: 8,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : undefined,
  },
  // Specie Picker
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 30, 10, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerSheet: {
    width: 240,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    maxHeight: 320,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  pickerTitle: {
    fontSize: 14,
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
    paddingVertical: 12,
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
  pickerLabel: {
    flex: 1,
    fontSize: 15,
    color: '#2D6A4F',
    fontWeight: '600',
  },
  pickerLabelActive: {
    color: '#68A64D',
  },
});

export default AddPlantCard;
