import {StyleSheet} from "react-native";

export const AURA_COLOR: Record<string, string | undefined> = {
    wilting:       'rgba(214, 40, 57, 0.35)',   // red
    'needs water': 'rgba(224, 122, 95, 0.35)',  // orange
};

export const plantStyle = StyleSheet.create({
    aura: {
        position: 'absolute',
        bottom: 0,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.15)',
    },
});