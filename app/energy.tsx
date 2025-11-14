import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { useAuth } from '@/src/context/AuthContext';
import {
  addEnergyConsumption,
  getEnergyConsumption,
  deleteEnergyConsumption,
  EnergyConsumption,
} from '@/lib/energy';

export default function EnergyScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [electricity, setElectricity] = useState('');
  const [gas, setGas] = useState('');
  const [water, setWater] = useState('');
  const [records, setRecords] = useState<EnergyConsumption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecords();
    }
  }, [user]);

  const loadRecords = async () => {
    if (!user) return;
    const data = await getEnergyConsumption(user.id);
    setRecords(data);
  };

  const handleAdd = async () => {
    if (!user) return;
    
    const elec = parseFloat(electricity);
    const gasVal = parseFloat(gas);
    const waterVal = parseFloat(water);

    if (isNaN(elec) || isNaN(gasVal) || isNaN(waterVal)) {
      Alert.alert(t('error'), 'Please enter valid numbers');
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const result = await addEnergyConsumption(user.id, elec, gasVal, waterVal, today);
    
    if (result) {
      Alert.alert(t('success'), 'Energy consumption logged successfully');
      setElectricity('');
      setGas('');
      setWater('');
      loadRecords();
    } else {
      Alert.alert(t('error'), 'Failed to log energy consumption');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      t('delete'),
      'Are you sure you want to delete this record?',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            const success = await deleteEnergyConsumption(id);
            if (success) {
              loadRecords();
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: 20,
      backgroundColor: theme.primary,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    form: {
      padding: 20,
      backgroundColor: theme.surface,
      margin: 15,
      borderRadius: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginTop: 15,
      marginBottom: 5,
    },
    input: {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.text,
    },
    button: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    recordsList: {
      padding: 15,
    },
    recordCard: {
      backgroundColor: theme.surface,
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
    },
    recordDate: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    recordRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 3,
    },
    recordLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    recordValue: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '600',
    },
    deleteButton: {
      backgroundColor: theme.error,
      padding: 8,
      borderRadius: 6,
      marginTop: 10,
      alignItems: 'center',
    },
    deleteButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>⚡ {t('energyConsumption')}</Text>
      </View>

      <ScrollView>
        <View style={styles.form}>
          <Text style={styles.label}>{t('electricityUsage')}</Text>
          <TextInput
            style={styles.input}
            value={electricity}
            onChangeText={setElectricity}
            keyboardType="numeric"
            placeholder="0.0"
            placeholderTextColor={theme.textSecondary}
          />

          <Text style={styles.label}>{t('gasUsage')}</Text>
          <TextInput
            style={styles.input}
            value={gas}
            onChangeText={setGas}
            keyboardType="numeric"
            placeholder="0.0"
            placeholderTextColor={theme.textSecondary}
          />

          <Text style={styles.label}>{t('waterUsage')}</Text>
          <TextInput
            style={styles.input}
            value={water}
            onChangeText={setWater}
            keyboardType="numeric"
            placeholder="0.0"
            placeholderTextColor={theme.textSecondary}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleAdd}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? t('loading') : t('save')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recordsList}>
          {records.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              <Text style={styles.recordDate}>{record.date}</Text>
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>Electricity:</Text>
                <Text style={styles.recordValue}>{record.electricity_kwh} kWh</Text>
              </View>
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>Gas:</Text>
                <Text style={styles.recordValue}>{record.gas_m3} m³</Text>
              </View>
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>Water:</Text>
                <Text style={styles.recordValue}>{record.water_liters} L</Text>
              </View>
              <View style={styles.recordRow}>
                <Text style={styles.recordLabel}>CO₂:</Text>
                <Text style={styles.recordValue}>
                  {record.carbon_footprint.toFixed(2)} kg
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => record.id && handleDelete(record.id)}
              >
                <Text style={styles.deleteButtonText}>{t('delete')}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
