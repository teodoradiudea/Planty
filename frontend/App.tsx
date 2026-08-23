/**
 * Planty — Plant Manager App
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import {
  requestNotificationPermission,
  setupNotificationChannel,
} from './src/services/notifications';

function App(): React.JSX.Element {
  useEffect(() => {
    // Set up the Android channel and request permission once on launch
    setupNotificationChannel()
      .then(() => requestNotificationPermission())
      .catch(err => console.warn('[App] notification setup error:', err));
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7F2" />
      <HomeScreen />
    </SafeAreaProvider>
  );
}

export default App;
