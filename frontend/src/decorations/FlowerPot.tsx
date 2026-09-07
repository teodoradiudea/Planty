import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

interface FlowerPotProps {
  /** Plant name to display on the pot rim. */
  name?: string;
  /** Emoji to float above the pot. */
  emoji?: string;
}

/* Original SVG dimensions for viewBox */
const SVG_W = 184;
const SVG_H = 132;

/* Fixed size for the pot */
export const POT_W = 50; // reduced from 70
const POT_H = POT_W * (SVG_H / SVG_W); // ~35.8
export const POT_CONTAINER_H = POT_H + 40; // 40 for emoji area

const FlowerPot: React.FC<FlowerPotProps> = ({
  name,
  emoji,
}) => {
  return (
    <View style={[styles.container, { width: POT_W, height: POT_CONTAINER_H }]}>
      {/* Emoji floats above the pot */}
      {emoji ? (
        <Text style={[styles.emoji, { fontSize: POT_W * 0.28 }]}>{emoji}</Text>
      ) : null}

      {/* The pot SVG — sits at the bottom of the container */}
      <Svg
        width={POT_W}
        height={POT_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        fill="none"
      >
        {/* Pot body */}
        <Path
          fill="#D19475"
          stroke="#B37B5F"
          strokeWidth={3}
          d="m170.769 33-17.411 82.905A19 19 0 0 1 134.764 131H47.14a19 19 0 0 1-18.684-15.544L13.202 33H170.77Z"
        />
        {/* Pot rim */}
        <Rect
          width={182}
          height={30}
          x={1}
          y={1}
          fill="#C28566"
          stroke="#B37B5F"
          strokeWidth={3}
          rx={10}
        />
      </Svg>

      {/* Plant name overlaid on the rim */}
      {name ? (
        <Text
          style={[
            styles.name,
            {
              fontSize: Math.max(8, POT_W * 0.2),
              color: "#966750",
              top: 55 + POT_H * 0.02,
              width: POT_W * 0.9,
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {name}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  emoji: {
    textAlign: 'center',
    marginBottom: 0,
  },
  name: {
    position: 'absolute',
    textAlign: 'center',
    fontWeight: '700',
    color: '#3B1F0E',
    letterSpacing: 0.1,
  },
});

export default FlowerPot;

