import { supabase } from './supabase';

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface FriendWithProfile {
  id: string;
  friend_id: string;
  email: string;
  total_footprint: number;
  rank: number;
}

export async function sendFriendRequest(userId: string, friendId: string): Promise<boolean> {
  try {
    // Check if friendship already exists
    const { data: existingFriendship } = await supabase
      .from('friends')
      .select('*')
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
      .maybeSingle();

    if (existingFriendship) {
      console.error('Friendship already exists');
      return false;
    }

    // Create friend request
    const { error } = await supabase
      .from('friends')
      .insert({
        user_id: userId,
        friend_id: friendId,
        status: 'pending',
      });

    if (error) {
      console.error('Error sending friend request:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export async function acceptFriendRequest(friendshipId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('id', friendshipId);

    if (error) {
      console.error('Error accepting friend request:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export async function getFriendRequests(userId: string): Promise<Friend[]> {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('friend_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching friend requests:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function getFriends(userId: string): Promise<FriendWithProfile[]> {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching friends:', error);
      return [];
    }

    // Get footprint data for each friend
    const friendsWithFootprint = await Promise.all(
      (data || []).map(async (friend: any) => {
        const footprint = await getTotalFootprint(friend.friend_id);
        
        return {
          id: friend.id,
          friend_id: friend.friend_id,
          email: friend.friend_id.substring(0, 8) + '...', // Show partial ID for now
          total_footprint: footprint,
          rank: 0,
        };
      })
    );

    // Calculate rankings
    const sorted = friendsWithFootprint.sort((a, b) => a.total_footprint - b.total_footprint);
    return sorted.map((friend, index) => ({ ...friend, rank: index + 1 }));
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function getTotalFootprint(userId: string): Promise<number> {
  try {
    const { data: meals } = await supabase
      .from('meals')
      .select('carbon_footprint')
      .eq('user_id', userId);

    const { data: transport } = await supabase
      .from('transport')
      .select('carbon_footprint')
      .eq('user_id', userId);

    const { data: energy } = await supabase
      .from('energy_consumption')
      .select('carbon_footprint')
      .eq('user_id', userId);

    const mealsTotal = meals?.reduce((sum, item) => sum + item.carbon_footprint, 0) || 0;
    const transportTotal = transport?.reduce((sum, item) => sum + item.carbon_footprint, 0) || 0;
    const energyTotal = energy?.reduce((sum, item) => sum + item.carbon_footprint, 0) || 0;

    return mealsTotal + transportTotal + energyTotal;
  } catch (error) {
    console.error('Error calculating footprint:', error);
    return 0;
  }
}

export async function removeFriend(friendshipId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', friendshipId);

    if (error) {
      console.error('Error removing friend:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
