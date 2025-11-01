import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { getTodayTransport, createTransport, deleteTransport } from '@/lib/transport';
import { supabase } from '@/lib/supabase';

type Trip = {
  id: string;
  distance: number;
  type: 'coche' | 'autobus' | 'metro' | 'bicicleta' | 'caminando' | 'moto';
  co2: number;
  created_at: string;
};

const TRANSPORT_EMISSIONS = {
  coche: 0.192,      // kg CO2 por km
  moto: 0.103,       // kg CO2 por km
  autobus: 0.089,    // kg CO2 por km
  metro: 0.041,      // kg CO2 por km
  bicicleta: 0,      // kg CO2 por km
  caminando: 0,      // kg CO2 por km
};

const TRANSPORT_ICONS = {
  coche: '🚗',
  moto: '🏍️',
  autobus: '🚌',
  metro: '🚇',
  bicicleta: '🚴',
  caminando: '🚶',
};

const TRANSPORT_LABELS = {
  coche: 'Coche',
  moto: 'Moto',
  autobus: 'Autobús',
  metro: 'Metro',
  bicicleta: 'Bicicleta',
  caminando: 'Caminando',
};

export default function TransportScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [distance, setDistance] = useState('');
  const [selectedType, setSelectedType] = useState<keyof typeof TRANSPORT_EMISSIONS>('coche');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTrips();

    // Suscribirse a cambios en tiempo real
    let channel: any = null;

    const setupRealtimeSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      channel = supabase
        .channel('transport-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transport',
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            console.log('Transport change detected:', payload);
            loadTrips();
          }
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  const loadTrips = async () => {
    setRefreshing(true);
    const { data, error } = await getTodayTransport();
    if (error) {
      console.error('Error cargando viajes:', error);
    } else if (data) {
      setTrips(data as Trip[]);
    }
    setRefreshing(false);
  };

  const addTrip = async () => {
    const distanceNum = parseFloat(distance);
    
    if (isNaN(distanceNum) || distanceNum <= 0) {
      Alert.alert('Error', 'Por favor ingresa una distancia válida');
      return;
    }

    setLoading(true);
    const co2Emission = distanceNum * TRANSPORT_EMISSIONS[selectedType];

    const { data, error } = await createTransport({
      type: selectedType,
      distance: distanceNum,
      co2: co2Emission,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'No se pudo registrar el viaje. Intenta de nuevo.');
      return;
    }

    setDistance('');
    
    if (co2Emission === 0) {
      Alert.alert('¡Excelente! 🌟', 'No generaste emisiones de CO₂');
    } else {
      Alert.alert('¡Registrado!', `Tu viaje generó ${co2Emission.toFixed(2)} kg de CO₂`);
    }
    
    loadTrips();
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Eliminar viaje',
      '¿Estás seguro de eliminar este registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteTransport(id);
            if (error) {
              Alert.alert('Error', 'No se pudo eliminar el viaje');
            } else {
              loadTrips();
            }
          },
        },
      ]
    );
  };

  const totalCO2 = trips.reduce((sum, trip) => sum + trip.co2, 0);
  const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚗 Registro de Transporte</Text>
        <Text style={styles.headerSubtitle}>Calcula las emisiones de tus viajes</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputCard}>
          <Text style={styles.label}>Tipo de transporte</Text>
          <View style={styles.typeGrid}>
            {(Object.keys(TRANSPORT_EMISSIONS) as (keyof typeof TRANSPORT_EMISSIONS)[]).map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.typeButton,
                  selectedType === type && styles.typeButtonSelected,
                ]}
                onPress={() => setSelectedType(type)}
                disabled={loading}
              >
                <Text style={styles.typeIcon}>{TRANSPORT_ICONS[type]}</Text>
                <Text style={[
                  styles.typeButtonText,
                  selectedType === type && styles.typeButtonTextSelected,
                ]}>
                  {TRANSPORT_LABELS[type]}
                </Text>
                <Text style={styles.typeEmission}>
                  {TRANSPORT_EMISSIONS[type] === 0 
                    ? '0 CO₂' 
                    : `${TRANSPORT_EMISSIONS[type]} kg/km`}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Distancia (km)</Text>
          <TextInput
            style={styles.input}
            value={distance}
            onChangeText={setDistance}
            placeholder="Ej: 5.5"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
            editable={!loading}
          />

          <Pressable 
            style={[styles.addButton, loading && styles.addButtonDisabled]} 
            onPress={addTrip}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.addButtonText}>+ Registrar Viaje</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>CO₂ Total</Text>
            <Text style={styles.statsValue}>{totalCO2.toFixed(2)} kg</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Distancia</Text>
            <Text style={styles.statsValue}>{totalDistance.toFixed(1)} km</Text>
          </View>
        </View>

        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Historial de hoy</Text>
            <Pressable onPress={loadTrips} disabled={refreshing}>
              <Text style={styles.refreshText}>{refreshing ? '⟳' : '↻'}</Text>
            </Pressable>
          </View>
          {refreshing ? (
            <ActivityIndicator size="large" color="#2563eb" style={{ marginVertical: 20 }} />
          ) : trips.length === 0 ? (
            <Text style={styles.emptyText}>No hay viajes registrados aún</Text>
          ) : (
            trips.map((trip) => (
              <Pressable
                key={trip.id}
                style={styles.historyItem}
                onLongPress={() => handleDelete(trip.id)}
              >
                <View style={styles.historyItemLeft}>
                  <Text style={styles.historyItemIcon}>{TRANSPORT_ICONS[trip.type]}</Text>
                  <View>
                    <Text style={styles.historyItemType}>
                      {TRANSPORT_LABELS[trip.type]}
                    </Text>
                    <Text style={styles.historyItemDistance}>{Number(trip.distance).toFixed(1)} km</Text>
                    <Text style={styles.historyItemTime}>
                      {new Date(trip.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
                <View style={styles.historyItemRight}>
                  <Text style={[
                    styles.historyItemCO2,
                    Number(trip.co2) === 0 && styles.historyItemCO2Zero
                  ]}>
                    {Number(trip.co2) === 0 ? '0' : Number(trip.co2).toFixed(2)} kg
                  </Text>
                  <Text style={styles.historyItemLabel}>CO₂</Text>
                </View>
              </Pressable>
            ))
          )}
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
    backgroundColor: '#2563eb',
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
  inputCard: {
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },
  typeIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  typeButtonTextSelected: {
    color: '#2563eb',
  },
  typeEmission: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refreshText: {
    fontSize: 24,
    color: '#2563eb',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  statsTitle: {
    fontSize: 13,
    color: '#1e40af',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
  },
  historySection: {
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    padding: 20,
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyItemIcon: {
    fontSize: 32,
  },
  historyItemType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyItemDistance: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  historyItemTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  historyItemRight: {
    alignItems: 'flex-end',
  },
  historyItemCO2: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
  },
  historyItemCO2Zero: {
    color: '#16a34a',
  },
  historyItemLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
});
