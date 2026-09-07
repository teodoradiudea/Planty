import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AddPlantCard from '../components/AddPlantCard';
import NotificationTimePicker from '../components/NotificationTimePicker';
import PlantCard from '../components/PlantCard';
import PlantInfoCard from '../components/PlantInfoCard';
import Fence from '../decorations/Fence';
import Flower from '../decorations/Flower';
import Shelf from '../decorations/Shelf';
import Sprinkler from '../decorations/Sprinkler';
import {
  createPlant,
  deletePlant,
  getAllPlants,
  getNotificationHour,
  getNotificationMinute,
  setNotificationHour,
  setNotificationMinute,
  updatePlant,
} from '../database/db';
import { computeStatus } from '../services/statusComputer';
import {
  rescheduleAllNotifications,
  schedulePlantNotification,
  cancelPlantNotification,
} from '../services/notifications';
import type { Plant, PlantFormData } from '../types/Plant';
import { todayStr, formatTime } from '../utils/formatting';

/* ─── layout constants ─── */

const MAX_PLANTS = 9;
const COLS = 3;
const SHELVES = 3;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const H_PADDING = 20;
const GAP = 12;
const SHELF_WIDTH = SCREEN_WIDTH - H_PADDING * 2;
const CARD_SIZE = SCREEN_WIDTH/4;
const FOOTER_HEIGHT = SCREEN_HEIGHT * 0.25; // made footer bigger
const SPRINKLER_SIZE = 64;
const NUM_DROPS = 8;

