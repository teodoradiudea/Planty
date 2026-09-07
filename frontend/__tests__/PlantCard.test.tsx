/**
 * Unit tests for PlantCard component.
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import PlantCard from '../src/components/PlantCard';
import type { Plant } from '../src/types/Plant';

const ORCHID: Plant = {
  id: 'p1',
  name: 'Purple Queen',
  specie: { id: 1, name: 'Orchid', wateringDays: 7, emoji: '🌸' },
  status: { id: 1, name: 'Healthy' },
  last_watered: '2026-08-15',
  watering_days: 7,
};

const POINSETTIA: Plant = {
  id: 'p2',
  name: 'Red Star',
  specie: { id: 2, name: 'Poinsettia', wateringDays: 3, emoji: '🌺' },
  status: { id: 2, name: 'Needs Water' },
  last_watered: '2026-08-14',
  watering_days: 3,
};

const WILTING: Plant = {
  id: 'p3',
  name: 'Sad Fern',
  specie: { id: 7, name: 'Spider Plant', wateringDays: 5, emoji: '🌱' },
  status: { id: 3, name: 'Wilting' },
  last_watered: '2026-08-01',
  watering_days: 5,
};

const renderCard = (
  plant: Plant,
  onPress = jest.fn(),
  isBeingWatered = false,
): ReactTestRenderer => {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      <PlantCard plant={plant} onPress={onPress} isBeingWatered={isBeingWatered} />,
    );
  });
  return renderer;
};

// ---------------------------------------------------------------------------

describe('PlantCard', () => {
  describe('rendering', () => {
    it('renders the plant name', () => {
      const renderer = renderCard(ORCHID);
      expect(JSON.stringify(renderer.toJSON())).toContain('Purple Queen');
    });

    it('renders orchid emoji 🌸 for Orchid specie', () => {
      const renderer = renderCard(ORCHID);
      expect(JSON.stringify(renderer.toJSON())).toContain('🌸');
    });

    it('renders poinsettia emoji 🌺 for Poinsettia specie', () => {
      const renderer = renderCard(POINSETTIA);
      expect(JSON.stringify(renderer.toJSON())).toContain('🌺');
    });
  });

  describe('interaction', () => {
    it('calls onPress with the plant object when tapped', () => {
      const onPress = jest.fn();
      const renderer = renderCard(ORCHID, onPress);
      act(() => {
        renderer.root.findByType(TouchableOpacity).props.onPress();
      });
      expect(onPress).toHaveBeenCalledTimes(1);
      expect(onPress).toHaveBeenCalledWith(ORCHID);
    });
  });

  describe('status aura', () => {
    it('shows no aura for a healthy plant when not being watered', () => {
      const renderer = renderCard(ORCHID);
      const json = JSON.stringify(renderer.toJSON());
      // Healthy plants have no aura colour — blue/red/orange tints should be absent
      expect(json).not.toContain('rgba(214, 40, 57');  // red (wilting)
      expect(json).not.toContain('rgba(224, 122, 95'); // orange (needs water)
      expect(json).not.toContain('rgba(79, 195, 247'); // blue (watering)
    });

    it('shows a red aura for a wilting plant', () => {
      const renderer = renderCard(WILTING);
      expect(JSON.stringify(renderer.toJSON())).toContain('rgba(214, 40, 57');
    });

    it('shows an orange aura for a plant that needs water', () => {
      const renderer = renderCard(POINSETTIA);
      expect(JSON.stringify(renderer.toJSON())).toContain('rgba(224, 122, 95');
    });

    it('shows a blue aura when isBeingWatered is true regardless of status', () => {
      const renderer = renderCard(ORCHID, jest.fn(), true);
      expect(JSON.stringify(renderer.toJSON())).toContain('rgba(79, 195, 247');
    });
  });
});
