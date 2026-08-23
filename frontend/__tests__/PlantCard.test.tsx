/**
 * Unit tests for PlantCard component.
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import PlantCard, { CARD_COLORS } from '../src/components/PlantCard';
import type { Plant } from '../src/types/Plant';

const ORCHID: Plant = {
  id: 'p1',
  name: 'Purple Queen',
  specie: { id: 1, name: 'Orchid' },
  status: { id: 1, name: 'Healthy' },
  last_watered: '2026-08-15',
  watering_days: 7,
};

const POINSETTIA: Plant = {
  id: 'p2',
  name: 'Red Star',
  specie: { id: 2, name: 'Poinsettia' },
  status: { id: 2, name: 'Needs Water' },
  last_watered: '2026-08-14',
  watering_days: 3,
};

const renderCard = (
  plant: Plant,
  index: number,
  onPress = jest.fn(),
  cardSize = 100,
): ReactTestRenderer => {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      <PlantCard plant={plant} index={index} onPress={onPress} cardSize={cardSize} />,
    );
  });
  return renderer;
};

// ---------------------------------------------------------------------------

describe('PlantCard', () => {
  describe('rendering', () => {
    it('renders the plant name', () => {
      const renderer = renderCard(ORCHID, 0);
      expect(JSON.stringify(renderer.toJSON())).toContain('Purple Queen');
    });

    it('renders orchid emoji 🌸 for Orchid specie', () => {
      const renderer = renderCard(ORCHID, 0);
      expect(JSON.stringify(renderer.toJSON())).toContain('🌸');
    });

    it('renders poinsettia emoji 🌺 for Poinsettia specie', () => {
      const renderer = renderCard(POINSETTIA, 1);
      expect(JSON.stringify(renderer.toJSON())).toContain('🌺');
    });

    it('renders the status label', () => {
      const renderer = renderCard(ORCHID, 0);
      expect(JSON.stringify(renderer.toJSON())).toContain('Healthy');
    });

    it('applies the correct card width from cardSize prop', () => {
      const renderer = renderCard(ORCHID, 0, jest.fn(), 120);
      const root = renderer.toJSON() as any;
      const styleArr: any[] = Array.isArray(root.props.style)
        ? root.props.style
        : [root.props.style];
      expect(styleArr.some((s: any) => s && s.width === 120)).toBe(true);
    });
  });

  describe('interaction', () => {
    it('calls onPress with the plant object when tapped', () => {
      const onPress = jest.fn();
      const renderer = renderCard(ORCHID, 0, onPress);
      act(() => {
        renderer.root.findByType(TouchableOpacity).props.onPress();
      });
      expect(onPress).toHaveBeenCalledTimes(1);
      expect(onPress).toHaveBeenCalledWith(ORCHID);
    });
  });

  describe('color palette', () => {
    it('has 9 distinct colors', () => {
      expect(CARD_COLORS).toHaveLength(9);
    });

    it('all entries are valid hex colors', () => {
      CARD_COLORS.forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('wraps back to index 0 color when index equals palette length', () => {
      expect(CARD_COLORS[9 % CARD_COLORS.length]).toBe(CARD_COLORS[0]);
    });
  });
});