/* ─── component ─── */

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  /* ── core state ── */
  const [plants, setPlants] = useState<Plant[]>([]);
  const [addCardVisible, setAddCardVisible] = useState(false);
  const [infoCardVisible, setInfoCardVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [notifHour, setNotifHour] = useState(17);
  const [notifMinute, setNotifMinute] = useState(0);

  /* ── sprinkler drag state ── */
  const [isDragging, setIsDragging] = useState(false);
  const [wateringIdx, setWateringIdx] = useState<number | null>(null);

  /* ── refs (stable across renders, accessible inside PanResponder) ── */
  const plantsRef = useRef<Plant[]>([]);
  useEffect(() => { plantsRef.current = plants; }, [plants]);

  const slotRefs = useRef(new Map<number, View>());
  const plantRects = useRef(
    new Map<number, { x: number; y: number; w: number; h: number }>(),
  );
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveredIdxRef = useRef<number | null>(null);
  const justWateredRef = useRef(new Set<number>());

  const dragX = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;

  /* water-drop animated values */
  const dropAnims = useRef(
    Array.from({ length: NUM_DROPS }, () => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0),
    })),
  ).current;
  const waterAnimRunning = useRef(false);

  /* ── data loading ── */
  const loadPlants = useCallback(() => {
    try {
      setPlants(getAllPlants());
    } catch (err: any) {
      Alert.alert('Load Error', err?.message ?? String(err));
    }
  }, []);

  useEffect(() => {
    loadPlants();
    try {
      setNotifHour(getNotificationHour());
      setNotifMinute(getNotificationMinute());
    } catch (err: any) {
      console.warn('Could not load notification time', err);
    }
  }, [loadPlants]);

  /* ── plant CRUD handlers ── */
  const openAddCard = () => setAddCardVisible(true);

  const openInfoCard = (plant: Plant) => {
    setSelectedPlant(plant);
    setInfoCardVisible(true);
  };

  const handleAddSave = (data: PlantFormData) => {
    try {
      const newPlant = createPlant(data);
      setAddCardVisible(false);
      loadPlants();
      schedulePlantNotification(newPlant).catch(console.warn);
    } catch (err: any) {
      Alert.alert('Error', `Could not save plant: ${err?.message ?? err}`);
    }
  };

  const handleInfoSaveName = (newName: string) => {
    if (!selectedPlant) { return; }
    try {
      updatePlant({ ...selectedPlant, name: newName });
      setSelectedPlant(prev => prev ? { ...prev, name: newName } : prev);
      loadPlants();
      const updated = getAllPlants().find(p => p.id === selectedPlant.id);
      if (updated) {
        schedulePlantNotification(updated).catch(console.warn);
      }
    } catch (err: any) {
      Alert.alert('Error', `Could not rename plant: ${err?.message ?? err}`);
    }
  };

  const handleInfoSaveLastWatered = (newDate: string) => {
    if (!selectedPlant) { return; }
    try {
      const newStatus = computeStatus(newDate, selectedPlant.watering_days);
      const updated = { ...selectedPlant, last_watered: newDate, status: newStatus };
      updatePlant(updated);
      setSelectedPlant(updated);
      loadPlants();
      schedulePlantNotification(updated).catch(console.warn);
    } catch (err: any) {
      Alert.alert('Error', `Could not update last watered: ${err?.message ?? err}`);
    }
  };

  const handleInfoDelete = () => {
    if (!selectedPlant) { return; }
    try {
      cancelPlantNotification(selectedPlant.id).catch(console.warn);
      deletePlant(selectedPlant.id);
      setInfoCardVisible(false);
      loadPlants();
    } catch (err: any) {
      Alert.alert('Error', `Could not delete plant: ${err?.message ?? err}`);
    }
  };

  const handleTimeChange = async (hour: number, minute: number) => {
    try {
      setNotificationHour(hour);
      setNotificationMinute(minute);
      setNotifHour(hour);
      setNotifMinute(minute);
      await rescheduleAllNotifications(getAllPlants());
    } catch (err: any) {
      console.warn('[HomeScreen] reschedule error:', err);
    }
  };

  /* ── sprinkler helpers (use refs only — safe for PanResponder) ── */

  const clearHover = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const measureSlots = () => {
    slotRefs.current.forEach((view, idx) => {
      view.measureInWindow((x, y, w, h) => {
        plantRects.current.set(idx, { x, y, w, h });
      });
    });
  };

  const findHoveredSlot = (px: number, py: number): number | null => {
    for (const [idx, r] of plantRects.current.entries()) {
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
        return idx;
      }
    }
    return null;
  };

  const startWaterDrops = useCallback(() => {
    if (waterAnimRunning.current) { return; }
    waterAnimRunning.current = true;

    const animations = dropAnims.map((drop, i) => {
      const randX = (Math.random() - 0.5) * 40;
      return Animated.loop(
        Animated.sequence([
          Animated.delay(i * 70),
          Animated.parallel([
            Animated.timing(drop.translateY, {
              toValue: 60,
              duration: 450,
              useNativeDriver: false,
            }),
            Animated.timing(drop.translateX, {
              toValue: randX,
              duration: 450,
              useNativeDriver: false,
            }),
            Animated.sequence([
              Animated.timing(drop.opacity, {
                toValue: 0.9,
                duration: 60,
                useNativeDriver: false,
              }),
              Animated.delay(280),
              Animated.timing(drop.opacity, {
                toValue: 0,
                duration: 110,
                useNativeDriver: false,
              }),
            ]),
          ]),
          // instant reset
          Animated.parallel([
            Animated.timing(drop.translateY, { toValue: 0, duration: 0, useNativeDriver: false }),
            Animated.timing(drop.translateX, { toValue: 0, duration: 0, useNativeDriver: false }),
          ]),
        ]),
      );
    });

    Animated.parallel(animations).start();
  }, [dropAnims]);

  const stopWaterDrops = useCallback(() => {
    waterAnimRunning.current = false;
    dropAnims.forEach(drop => {
      drop.translateY.stopAnimation();
      drop.translateX.stopAnimation();
      drop.opacity.stopAnimation();
      drop.translateY.setValue(0);
      drop.translateX.setValue(0);
      drop.opacity.setValue(0);
    });
  }, [dropAnims]);

  /* ── PanResponder (created once, reads refs) ── */

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onShouldBlockNativeResponder: () => true,

    onPanResponderGrant: (evt) => {
      const { pageX, pageY } = evt.nativeEvent;
      dragX.setValue(pageX - SPRINKLER_SIZE / 2);
      dragY.setValue(pageY - SPRINKLER_SIZE);
      setIsDragging(true);
      justWateredRef.current.clear();
      measureSlots();
    },

    onPanResponderMove: (_, gs) => {
      dragX.setValue(gs.moveX - SPRINKLER_SIZE / 2);
      dragY.setValue(gs.moveY - SPRINKLER_SIZE);

      const idx = findHoveredSlot(gs.moveX, gs.moveY);
      const prevIdx = hoveredIdxRef.current;

      // Determine if current slot is a valid watering target
      let isValid = false;
      if (idx !== null && !justWateredRef.current.has(idx)) {
        const plant = plantsRef.current[idx];
        if (plant) {
          const s = plant.status.name.toLowerCase();
          isValid = s === 'needs water' || s === 'wilting';
        }
      }

      if (isValid && idx !== prevIdx) {
        // New valid hover target → start timer + animation
        clearHover();
        hoveredIdxRef.current = idx;
        setWateringIdx(idx);
        startWaterDrops();

        hoverTimerRef.current = setTimeout(() => {
          const p = plantsRef.current[idx!];
          if (p) {
            const today = todayStr();
            const updated: Plant = {
              ...p,
              last_watered: today,
              status: computeStatus(today, p.watering_days),
            };
            updatePlant(updated);
            // Sync ref immediately to prevent re-trigger
            plantsRef.current = plantsRef.current.map((pl, i) =>
              i === idx ? updated : pl,
            );
            justWateredRef.current.add(idx!);
            loadPlants();
            schedulePlantNotification(updated).catch(console.warn);
          }
          stopWaterDrops();
          setWateringIdx(null);
          hoveredIdxRef.current = null;
        }, 2000);
      } else if (!isValid && prevIdx !== null) {
        // Moved away from valid target
        clearHover();
        stopWaterDrops();
        setWateringIdx(null);
        hoveredIdxRef.current = null;
      }
    },

    onPanResponderRelease: () => {
      clearHover();
      stopWaterDrops();
      setIsDragging(false);
      setWateringIdx(null);
      hoveredIdxRef.current = null;
      justWateredRef.current.clear();
    },

    onPanResponderTerminate: () => {
      clearHover();
      stopWaterDrops();
      setIsDragging(false);
      setWateringIdx(null);
      hoveredIdxRef.current = null;
      justWateredRef.current.clear();
    },
  }), [dragX, dragY, loadPlants, startWaterDrops, stopWaterDrops]);

  /* ── grid data ── */
  const slots: (Plant | null)[] = Array.from(
    { length: MAX_PLANTS },
    (_, i) => plants[i] ?? null,
  );

  const rows: (Plant | null)[][] = [];
  for (let s = 0; s < SHELVES; s++) {
    rows.push(slots.slice(s * COLS, s * COLS + COLS));
  }

  /* ── render ── */
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>🌱 Planty</Text>
          <Text style={styles.subtitle}>Your plant collection</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {plants.length}/{MAX_PLANTS}
          </Text>
        </View>
      </View>

      {/* Plants area */}
      <View style={styles.plantsArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isDragging}
        >
          {rows.map((row, shelfIdx) => (
            <View key={shelfIdx} style={styles.shelfSection}>
              <View style={styles.row}>
                {row.map((plant, colIdx) => {
                  const idx = shelfIdx * COLS + colIdx;
                  const isBeingWatered = wateringIdx === idx;

                  return (
                    <View
                      key={plant?.id ?? `slot-${idx}`}
                      ref={ref => {
                        if (ref) { slotRefs.current.set(idx, ref); }
                        else { slotRefs.current.delete(idx); }
                      }}
                    >
                      {plant ? (
                        <PlantCard
                          plant={plant}
                          onPress={openInfoCard}
                          isBeingWatered={isBeingWatered}
                        />
                      ) : (
                        <View style={{ width: CARD_SIZE, height: CARD_SIZE }} />
                      )}
                    </View>
                  );
                })}
              </View>
              <Shelf width={SHELF_WIDTH} />
            </View>
          ))}

          {plants.length === 0 && (
            <Text style={styles.emptyHint}>
              Tap the 'Add' button below to add your first plant 🌱
            </Text>
          )}
        </ScrollView>
      </View>

      {/* Garden footer — fence covers the top edge, buttons + sprinkler sit in front */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>

        {/* Fence: spans full width, overflows upward to cover the plants/footer border */}
        <View style={styles.fenceWrapper} pointerEvents="none">
          <Fence width={SCREEN_WIDTH} height={104} />
        </View>

        {/* Flowers: sit at the base of the fence pickets */}
        <View style={styles.flowersRow} pointerEvents="none">
          <Flower width={57} height={37} />
          <Flower width={48} height={31} />
          <Flower width={57} height={37} />
          <Flower width={44} height={29} />
          <Flower width={57} height={37} />
          <Flower width={50} height={33} />
        </View>

        {/* Buttons row: Add | Sprinkler (draggable) | Clock — in front of fence */}
        <View style={styles.footerButtons}>
          {/* Add Plant button */}
          <TouchableOpacity
            style={[styles.footerBtn, plants.length >= MAX_PLANTS && styles.footerBtnDisabled]}
            onPress={openAddCard}
            disabled={plants.length >= MAX_PLANTS}
            activeOpacity={0.7}
          >
            <Text style={styles.footerBtnEmoji}>🌱</Text>
            <Text style={styles.footerBtnLabel}>Add</Text>
          </TouchableOpacity>

          {/* Sprinkler — draggable, between the two buttons */}
          <View
            style={styles.sprinklerInFooter}
            {...panResponder.panHandlers}
          >
            <Sprinkler width={SPRINKLER_SIZE} height={SPRINKLER_SIZE} />
          </View>

          {/* Clock / notification time button */}
          <TouchableOpacity
            style={styles.footerBtn}
            onPress={() => setTimePickerVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.footerBtnEmoji}>⏰</Text>
            <Text style={styles.footerBtnLabel}>{formatTime(notifHour, notifMinute)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating sprinkler overlay (visible only during drag) */}
      {isDragging && (
        <Animated.View
          style={[
            styles.floatingSprinklerActive,
            { left: dragX, top: dragY },
          ]}
          pointerEvents="none"
        >
          <Sprinkler width={SPRINKLER_SIZE} height={SPRINKLER_SIZE} />
          {/* Water drops */}
          {dropAnims.map((drop, i) => (
            <Animated.View
              key={i}
              style={[
                styles.waterDrop,
                {
                  opacity: drop.opacity,
                  transform: [
                    { translateX: drop.translateX },
                    { translateY: drop.translateY },
                  ],
                },
              ]}
            />
          ))}
        </Animated.View>
      )}

      {/* Modals */}
      <AddPlantCard
        visible={addCardVisible}
        onSave={handleAddSave}
        onClose={() => setAddCardVisible(false)}
      />

      {selectedPlant && (
        <PlantInfoCard
          visible={infoCardVisible}
          plant={selectedPlant}
          onClose={() => setInfoCardVisible(false)}
          onSaveName={handleInfoSaveName}
          onSaveLastWatered={handleInfoSaveLastWatered}
          onDelete={handleInfoDelete}
        />
      )}

      <NotificationTimePicker
        visible={timePickerVisible}
        currentHour={notifHour}
        currentMinute={notifMinute}
        onSelect={handleTimeChange}
        onClose={() => setTimePickerVisible(false)}
      />
    </SafeAreaView>
  );
};

