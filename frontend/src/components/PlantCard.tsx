import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { POT_W, POT_CONTAINER_H } from '../decorations/FlowerPot';
import FlowerPot from '../decorations/FlowerPot';
import type { Plant } from '../types/Plant';
import {AURA_COLOR, plantStyle} from "../styles/plantStyle.ts";

interface PlantCardProps {
  plant: Plant;
  onPress: (plant: Plant) => void;
  isBeingWatered: boolean;
}

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
            plantStyle.aura,
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

export default PlantCard;


