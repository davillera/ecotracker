import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function DashboardScreen() {
  // Datos simulados - en una app real vendrían de un contexto o base de datos
  const weekData = [
    { day: 'Lun', co2: 8.5 },
    { day: 'Mar', co2: 6.2 },
    { day: 'Mié', co2: 7.8 },
    { day: 'Jue', co2: 5.4 },
    { day: 'Vie', co2: 9.1 },
    { day: 'Sáb', co2: 4.2 },
    { day: 'Dom', co2: 3.8 },
  ];

  const totalWeekCO2 = weekData.reduce((sum, day) => sum + day.co2, 0);
  const avgDailyCO2 = totalWeekCO2 / weekData.length;
  const maxCO2 = Math.max(...weekData.map(d => d.co2));

  const stats = [
    { label: 'Total Semanal', value: `${totalWeekCO2.toFixed(1)} kg`, color: '#16a34a', icon: '🌍' },
    { label: 'Promedio Diario', value: `${avgDailyCO2.toFixed(1)} kg`, color: '#2563eb', icon: '📊' },
    { label: 'Comidas', value: '18 reg.', color: '#16a34a', icon: '🍽️' },
    { label: 'Viajes', value: '12 reg.', color: '#2563eb', icon: '🚗' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Dashboard</Text>
        <Text style={styles.headerSubtitle}>Tu impacto ambiental semanal</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Emisiones por día (kg CO₂)</Text>
          <View style={styles.chart}>
            {weekData.map((day, index) => {
              const barHeight = (day.co2 / maxCO2) * 150;
              return (
                <View key={index} style={styles.barContainer}>
                  <Text style={styles.barValue}>{day.co2.toFixed(1)}</Text>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, { height: barHeight }]} />
                  </View>
                  <Text style={styles.barLabel}>{day.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.compareCard}>
          <Text style={styles.compareTitle}>🌟 Comparación</Text>
          <Text style={styles.compareSubtitle}>vs. Promedio Global</Text>
          
          <View style={styles.compareBar}>
            <View style={styles.compareBarSection}>
              <Text style={styles.compareLabel}>Tú</Text>
              <View style={[styles.compareBarFill, { width: '45%', backgroundColor: '#16a34a' }]} />
              <Text style={styles.compareValue}>{avgDailyCO2.toFixed(1)} kg/día</Text>
            </View>
            <View style={styles.compareBarSection}>
              <Text style={styles.compareLabel}>Global</Text>
              <View style={[styles.compareBarFill, { width: '70%', backgroundColor: '#ef4444' }]} />
              <Text style={styles.compareValue}>12.5 kg/día</Text>
            </View>
          </View>

          <View style={styles.messageBanner}>
            <Text style={styles.messageBannerText}>
              ¡Genial! Estás 35% por debajo del promedio 🎉
            </Text>
          </View>
        </View>

        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Desglose por categoría</Text>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Text style={styles.breakdownIcon}>🍽️</Text>
              <Text style={styles.breakdownLabel}>Comidas</Text>
            </View>
            <View style={styles.breakdownRight}>
              <View style={styles.breakdownBar}>
                <View style={[styles.breakdownBarFill, { width: '60%', backgroundColor: '#16a34a' }]} />
              </View>
              <Text style={styles.breakdownValue}>18.2 kg</Text>
            </View>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Text style={styles.breakdownIcon}>🚗</Text>
              <Text style={styles.breakdownLabel}>Transporte</Text>
            </View>
            <View style={styles.breakdownRight}>
              <View style={styles.breakdownBar}>
                <View style={[styles.breakdownBarFill, { width: '75%', backgroundColor: '#2563eb' }]} />
              </View>
              <Text style={styles.breakdownValue}>26.8 kg</Text>
            </View>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Text style={styles.breakdownIcon}>⚡</Text>
              <Text style={styles.breakdownLabel}>Energía</Text>
            </View>
            <View style={styles.breakdownRight}>
              <View style={styles.breakdownBar}>
                <View style={[styles.breakdownBarFill, { width: '40%', backgroundColor: '#f59e0b' }]} />
              </View>
              <Text style={styles.breakdownValue}>10.0 kg</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fdf8',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#f59e0b',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  barWrapper: {
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 28,
    backgroundColor: '#16a34a',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
  },
  compareCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compareTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  compareSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
  },
  compareBar: {
    gap: 16,
  },
  compareBarSection: {
    gap: 8,
  },
  compareLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  compareBarFill: {
    height: 32,
    borderRadius: 8,
  },
  compareValue: {
    fontSize: 13,
    color: '#666',
  },
  messageBanner: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  messageBannerText: {
    fontSize: 14,
    color: '#166534',
    textAlign: 'center',
    fontWeight: '600',
  },
  breakdownCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breakdownIcon: {
    fontSize: 24,
  },
  breakdownLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  breakdownRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 16,
  },
  breakdownBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  breakdownBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  breakdownValue: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
});
