import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import Header from "./scr/components/Header";
import Timer from "./scr/components/Timer";
import Achievements from "./scr/components/Achievements";
import Statistics from "./scr/components/Statistics";
import { loadStats, updateStats } from "./scr/services/achievementService";

const { width } = Dimensions.get('window');

const TIMER_TYPES = {
  POMODORO: {
    type: 'POMODORO',
    time: 25 * 60,
    colors: ['#FF6B6B', '#FF8787'],
    icon: 'timer-outline',
  },
  SHORT_BREAK: {
    type: 'SHORT_BREAK',
    time: 5 * 60,
    colors: ['#4ECDC4', '#45B7AF'],
    icon: 'coffee-outline',
  },
  LONG_BREAK: {
    type: 'LONG_BREAK',
    time: 15 * 60,
    colors: ['#6C5CE7', '#5D4ED6'],
    icon: 'beach',
  },
};

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(TIMER_TYPES.POMODORO.time);
  const [currentTimer, setCurrentTimer] = useState(TIMER_TYPES.POMODORO.type);
  const [showModal, setShowModal] = useState(false);
  const [modalView, setModalView] = useState('achievements'); // 'achievements' or 'statistics'
  const [stats, setStats] = useState(null);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const buttonScale = useSharedValue(1);
  
  useEffect(() => {
    loadStats().then(setStats);
  }, []);

  const handleStartStop = useCallback(() => {
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
    setIsRunning(!isRunning);
  }, [isRunning]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    const type = currentTimer === 'POMODORO' ? 'pomodoro' : 'break';
    const { stats: newStats, pointsEarned } = await updateStats(type);
    setStats(newStats);
    
    if (pointsEarned > 0) {
      setEarnedPoints(pointsEarned);
      setShowAchievementPopup(true);
      setTimeout(() => setShowAchievementPopup(false), 3000);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const getCurrentTimerConfig = () => {
    return TIMER_TYPES[currentTimer] || TIMER_TYPES.POMODORO;
  };

  const renderModalContent = () => {
    if (!stats) return null;

    return modalView === 'achievements' ? (
      <Achievements
        stats={stats}
        onClose={() => setShowModal(false)}
      />
    ) : (
      <Statistics
        stats={stats}
        onClose={() => setShowModal(false)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={getCurrentTimerConfig().colors}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Header
            currentTimer={currentTimer}
            setCurrentTimer={setCurrentTimer}
            setTime={setTime}
            timerTypes={TIMER_TYPES}
          />
          
          <View style={styles.timerContainer}>
            <MaterialCommunityIcons
              name={getCurrentTimerConfig().icon}
              size={40}
              color="rgba(255,255,255,0.9)"
              style={styles.timerIcon}
            />
            <Timer time={time} />
          </View>

          <View style={styles.buttonContainer}>
            <Animated.View style={[buttonAnimatedStyle]}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleStartStop}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={isRunning ? "pause" : "play"}
                  size={32}
                  color="white"
                />
                <Text style={styles.buttonText}>
                  {isRunning ? "PAUSE" : "START"}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.statsButtonsContainer}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  setModalView('achievements');
                  setShowModal(true);
                }}
              >
                <MaterialCommunityIcons
                  name="trophy"
                  size={24}
                  color="rgba(255,255,255,0.9)"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  setModalView('statistics');
                  setShowModal(true);
                }}
              >
                <MaterialCommunityIcons
                  name="chart-box"
                  size={24}
                  color="rgba(255,255,255,0.9)"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderModalContent()}
          </View>
        </View>
      </Modal>

      {showAchievementPopup && (
        <View style={styles.achievementPopup}>
          <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
          <Text style={styles.achievementPopupText}>
            ¡Felicitaciones! +{earnedPoints} puntos
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 0,
    paddingHorizontal: 20,
  },
  timerContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  timerIcon: {
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  statsButtonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    gap: 20,
  },
  iconButton: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    flex: 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  achievementPopup: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementPopupText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
});
