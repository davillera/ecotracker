import { supabase } from './supabase';

export interface EnergyConsumption {
  id?: string;
  user_id: string;
  date: string;
  electricity_kwh: number;
  gas_m3: number;
  water_liters: number;
  carbon_footprint: number;
  created_at?: string;
}

// Carbon emission factors
const ELECTRICITY_EMISSION_FACTOR = 0.5; // kg CO2 per kWh
const GAS_EMISSION_FACTOR = 2.0; // kg CO2 per m³
const WATER_EMISSION_FACTOR = 0.001; // kg CO2 per liter

export function calculateEnergyFootprint(
  electricity: number,
  gas: number,
  water: number
): number {
  const electricityFootprint = electricity * ELECTRICITY_EMISSION_FACTOR;
  const gasFootprint = gas * GAS_EMISSION_FACTOR;
  const waterFootprint = water * WATER_EMISSION_FACTOR;
  
  return electricityFootprint + gasFootprint + waterFootprint;
}

export async function addEnergyConsumption(
  userId: string,
  electricity: number,
  gas: number,
  water: number,
  date: string
): Promise<EnergyConsumption | null> {
  try {
    const carbonFootprint = calculateEnergyFootprint(electricity, gas, water);
    
    const { data, error } = await supabase
      .from('energy_consumption')
      .insert({
        user_id: userId,
        date,
        electricity_kwh: electricity,
        gas_m3: gas,
        water_liters: water,
        carbon_footprint: carbonFootprint,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding energy consumption:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getEnergyConsumption(
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<EnergyConsumption[]> {
  try {
    let query = supabase
      .from('energy_consumption')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching energy consumption:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export async function updateEnergyConsumption(
  id: string,
  electricity: number,
  gas: number,
  water: number
): Promise<boolean> {
  try {
    const carbonFootprint = calculateEnergyFootprint(electricity, gas, water);
    
    const { error } = await supabase
      .from('energy_consumption')
      .update({
        electricity_kwh: electricity,
        gas_m3: gas,
        water_liters: water,
        carbon_footprint: carbonFootprint,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating energy consumption:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export async function deleteEnergyConsumption(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('energy_consumption')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting energy consumption:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
