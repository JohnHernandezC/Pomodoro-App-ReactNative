import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const TIMER_SIZE = width * 0.7;

export default function Timer({ time }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Pulse animation when time changes
    scale.value = withSequence(
      withSpring(1.1, { damping: 2 }),
      withSpring(1, { damping: 2 })
    );
    opacity.value = withSequence(
      withTiming(0.7, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  }, [time]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (time % 60) / 60;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.timerCircle, animatedStyle]}>
        <Text style={styles.time}>{formatTime(time)}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCircle: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    borderRadius: TIMER_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  time: {
    fontSize: TIMER_SIZE * 0.25,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
  },
});