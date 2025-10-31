import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🌍</Text>
          <Text style={styles.title}>¡Bienvenido a EcoTracker!</Text>
          <Text style={styles.subtitle}>
            Aquí podrás rastrear tus comidas, transporte y consumo de energía para reducir tu huella de carbono.
          </Text>
        </View>
        
        <View style={styles.cardsContainer}>
          <View style={[styles.card, styles.cardGreen]}>
            <Text style={styles.cardTitle}>🍽️ Comidas</Text>
            <Text style={styles.cardText}>Registra tus comidas diarias</Text>
          </View>
          
          <View style={[styles.card, styles.cardBlue]}>
            <Text style={styles.cardTitle}>🚗 Transporte</Text>
            <Text style={styles.cardText}>Rastrea tus viajes y desplazamientos</Text>
          </View>
          
          <View style={[styles.card, styles.cardOrange]}>
            <Text style={styles.cardTitle}>⚡ Energía</Text>
            <Text style={styles.cardText}>Monitorea tu consumo de energía</Text>
          </View>
        </View>
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
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
    gap: 12,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#16a34a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
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
  cardOrange: {
    borderLeftColor: '#f59e0b',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
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