/* ─── styles ─── */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#D8F3DC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#D8F3DC',
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1C3D1C',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#74C69D',
    fontWeight: '500',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#2D6A4F',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  scroll: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 16,
  },
  plantsArea: {
    flex: 1,
    backgroundColor: '#D8F3DC',
  },
  shelfSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
    marginBottom: 4,
  },
  emptyHint: {
    textAlign: 'center',
    color: '#95D5B2',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },

  /* footer */
  footer: {
    height: FOOTER_HEIGHT,
    backgroundColor: '#D8F3DC',
    overflow: 'visible',   // let fence bleed upward
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  fenceWrapper: {
    position: 'absolute',
    top: -36,             // bleed 36px upward into the plants area
    left: 0,
    right: 0,
    zIndex: 1,
  },
  flowersRow: {
    position: 'absolute',
    top: 52,              // bottom of fence pickets, above rails
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    zIndex: 2,
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    zIndex: 10,
    elevation: 10,
    marginBottom: 12,
  },
  footerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: 68,
    height: 68,
    borderRadius: 34,
    elevation: 6,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  footerBtnDisabled: {
    opacity: 0.5,
  },
  footerBtnEmoji: {
    fontSize: 28,
  },
  footerBtnLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2D6A4F',
    marginTop: 2,
  },
  sprinklerInFooter: {
    zIndex: 10,
    elevation: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  /* active floating sprinkler during drag */
  floatingSprinklerActive: {
    position: 'absolute',
    width: SPRINKLER_SIZE,
    height: SPRINKLER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    elevation: 20,
  },

  /* individual water drop */
  waterDrop: {
    position: 'absolute',
    bottom: 2,
    width: 5,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4FC3F7',
  },
});

export default HomeScreen;
