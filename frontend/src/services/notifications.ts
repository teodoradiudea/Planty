/**
 * Planty — Notification Service
 *
 * Schedules a daily local notification for each plant at 17:00 Romanian time
 * (Europe/Bucharest = UTC+2 in winter EET, UTC+3 in summer EEST).
 *
 * Each plant gets one scheduled notification keyed by its ID.
 * When a plant is added, renamed, or deleted the notification is
 * cancelled and rescheduled accordingly.
 */

import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { getNotificationHour } from '../database/db';
import type { Plant } from '../types/Plant';

/* ─── constants ─────────────────────────────────────────────────────────── */

export const CHANNEL_ID = 'planty-watering';

/** UTC offset for Romania: +3h in summer (EEST), +2h in winter (EET) */
const BUCHAREST_OFFSET_MS = (): number => {
  // Determine whether Bucharest is currently on EEST (+3) or EET (+2)
  // by checking what offset the Intl formatter gives for Europe/Bucharest.
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: 'Europe/Bucharest',
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find(p => p.type === 'timeZoneName')?.value ?? 'GMT+3';
    // tzPart looks like "GMT+3" or "GMT+2"
    const match = tzPart.match(/GMT([+-]\d+)/);
    const hours = match ? parseInt(match[1], 10) : 3;
    return hours * 60 * 60 * 1000;
  } catch {
    return 3 * 60 * 60 * 1000; // default to EEST
  }
};

/* ─── helpers ────────────────────────────────────────────────────────────── */

const parseLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const nextWateringDateStr = (lastWatered: string, wateringDays: number): string => {
  const base = parseLocalDate(lastWatered);
  base.setDate(base.getDate() + wateringDays);
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, '0');
  const d = String(base.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Returns the UTC timestamp for the user-chosen notification hour on a given
 * YYYY-MM-DD date in the Europe/Bucharest timezone.
 */
const atScheduledHourBucharest = (dateStr: string): number => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const hour = getNotificationHour();
  // Build the timestamp as if it's midnight UTC for that date,
  // then shift to the chosen hour in Bucharest time.
  const midnightUtc = Date.UTC(y, m - 1, d, 0, 0, 0, 0);
  const offset = BUCHAREST_OFFSET_MS();
  return midnightUtc + (hour * 60 * 60 * 1000) - offset;
};

const notificationId = (plantId: string) => `plant-${plantId}`;

/* ─── setup ──────────────────────────────────────────────────────────────── */

/**
 * Creates the Android notification channel.
 * Safe to call multiple times — notifee is idempotent.
 */
export const setupNotificationChannel = async (): Promise<void> => {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Plant Watering Reminders',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
    lights: true,
  });
};

/**
 * Requests notification permissions (iOS + Android 13+).
 * Returns true if granted.
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  const settings = await notifee.requestPermission();
  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
};

/* ─── per-plant scheduling ───────────────────────────────────────────────── */

/**
 * Schedules (or replaces) a watering reminder for one plant.
 * The notification fires at 17:00 Romanian time on the plant's next
 * watering date. If that date is already past 17:00 today, it is skipped.
 */
export const schedulePlantNotification = async (plant: Plant): Promise<void> => {
  const nextDate = nextWateringDateStr(plant.last_watered, plant.watering_days);
  const fireAt = atScheduledHourBucharest(nextDate);

  if (fireAt <= Date.now()) {
    // Due date has already passed — cancel any stale notification and bail
    await notifee.cancelNotification(notificationId(plant.id));
    return;
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: fireAt,
    // alarmManager ensures the notification fires even in Doze mode
    alarmManager: {
      allowWhileIdle: true,
    },
  };

  await notifee.createTriggerNotification(
    {
      id: notificationId(plant.id),
      title: '🌿 Time to water!',
      body: `${plant.name} needs watering today. Give it some love! 💧`,
      android: {
        channelId: CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_launcher',        // always available
        pressAction: { id: 'default' },
        showTimestamp: true,
      },
      ios: {
        sound: 'default',
        badgeCount: 1,
      },
    },
    trigger,
  );
};

/**
 * Cancels the scheduled notification for a plant.
 */
export const cancelPlantNotification = async (plantId: string): Promise<void> => {
  await notifee.cancelNotification(notificationId(plantId));
};

/**
 * Re-syncs ALL scheduled notifications with the current plant list.
 * Call this on every app launch so the schedule stays accurate even if
 * the user changed the system clock or the app was killed.
 */
export const rescheduleAllNotifications = async (plants: Plant[]): Promise<void> => {
  // Cancel every existing plant trigger
  const existing = await notifee.getTriggerNotifications();
  await Promise.all(
    existing
      .filter(t => t.notification.id?.startsWith('plant-'))
      .map(t => notifee.cancelNotification(t.notification.id!)),
  );

  // Schedule fresh for every plant
  await Promise.all(plants.map(schedulePlantNotification));
};

/**
 * Triggers an immediate test notification.
 */
export const sendTestNotification = async (): Promise<void> => {
  await notifee.displayNotification({
    title: '🧪 Test Notification',
    body: 'Your plant watering reminders are working correctly!',
    android: {
      channelId: CHANNEL_ID,
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_launcher',
      pressAction: { id: 'default' },
    },
    ios: {
      sound: 'default',
      badgeCount: 1,
    },
  });
};
