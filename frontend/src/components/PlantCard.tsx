import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { POT_W } from '../decorations/FlowerPot';
import FlowerPot from '../decorations/FlowerPot';
import type { Plant } from '../types/Plant';
import { AURA_COLOR, AURA_SIZE, AURA_WATERING_COLOR, plantStyle } from '../styles/plantStyle.ts';

interface PlantCardProps {
  plant: Plant;
  onPress: (plant: Plant) => void;
  isBeingWatered: boolean;
}

const AURA_R = AURA_SIZE / 2;
const AURA_LEFT = -(AURA_SIZE - POT_W) / 2;

const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onPress,
  isBeingWatered,
}) => {
  const baseColor = isBeingWatered
    ? AURA_WATERING_COLOR
    : AURA_COLOR[plant.status.name.toLowerCase()];

  const gradId = isBeingWatered
    ? 'auraGrad_watering'
    : `auraGrad_${plant.status.name.replace(/\s+/g, '_')}`;

  return (
    <TouchableOpacity
      onPress={() => onPress(plant)}
      activeOpacity={0.85}
    >
      {/* Radial-gradient aura behind the pot */}
      {baseColor && (
        <Svg
          width={AURA_SIZE}
          height={AURA_SIZE}
          style={[plantStyle.aura, { left: AURA_LEFT }]}
        >
          <Defs>
            <RadialGradient
              id={gradId}
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0%"   stopColor={baseColor} stopOpacity="0.7" />
              <Stop offset="60%"  stopColor={baseColor} stopOpacity="0.25" />
              <Stop offset="100%" stopColor={baseColor} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle
            cx={AURA_R}
            cy={AURA_R}
            r={AURA_R}
            fill={`url(#${gradId})`}
          />
        </Svg>
      )}
      <FlowerPot
        name={plant.name}
        emoji={plant.specie.emoji}
      />
    </TouchableOpacity>
  );
};

export default PlantCard;
