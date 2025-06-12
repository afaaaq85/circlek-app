import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Send, Calendar, MapPin, Phone, Mail, Fuel, Database, Settings, ChartBar as BarChart3, ArrowLeft } from 'lucide-react-native';
import PipelineForm from '@/components/PipelineForm';

export default function HomeScreen() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pipelineName: '',
    fuelType: '',
    capacity: '',
    pressure: '',
    temperature: '',
    flowRate: '',
    location: '',
    operatorName: '',
    phone: '',
    email: '',
    date: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const gridOptions = [
    {
      id: 1,
      title: 'Add Pipeline Data',
      subtitle: 'Enter fuel pump pipeline information',
      icon: Fuel,
      enabled: true,
      color: '#DC2626',
    },
    {
      id: 2,
      title: 'Data Analytics',
      subtitle: 'View pipeline performance metrics',
      icon: BarChart3,
      enabled: false,
      color: '#9CA3AF',
    },
    {
      id: 3,
      title: 'System Settings',
      subtitle: 'Configure pipeline parameters',
      icon: Settings,
      enabled: false,
      color: '#9CA3AF',
    },
    {
      id: 4,
      title: 'Database Management',
      subtitle: 'Manage stored pipeline records',
      icon: Database,
      enabled: false,
      color: '#9CA3AF',
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pipelineName.trim()) {
      newErrors.pipelineName = 'Pipeline name is required';
    }

    if (!formData.fuelType.trim()) {
      newErrors.fuelType = 'Fuel type is required';
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(Number(formData.capacity))) {
      newErrors.capacity = 'Capacity must be a number';
    }

    if (!formData.pressure.trim()) {
      newErrors.pressure = 'Pressure is required';
    } else if (isNaN(Number(formData.pressure))) {
      newErrors.pressure = 'Pressure must be a number';
    }

    if (!formData.temperature.trim()) {
      newErrors.temperature = 'Temperature is required';
    } else if (isNaN(Number(formData.temperature))) {
      newErrors.temperature = 'Temperature must be a number';
    }

    if (!formData.flowRate.trim()) {
      newErrors.flowRate = 'Flow rate is required';
    } else if (isNaN(Number(formData.flowRate))) {
      newErrors.flowRate = 'Flow rate must be a number';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.operatorName.trim()) {
      newErrors.operatorName = 'Operator name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Pipeline data submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({
                pipelineName: '',
                fuelType: '',
                capacity: '',
                pressure: '',
                temperature: '',
                flowRate: '',
                location: '',
                operatorName: '',
                phone: '',
                email: '',
                date: '',
                notes: '',
              });
              setErrors({});
              setShowForm(false);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit pipeline data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOptionPress = (option: any) => {
    if (!option.enabled) {
      Alert.alert('Coming Soon', `${option.title} feature will be available soon!`);
      return;
    }

    if (option.id === 1) {
      setShowForm(true);
    }
  };

  if (showForm) {
    return (
     <PipelineForm setShowForm={setShowForm}/>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
     {/* <View>
      <Image source={require('@/assets/images/circlek.png')} />
     </View> */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.username}!</Text>
        <Text style={styles.subGreeting}>Manage your pipeline operations</Text>
      </View>

      <View style={styles.gridContainer}>
        <Text style={styles.sectionTitle}>Pipeline Management System</Text>
        
        <View style={styles.grid}>
          {gridOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.gridCard,
                  !option.enabled && styles.gridCardDisabled
                ]}
                onPress={() => handleOptionPress(option)}
                disabled={!option.enabled}
              >
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: option.enabled ? `${option.color}15` : '#F3F4F6' }
                ]}>
                  <IconComponent 
                    size={32} 
                    color={option.color}
                  />
                </View>
                <Text style={[
                  styles.cardTitle,
                  !option.enabled && styles.cardTitleDisabled
                ]}>
                  {option.title}
                </Text>
                <Text style={[
                  styles.cardSubtitle,
                  !option.enabled && styles.cardSubtitleDisabled
                ]}>
                  {option.subtitle}
                </Text>
                {!option.enabled && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  greeting: {
    fontSize: 28,
    color: '#1f2937',
    marginBottom: 4,
    fontFamily:"GothamBlack"
  },
  subGreeting: {
    fontSize: 16,
    color: '#6b7280',
    fontFamily:"GothamMedium",
    letterSpacing:0
  },
  gridContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily:"GothamBold",
    letterSpacing:-1,
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  gridCardDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardTitleDisabled: {
    color: '#9CA3AF',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  cardSubtitleDisabled: {
    color: '#D1D5DB',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400E',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  formHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  form: {
    padding: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginLeft: 16,
    marginTop: 18,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: '#DC2626',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});