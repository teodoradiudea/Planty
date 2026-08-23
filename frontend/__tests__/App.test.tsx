/**
 * @format
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from '../App';


test('renders without crashing', async () => {
  await act(async () => {
    ReactTestRenderer.create(
      <SafeAreaProvider>
        <App />
      </SafeAreaProvider>,
    );
  });
});
