import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Obtener variables de entorno de Expo
const expoConfig = Constants.expoConfig;
const supabaseUrl = 
  process.env.EXPO_PUBLIC_SUPABASE_URL || 
  expoConfig?.extra?.supabaseUrl ||
  'https://eeargnqbrnlkvucuxyrj.supabase.co'; // Fallback temporal

const supabaseAnonKey = 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  expoConfig?.extra?.supabaseAnonKey ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlYXJnbnFicm5sa3Z1Y3V4eXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjY1ODcsImV4cCI6MjA3NjkwMjU4N30.3IyPJIY-XiqPaRhq5VBigPw6Q8fSRxNhkbwqmQezh84'; // Fallback temporal

// Validar credenciales
console.log('🔧 Supabase Config:');
console.log('  URL:', supabaseUrl ? '✅' : '❌');
console.log('  Key:', supabaseAnonKey ? '✅' : '❌');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ ERROR: Credenciales de Supabase no configuradas');
  console.error('Reinicia Expo con: npx expo start -c');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tipos para la base de datos
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  type: 'vegetariano' | 'vegano' | 'carne_roja' | 'carne_blanca' | 'pescado';
  grams: number;
  co2: number;
  created_at: string;
}

export interface Transport {
  id: string;
  user_id: string;
  type: 'coche' | 'moto' | 'autobus' | 'metro' | 'bicicleta' | 'caminando';
  distance: number;
  co2: number;
  created_at: string;
}

export interface DashboardStats {
  total_co2: number;
  meals_co2: number;
  transport_co2: number;
  meals_count: number;
  transport_count: number;
  weekly_data: Array<{
    date: string;
    meals_co2: number;
    transport_co2: number;
  }>;
}
