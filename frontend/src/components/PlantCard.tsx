import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { POT_W, POT_CONTAINER_H } from '../decorations/FlowerPot';
import FlowerPot from '../decorations/FlowerPot';
import type { Plant } from '../types/Plant';

interface PlantCardProps {
  plant: Plant;
  onPress: (plant: Plant) => void;
  isBeingWatered: boolean;
}

/** Maps status name to aura colour. Healthy has no aura. */
const AURA_COLOR: Record<string, string | undefined> = {
  wilting:       'rgba(214, 40, 57, 0.35)',   // red
  'needs water': 'rgba(224, 122, 95, 0.35)',  // orange
};

const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onPress,
  isBeingWatered,
}) => {
  const auraColor = isBeingWatered
    ? 'rgba(79, 195, 247, 0.35)'   // blue — sprinkler hover
    : AURA_COLOR[plant.status.name.toLowerCase()];

  return (
    <TouchableOpacity
      onPress={() => onPress(plant)}
      activeOpacity={0.85}
    >
      {/* Status / watering aura behind the pot */}
      {auraColor && (
        <View
          style={[
            styles.aura,
            { width: POT_W, height: POT_CONTAINER_H, backgroundColor: auraColor },
          ]}
        />
      )}
      <FlowerPot
        name={plant.name}
        emoji={plant.specie.emoji}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  aura: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
});

export default PlantCard;


