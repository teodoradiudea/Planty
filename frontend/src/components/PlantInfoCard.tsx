import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SPECIE_EMOJI, STATUS_COLOR } from '../constants/plantOptions';
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

const nextWateringDate = (lastWatered: string, wateringDays: number): string => {
  const base = parseDate(lastWatered);
  base.setDate(base.getDate() + wateringDays);
  return base.toISOString().split('T')[0];
};

const friendlyDate = (dateStr: string): string =>
  parseDate(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

/* ─── props ─────────────────────────────────────────────────────────────── */

interface PlantInfoCardProps {
  plant: Plant;
  visible: boolean;
  onClose: () => void;
  onSaveName: (newName: string) => void;
  onDelete: () => void;
}

/* ─── component ─────────────────────────────────────────────────────────── */

const PlantInfoCard: React.FC<PlantInfoCardProps> = ({
  plant,
  visible,
  onClose,
  onSaveName,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(plant.name);
  const inputRef = useRef<TextInput>(null);

  // sync name when a different plant is opened
  useEffect(() => {
    setNameValue(plant.name);
    setIsEditing(false);
  }, [plant.id, plant.name, visible]);

  const startEditing = () => {
    setIsEditing(true);
    // Give RN a tick to mount before focusing
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

  const emoji = SPECIE_EMOJI[plant.specie.name.toLowerCase()] ?? '🌿';
  const statusColor = STATUS_COLOR[plant.status.name.toLowerCase()] ?? '#52B788';
  const nextDate = nextWateringDate(plant.last_watered, plant.watering_days);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop — tap outside to close */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Card — absorbs taps so backdrop doesn't close */}
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <LinearGradient
            colors={['#68A74D', '#28401E']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.card}
          >
            {/* ── Close ── */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>

            {/* ── Content ── */}
            <View style={styles.content}>

              {/* Emoji box */}
              <View style={styles.imagePlaceholder}>
                <Text style={styles.plantEmoji}>{emoji}</Text>
              </View>

              {/* Name row — static OR editing */}
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
                  {/* Tick — save */}
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

              {/* Species + status dot */}
              <View style={styles.speciesRow}>
                <Text style={styles.speciesText}>{plant.specie.name}</Text>
                <View style={[styles.speciesDot, { backgroundColor: statusColor }]} />
              </View>

              {/* Info block */}
              <View style={styles.infoBlock}>
                <Text style={styles.infoText}>
                  status:{' '}
                  <Text style={[styles.infoText, { color: statusColor }]}>
                    {plant.status.name}
                  </Text>
                </Text>
                <Text style={styles.infoText}>
                  last watered: {relativeLabel(plant.last_watered)}
                  {' '}({friendlyDate(plant.last_watered)})
                </Text>
                <Text style={styles.infoText}>
                  next watering: {relativeLabel(nextDate)}
                </Text>
              </View>
            </View>

            {/* ── Delete ── */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={confirmDelete}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
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
    width: 156,
    height: 224,
    borderRadius: 9,
    padding: 12,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    gap: 7,
  },
  imagePlaceholder: {
    width: 66,
    height: 74,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  plantEmoji: {
    fontSize: 34,
  },
  // Static name row
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  plantName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    maxWidth: 100,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : undefined,
  },
  pencilIcon: {
    fontSize: 7,
  },
  // Editing name row
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameInput: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255,255,255,0.7)',
    minWidth: 80,
    maxWidth: 100,
    paddingVertical: 1,
    paddingHorizontal: 2,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : undefined,
  },
  tickButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
  // Species
  speciesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  speciesText: {
    fontSize: 10,
    color: '#D3D3D3',
    fontFamily: Platform.OS === 'ios' ? 'Inter' : undefined,
  },
  speciesDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Info block
  infoBlock: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 8,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 12,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : undefined,
  },
  // Delete
  deleteButton: {
    position: 'absolute',
    bottom: 12,
    right: 22,
    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: '#7B6B5D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 12,
    color: '#FFFFFF',
  },
});

export default PlantInfoCard;
