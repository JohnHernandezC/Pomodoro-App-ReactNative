import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACHIEVEMENTS } from '../data/achievements';

const STATS_KEY = '@pomodoro_stats';

export const initialStats = {
  pomodoros: 0,
  pomodoros_day: 0,
  breaks: 0,
  streak: 0,
  lastActiveDate: null,
  firstActiveDate: null,
  totalPoints: 0,
  completedAchievements: [],
  totalSessions: 0,
  weeklyData: {},
  bestDay: {
    date: null,
    count: 0
  }
};

export const loadStats = async () => {
  try {
    const statsJson = await AsyncStorage.getItem(STATS_KEY);
    return statsJson ? JSON.parse(statsJson) : initialStats;
  } catch (error) {
    console.error('Error loading stats:', error);
    return initialStats;
  }
};

export const saveStats = async (stats) => {
  try {
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

export const updateStats = async (type) => {
  const stats = await loadStats();
  const today = new Date().toDateString();
  const todayISO = new Date().toISOString().split('T')[0];
  
  // Initialize first active date if not set
  if (!stats.firstActiveDate) {
    stats.firstActiveDate = today;
  }
  
  // Update streak
  if (stats.lastActiveDate) {
    const lastActive = new Date(stats.lastActiveDate);
    const daysDiff = Math.floor((new Date() - lastActive) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      stats.streak += 1;
    } else if (daysDiff > 1) {
      stats.streak = 1;
    }
  } else {
    stats.streak = 1;
  }
  
  stats.lastActiveDate = today;

  // Initialize weekly data if needed
  if (!stats.weeklyData) {
    stats.weeklyData = {};
  }

  // Update counters
  if (type === 'pomodoro') {
    stats.pomodoros += 1;
    stats.totalSessions += 1;
    stats.pomodoros_day = (stats.lastActiveDate === today) ? (stats.pomodoros_day + 1) : 1;
    
    // Update weekly data
    stats.weeklyData[todayISO] = (stats.weeklyData[todayISO] || 0) + 1;
    
    // Update best day
    if (stats.weeklyData[todayISO] > (stats.bestDay?.count || 0)) {
      stats.bestDay = {
        date: today,
        count: stats.weeklyData[todayISO]
      };
    }
  } else if (type === 'break') {
    stats.breaks += 1;
    stats.totalSessions += 1;
  }

  // Clean up old weekly data (keep only last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  stats.weeklyData = Object.entries(stats.weeklyData).reduce((acc, [date, count]) => {
    if (new Date(date) >= thirtyDaysAgo) {
      acc[date] = count;
    }
    return acc;
  }, {});

  // Check achievements
  let pointsEarned = 0;
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (!stats.completedAchievements.includes(achievement.id)) {
      const progress = stats[achievement.type] || 0;
      if (progress >= achievement.requirement) {
        stats.completedAchievements.push(achievement.id);
        pointsEarned += 50; // Points for completing an achievement
      }
    }
  });

  stats.totalPoints += pointsEarned;
  
  await saveStats(stats);
  return { stats, pointsEarned };
}; 