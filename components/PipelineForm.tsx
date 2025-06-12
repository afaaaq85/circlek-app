import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Database,
  FileText,
  Fuel,
  Settings,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react-native';

const PipelineForm = ({setShowForm}: any) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert('Success', 'Pipeline data submitted successfully!', [
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
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit pipeline data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowForm(false)}
        >
          <ArrowLeft size={24} color="#DC2626" />
        </TouchableOpacity>
       
        <Text style={styles.formHeaderTitle}>Pipeline Data Entry</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Fuel Pump Pipeline Information</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Fuel size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.pipelineName && styles.inputError]}
              placeholder="Pipeline Name"
              value={formData.pipelineName}
              onChangeText={(value) => updateFormData('pipelineName', value)}
            />
          </View>
          {errors.pipelineName && (
            <Text style={styles.errorText}>{errors.pipelineName}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <FileText size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.fuelType && styles.inputError]}
              placeholder="Fuel Type (e.g., Gasoline, Diesel)"
              value={formData.fuelType}
              onChangeText={(value) => updateFormData('fuelType', value)}
            />
          </View>
          {errors.fuelType && (
            <Text style={styles.errorText}>{errors.fuelType}</Text>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <Database size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.capacity && styles.inputError]}
                placeholder="Capacity (L)"
                value={formData.capacity}
                onChangeText={(value) => updateFormData('capacity', value)}
                keyboardType="numeric"
              />
            </View>
            {errors.capacity && (
              <Text style={styles.errorText}>{errors.capacity}</Text>
            )}
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <BarChart3 size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.pressure && styles.inputError]}
                placeholder="Pressure (PSI)"
                value={formData.pressure}
                onChangeText={(value) => updateFormData('pressure', value)}
                keyboardType="numeric"
              />
            </View>
            {errors.pressure && (
              <Text style={styles.errorText}>{errors.pressure}</Text>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <Settings size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.temperature && styles.inputError]}
                placeholder="Temperature (°C)"
                value={formData.temperature}
                onChangeText={(value) => updateFormData('temperature', value)}
                keyboardType="numeric"
              />
            </View>
            {errors.temperature && (
              <Text style={styles.errorText}>{errors.temperature}</Text>
            )}
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <Fuel size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.flowRate && styles.inputError]}
                placeholder="Flow Rate (L/min)"
                value={formData.flowRate}
                onChangeText={(value) => updateFormData('flowRate', value)}
                keyboardType="numeric"
              />
            </View>
            {errors.flowRate && (
              <Text style={styles.errorText}>{errors.flowRate}</Text>
            )}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MapPin size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.location && styles.inputError]}
              placeholder="Pipeline Location"
              value={formData.location}
              onChangeText={(value) => updateFormData('location', value)}
            />
          </View>
          {errors.location && (
            <Text style={styles.errorText}>{errors.location}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <FileText size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.operatorName && styles.inputError]}
              placeholder="Operator Name"
              value={formData.operatorName}
              onChangeText={(value) => updateFormData('operatorName', value)}
            />
          </View>
          {errors.operatorName && (
            <Text style={styles.errorText}>{errors.operatorName}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Phone size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Phone Number"
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              keyboardType="phone-pad"
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Calendar size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.date && styles.inputError]}
              placeholder="Date (YYYY-MM-DD)"
              value={formData.date}
              onChangeText={(value) => updateFormData('date', value)}
            />
          </View>
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <FileText size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional Notes (Optional)"
              value={formData.notes}
              onChangeText={(value) => updateFormData('notes', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Send size={20} color="#ffffff" style={styles.buttonIcon} />
              <Text style={styles.submitButtonText}>Submit Pipeline Data</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
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
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  gridContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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

export default PipelineForm;
