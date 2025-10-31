import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Registrar nuevo usuario
export async function signUp({ email, password, name }: SignUpData): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (error) {
    console.error('Error en signUp:', error);
    return {
      user: null,
      session: null,
      error: error as Error,
    };
  }
}

// Iniciar sesión
export async function signIn({ email, password }: SignInData): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (error) {
    console.error('Error en signIn:', error);
    return {
      user: null,
      session: null,
      error: error as Error,
    };
  }
}

// Cerrar sesión
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error en signOut:', error);
    return { error: error as Error };
  }
}

// Obtener sesión actual
export async function getSession(): Promise<{ session: Session | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    return { session: null, error: error as Error };
  }
}

// Obtener usuario actual
export async function getCurrentUser(): Promise<{ user: User | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return { user: null, error: error as Error };
  }
}

// Actualizar perfil de usuario
export async function updateProfile(name: string): Promise<{ error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No hay usuario autenticado');

    const { error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', user.id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    return { error: error as Error };
  }
}

// Escuchar cambios de autenticación
export function onAuthStateChange(callback: (user: User | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return subscription;
}
