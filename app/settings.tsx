import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [language, setLanguage] = useState('es');

  const handleToggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    Alert.alert('Próximamente', 'El modo oscuro estará disponible pronto 🌙');
  };

  const handleToggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      Alert.alert('Próximamente', 'Las notificaciones estarán disponibles pronto 🔔');
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    Alert.alert('Próximamente', 'El cambio de idioma estará disponible pronto 🌍');
  };

  const handleExportPDF = () => {
    Alert.alert('Próximamente', 'La exportación a PDF estará disponible pronto 📄');
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
        <Text style={styles.headerText}>⚙️ Configuración</Text>
        <Text style={styles.headerSubtitle}>Personaliza tu experiencia</Text>
      </View>

      <ScrollView style={styles.section}>
        {/* User Info */}
        {user && (
          <View style={styles.userCard}>
            <View style={styles.userIcon}>
              <Text style={{ fontSize: 40 }}>👤</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user.user_metadata?.name || user.email?.split('@')[0]}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        )}

        {/* Appearance Section */}
        <Text style={styles.sectionTitle}>🎨 Apariencia</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingLabel}>🌙 Modo Oscuro</Text>
            <Text style={styles.settingDescription}>Tema oscuro para tus ojos</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleToggleDarkMode}
            trackColor={{ false: '#e5e7eb', true: '#10b981' }}
            thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        {/* Language Section */}
        <Text style={styles.sectionTitle}>🌍 Idioma</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingLabel}>Seleccionar Idioma</Text>
            <Text style={styles.settingDescription}>Cambia el idioma de la aplicación</Text>
          </View>
          <View style={styles.languageButtons}>
            <Pressable
              style={[
                styles.languageButton,
                language === 'es' && styles.activeLanguageButton,
              ]}
              onPress={() => handleLanguageChange('es')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === 'es' && styles.activeLanguageButtonText,
                ]}
              >
                ES
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.languageButton,
                language === 'en' && styles.activeLanguageButton,
              ]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === 'en' && styles.activeLanguageButtonText,
                ]}
              >
                EN
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>🔔 Notificaciones</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingLabel}>Recordatorios Diarios</Text>
            <Text style={styles.settingDescription}>Recibe notificaciones diarias</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: '#e5e7eb', true: '#10b981' }}
            thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        {/* Reports Section */}
        <Text style={styles.sectionTitle}>📊 Reportes</Text>
        
        <Pressable
          style={styles.actionCard}
          onPress={handleExportPDF}
        >
          <Text style={styles.actionCardIcon}>📄</Text>
          <View style={styles.actionCardContent}>
            <Text style={styles.actionCardTitle}>Exportar Reporte PDF</Text>
            <Text style={styles.actionCardDescription}>
              Genera un reporte detallado de tu huella de carbono
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        {/* About Section */}
        <Text style={styles.sectionTitle}>ℹ️ Acerca de</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>EcoTracker</Text>
          <Text style={styles.infoVersion}>Versión 1.0.0</Text>
          <Text style={styles.infoDescription}>
            Tu asistente personal para reducir la huella de carbono
          </Text>
        </View>

        {/* Logout Button */}
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>🚪 Cerrar Sesión</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hecho con 💚 por el planeta</Text>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#6366f1',
  },
  backButton: {
    marginBottom: 8,
  },
  backText: {
    color: 'white',
    fontSize: 16,
  },
  headerText: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  section: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  settingRow: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingLeft: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  activeLanguageButton: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  languageButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '700',
  },
  activeLanguageButtonText: {
    color: 'white',
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionCardIcon: {
    fontSize: 32,
  },
  actionCardContent: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionCardDescription: {
    fontSize: 13,
    color: '#666',
  },
  chevron: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  infoVersion: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
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
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#999',
  },
});
