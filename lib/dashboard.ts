import { supabase, DashboardStats } from './supabase';

// Obtener estadísticas del dashboard
export async function getDashboardStats() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // Obtener comidas de hoy
    const { data: meals } = await supabase
      .from('meals')
      .select('co2')
      .eq('user_id', user.id)
      .gte('created_at', todayISO);

    // Obtener transporte de hoy
    const { data: transport } = await supabase
      .from('transport')
      .select('co2')
      .eq('user_id', user.id)
      .gte('created_at', todayISO);

    const meals_co2 = meals?.reduce((sum, m) => sum + Number(m.co2), 0) || 0;
    const transport_co2 = transport?.reduce((sum, t) => sum + Number(t.co2), 0) || 0;

    const stats = {
      total_co2: meals_co2 + transport_co2,
      meals_co2,
      transport_co2,
      meals_count: meals?.length || 0,
      transport_count: transport?.length || 0,
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error);
    return { data: null, error: error as Error };
  }
}

// Obtener datos semanales
export async function getWeeklyData() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    const weekAgoISO = weekAgo.toISOString();

    // Obtener comidas de la última semana
    const { data: meals } = await supabase
      .from('meals')
      .select('co2, created_at')
      .eq('user_id', user.id)
      .gte('created_at', weekAgoISO)
      .order('created_at', { ascending: true });

    // Obtener transporte de la última semana
    const { data: transport } = await supabase
      .from('transport')
      .select('co2, created_at')
      .eq('user_id', user.id)
      .gte('created_at', weekAgoISO)
      .order('created_at', { ascending: true });

    // Agrupar por día
    const dailyData: Record<string, { meals_co2: number; transport_co2: number }> = {};

    meals?.forEach((meal) => {
      const date = new Date(meal.created_at).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { meals_co2: 0, transport_co2: 0 };
      }
      dailyData[date].meals_co2 += Number(meal.co2);
    });

    transport?.forEach((t) => {
      const date = new Date(t.created_at).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { meals_co2: 0, transport_co2: 0 };
      }
      dailyData[date].transport_co2 += Number(t.co2);
    });

    // Convertir a array y ordenar
    const weeklyData = Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        meals_co2: data.meals_co2,
        transport_co2: data.transport_co2,
        total_co2: data.meals_co2 + data.transport_co2,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { data: weeklyData, error: null };
  } catch (error) {
    console.error('Error obteniendo datos semanales:', error);
    return { data: null, error: error as Error };
  }
}

// Obtener desglose por categorías
export async function getCategoryBreakdown() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // Obtener comidas con tipo
    const { data: meals } = await supabase
      .from('meals')
      .select('type, co2')
      .eq('user_id', user.id)
      .gte('created_at', todayISO);

    // Obtener transporte con tipo
    const { data: transport } = await supabase
      .from('transport')
      .select('type, co2')
      .eq('user_id', user.id)
      .gte('created_at', todayISO);

    const mealsBreakdown = meals?.reduce((acc, meal) => {
      acc[meal.type] = (acc[meal.type] || 0) + Number(meal.co2);
      return acc;
    }, {} as Record<string, number>) || {};

    const transportBreakdown = transport?.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + Number(t.co2);
      return acc;
    }, {} as Record<string, number>) || {};

    return {
      data: {
        meals: mealsBreakdown,
        transport: transportBreakdown,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error obteniendo desglose por categorías:', error);
    return { data: null, error: error as Error };
  }
}

// Obtener datos completos del dashboard
export async function getFullDashboard() {
  try {
    const [stats, weekly, breakdown] = await Promise.all([
      getDashboardStats(),
      getWeeklyData(),
      getCategoryBreakdown(),
    ]);

    return {
      data: {
        stats: stats.data,
        weekly: weekly.data,
        breakdown: breakdown.data,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error obteniendo datos completos del dashboard:', error);
    return { data: null, error: error as Error };
  }
}
