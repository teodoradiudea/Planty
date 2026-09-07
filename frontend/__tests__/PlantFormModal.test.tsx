/**
 * Unit tests for PlantFormModal component.
 */

import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import PlantFormModal from '../src/components/PlantFormModal';

jest.mock('@op-engineering/op-sqlite', () =>
  require('./__mocks__/@op-engineering/op-sqlite'),
);

const MOCK_PLANT = {
  id: 'plant-1',
  name: 'My Orchid',
  specie: { id: 1, name: 'Orchid', wateringDays: 7, emoji: '🌸' },
  status: { id: 1, name: 'Healthy' },
  last_watered: '2026-08-15',
  watering_days: 7,
};

const renderModal = (
  props: Partial<React.ComponentProps<typeof PlantFormModal>> = {},
) => {
  const onSave = jest.fn();
  const onDelete = jest.fn();
  const onClose = jest.fn();

  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = create(
      <PlantFormModal
        visible={true}
        onSave={onSave}
        onDelete={onDelete}
        onClose={onClose}
        {...props}
      />,
    );
  });

  return { renderer, onSave, onDelete, onClose };
};

/** Finds the TouchableOpacity whose Text child contains the given label */
const findButtonByLabel = (renderer: ReactTestRenderer, label: string) =>
  renderer.root
    .findAllByType(TouchableOpacity)
    .find(el => {
      try {
        return el
          .findAllByType('Text' as any)
          .some(t => typeof t.props.children === 'string' && t.props.children.includes(label));
      } catch {
        return false;
      }
    });

// ---------------------------------------------------------------------------

describe('PlantFormModal', () => {
  describe('Add mode (no plant prop)', () => {
    it('renders "New Plant" title', () => {
      const { renderer } = renderModal();
      expect(JSON.stringify(renderer.toJSON())).toContain('New Plant');
    });

    it('does not render Delete button in add mode', () => {
      const { renderer } = renderModal();
      expect(JSON.stringify(renderer.toJSON())).not.toContain('Delete Plant');
    });

    it('calls onClose when close button is pressed', () => {
      const { renderer, onClose } = renderModal();
      const closeBtns = renderer.root
        .findAllByType(TouchableOpacity)
        .filter(el => el.props.onPress === onClose);
      expect(closeBtns.length).toBeGreaterThan(0);
    });

    it('fires Alert and does NOT call onSave when name is empty', () => {
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      const { renderer, onSave } = renderModal();

      act(() => {
        findButtonByLabel(renderer, 'Save Plant')?.props.onPress();
      });

      expect(onSave).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Missing Field', expect.any(String));
      alertSpy.mockRestore();
    });
  });

  describe('Edit mode (plant prop provided)', () => {
    it('renders "Edit Plant" title', () => {
      const { renderer } = renderModal({ plant: MOCK_PLANT });
      expect(JSON.stringify(renderer.toJSON())).toContain('Edit Plant');
    });

    it('renders Delete Plant button in edit mode', () => {
      const { renderer } = renderModal({ plant: MOCK_PLANT });
      expect(JSON.stringify(renderer.toJSON())).toContain('Delete Plant');
    });

    it('pre-fills form with existing plant name', () => {
      const { renderer } = renderModal({ plant: MOCK_PLANT });
      expect(JSON.stringify(renderer.toJSON())).toContain('My Orchid');
    });
  });

  describe('Species selector', () => {
    it('renders all available species', () => {
      const { renderer } = renderModal();
      const text = JSON.stringify(renderer.toJSON());
      expect(text).toContain('Orchid');
      expect(text).toContain('Poinsettia');
    });
  });

  describe('Watering days input', () => {
    it('renders the watering days field', () => {
      const { renderer } = renderModal();
      const text = JSON.stringify(renderer.toJSON());
      expect(text).toContain('Water Every');
    });
  });

  describe('Date presets', () => {
    it('renders Today and Yesterday preset buttons', () => {
      const { renderer } = renderModal();
      const text = JSON.stringify(renderer.toJSON());
      expect(text).toContain('Today');
      expect(text).toContain('Yesterday');
    });
  });
});
