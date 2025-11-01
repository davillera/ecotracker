import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { getDashboardStats, getWeeklyData, getCategoryBreakdown } from '@/lib/dashboard';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayStats, setTodayStats] = useState({
    total_co2: 0,
    meals_co2: 0,
    transport_co2: 0,
    meals_count: 0,
    transport_count: 0,
  });
  const [weekData, setWeekData] = useState<Array<{ date: string; meals_co2: number; transport_co2: number; total_co2: number }>>([]);
  const [breakdown, setBreakdown] = useState<any>(null);

  const loadDashboard = async () => {
    try {
      console.log('📊 Loading dashboard data...');
      const [statsResult, weeklyResult, breakdownResult] = await Promise.all([
        getDashboardStats(),
        getWeeklyData(),
        getCategoryBreakdown(),
      ]);

      if (statsResult.data) {
        console.log('📈 Dashboard stats:', statsResult.data);
        setTodayStats(statsResult.data);
      }
      if (weeklyResult.data) {
        setWeekData(weeklyResult.data);
      }
      if (breakdownResult.data) {
        setBreakdown(breakdownResult.data);
      }
    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboard();
  }, []);

  // Cargar al montar y cuando la pantalla está en foco
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Dashboard focused, loading data...');
      loadDashboard();
    }, [])
  );

  useEffect(() => {
    loadDashboard();

    // Suscribirse a cambios en tiempo real para meals
    const mealsChannel = supabase
      .channel('meals-changes-dashboard-screen')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meals',
        },
        (payload) => {
          console.log('🍽️ Meals changed in dashboard screen:', payload.eventType);
          loadDashboard();
        }
      )
      .subscribe((status) => {
        console.log('📡 Dashboard meals subscription:', status);
      });

    // Suscribirse a cambios en tiempo real para transport
    const transportChannel = supabase
      .channel('transport-changes-dashboard-screen')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transport',
        },
        (payload) => {
          console.log('🚗 Transport changed in dashboard screen:', payload.eventType);
          loadDashboard();
        }
      )
      .subscribe((status) => {
        console.log('📡 Dashboard transport subscription:', status);
      });

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up dashboard subscriptions');
      mealsChannel.unsubscribe();
      transportChannel.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={{ marginTop: 16, color: '#666' }}>Cargando datos...</Text>
      </View>
    );
  }

  const totalWeekCO2 = weekData.reduce((sum, day) => sum + day.total_co2, 0);
  const avgDailyCO2 = weekData.length > 0 ? totalWeekCO2 / weekData.length : 0;
  const maxCO2 = weekData.length > 0 ? Math.max(...weekData.map(d => d.total_co2)) : 1;

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  };

  const stats = [
    { label: 'Hoy', value: `${todayStats.total_co2.toFixed(1)} kg`, color: '#16a34a', icon: '🌍' },
    { label: 'Promedio Semanal', value: `${avgDailyCO2.toFixed(1)} kg`, color: '#2563eb', icon: '📊' },
    { label: 'Comidas Hoy', value: `${todayStats.meals_count} reg.`, color: '#16a34a', icon: '🍽️' },
    { label: 'Viajes Hoy', value: `${todayStats.transport_count} reg.`, color: '#2563eb', icon: '🚗' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>📊 Dashboard</Text>
          <Text style={styles.headerSubtitle}>Tu impacto ambiental</Text>
        </View>
        <Pressable onPress={handleRefresh} disabled={refreshing}>
          <Text style={styles.refreshButton}>{refreshing ? '⟳' : '↻'}</Text>
        </Pressable>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh} 
            colors={['#f59e0b']}
            tintColor="#f59e0b"
          />
        }
      >
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
          <Text style={styles.chartTitle}>Emisiones últimos 7 días (kg CO₂)</Text>
          {weekData.length === 0 ? (
            <Text style={styles.emptyText}>No hay datos suficientes aún</Text>
          ) : (
            <View style={styles.chart}>
              {weekData.map((day, index) => {
                const barHeight = maxCO2 > 0 ? (day.total_co2 / maxCO2) * 150 : 0;
                return (
                  <View key={index} style={styles.barContainer}>
                    <Text style={styles.barValue}>{day.total_co2.toFixed(1)}</Text>
                    <View style={styles.barWrapper}>
                      <View style={[styles.bar, { height: Math.max(barHeight, 2) }]} />
                    </View>
                    <Text style={styles.barLabel}>{getDayLabel(day.date)}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.compareCard}>
          <Text style={styles.compareTitle}>🌟 Comparación</Text>
          <Text style={styles.compareSubtitle}>vs. Promedio Global</Text>
          
          <View style={styles.compareBar}>
            <View style={styles.compareBarSection}>
              <Text style={styles.compareLabel}>Tú (hoy)</Text>
              <View style={[styles.compareBarFill, { width: `${Math.min((todayStats.total_co2 / 12.5) * 100, 100)}%`, backgroundColor: '#16a34a' }]} />
              <Text style={styles.compareValue}>{todayStats.total_co2.toFixed(1)} kg</Text>
            </View>
            <View style={styles.compareBarSection}>
              <Text style={styles.compareLabel}>Global</Text>
              <View style={[styles.compareBarFill, { width: '100%', backgroundColor: '#ef4444' }]} />
              <Text style={styles.compareValue}>12.5 kg/día</Text>
            </View>
          </View>

          {todayStats.total_co2 < 12.5 ? (
            <View style={styles.messageBanner}>
              <Text style={styles.messageBannerText}>
                ¡Genial! Estás {((1 - todayStats.total_co2 / 12.5) * 100).toFixed(0)}% por debajo del promedio 🎉
              </Text>
            </View>
          ) : (
            <View style={[styles.messageBanner, { backgroundColor: '#fee2e2', borderColor: '#ef4444' }]}>
              <Text style={[styles.messageBannerText, { color: '#991b1b' }]}>
                Intenta reducir tus emisiones hoy 💪
              </Text>
            </View>
          )}
        </View>

        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Desglose de hoy</Text>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Text style={styles.breakdownIcon}>🍽️</Text>
              <Text style={styles.breakdownLabel}>Comidas</Text>
            </View>
            <View style={styles.breakdownRight}>
              <View style={styles.breakdownBar}>
                <View style={[
                  styles.breakdownBarFill, 
                  { 
                    width: todayStats.total_co2 > 0 ? `${(todayStats.meals_co2 / todayStats.total_co2) * 100}%` : '0%', 
                    backgroundColor: '#16a34a' 
                  }
                ]} />
              </View>
              <Text style={styles.breakdownValue}>{todayStats.meals_co2.toFixed(1)} kg</Text>
            </View>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Text style={styles.breakdownIcon}>🚗</Text>
              <Text style={styles.breakdownLabel}>Transporte</Text>
            </View>
            <View style={styles.breakdownRight}>
              <View style={styles.breakdownBar}>
                <View style={[
                  styles.breakdownBarFill, 
                  { 
                    width: todayStats.total_co2 > 0 ? `${(todayStats.transport_co2 / todayStats.total_co2) * 100}%` : '0%', 
                    backgroundColor: '#2563eb' 
                  }
                ]} />
              </View>
              <Text style={styles.breakdownValue}>{todayStats.transport_co2.toFixed(1)} kg</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  refreshButton: {
    fontSize: 28,
    color: 'white',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    padding: 20,
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
