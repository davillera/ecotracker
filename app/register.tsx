import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import { useAuth } from './src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    try {
      setLoading(true);
      const { error } = await signUp(email, password, name);
      
      if (error) {
        Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
      } else {
        Alert.alert(
          '¡Cuenta creada!', 
          'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/login'),
            }
          ]
        );
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.back();
  };

  const disabled = loading || !name || !email || !password || !confirmPassword;

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.select({ ios: 'padding' })}
    >
      <ScrollView 
        style={{ flex: 1, backgroundColor: '#f8fdf8' }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ 
          flex: 1, 
          padding: 24, 
          justifyContent: 'center', 
          gap: 16,
          minHeight: '100%',
        }}>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>🌱</Text>
            <Text style={{ fontSize: 32, fontWeight: '700', color: '#16a34a' }}>
              Crear Cuenta
            </Text>
            <Text style={{ fontSize: 16, color: '#555', marginTop: 8, textAlign: 'center' }}>
              Únete y comienza a reducir tu huella de carbono
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            {/* Nombre */}
            <View>
              <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>
                Nombre
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre completo"
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

            {/* Email */}
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

            {/* Contraseña */}
            <View>
              <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>
                Contraseña
              </Text>
              <TextInput
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
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

            {/* Confirmar Contraseña */}
            <View>
              <Text style={{ fontWeight: '600', marginBottom: 8, color: '#333' }}>
                Confirmar Contraseña
              </Text>
              <TextInput
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repite tu contraseña"
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

          {/* Botón de Registro */}
          <Pressable
            onPress={handleRegister}
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
                Crear Cuenta
              </Text>
            )}
          </Pressable>

          {/* Link a Login */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            marginTop: 16,
            gap: 4,
          }}>
            <Text style={{ color: '#666' }}>¿Ya tienes cuenta?</Text>
            <Pressable onPress={goToLogin} disabled={loading}>
              <Text style={{ color: '#16a34a', fontWeight: '600' }}>
                Inicia sesión
              </Text>
            </Pressable>
          </View>

          {/* Información adicional */}
          <View style={{ 
            marginTop: 24, 
            padding: 16, 
            backgroundColor: '#e8f5e9', 
            borderRadius: 12,
            borderLeftWidth: 4,
            borderLeftColor: '#16a34a',
          }}>
            <Text style={{ fontSize: 12, color: '#333', lineHeight: 18 }}>
              Al crear una cuenta, podrás:
              {'\n'}• Registrar tus comidas y transporte
              {'\n'}• Ver tu huella de carbono diaria
              {'\n'}• Acceder a tips ecológicos
              {'\n'}• Sincronizar tus datos en la nube
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
