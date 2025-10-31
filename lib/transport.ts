import { supabase, Transport } from './supabase';

export interface CreateTransportData {
  type: 'coche' | 'moto' | 'autobus' | 'metro' | 'bicicleta' | 'caminando';
  distance: number;
  co2: number;
}

// Crear nuevo viaje
export async function createTransport(data: CreateTransportData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data: transport, error } = await supabase
      .from('transport')
      .insert([
        {
          user_id: user.id,
          type: data.type,
          distance: data.distance,
          co2: data.co2,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data: transport, error: null };
  } catch (error) {
    console.error('Error creando transporte:', error);
    return { data: null, error: error as Error };
  }
}

// Obtener todos los viajes del usuario
export async function getTransport() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data, error } = await supabase
      .from('transport')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo transporte:', error);
    return { data: null, error: error as Error };
  }
}

// Obtener viajes de hoy
export async function getTodayTransport() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const { data, error } = await supabase
      .from('transport')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', todayISO)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo transporte de hoy:', error);
    return { data: null, error: error as Error };
  }
}

// Eliminar viaje
export async function deleteTransport(id: string) {
  try {
    const { error } = await supabase
      .from('transport')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error eliminando transporte:', error);
    return { error: error as Error };
  }
}

// Obtener estadísticas de transporte
export async function getTransportStats() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data, error } = await supabase
      .from('transport')
      .select('co2, type, distance')
      .eq('user_id', user.id);

    if (error) throw error;

    const stats = {
      total_co2: data?.reduce((sum, t) => sum + Number(t.co2), 0) || 0,
      total_distance: data?.reduce((sum, t) => sum + Number(t.distance), 0) || 0,
      count: data?.length || 0,
      by_type: data?.reduce((acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + Number(t.co2);
        return acc;
      }, {} as Record<string, number>) || {},
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error obteniendo estadísticas de transporte:', error);
    return { data: null, error: error as Error };
  }
}
