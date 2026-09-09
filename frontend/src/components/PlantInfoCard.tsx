import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { STATUS_COLOR, STATUS_COLOR_FALLBACK } from '../constants/plantOptions';
import { computeStatus } from '../services/statusComputer';
import type { Plant } from '../types/Plant';
import {cardStyle} from "../styles/cardStyle.ts";

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
        style={cardStyle.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <LinearGradient
            colors={['#68A74D', '#28401E']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={cardStyle.card}
          >
            <View style={cardStyle.header}>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={cardStyle.closeButton}>
                <Text style={cardStyle.closeIcon}>x</Text>
              </TouchableOpacity>
            </View>

            <View style={cardStyle.content}>
              <View style={cardStyle.plantImageBox}>
                <Text style={cardStyle.plantEmoji}>{plant.specie.emoji}</Text>
              </View>

              {isEditing ? (
                <View style={cardStyle.nameEditRow}>
                  <TextInput
                    ref={inputRef}
                    style={cardStyle.nameInput}
                    value={nameValue}
                    onChangeText={setNameValue}
                    onSubmitEditing={commitName}
                    returnKeyType="done"
                    selectTextOnFocus
                    maxLength={30}
                  />
                </View>
              ) : (
                <TouchableOpacity style={cardStyle.editButton} onPress={startEditing}>
                  <Text style={cardStyle.plantName} numberOfLines={1}>
                    {plant.name}
                  </Text>
                  <Text style={cardStyle.pencilIcon}>✏️</Text>
                </TouchableOpacity>
              )}

              <View style={cardStyle.speciesRow}>
                <Text style={cardStyle.speciesText}>{plant.specie.name}</Text>
              </View>

              <View style={cardStyle.infoBlock}>
                <Text style={cardStyle.infoText}>
                  status: <Text style={[cardStyle.infoText, { color: statusColor, fontWeight: '700' }]}>{currentStatus.name}</Text>
                </Text>

                <View style={cardStyle.wateredRow}>
                  <Text style={cardStyle.infoText}>last watered:</Text>
                  <TouchableOpacity
                    onPress={() => adjustWateredDays(1)}
                    disabled={wateredDaysAgo >= MAX_DAYS_AGO}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={[cardStyle.arrowText, wateredDaysAgo >= MAX_DAYS_AGO && cardStyle.arrowDisabled]}>◄</Text>
                  </TouchableOpacity>
                  <Text style={cardStyle.wateredLabel}>{dateLabelStr(wateredDaysAgo)}</Text>
                  <TouchableOpacity
                    onPress={() => adjustWateredDays(-1)}
                    disabled={wateredDaysAgo <= 0}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={[cardStyle.arrowText, wateredDaysAgo <= 0 && cardStyle.arrowDisabled]}>►</Text>
                  </TouchableOpacity>
                </View>

                <Text style={cardStyle.infoText}>next watering: {relativeLabel(nextDate)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={cardStyle.deleteButton}
              onPress={confirmDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={cardStyle.deleteIcon}>🗑</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default PlantInfoCard;
