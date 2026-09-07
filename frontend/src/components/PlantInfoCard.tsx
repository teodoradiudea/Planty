import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { STATUS_COLOR, STATUS_COLOR_FALLBACK } from '../constants/plantOptions';
import { FONT_FAMILY } from '../constants/theme';
import { computeStatus } from '../services/statusComputer';
import type { Plant } from '../types/Plant';

/* ─── date helpers ──────────────────────────────────────────────────────── */

const parseDate = (str: string): Date => {
  const [y, m, day] = str.split('-').map(Number);
  const d = new Date(y, m - 1, day);
  d.setHours(0, 0, 0, 0);
  return d;
};

const todayMidnight = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const relativeLabel = (dateStr: string): string => {
  const diffDays = Math.round(
    (parseDate(dateStr).getTime() - todayMidnight().getTime()) / 86_400_000,
  );
  if (diffDays === 0)  { return 'today'; }
  if (diffDays === 1)  { return 'tomorrow'; }
  if (diffDays === -1) { return 'yesterday'; }
  if (diffDays > 1)   { return `in ${diffDays} days`; }
  return `${Math.abs(diffDays)} days ago`;
};

/** Returns next watering date as YYYY-MM-DD using local time */
const nextWateringDate = (lastWatered: string, wateringDays: number): string => {
  const base = parseDate(lastWatered);
  base.setDate(base.getDate() + wateringDays);
  return [
    base.getFullYear(),
    String(base.getMonth() + 1).padStart(2, '0'),
    String(base.getDate()).padStart(2, '0'),
  ].join('-');
};

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

const MAX_DAYS_AGO = 7;

/* ─── props ─────────────────────────────────────────────────────────────── */

interface PlantInfoCardProps {
  plant: Plant;
  visible: boolean;
  onClose: () => void;
  onSaveName: (newName: string) => void;
  onSaveLastWatered: (newDate: string) => void;
  onDelete: () => void;
}

/* ─── component ─────────────────────────────────────────────────────────── */

const PlantInfoCard: React.FC<PlantInfoCardProps> = ({
  plant,
  visible,
  onClose,
  onSaveName,
  onSaveLastWatered,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(plant.name);
  const inputRef = useRef<TextInput>(null);

  // last-watered editing state
  const [wateredDaysAgo, setWateredDaysAgo] = useState(0);

  // sync name + last-watered when a different plant is opened or modal re-opens
  useEffect(() => {
    setNameValue(plant.name);
    setIsEditing(false);
    const diffMs = todayMidnight().getTime() - parseDate(plant.last_watered).getTime();
    const diffDays = Math.round(diffMs / 86_400_000);
    setWateredDaysAgo(Math.max(0, Math.min(diffDays, MAX_DAYS_AGO)));
  }, [plant.id, plant.name, plant.last_watered, visible]);

  // Derived: the last_watered date string based on current wateredDaysAgo
  const lastWateredDate = useMemo(() => localDateStr(wateredDaysAgo), [wateredDaysAgo]);

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const commitName = () => {
    const trimmed = nameValue.trim();
    if (!trimmed) {
      Alert.alert('Name required', 'Please enter a plant name.');
      return;
    }
    setIsEditing(false);
    if (trimmed !== plant.name) {
      onSaveName(trimmed);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Plant',
      `Remove "${plant.name}" from your collection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
    );
  };

  const adjustWateredDays = (delta: number) => {
    const next = Math.max(0, Math.min(wateredDaysAgo + delta, MAX_DAYS_AGO));
    setWateredDaysAgo(next);
    onSaveLastWatered(localDateStr(next));
  };

  const currentStatus = computeStatus(lastWateredDate, plant.watering_days);
  const statusColor = STATUS_COLOR[currentStatus.name.toLowerCase()] ?? STATUS_COLOR_FALLBACK;
  const nextDate = nextWateringDate(lastWateredDate, plant.watering_days);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <LinearGradient
            colors={['#68A74D', '#28401E']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.card}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>

            <View style={styles.content}>
              <View style={styles.imagePlaceholder}>
                <Text style={styles.plantEmoji}>{plant.specie.emoji}</Text>
              </View>

              {isEditing ? (
                <View style={styles.nameEditRow}>
                  <TextInput
                    ref={inputRef}
                    style={styles.nameInput}
                    value={nameValue}
                    onChangeText={setNameValue}
                    onSubmitEditing={commitName}
                    returnKeyType="done"
                    selectTextOnFocus
                    maxLength={30}
                  />
                  <TouchableOpacity
                    onPress={commitName}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.tickButton}
                  >
                    <Text style={styles.tickIcon}>✓</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.nameRow} onPress={startEditing}>
                  <Text style={styles.plantName} numberOfLines={1}>
                    {plant.name}
                  </Text>
                  <Text style={styles.pencilIcon}>✏️</Text>
                </TouchableOpacity>
              )}

              <View style={styles.speciesRow}>
                <Text style={styles.speciesText}>{plant.specie.name}</Text>
                <View style={[styles.speciesDot, { backgroundColor: statusColor }]} />
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.infoText}>
                  status: <Text style={[styles.infoText, { color: statusColor, fontWeight: '700' }]}>{currentStatus.name}</Text>
                </Text>

                <View style={styles.wateredRow}>
                  <Text style={styles.infoText}>last watered:</Text>
                  <TouchableOpacity
                    onPress={() => adjustWateredDays(1)}
                    disabled={wateredDaysAgo >= MAX_DAYS_AGO}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={[styles.arrowText, wateredDaysAgo >= MAX_DAYS_AGO && styles.arrowDisabled]}>◄</Text>
                  </TouchableOpacity>
                  <Text style={styles.wateredLabel}>{dateLabelStr(wateredDaysAgo)}</Text>
                  <TouchableOpacity
                    onPress={() => adjustWateredDays(-1)}
                    disabled={wateredDaysAgo <= 0}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={[styles.arrowText, wateredDaysAgo <= 0 && styles.arrowDisabled]}>►</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.infoText}>next watering: {relativeLabel(nextDate)}</Text>
                <Text style={styles.infoText}>every {plant.watering_days} day{plant.watering_days !== 1 ? 's' : ''}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={confirmDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.deleteIcon}>🗑</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

/* ─── styles ─────────────────────────────────────────────────────────────── */

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
    padding: 20,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    alignItems: 'center',
    paddingTop: 12,
    gap: 10,
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantEmoji: {
    fontSize: 46,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    maxWidth: 220,
    fontFamily: FONT_FAMILY,
  },
  pencilIcon: {
    fontSize: 12,
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255,255,255,0.7)',
    minWidth: 120,
    maxWidth: 200,
    paddingVertical: 2,
    paddingHorizontal: 4,
    fontFamily: FONT_FAMILY,
  },
  tickButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  speciesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  speciesText: {
    fontSize: 13,
    color: '#D3EDD3',
    fontFamily: FONT_FAMILY,
  },
  speciesDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  infoBlock: {
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    width: '100%',
  },
  infoText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: FONT_FAMILY,
  },
  wateredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  arrowText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
  },
  arrowDisabled: {
    opacity: 0.25,
  },
  wateredLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY,
    fontWeight: '600',
    minWidth: 70,
    textAlign: 'center',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#7B6B5D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 16,
  },
});

export default PlantInfoCard;
