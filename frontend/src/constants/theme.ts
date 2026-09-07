import { Platform } from 'react-native';

/** Platform-aware font family - 'Inter' on iOS, system default on Android */
export const FONT_FAMILY = Platform.OS === 'ios' ? 'Inter' : undefined;

/** Fallback colour when a status name is not found in STATUS_COLOR */
export const STATUS_COLOR_FALLBACK = '#9E9E9E';
