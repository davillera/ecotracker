import { supabase } from './supabase';

/**
 * Generar código único de 6 caracteres
 */
function generateFriendCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Asignar código a usuario si no tiene
 * Esta función trabaja incluso si la columna friend_code no existe aún
 */
export async function ensureFriendCode(userId: string): Promise<string | null> {
  try {
    // Intentar obtener código existente
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('friend_code')
      .eq('id', userId)
      .single();

    // Si hay error, probablemente la columna no existe
    if (fetchError && fetchError.message.includes('column')) {
      console.warn('⚠️ La columna friend_code no existe. Por favor ejecuta el SQL en Supabase.');
      return null;
    }

    // Si ya tiene código, retornarlo
    if (profile?.friend_code) {
      return profile.friend_code;
    }

    // Generar código único
    let attempts = 0;
    let friendCode = '';
    let isUnique = false;

    while (!isUnique && attempts < 10) {
      friendCode = generateFriendCode();
      
      // Verificar que sea único
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('friend_code', friendCode)
        .maybeSingle();

      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      console.error('❌ No se pudo generar un código único después de 10 intentos');
      return null;
    }

    // Asignar código
    const { error } = await supabase
      .from('profiles')
      .update({ friend_code: friendCode })
      .eq('id', userId);

    if (error) {
      console.error('❌ Error al asignar código:', error.message);
      // Si el error es por columna inexistente, dar instrucciones
      if (error.message.includes('column')) {
        console.error('⚠️ Necesitas ejecutar el SQL en Supabase Dashboard:');
        console.error('   database/ADD_FRIEND_CODE.sql');
      }
      return null;
    }

    console.log('✅ Código de amigo generado:', friendCode);
    return friendCode;
  } catch (error) {
    console.error('❌ Error en ensureFriendCode:', error);
    return null;
  }
}

/**
 * Buscar usuario por código de amigo
 */
export async function findUserByFriendCode(friendCode: string): Promise<string | null> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('friend_code', friendCode.toUpperCase())
      .single();

    if (error || !profile) {
      return null;
    }

    return profile.id;
  } catch (error) {
    console.error('❌ Error buscando usuario por código:', error);
    return null;
  }
}
