import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';

const tips = [
  {
    id: 1,
    icon: '🥗',
    title: 'Elige comidas vegetarianas',
    description: 'Las dietas basadas en plantas pueden reducir tu huella de carbono hasta en un 73%.',
    impact: 'Alto',
    color: '#16a34a',
  },
  {
    id: 2,
    icon: '🚴',
    title: 'Usa transporte sostenible',
    description: 'La bicicleta y caminar no generan emisiones. El transporte público reduce emisiones en un 45%.',
    impact: 'Alto',
    color: '#2563eb',
  },
  {
    id: 3,
    icon: '💡',
    title: 'Apaga luces innecesarias',
    description: 'Desconecta aparatos electrónicos cuando no los uses. Pueden consumir energía incluso apagados.',
    impact: 'Medio',
    color: '#f59e0b',
  },
  {
    id: 4,
    icon: '🛍️',
    title: 'Compra local',
    description: 'Los productos locales reducen las emisiones del transporte de mercancías.',
    impact: 'Medio',
    color: '#16a34a',
  },
  {
    id: 5,
    icon: '♻️',
    title: 'Recicla correctamente',
    description: 'Separar residuos reduce la cantidad de desechos que terminan en vertederos.',
    impact: 'Medio',
    color: '#10b981',
  },
  {
    id: 6,
    icon: '🚰',
    title: 'Ahorra agua',
    description: 'Duchas cortas y cerrar el grifo mientras te cepillas los dientes ahorran energía y agua.',
    impact: 'Bajo',
    color: '#0ea5e9',
  },
  {
    id: 7,
    icon: '🌡️',
    title: 'Regula la temperatura',
    description: 'Ajusta el termostato 2°C arriba en verano y 2°C abajo en invierno para ahorrar energía.',
    impact: 'Medio',
    color: '#f59e0b',
  },
  {
    id: 8,
    icon: '🛒',
    title: 'Evita el desperdicio',
    description: 'Planifica tus comidas y compras para reducir el desperdicio de alimentos.',
    impact: 'Alto',
    color: '#16a34a',
  },
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'Alto':
      return '#16a34a';
    case 'Medio':
      return '#f59e0b';
    case 'Bajo':
      return '#6b7280';
    default:
      return '#6b7280';
  }
};

export default function ExploreScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>💡 Tips Ecológicos</Text>
          <Text style={styles.headerSubtitle}>Consejos para reducir tu huella de carbono</Text>
        </View>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {/* Perfil de usuario */}
        {user && (
          <View style={styles.profileCard}>
            <View style={styles.profileIcon}>
              <Text style={{ fontSize: 32 }}>👤</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user.user_metadata?.name || user.email?.split('@')[0]}
              </Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </View>
        )}

        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerTitle}>¿Sabías que?</Text>
          <Text style={styles.infoBannerText}>
            El promedio mundial de emisiones es de 4 toneladas de CO₂ por persona al año. 
            Con pequeños cambios podemos reducirlo significativamente.
          </Text>
        </View>

        {tips.map((tip) => (
          <View key={tip.id} style={[styles.tipCard, { borderLeftColor: tip.color }]}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <View style={styles.tipHeaderText}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <View style={[styles.impactBadge, { backgroundColor: getImpactColor(tip.impact) + '20' }]}>
                  <Text style={[styles.impactText, { color: getImpactColor(tip.impact) }]}>
                    Impacto {tip.impact}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.tipDescription}>{tip.description}</Text>
          </View>
        ))}

        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>🌍 Juntos por el planeta</Text>
          <Text style={styles.actionText}>
            Cada acción cuenta. Comparte estos tips con tus amigos y familiares para multiplicar el impacto positivo.
          </Text>
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
    backgroundColor: '#10b981',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  infoBanner: {
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  infoBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoBannerText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  tipIcon: {
    fontSize: 36,
  },
  tipHeaderText: {
    flex: 1,
    gap: 8,
  },
  tipTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  impactBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  impactText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionCard: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
});
