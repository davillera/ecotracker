export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  category: 'meals' | 'transport' | 'energy' | 'streak' | 'social';
}

export interface Achievement {
  id: string;
  badge_id: string;
  user_id: string;
  earned_at: string;
  progress: number;
}

export const BADGES: Badge[] = [
  // Meals badges
  {
    id: 'vegetarian_week',
    name: 'Vegetarian Week',
    description: 'Logged 7 vegetarian meals in a week',
    icon: '🥗',
    requirement: 7,
    category: 'meals',
  },
  {
    id: 'eco_chef',
    name: 'Eco Chef',
    description: 'Logged 30 low-carbon meals',
    icon: '👨‍🍳',
    requirement: 30,
    category: 'meals',
  },
  
  // Transport badges
  {
    id: 'bike_enthusiast',
    name: 'Bike Enthusiast',
    description: 'Traveled 100km by bike',
    icon: '🚴',
    requirement: 100,
    category: 'transport',
  },
  {
    id: 'public_transport_hero',
    name: 'Public Transport Hero',
    description: 'Used public transport 50 times',
    icon: '🚇',
    requirement: 50,
    category: 'transport',
  },
  
  // Energy badges
  {
    id: 'energy_saver',
    name: 'Energy Saver',
    description: 'Reduced energy consumption by 20%',
    icon: '💡',
    requirement: 20,
    category: 'energy',
  },
  {
    id: 'renewable_champion',
    name: 'Renewable Champion',
    description: 'Logged 30 days of renewable energy use',
    icon: '⚡',
    requirement: 30,
    category: 'energy',
  },
  
  // Streak badges
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: 'Logged activities for 7 consecutive days',
    icon: '🔥',
    requirement: 7,
    category: 'streak',
  },
  {
    id: 'month_streak',
    name: 'Monthly Master',
    description: 'Logged activities for 30 consecutive days',
    icon: '🏆',
    requirement: 30,
    category: 'streak',
  },
  
  // Social badges
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Added 10 friends',
    icon: '🦋',
    requirement: 10,
    category: 'social',
  },
  {
    id: 'top_performer',
    name: 'Top Performer',
    description: 'Ranked #1 in friends leaderboard',
    icon: '👑',
    requirement: 1,
    category: 'social',
  },
];

export function calculateLevel(totalFootprint: number): number {
  // Lower footprint = higher level
  if (totalFootprint < 100) return 10;
  if (totalFootprint < 500) return 9;
  if (totalFootprint < 1000) return 8;
  if (totalFootprint < 2000) return 7;
  if (totalFootprint < 3000) return 6;
  if (totalFootprint < 4000) return 5;
  if (totalFootprint < 5000) return 4;
  if (totalFootprint < 7000) return 3;
  if (totalFootprint < 10000) return 2;
  return 1;
}

export function getNextLevelFootprint(currentLevel: number): number {
  const thresholds = [10000, 7000, 5000, 4000, 3000, 2000, 1000, 500, 100, 0];
  return thresholds[currentLevel] || 0;
}

export function checkBadgeProgress(badge: Badge, userProgress: number): boolean {
  return userProgress >= badge.requirement;
}
