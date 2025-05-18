import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = (width - 40) / 3;

export default function Header({ currentTimer, setCurrentTimer, setTime, timerTypes }) {
  const translateX = useSharedValue(0);

  const handlePress = (type) => {
    const newTimer = timerTypes[type];
    setCurrentTimer(type);
    setTime(newTimer.time);
    
    const index = Object.keys(timerTypes).indexOf(type);
    translateX.value = withSpring(index * BUTTON_WIDTH);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.slider, animatedStyle]} />
        {Object.entries(timerTypes).map(([type, config]) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.button,
              currentTimer === type && styles.activeButton,
            ]}
            onPress={() => handlePress(type)}
          >
            <Text style={[
              styles.buttonText,
              currentTimer === type && styles.activeButtonText,
            ]}>
              {type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 5,
    position: 'relative',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  buttonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  activeButton: {
    backgroundColor: 'transparent',
  },
  activeButtonText: {
    color: 'white',
  },
  slider: {
    position: 'absolute',
    width: BUTTON_WIDTH - 10,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    left: 5,
  },
});
