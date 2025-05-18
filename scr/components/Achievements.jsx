import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ACHIEVEMENTS, LEVELS } from '../data/achievements';

const { width } = Dimensions.get('window');

export default function Achievements({ stats, onClose }) {
  const calculateLevel = (points) => {
    const levelEntries = Object.entries(LEVELS);
    for (let i = levelEntries.length - 1; i >= 0; i--) {
      if (points >= levelEntries[i][1].minPoints) {
        return levelEntries[i][1];
      }
    }
    return LEVELS.BEGINNER;
  };

  const currentLevel = calculateLevel(stats.totalPoints || 0);

  const renderAchievement = (achievement) => {
    const progress = stats[achievement.type] || 0;
    const isCompleted = progress >= achievement.requirement;

    return (
      <View
        key={achievement.id}
        style={[
          styles.achievementCard,
          isCompleted && styles.achievementCompleted,
        ]}
      >
        <Text style={styles.achievementIcon}>{achievement.icon}</Text>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.achievementDescription}>
            {achievement.description}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    (progress / achievement.requirement) * 100,
                    100
                  )}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress}/{achievement.requirement}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>

      <View style={styles.levelContainer}>
        <Text style={styles.levelIcon}>{currentLevel.icon}</Text>
        <Text style={styles.levelTitle}>{currentLevel.title}</Text>
        <Text style={styles.points}>{stats.totalPoints || 0} points</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {Object.values(ACHIEVEMENTS).map(renderAchievement)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 30,
    color: '#666',
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  levelIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  points: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  achievementCompleted: {
    backgroundColor: '#e8f5e9',
  },
  achievementIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
}); 