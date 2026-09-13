import {StyleSheet} from "react-native";

export const AURA_COLOR: Record<string, string | undefined> = {
    wilting:'#D62839',
    'needs water':'#E07A5F',
};

export const AURA_WATERING_COLOR = '#4FC3F7';  // blue
export const AURA_SIZE = 70;

export const plantStyle = StyleSheet.create({
    aura: {
        position: 'absolute',
        bottom: 0,
    },
});
