import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Theme } from '../../constants/JalSakhiTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// Model 1: Crop Water Requirement Input Screen
export default function CropWaterInput() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cropType: '',
    growthStage: '',
    soilType: '',
    soilMoisture: '',
    temperature: '',
    humidity: '',
    rainfallLast5Days: '',
    rainfallForecast: '',
    windSpeed: '',
    solarRadiation: '',
  });
  const [loading, setLoading] = useState(false);

  const cropTypes = ['Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Maize', 'Soybean', 'Vegetables', 'Pulses'];
  const growthStages = ['Seedling', 'Vegetative', 'Flowering', 'Harvest'];
  const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Silt', 'Peaty'];

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.cropType || !formData.growthStage || !formData.soilType) {
      Alert.alert('Error', 'Please fill all required fields (Crop Type, Growth Stage, Soil Type)');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('http://YOUR_SERVER_IP:5000/api/predict/crop-water-requirement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      // Navigate to results screen with prediction data
      router.push({
        pathname: '/farmer/crop-water-results' as any,
        params: { 
          prediction: JSON.stringify(result),
          inputData: JSON.stringify(formData)
        },
      });
    } catch (error: any) {
      Alert.alert('Error', 'Failed to get prediction. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color={Theme.colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Crop Water Requirement</Text>
            <Text style={styles.subtitle}>Model 1: Predict irrigation needs</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Crop Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌾 Crop Details</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Crop Type *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.cropType}
                  onValueChange={(value) => setFormData({ ...formData, cropType: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Select crop type" value="" />
                  {cropTypes.map((crop) => (
                    <Picker.Item key={crop} label={crop} value={crop} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Growth Stage *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.growthStage}
                  onValueChange={(value) => setFormData({ ...formData, growthStage: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Select growth stage" value="" />
                  {growthStages.map((stage) => (
                    <Picker.Item key={stage} label={stage} value={stage} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Soil Type *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.soilType}
                  onValueChange={(value) => setFormData({ ...formData, soilType: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Select soil type" value="" />
                  {soilTypes.map((soil) => (
                    <Picker.Item key={soil} label={soil} value={soil} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Current Conditions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌡️ Current Conditions</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Soil Moisture (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 45"
                keyboardType="decimal-pad"
                value={formData.soilMoisture}
                onChangeText={(text) => setFormData({ ...formData, soilMoisture: text })}
              />
              <Text style={styles.hint}>Typical range: 20-60%</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Temperature (°C)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 32"
                  keyboardType="decimal-pad"
                  value={formData.temperature}
                  onChangeText={(text) => setFormData({ ...formData, temperature: text })}
                />
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>Humidity (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 65"
                  keyboardType="decimal-pad"
                  value={formData.humidity}
                  onChangeText={(text) => setFormData({ ...formData, humidity: text })}
                />
              </View>
            </View>
          </View>

          {/* Weather Data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌤️ Weather Data</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Rainfall Last 5 Days (mm)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 25"
                keyboardType="decimal-pad"
                value={formData.rainfallLast5Days}
                onChangeText={(text) => setFormData({ ...formData, rainfallLast5Days: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Rainfall Forecast Next 5 Days (mm)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 10"
                keyboardType="decimal-pad"
                value={formData.rainfallForecast}
                onChangeText={(text) => setFormData({ ...formData, rainfallForecast: text })}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Wind Speed (km/h)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 15"
                  keyboardType="decimal-pad"
                  value={formData.windSpeed}
                  onChangeText={(text) => setFormData({ ...formData, windSpeed: text })}
                />
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>Solar Radiation (MJ/m²/day)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 20"
                  keyboardType="decimal-pad"
                  value={formData.solarRadiation}
                  onChangeText={(text) => setFormData({ ...formData, solarRadiation: text })}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Feather name="droplet" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {loading ? 'Calculating...' : 'Get Water Requirement'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backBtn: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  hint: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 24,
    elevation: 4,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
