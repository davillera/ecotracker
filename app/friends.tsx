import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

type Friend = {
  id: string;
  friend_id: string;
  email: string;
  total_footprint: number;
  rank: number;
};

export default function FriendsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [friendCode, setFriendCode] = useState('');
  const [myFriendCode, setMyFriendCode] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [myRank, setMyRank] = useState(0);
  const [myFootprint, setMyFootprint] = useState(0);

  useEffect(() => {
    if (user) {
      loadData();
      loadMyFriendCode();
    }
  }, [user]);

  const loadMyFriendCode = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('friend_code')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading friend code:', error);
        return;
      }

      if (data?.friend_code) {
        setMyFriendCode(data.friend_code);
      } else {
        // Si no tiene código, intentar generarlo
        console.log('Usuario sin friend_code, necesita ejecutar el script SQL');
      }
    } catch (error) {
      console.error('Error en loadMyFriendCode:', error);
    }
  };

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Calculate my footprint - CORREGIDO: usar 'co2' en lugar de 'carbon_footprint'
      const { data: meals } = await supabase
        .from('meals')
        .select('co2')
        .eq('user_id', user.id);

      const { data: transport } = await supabase
        .from('transport')
        .select('co2')
        .eq('user_id', user.id);

      const myTotal =
        (meals?.reduce((sum, m) => sum + m.co2, 0) || 0) +
        (transport?.reduce((sum, t) => sum + t.co2, 0) || 0);

      setMyFootprint(myTotal);

      // Get friends with their profile information
      // CORREGIDO: Buscar amistades en ambas direcciones
      const { data: friendsAsUser, error: error1 } = await supabase
        .from('friends')
        .select('id, friend_id, status')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      const { data: friendsAsFriend, error: error2 } = await supabase
        .from('friends')
        .select('id, user_id, status')
        .eq('friend_id', user.id)
        .eq('status', 'accepted');

      if (error1 || error2) {
        console.error('Error loading friends:', error1 || error2);
        setLoading(false);
        return;
      }

      // Combinar amistades y extraer IDs únicos de amigos
      const friendIds = new Set<string>();
      const friendshipMap = new Map<string, string>(); // friendId -> friendshipId
      
      friendsAsUser?.forEach((f: any) => {
        friendIds.add(f.friend_id);
        friendshipMap.set(f.friend_id, f.id);
      });
      
      friendsAsFriend?.forEach((f: any) => {
        friendIds.add(f.user_id);
        friendshipMap.set(f.user_id, f.id);
      });

      if (friendIds.size > 0) {
        // Get profile information for each friend
        const friendsWithStats = await Promise.all(
          Array.from(friendIds).map(async (friendId: string) => {
            // Get friend's profile
            const { data: friendProfile } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', friendId)
              .single();

            const { data: fMeals } = await supabase
              .from('meals')
              .select('co2')
              .eq('user_id', friendId);

            const { data: fTransport } = await supabase
              .from('transport')
              .select('co2')
              .eq('user_id', friendId);

            const total =
              (fMeals?.reduce((sum: number, m: any) => sum + m.co2, 0) || 0) +
              (fTransport?.reduce((sum: number, t: any) => sum + t.co2, 0) || 0);

            // Obtener el nombre del perfil
            const friendName = friendProfile?.name || `Usuario ${friendId.substring(0, 8)}`;

            return {
              id: friendshipMap.get(friendId)!, // ID de la relación de amistad
              friend_id: friendId,
              email: friendName, // Mostrar nombre en lugar de UUID
              total_footprint: total,
              rank: 0,
            };
          })
        );

        // Add myself to ranking
        const myProfile = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();

        const myName = myProfile.data?.name || user.email || 'Tú';

        const allUsers = [
          { id: user.id, email: myName, total_footprint: myTotal, rank: 0 },
          ...friendsWithStats,
        ];

        // Sort by footprint (lower is better)
        allUsers.sort((a, b) => a.total_footprint - b.total_footprint);

        // Assign ranks
        allUsers.forEach((u, i) => {
          u.rank = i + 1;
          if (u.id === user.id) {
            setMyRank(i + 1);
          }
        });

        setFriends(allUsers.filter(u => u.id !== user.id));
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error('Error en loadData:', error);
    }

    setLoading(false);
  };

  const handleAddFriend = async () => {
    if (!user || !friendCode.trim()) {
      Alert.alert('Error', 'Por favor ingresa el código de amigo');
      return;
    }

    setLoading(true);

    try {
      const code = friendCode.trim().toUpperCase();

      // 1. Buscar usuario por friend_code
      const { data: friendProfile, error: searchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('friend_code', code)
        .single();

      if (searchError || !friendProfile) {
        Alert.alert(
          'Código Inválido',
          'El código de amigo no existe. Verifica que esté correcto.'
        );
        setLoading(false);
        return;
      }

      const friendId = friendProfile.id;

      // 2. Verificar que no te agregues a ti mismo
      if (friendId === user.id) {
        Alert.alert('Error', 'No puedes agregarte a ti mismo como amigo');
        setLoading(false);
        return;
      }

      // 3. Verificar que no sean amigos ya (verificar AMBAS direcciones)
      const { data: existingForward } = await supabase
        .from('friends')
        .select('id')
        .eq('user_id', user.id)
        .eq('friend_id', friendId)
        .maybeSingle();

      const { data: existingReverse } = await supabase
        .from('friends')
        .select('id')
        .eq('user_id', friendId)
        .eq('friend_id', user.id)
        .maybeSingle();

      if (existingForward || existingReverse) {
        Alert.alert('Error', 'Ya son amigos');
        setLoading(false);
        return;
      }

      // 4. Crear relación bidireccional
      const { error: error1 } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'accepted',
        });

      const { error: error2 } = await supabase
        .from('friends')
        .insert({
          user_id: friendId,
          friend_id: user.id,
          status: 'accepted',
        });

      if (error1 || error2) {
        console.error('Error adding friend:', error1 || error2);
        Alert.alert('Error', 'No se pudo agregar al amigo');
      } else {
        Alert.alert('¡Éxito!', '¡Amigo agregado correctamente! 🎉');
        setFriendCode('');
        loadData();
      }
    } catch (error) {
      console.error('Error in handleAddFriend:', error);
      Alert.alert('Error', 'Ocurrió un error al buscar el usuario');
    }

    setLoading(false);
  };

  const handleRemoveFriend = async (friendshipId: string, friendId: string) => {
    Alert.alert(
      'Eliminar Amigo',
      '¿Estás seguro que deseas eliminar este amigo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            // Eliminar ambas direcciones de la amistad
            const { error: error1 } = await supabase
              .from('friends')
              .delete()
              .eq('user_id', user?.id)
              .eq('friend_id', friendId);

            const { error: error2 } = await supabase
              .from('friends')
              .delete()
              .eq('user_id', friendId)
              .eq('friend_id', user?.id);

            if (!error1 && !error2) {
              loadData();
            } else {
              console.error('Error removing friend:', error1 || error2);
              Alert.alert('Error', 'No se pudo eliminar al amigo');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>👥 Mis Amigos</Text>
        <Text style={styles.headerSubtitle}>Compite con tus amigos por una huella más baja</Text>
      </View>

      <ScrollView style={styles.section}>
        {/* My Rank */}
        <View style={styles.myRankCard}>
          <View style={styles.myRankBadge}>
            <Text style={styles.myRankText}>#{myRank}</Text>
          </View>
          <View style={styles.myRankInfo}>
            <Text style={styles.myRankLabel}>Tu Posición</Text>
            <Text style={styles.myRankFootprint}>{myFootprint.toFixed(2)} kg CO₂</Text>
          </View>
        </View>

        {/* My Friend Code Card */}
        <View style={styles.friendCodeCard}>
          <Text style={styles.friendCodeTitle}>🎯 Tu Código de Amigo</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.friendCodeText}>{myFriendCode || 'Cargando...'}</Text>
          </View>
          <Text style={styles.friendCodeHint}>
            Comparte este código con tus amigos para que te agreguen
          </Text>
        </View>

        {/* Add Friend Form */}
        <View style={styles.addForm}>
          <Text style={styles.sectionTitle}>➕ Agregar Amigo</Text>
          <Text style={styles.addFormHint}>Ingresa el código de 6 caracteres de tu amigo:</Text>
          <TextInput
            style={styles.codeInput}
            value={friendCode}
            onChangeText={(text) => setFriendCode(text.toUpperCase())}
            placeholder="ABC123"
            placeholderTextColor="#999"
            autoCapitalize="characters"
            maxLength={6}
          />
          <Pressable
            style={styles.button}
            onPress={handleAddFriend}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </Text>
          </Pressable>
        </View>

        {/* Leaderboard */}
        <Text style={styles.sectionTitle}>🏆 Tabla de Posiciones</Text>
        <Text style={styles.sectionSubtitle}>Menor huella de carbono = Mejor posición</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 20 }} />
        ) : friends.length > 0 ? (
          friends.map((friend) => (
            <View key={friend.id} style={styles.card}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{friend.rank}</Text>
              </View>
              <View style={styles.cardLeft}>
                <Text style={styles.cardEmail}>{friend.email}</Text>
                <Text style={styles.cardStats}>
                  {friend.total_footprint.toFixed(2)} kg CO₂
                </Text>
              </View>
              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemoveFriend(friend.id, friend.friend_id)}
              >
                <Text style={styles.actionText}>✕</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>
              Aún no tienes amigos agregados
            </Text>
            <Text style={styles.emptySubtext}>
              Agrega amigos para competir y motivarse mutuamente
            </Text>
          </View>
        )}
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
    backgroundColor: '#3b82f6',
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
  myRankCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  myRankBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myRankText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 24,
  },
  myRankInfo: {
    flex: 1,
  },
  myRankLabel: {
    fontSize: 16,
    color: '#1e40af',
    fontWeight: '600',
    marginBottom: 4,
  },
  myRankFootprint: {
    fontSize: 20,
    color: '#1e3a8a',
    fontWeight: '700',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  userId: {
    fontSize: 12,
    color: '#78350f',
    fontFamily: 'monospace',
    backgroundColor: '#fffbeb',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  userIdHint: {
    fontSize: 12,
    color: '#92400e',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  addForm: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addFormHint: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  codeInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#16a34a',
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 4,
    fontFamily: 'monospace',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
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
  cardLeft: {
    flex: 1,
  },
  cardEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardStats: {
    fontSize: 14,
    color: '#666',
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: '#3b82f6',
    fontWeight: '700',
    fontSize: 16,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#dc2626',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
