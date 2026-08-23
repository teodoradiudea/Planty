import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SPECIE_EMOJI } from '../constants/plantOptions';
import type { Plant } from '../types/Plant';

export const CARD_COLORS = [
  '#2D6A4F',
  '#52B788',
  '#7B2D8B',
  '#D62839',
  '#E07A5F',
  '#3D5A80',
  '#C9A227',
  '#81B29A',
  '#6B4226',
];

interface PlantCardProps {
  plant: Plant;
  index: number;
  onPress: (plant: Plant) => void;
  cardSize: number;
}

const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  index,
  onPress,
  cardSize,
}) => {
  const bgColor = CARD_COLORS[index % CARD_COLORS.length];
  const emoji = SPECIE_EMOJI[plant.specie.name.toLowerCase()] ?? '🌿';

  return (
    <TouchableOpacity
      style={[styles.wrapper, { width: cardSize }]}
      onPress={() => onPress(plant)}
      activeOpacity={0.85}
    >
      <View style={[styles.card, { backgroundColor: bgColor, height: cardSize }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {plant.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  emoji: {
    fontSize: 20,
  },
  name: {
    marginTop: 7,
    fontSize: 13,
    fontWeight: '700',
    color: '#1C3D1C',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});

export default PlantCard;
