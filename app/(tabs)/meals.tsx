import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { getTodayMeals, createMeal, deleteMeal } from '@/lib/meals';
import { supabase } from '@/lib/supabase';

type Meal = {
  id: string;
  name: string;
  type: 'vegano' | 'vegetariano' | 'carne_blanca' | 'carne_roja' | 'pescado';
  grams: number;
  co2: number;
  created_at: string;
};

// Emisiones de CO₂ por cada 100 gramos
const MEAL_EMISSIONS = {
  vegano: 0.09,       // 0.9 kg CO₂ por kg = 0.09 kg por 100g
  vegetariano: 0.13,  // 1.3 kg CO₂ por kg = 0.13 kg por 100g
  carne_blanca: 0.30,        // 3.0 kg CO₂ por kg = 0.30 kg por 100g
  pescado: 0.25,      // 2.5 kg CO₂ por kg = 0.25 kg por 100g
  carne_roja: 0.65,        // 6.5 kg CO₂ por kg = 0.65 kg por 100g
};

const MEAL_LABELS = {
  vegano: 'Vegano',
  vegetariano: 'Vegetariano',
  carne_blanca: 'Pollo/Pavo',
  carne_roja: 'Carne Roja',
  pescado: 'Pescado',
};

export default function MealsScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealName, setMealName] = useState('');
  const [grams, setGrams] = useState('');
  const [selectedType, setSelectedType] = useState<keyof typeof MEAL_EMISSIONS>('vegetariano');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMeals();

    // Suscribirse a cambios en tiempo real
    let channel: any = null;

    const setupRealtimeSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      channel = supabase
        .channel('meals-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'meals',
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            console.log('Meal change detected:', payload);
            loadMeals();
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

  const loadMeals = async () => {
    setRefreshing(true);
    const { data, error } = await getTodayMeals();
    if (error) {
      console.error('Error cargando comidas:', error);
    } else if (data) {
      setMeals(data as Meal[]);
    }
    setRefreshing(false);
  };

  const addMeal = async () => {
    if (!mealName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la comida');
      return;
    }

    const gramsNum = parseFloat(grams);
    if (isNaN(gramsNum) || gramsNum <= 0) {
      Alert.alert('Error', 'Por favor ingresa una cantidad válida en gramos');
      return;
    }

    setLoading(true);
    // Calcular CO₂ según los gramos: (gramos / 100) * emisión_por_100g
    const co2Emission = (gramsNum / 100) * MEAL_EMISSIONS[selectedType];

    const { data, error } = await createMeal({
      name: mealName,
      type: selectedType,
      grams: gramsNum,
      co2: co2Emission,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'No se pudo registrar la comida. Intenta de nuevo.');
      return;
    }

    setMealName('');
    setGrams('');
    Alert.alert('¡Registrado!', `${gramsNum}g de ${mealName} generó ${co2Emission.toFixed(2)} kg de CO₂`);
    loadMeals();
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Eliminar comida',
      '¿Estás seguro de eliminar este registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteMeal(id);
            if (error) {
              Alert.alert('Error', 'No se pudo eliminar la comida');
            } else {
              loadMeals();
            }
          },
        },
      ]
    );
  };

  const totalCO2 = meals.reduce((sum, meal) => sum + meal.co2, 0);
  const totalGrams = meals.reduce((sum, meal) => sum + meal.grams, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍽️ Registro de Comidas</Text>
        <Text style={styles.headerSubtitle}>Rastrea el impacto de tu alimentación</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputCard}>
          <Text style={styles.label}>Nombre de la comida</Text>
          <TextInput
            style={styles.input}
            value={mealName}
            onChangeText={setMealName}
            placeholder="Ej: Ensalada César"
            placeholderTextColor="#999"
            editable={!loading}
          />

          <Text style={styles.label}>Cantidad (gramos)</Text>
          <TextInput
            style={styles.input}
            value={grams}
            onChangeText={setGrams}
            placeholder="Ej: 250"
            placeholderTextColor="#999"
            keyboardType="numeric"
            editable={!loading}
          />

          <Text style={styles.label}>Tipo de comida</Text>
          <View style={styles.typeGrid}>
            {(Object.keys(MEAL_EMISSIONS) as (keyof typeof MEAL_EMISSIONS)[]).map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.typeButton,
                  selectedType === type && styles.typeButtonSelected,
                ]}
                onPress={() => setSelectedType(type)}
                disabled={loading}
              >
                <Text style={[
                  styles.typeButtonText,
                  selectedType === type && styles.typeButtonTextSelected,
                ]}>
                  {MEAL_LABELS[type]}
                </Text>
                <Text style={styles.typeEmission}>{(MEAL_EMISSIONS[type] * 10).toFixed(1)} kg/kg</Text>
              </Pressable>
            ))}
          </View>

          <Pressable 
            style={[styles.addButton, loading && styles.addButtonDisabled]} 
            onPress={addMeal}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.addButtonText}>+ Registrar Comida</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Total hoy</Text>
          <Text style={styles.statsValue}>{totalCO2.toFixed(2)} kg CO₂</Text>
          <View style={styles.statsDetails}>
            <Text style={styles.statsSubtext}>{meals.length} comida(s) • {totalGrams.toFixed(0)}g total</Text>
          </View>
        </View>

        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Historial de hoy</Text>
            <Pressable onPress={loadMeals} disabled={refreshing}>
              <Text style={styles.refreshText}>{refreshing ? '⟳' : '↻'}</Text>
            </Pressable>
          </View>
          {refreshing ? (
            <ActivityIndicator size="large" color="#16a34a" style={{ marginVertical: 20 }} />
          ) : meals.length === 0 ? (
            <Text style={styles.emptyText}>No hay comidas registradas aún</Text>
          ) : (
            meals.map((meal) => (
              <Pressable
                key={meal.id}
                style={styles.historyItem}
                onLongPress={() => handleDelete(meal.id)}
              >
                <View style={styles.historyItemHeader}>
                  <Text style={styles.historyItemName}>{meal.name}</Text>
                  <Text style={styles.historyItemCO2}>{Number(meal.co2).toFixed(2)} kg CO₂</Text>
                </View>
                <View style={styles.historyItemDetails}>
                  <Text style={styles.historyItemType}>
                    {MEAL_LABELS[meal.type]}
                  </Text>
                  <Text style={styles.historyItemGrams}>{meal.grams}g</Text>
                  <Text style={styles.historyItemTime}>
                    {new Date(meal.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
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
    backgroundColor: '#16a34a',
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
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonSelected: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  typeButtonTextSelected: {
    color: '#16a34a',
  },
  typeEmission: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#16a34a',
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
    color: '#16a34a',
  },
  statsCard: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  statsTitle: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#16a34a',
  },
  statsDetails: {
    marginTop: 8,
  },
  statsSubtext: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '500',
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
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  historyItemCO2: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
  },
  historyItemDetails: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  historyItemType: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  historyItemGrams: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '600',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  historyItemTime: {
    fontSize: 12,
    color: '#999',
  },
});
