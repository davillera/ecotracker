// Ejemplo de uso de los servicios de Supabase en componentes React Native

/**
 * ====================================
 * 1. AUTENTICACIÓN
 * ====================================
 */

// Hook personalizado para autenticación
import { useState, useEffect } from 'react';
import { onAuthStateChange } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

/**
 * ====================================
 * 2. PANTALLA DE LOGIN
 * ====================================
 */

import { View, TextInput, Pressable, Text, Alert } from 'react-native';
import { useState } from 'react';
import { signIn, signUp } from '@/lib/auth';
import { router } from 'expo-router';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp({ email, password, name });
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('Éxito', 'Cuenta creada. Por favor verifica tu email.');
        }
      } else {
        const { error } = await signIn({ email, password });
        if (error) {
          Alert.alert('Error', error.message);
        } else {
          router.replace('/(tabs)');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {isSignUp && (
        <TextInput
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable onPress={handleSubmit} disabled={loading}>
        <Text>{loading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Iniciar Sesión'}</Text>
      </Pressable>
      <Pressable onPress={() => setIsSignUp(!isSignUp)}>
        <Text>{isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}</Text>
      </Pressable>
    </View>
  );
}

/**
 * ====================================
 * 3. PANTALLA DE COMIDAS
 * ====================================
 */

import { View, Text, FlatList, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { createMeal, getMeals, deleteMeal } from '@/lib/meals';

export function MealsScreen() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMeals = async () => {
    const { data, error } = await getMeals();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setMeals(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const handleAddMeal = async () => {
    const { data, error } = await createMeal({
      name: 'Ensalada',
      type: 'vegetariano',
      grams: 250,
      co2: 0.33,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      loadMeals(); // Recargar lista
    }
  };

  const handleDeleteMeal = async (id: string) => {
    const { error } = await deleteMeal(id);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      loadMeals(); // Recargar lista
    }
  };

  return (
    <View>
      <Pressable onPress={handleAddMeal}>
        <Text>Agregar Comida</Text>
      </Pressable>
      
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.type} - {item.grams}g</Text>
            <Text>{item.co2} kg CO₂</Text>
            <Pressable onPress={() => handleDeleteMeal(item.id)}>
              <Text>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

/**
 * ====================================
 * 4. PANTALLA DE DASHBOARD
 * ====================================
 */

import { View, Text, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { getFullDashboard } from '@/lib/dashboard';

export function DashboardScreen() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const { data, error } = await getFullDashboard();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setDashboard(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <ScrollView>
      {/* Estadísticas generales */}
      <View>
        <Text>CO₂ Total: {dashboard?.stats?.total_co2} kg</Text>
        <Text>Comidas: {dashboard?.stats?.meals_co2} kg</Text>
        <Text>Transporte: {dashboard?.stats?.transport_co2} kg</Text>
      </View>

      {/* Datos semanales */}
      <View>
        <Text>Últimos 7 días:</Text>
        {dashboard?.weekly?.map((day) => (
          <View key={day.date}>
            <Text>{day.date}</Text>
            <Text>Total: {day.total_co2} kg</Text>
          </View>
        ))}
      </View>

      {/* Desglose por categorías */}
      <View>
        <Text>Por tipo de comida:</Text>
        {Object.entries(dashboard?.breakdown?.meals || {}).map(([type, co2]) => (
          <Text key={type}>{type}: {co2} kg</Text>
        ))}
      </View>
    </ScrollView>
  );
}

/**
 * ====================================
 * 5. LAYOUT CON PROTECCIÓN DE RUTA
 * ====================================
 */

import { useEffect } from 'react';
import { router } from 'expo-router';
import { getCurrentUser } from '@/lib/auth';

export function ProtectedLayout({ children }) {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { user } = await getCurrentUser();
    if (!user) {
      router.replace('/login');
    }
  };

  return <>{children}</>;
}

/**
 * ====================================
 * 6. HOOK PARA TIEMPO REAL (OPCIONAL)
 * ====================================
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtimeMeals() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    loadMeals();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('meals_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'meals' },
        (payload) => {
          console.log('Cambio detectado:', payload);
          loadMeals(); // Recargar datos
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadMeals = async () => {
    const { data } = await getMeals();
    setMeals(data || []);
  };

  return meals;
}

/**
 * ====================================
 * 7. CERRAR SESIÓN
 * ====================================
 */

import { Pressable, Text } from 'react-native';
import { signOut } from '@/lib/auth';
import { router } from 'expo-router';

export function LogoutButton() {
  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      router.replace('/login');
    }
  };

  return (
    <Pressable onPress={handleLogout}>
      <Text>Cerrar Sesión</Text>
    </Pressable>
  );
}

/**
 * ====================================
 * 8. MANEJO DE ERRORES GLOBAL
 * ====================================
 */

export function handleError(error: any) {
  console.error('Error:', error);
  
  if (error.message?.includes('JWT')) {
    // Token inválido, redirigir a login
    router.replace('/login');
  } else {
    Alert.alert('Error', error.message || 'Algo salió mal');
  }
}
