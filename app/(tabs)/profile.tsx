import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [friendCode, setFriendCode] = useState('');

  useEffect(() => {
    if (user) {
      loadFriendCode();
    }
  }, [user]);

  const loadFriendCode = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('friend_code')
      .eq('id', user.id)
      .single();

    if (data?.friend_code) {
      setFriendCode(data.friend_code);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: signOut },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 Mi Perfil</Text>
        <Text style={styles.headerSubtitle}>Gestiona tu cuenta y preferencias</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Perfil de usuario */}
        {user && (
          <>
            <View style={styles.profileCard}>
              <View style={styles.profileIcon}>
                <Text style={{ fontSize: 48 }}>👤</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {user.user_metadata?.name || user.email?.split('@')[0]}
                </Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
              </View>
            </View>

            {/* Friend Code Card */}
            <View style={styles.friendCodeCard}>
              <Text style={styles.friendCodeTitle}>🎯 Tu Código de Amigo</Text>
              <View style={styles.codeContainer}>
                <Text style={styles.friendCodeText}>{friendCode || '------'}</Text>
              </View>
              <Text style={styles.friendCodeHint}>
                Comparte este código de 6 caracteres con tus amigos
              </Text>
            </View>
          </>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funciones Disponibles</Text>
          
          <Pressable 
            style={styles.actionButton}
            onPress={() => router.push('/friends')}
          >
            <View style={styles.actionButtonLeft}>
              <Text style={styles.actionButtonIcon}>👥</Text>
              <View>
                <Text style={styles.actionButtonText}>Amigos</Text>
                <Text style={styles.actionButtonSubtext}>Compite con tus amigos</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
          
          <Pressable 
            style={styles.actionButton}
            onPress={() => router.push('/achievements')}
          >
            <View style={styles.actionButtonLeft}>
              <Text style={styles.actionButtonIcon}>🏆</Text>
              <View>
                <Text style={styles.actionButtonText}>Logros y Badges</Text>
                <Text style={styles.actionButtonSubtext}>Desbloquea tus logros</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
          
          <Pressable 
            style={styles.actionButton}
            onPress={() => router.push('/settings')}
          >
            <View style={styles.actionButtonLeft}>
              <Text style={styles.actionButtonIcon}>⚙️</Text>
              <View>
                <Text style={styles.actionButtonText}>Configuración</Text>
                <Text style={styles.actionButtonSubtext}>Preferencias de la app</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        {/* Próximamente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔜 Próximamente</Text>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>⚡ Registro de Consumo de Energía</Text>
            <Text style={styles.featureDescription}>Rastrea tu consumo eléctrico diario</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🌙 Modo Oscuro</Text>
            <Text style={styles.featureDescription}>Cuida tus ojos con el tema oscuro</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🌍 Múltiples Idiomas</Text>
            <Text style={styles.featureDescription}>Disponible en varios idiomas</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>📊 Exportar Reportes PDF</Text>
            <Text style={styles.featureDescription}>Genera reportes de tu huella de carbono</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🔔 Notificaciones Push</Text>
            <Text style={styles.featureDescription}>Recordatorios y consejos diarios</Text>
          </View>
        </View>

        {/* Botón de cerrar sesión */}
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>EcoTracker v1.0.0</Text>
          <Text style={styles.footerSubtext}>Comprometidos con el planeta 🌍</Text>
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
    backgroundColor: '#8b5cf6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  profileEmail: {
    fontSize: 15,
    color: '#666',
  },
  friendCodeCard: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#16a34a',
    alignItems: 'center',
  },
  friendCodeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 12,
  },
  codeContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  friendCodeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#16a34a',
    letterSpacing: 4,
    fontFamily: 'monospace',
  },
  friendCodeHint: {
    fontSize: 13,
    color: '#166534',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  userIdCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  userIdTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  userId: {
    fontSize: 11,
    color: '#78350f',
    fontFamily: 'monospace',
    backgroundColor: '#fffbeb',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  userIdHint: {
    fontSize: 12,
    color: '#92400e',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  actionButtonIcon: {
    fontSize: 28,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: '#666',
  },
  chevron: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
  featureCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#78350f',
  },
  logoutButton: {
    backgroundColor: '#e11d48',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});
