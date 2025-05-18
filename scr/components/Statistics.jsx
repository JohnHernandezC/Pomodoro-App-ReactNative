import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const StatCard = ({ icon, title, value, subtitle }) => (
  <View style={styles.statCard}>
    <MaterialCommunityIcons name={icon} size={24} color="#6C5CE7" />
    <View style={styles.statInfo}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  </View>
);

export default function Statistics({ stats, onClose }) {
  const calculateDailyAverage = () => {
    if (!stats.lastActiveDate) return 0;
    const firstDate = new Date(stats.firstActiveDate || stats.lastActiveDate);
    const lastDate = new Date(stats.lastActiveDate);
    const daysDiff = Math.max(1, Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1);
    return (stats.pomodoros / daysDiff).toFixed(1);
  };

  const calculateCompletionRate = () => {
    if (stats.totalSessions === 0) return '0%';
    return Math.round((stats.pomodoros / stats.totalSessions) * 100) + '%';
  };

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const totalFocusTime = stats.pomodoros * 25; // 25 minutes per pomodoro

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>

      <View style={styles.levelContainer}>
        <MaterialCommunityIcons name="chart-box" size={40} color="#6C5CE7" style={styles.levelIcon} />
        <Text style={styles.levelTitle}>Estadísticas</Text>
        <Text style={styles.subtitle}>Tu progreso hasta ahora</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.statsGrid}>
          <StatCard
            icon="timer-outline"
            title="Pomodoros Totales"
            value={stats.pomodoros}
            subtitle="sesiones completadas"
          />

          <StatCard
            icon="clock-outline"
            title="Tiempo Total Enfocado"
            value={formatTime(totalFocusTime)}
            subtitle="de trabajo efectivo"
          />

          <StatCard
            icon="fire"
            title="Racha Actual"
            value={`${stats.streak} días`}
            subtitle={stats.streak > 0 ? "¡Sigue así!" : "Comienza tu racha"}
          />

          <StatCard
            icon="chart-line-variant"
            title="Promedio Diario"
            value={calculateDailyAverage()}
            subtitle="pomodoros por día"
          />

          <StatCard
            icon="calendar-check"
            title="Mejor Día"
            value={stats.bestDay?.count || 0}
            subtitle={stats.bestDay?.date ? `el ${new Date(stats.bestDay.date).toLocaleDateString()}` : 'aún no registrado'}
          />

          <StatCard
            icon="check-circle-outline"
            title="Tasa de Finalización"
            value={calculateCompletionRate()}
            subtitle="pomodoros completados"
          />
        </View>

        <View style={styles.weekSummary}>
          <Text style={styles.weekTitle}>Resumen Semanal</Text>
          <View style={styles.weekGrid}>
            {Array(7).fill(0).map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - index));
              const dayStats = stats.weeklyData?.[date.toISOString().split('T')[0]] || 0;
              
              return (
                <View key={index} style={styles.dayColumn}>
                  <View style={[styles.dayBar, { height: Math.min(100, dayStats * 10) }]} />
                  <Text style={styles.dayLabel}>
                    {['D', 'L', 'M', 'X', 'J', 'V', 'S'][date.getDay()]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
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
  scrollView: {
    flex: 1,
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
    marginBottom: 10,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
    statsGrid: {      paddingHorizontal: 15,    },    statCard: {      width: '100%',      backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statInfo: {
    marginLeft: 10,
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 11,
    color: '#999',
  },
  weekSummary: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    margin: 15,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
    alignItems: 'flex-end',
  },
  dayColumn: {
    alignItems: 'center',
    width: 30,
  },
  dayBar: {
    width: 20,
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
    opacity: 0.8,
  },
  dayLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
}); 