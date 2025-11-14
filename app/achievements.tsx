import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

// Badge types
type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: number;
};

// Badges definition
const BADGES: Badge[] = [
  // Meals
  { id: 'veg_starter', name: 'Veggie Starter', description: 'Log 5 vegetarian meals', icon: '🥗', category: 'meals', requirement: 5 },
  { id: 'veg_champion', name: 'Veggie Champion', description: 'Log 20 vegetarian meals', icon: '🌱', category: 'meals', requirement: 20 },
  { id: 'plant_warrior', name: 'Plant Warrior', description: 'Log 50 plant-based meals', icon: '🥦', category: 'meals', requirement: 50 },
  
  // Transport
  { id: 'bike_beginner', name: 'Bike Beginner', description: 'Use bike 5 times', icon: '🚴', category: 'transport', requirement: 5 },
  { id: 'eco_commuter', name: 'Eco Commuter', description: 'Use sustainable transport 20 times', icon: '🚇', category: 'transport', requirement: 20 },
  { id: 'walk_master', name: 'Walk Master', description: 'Walk 50 times', icon: '🚶', category: 'transport', requirement: 50 },
  
  // Streaks
  { id: 'week_warrior', name: 'Week Warrior', description: 'Log activities for 7 days', icon: '🔥', category: 'streak', requirement: 7 },
  { id: 'month_master', name: 'Month Master', description: 'Log activities for 30 days', icon: '💪', category: 'streak', requirement: 30 },
  
  // Social
  { id: 'social_starter', name: 'Social Starter', description: 'Add 1 friend', icon: '👥', category: 'social', requirement: 1 },
  { id: 'team_player', name: 'Team Player', description: 'Add 5 friends', icon: '👨‍👩‍👧‍👦', category: 'social', requirement: 5 },
];

const calculateLevel = (totalFootprint: number): number => {
  if (totalFootprint < 100) return 1;
  if (totalFootprint < 500) return 2;
  if (totalFootprint < 1000) return 3;
  if (totalFootprint < 2500) return 4;
  return 5;
};

export default function AchievementsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [totalFootprint, setTotalFootprint] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [stats, setStats] = useState({ vegMeals: 0, bikeTrips: 0, friends: 0, streak: 0 });

  useEffect(() => {
    if (user) {
      loadFootprint();
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    
    // Count vegetarian meals
    const { data: vegMeals } = await supabase
      .from('meals')
      .select('id')
      .eq('user_id', user.id)
      .in('meal_type', ['vegetarian', 'vegan']);

    // Count bike/walk trips
    const { data: ecoTrips } = await supabase
      .from('transport')
      .select('id')
      .eq('user_id', user.id)
      .in('transport_type', ['bike', 'walk', 'public_transport']);

    // Count friends
    const { data: friends } = await supabase
      .from('friends')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'accepted');

    setStats({
      vegMeals: vegMeals?.length || 0,
      bikeTrips: ecoTrips?.length || 0,
      friends: friends?.length || 0,
      streak: 0, // TODO: Implement streak calculation
    });

    // Check badges
    const earned = new Set<string>();
    
    if (vegMeals && vegMeals.length >= 5) earned.add('veg_starter');
    if (vegMeals && vegMeals.length >= 20) earned.add('veg_champion');
    if (vegMeals && vegMeals.length >= 50) earned.add('plant_warrior');
    
    if (ecoTrips && ecoTrips.length >= 5) earned.add('bike_beginner');
    if (ecoTrips && ecoTrips.length >= 20) earned.add('eco_commuter');
    if (ecoTrips && ecoTrips.length >= 50) earned.add('walk_master');
    
    if (friends && friends.length >= 1) earned.add('social_starter');
    if (friends && friends.length >= 5) earned.add('team_player');
    
    setEarnedBadges(earned);
  };

  const loadFootprint = async () => {
    if (!user) return;

    const { data: meals } = await supabase
      .from('meals')
      .select('carbon_footprint')
      .eq('user_id', user.id);

    const { data: transport } = await supabase
      .from('transport')
      .select('carbon_footprint')
      .eq('user_id', user.id);

    const total =
      (meals?.reduce((sum, m) => sum + m.carbon_footprint, 0) || 0) +
      (transport?.reduce((sum, t) => sum + t.carbon_footprint, 0) || 0);

    setTotalFootprint(total);
    setUserLevel(calculateLevel(total));
  };

  const renderBadge = (badge: Badge) => {
    const isEarned = earnedBadges.has(badge.id);
    
    return (
      <View
        key={badge.id}
        style={[
          styles.badgeCard,
          isEarned && styles.badgeCardEarned,
        ]}
      >
        <Text style={styles.badgeIcon}>{badge.icon}</Text>
        <Text style={styles.badgeName}>{badge.name}</Text>
        <Text style={styles.badgeDescription}>{badge.description}</Text>
        {isEarned ? (
          <View style={styles.earnedBadge}>
            <Text style={styles.earnedText}>✓ Desbloqueado</Text>
          </View>
        ) : (
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedText}>🔒 Bloqueado</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🏆 Logros y Badges</Text>
      </View>

      <ScrollView>
        <View style={styles.levelSection}>
          <Text style={styles.levelText}>Nivel {userLevel}</Text>
          <Text style={styles.levelLabel}>Eco Warrior</Text>
          <Text style={styles.footprintText}>
            Huella Total: {totalFootprint.toFixed(2)} kg CO₂
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.stats}>
            <Text style={styles.statsText}>
              🏅 Badges Desbloqueados: {earnedBadges.size} / {BADGES.length}
            </Text>
            <Text style={styles.statsText}>
              Progreso: {Math.round((earnedBadges.size / BADGES.length) * 100)}%
            </Text>
          </View>

          <Text style={styles.sectionTitle}>🥗 Comidas Sostenibles</Text>
          <Text style={styles.sectionSubtitle}>Has registrado {stats.vegMeals} comidas vegetarianas</Text>
          <View style={styles.badgesGrid}>
            {BADGES.filter(b => b.category === 'meals').map(renderBadge)}
          </View>

          <Text style={styles.sectionTitle}>🚴 Transporte Ecológico</Text>
          <Text style={styles.sectionSubtitle}>Has usado transporte sostenible {stats.bikeTrips} veces</Text>
          <View style={styles.badgesGrid}>
            {BADGES.filter(b => b.category === 'transport').map(renderBadge)}
          </View>

          <Text style={styles.sectionTitle}>🔥 Rachas</Text>
          <Text style={styles.sectionSubtitle}>Racha actual: {stats.streak} días</Text>
          <View style={styles.badgesGrid}>
            {BADGES.filter(b => b.category === 'streak').map(renderBadge)}
          </View>

          <Text style={styles.sectionTitle}>👥 Social</Text>
          <Text style={styles.sectionSubtitle}>Tienes {stats.friends} amigos</Text>
          <View style={styles.badgesGrid}>
            {BADGES.filter(b => b.category === 'social').map(renderBadge)}
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f59e0b',
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
  },
  levelSection: {
    backgroundColor: 'white',
    padding: 24,
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  levelText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#f59e0b',
  },
  levelLabel: {
    fontSize: 20,
    color: '#333',
    marginTop: 8,
    fontWeight: '600',
  },
  footprintText: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    marginTop: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  badgeCardEarned: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  badgeIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    color: '#333',
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
  },
  earnedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#16a34a',
  },
  earnedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  lockedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  lockedText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  stats: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statsText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
    fontWeight: '600',
  },
});
