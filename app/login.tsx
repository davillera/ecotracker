import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useAuth } from './src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const { error } = await signIn(email, password);
      
      if (error) {
        Alert.alert('Error', error.message || 'No se pudo iniciar sesión');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  const disabled = loading || !email || !password;

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.select({ ios: 'padding' })}
    >
      <View style={{ 
        flex: 1, 
        padding: 24, 
        justifyContent: 'center', 
        gap: 16, 
        backgroundColor: '#f8fdf8' 
      }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 48, marginBottom: 8 }}>🌱</Text>
          <Text style={{ fontSize: 32, fontWeight: '700', color: '#16a34a' }}>
            EcoTracker
          </Text>
          <Text style={{ fontSize: 16, color: '#555', marginTop: 8 }}>
            Rastrea y reduce tu huella de carbono
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          <View>
            <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>
              Email
            </Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholder="tucorreo@ejemplo.com"
              style={{
                borderWidth: 1, 
                borderColor: '#ddd', 
                borderRadius: 12, 
                padding: 14,
                fontSize: 16,
                backgroundColor: '#fff',
              }}
              editable={!loading}
            />
          </View>

          <View>
            <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>
              Contraseña
            </Text>
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              style={{
                borderWidth: 1, 
                borderColor: '#ddd', 
                borderRadius: 12, 
                padding: 14,
                fontSize: 16,
                backgroundColor: '#fff',
              }}
              editable={!loading}
            />
          </View>
        </View>

        <Pressable
          onPress={handleLogin}
          disabled={disabled}
          style={{
            backgroundColor: disabled ? '#ccc' : '#16a34a',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
              Iniciar sesión
            </Text>
          )}
        </Pressable>

        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          marginTop: 16,
          gap: 4,
        }}>
          <Text style={{ color: '#666' }}>¿No tienes cuenta?</Text>
          <Pressable onPress={goToRegister} disabled={loading}>
            <Text style={{ color: '#16a34a', fontWeight: '600' }}>
              Regístrate
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
