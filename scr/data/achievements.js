export const ACHIEVEMENTS = {
  FIRST_POMODORO: {
    id: 'FIRST_POMODORO',
    title: 'First Focus!',
    description: 'Complete your first Pomodoro session',
    icon: '🎯',
    requirement: 1,
    type: 'pomodoros',
  },
  PRODUCTIVE_DAY: {
    id: 'PRODUCTIVE_DAY',
    title: 'Productive Day',
    description: 'Complete 4 Pomodoros in a day',
    icon: '⭐',
    requirement: 4,
    type: 'pomodoros_day',
  },
  FOCUS_MASTER: {
    id: 'FOCUS_MASTER',
    title: 'Focus Master',
    description: 'Complete 25 total Pomodoro sessions',
    icon: '🏆',
    requirement: 25,
    type: 'pomodoros',
  },
  STREAK_WARRIOR: {
    id: 'STREAK_WARRIOR',
    title: 'Streak Warrior',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    requirement: 3,
    type: 'streak',
  },
  BREAK_BALANCE: {
    id: 'BREAK_BALANCE',
    title: 'Break Balance',
    description: 'Take 10 proper breaks',
    icon: '⚖️',
    requirement: 10,
    type: 'breaks',
  },
};

export const LEVELS = {
  BEGINNER: {
    title: 'Beginner',
    minPoints: 0,
    icon: '🌱',
  },
  INTERMEDIATE: {
    title: 'Intermediate',
    minPoints: 100,
    icon: '🌿',
  },
  ADVANCED: {
    title: 'Advanced',
    minPoints: 300,
    icon: '🌳',
  },
  MASTER: {
    title: 'Pomodoro Master',
    minPoints: 1000,
    icon: '🎓',
  },
}; 