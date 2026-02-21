import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Theme } from '../../constants/JalSakhiTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

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
    if (!formData.cropType || !formData.growthStage || !formData.soilType) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        const mockResult = { suggestion: "1200L / hectare", confidence: "94%" };
        router.push({
          pathname: '/farmer/crop-water-results' as any,
          params: {
            prediction: JSON.stringify(mockResult),
            inputData: JSON.stringify(formData)
          },
        });
        setLoading(false);
      }, 1500);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to get prediction.');
      setLoading(false);
    }
  };

  const GlassCard = ({ title, icon, children, style }: any) => (
    <View style={[styles.glassCard, style]}>
      <BlurView intensity={30} tint="light" style={styles.cardBlur}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBox}>
            <MaterialCommunityIcons name={icon} size={20} color={Theme.colors.primary} />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {children}
      </BlurView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative Background Lines */}
      <View style={styles.decorativeLayer} pointerEvents="none">
        <View style={[styles.designLine, { top: '10%', right: -40, transform: [{ rotate: '-45deg' }] }]} />
        <View style={[styles.designLine, { bottom: '20%', left: -60, width: 250, transform: [{ rotate: '30deg' }] }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <BlurView intensity={60} tint="light" style={styles.backBlur}>
              <Feather name="chevron-left" size={24} color={Theme.colors.text} />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Crop Water</Text>
            <Text style={styles.subtitle}>Predict precise irrigation needs</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Form Section - Bento Style */}
          <View style={styles.bentoGrid}>

            <GlassCard title="Crop Details" icon="sprout" style={styles.fullWidth}>
              <View style={styles.inputGroup}>
                <Text style={styles.miniLabel}>Crop Type</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.cropType}
                    onValueChange={(value: string) => setFormData({ ...formData, cropType: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select crop" value="" color="#94a3b8" />
                    {cropTypes.map(c => <Picker.Item key={c} label={c} value={c} />)}
                  </Picker>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.miniLabel}>Growth Stage</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={formData.growthStage}
                      onValueChange={(value: string) => setFormData({ ...formData, growthStage: value })}
                      style={styles.picker}
                    >
                      <Picker.Item label="Stage" value="" color="#94a3b8" />
                      {growthStages.map(s => <Picker.Item key={s} label={s} value={s} />)}
                    </Picker>
                  </View>
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.miniLabel}>Soil Type</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={formData.soilType}
                      onValueChange={(value: string) => setFormData({ ...formData, soilType: value })}
                      style={styles.picker}
                    >
                      <Picker.Item label="Soil" value="" color="#94a3b8" />
                      {soilTypes.map(s => <Picker.Item key={s} label={s} value={s} />)}
                    </Picker>
                  </View>
                </View>
              </View>
            </GlassCard>

            <GlassCard title="Environment" icon="thermometer" style={styles.fullWidth}>
              <View style={styles.inputGroup}>
                <Text style={styles.miniLabel}>Soil Moisture (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 45"
                  placeholderTextColor="#94a3b8"
                  keyboardType="decimal-pad"
                  value={formData.soilMoisture}
                  onChangeText={(t) => setFormData({ ...formData, soilMoisture: t })}
                />
              </View>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.miniLabel}>Temp (°C)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 32"
                    placeholderTextColor="#94a3b8"
                    keyboardType="decimal-pad"
                    value={formData.temperature}
                    onChangeText={(t) => setFormData({ ...formData, temperature: t })}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.miniLabel}>Humidity (%)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 65"
                    placeholderTextColor="#94a3b8"
                    keyboardType="decimal-pad"
                    value={formData.humidity}
                    onChangeText={(t) => setFormData({ ...formData, humidity: t })}
                  />
                </View>
              </View>
            </GlassCard>

            <GlassCard title="Forecasting" icon="weather-cloudy" style={styles.fullWidth}>
              <View style={[styles.inputGroup, { marginBottom: 16 }]}>
                <Text style={styles.miniLabel}>Rainfall Forecast (5 Days)</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="mm"
                    placeholderTextColor="#94a3b8"
                    keyboardType="decimal-pad"
                    value={formData.rainfallForecast}
                    onChangeText={(t) => setFormData({ ...formData, rainfallForecast: t })}
                  />
                  <Ionicons name="rainy-outline" size={20} color={Theme.colors.primary} style={styles.inputIcon} />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.miniLabel}>Wind Speed</Text>
                  <TextInput style={styles.input} placeholder="km/h" placeholderTextColor="#94a3b8" keyboardType="decimal-pad" value={formData.windSpeed} onChangeText={t => setFormData({ ...formData, windSpeed: t })} />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.miniLabel}>Solar Rad.</Text>
                  <TextInput style={styles.input} placeholder="MJ/m²" placeholderTextColor="#94a3b8" keyboardType="decimal-pad" value={formData.solarRadiation} onChangeText={t => setFormData({ ...formData, solarRadiation: t })} />
                </View>
              </View>
            </GlassCard>

          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient colors={['#10b981', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBtn}>
              <Feather name="zap" size={20} color="white" />
              <Text style={styles.submitBtnText}>
                {loading ? 'Analyzing...' : 'Get Recommendation'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  decorativeLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  designLine: {
    position: 'absolute',
    width: 300,
    height: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 16,
  },
  backBlur: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Theme.colors.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  backBtn: {
    borderRadius: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  bentoGrid: {
    gap: 16,
  },
  fullWidth: {
    width: '100%',
  },
  glassCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  cardBlur: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  cardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 12,
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    marginBottom: 6,
    marginLeft: 4,
  },
  pickerWrapper: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    height: 48,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Theme.colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingRight: 12,
  },
  inputIcon: {
    marginLeft: 8,
  },
  submitBtn: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  gradientBtn: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  btnDisabled: {
    opacity: 0.7,
  }
});
