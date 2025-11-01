import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { getDashboardStats } from '@/lib/dashboard';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const { signOut } = useAuth();
  const [stats, setStats] = useState({
    total_co2: 0,
    meals_co2: 0,
    transport_co2: 0,
    meals_count: 0,
    transport_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      const { data } = await getDashboardStats();
      if (data) {
        console.log('📊 Stats loaded:', data);
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refrescar al hacer pull
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadStats();
  }, []);

  // Cargar stats cuando la pantalla está en foco
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Dashboard focused, loading stats...');
      loadStats();
    }, [])
  );

  useEffect(() => {
    loadStats();

    // Suscribirse a cambios en meals
    const mealsChannel = supabase
      .channel('meals-changes-dashboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meals',
        },
        (payload) => {
          console.log('🍽️ Meals changed in dashboard:', payload.eventType);
          loadStats();
        }
      )
      .subscribe((status) => {
        console.log('📡 Meals subscription status:', status);
      });

    // Suscribirse a cambios en transport
    const transportChannel = supabase
      .channel('transport-changes-dashboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transport',
        },
        (payload) => {
          console.log('🚗 Transport changed in dashboard:', payload.eventType);
          loadStats();
        }
      )
      .subscribe((status) => {
        console.log('📡 Transport subscription status:', status);
      });

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up dashboard subscriptions');
      mealsChannel.unsubscribe();
      transportChannel.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.emoji}>🌍</Text>
              <Text style={styles.title}>Tu Huella de Carbono Hoy</Text>
              <Text style={styles.subtitle}>
                Actualización automática en tiempo real
              </Text>
            </View>
            <Pressable onPress={onRefresh} style={styles.refreshButton} disabled={refreshing}>
              <Text style={styles.refreshButtonText}>{refreshing ? '⟳' : '↻'}</Text>
            </Pressable>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.mainStats}>
              <Text style={styles.mainStatsLabel}>Total de CO₂</Text>
              <Text style={styles.mainStatsValue}>{stats.total_co2.toFixed(2)} kg</Text>
              <Text style={styles.mainStatsSubtext}>
                {stats.meals_count + stats.transport_count} registros hoy
              </Text>
            </View>

            <View style={styles.cardsContainer}>
              <View style={[styles.card, styles.cardGreen]}>
                <Text style={styles.cardTitle}>🍽️ Comidas</Text>
                <Text style={styles.cardValue}>{stats.meals_co2.toFixed(2)} kg CO₂</Text>
                <Text style={styles.cardText}>{stats.meals_count} comida(s) registrada(s)</Text>
              </View>
              
              <View style={[styles.card, styles.cardBlue]}>
                <Text style={styles.cardTitle}>🚗 Transporte</Text>
                <Text style={styles.cardValue}>{stats.transport_co2.toFixed(2)} kg CO₂</Text>
                <Text style={styles.cardText}>{stats.transport_count} viaje(s) registrado(s)</Text>
              </View>
              
              <View style={[styles.card, styles.cardInfo]}>
                <Text style={styles.cardTitle}>💡 Consejo del día</Text>
                <Text style={styles.cardText}>
                  {stats.total_co2 < 5 
                    ? '¡Excelente! Mantienes tu huella baja' 
                    : stats.total_co2 < 10
                    ? 'Buen trabajo. Intenta usar más transporte sostenible'
                    : 'Considera reducir el uso de coche y consumir menos carne'}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <Pressable onPress={signOut} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fdf8',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginTop: 40,
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  refreshButtonText: {
    fontSize: 28,
    color: '#16a34a',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16a34a',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  mainStats: {
    backgroundColor: '#16a34a',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  mainStatsLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  mainStatsValue: {
    fontSize: 48,
    fontWeight: '700',
    color: 'white',
  },
  mainStatsSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardGreen: {
    borderLeftColor: '#16a34a',
  },
  cardBlue: {
    borderLeftColor: '#2563eb',
  },
  cardInfo: {
    borderLeftColor: '#f59e0b',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16a34a',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#e11d48',
    padding: 18,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
