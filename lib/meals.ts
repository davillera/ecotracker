import { supabase, Meal } from './supabase';

export interface CreateMealData {
  name: string;
  type: 'vegetariano' | 'vegano' | 'carne_roja' | 'carne_blanca' | 'pescado';
  grams: number;
  co2: number;
}

// Crear nueva comida
export async function createMeal(data: CreateMealData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data: meal, error } = await supabase
      .from('meals')
      .insert([
        {
          user_id: user.id,
          name: data.name,
          type: data.type,
          grams: data.grams,
          co2: data.co2,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data: meal, error: null };
  } catch (error) {
    console.error('Error creando comida:', error);
    return { data: null, error: error as Error };
  }
}

// Obtener todas las comidas del usuario
export async function getMeals() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo comidas:', error);
    return { data: null, error: error as Error };
  }
}

// Obtener comidas de hoy
export async function getTodayMeals() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', todayISO)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error obteniendo comidas de hoy:', error);
    return { data: null, error: error as Error };
  }
}

// Eliminar comida
export async function deleteMeal(id: string) {
  try {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error eliminando comida:', error);
    return { error: error as Error };
  }
}

// Obtener estadísticas de comidas
export async function getMealStats() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data, error } = await supabase
      .from('meals')
      .select('co2, type')
      .eq('user_id', user.id);

    if (error) throw error;

    const stats = {
      total_co2: data?.reduce((sum, meal) => sum + Number(meal.co2), 0) || 0,
      count: data?.length || 0,
      by_type: data?.reduce((acc, meal) => {
        acc[meal.type] = (acc[meal.type] || 0) + Number(meal.co2);
        return acc;
      }, {} as Record<string, number>) || {},
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error obteniendo estadísticas de comidas:', error);
    return { data: null, error: error as Error };
  }
}
