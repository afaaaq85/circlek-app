import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Image,
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
  Building,
  DollarSign,
  Users,
  Camera,
  Clock,
} from 'lucide-react-native';
import axios from 'axios';
import Config from '@/config/config';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const PipelineForm = ({ setShowForm }: any) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    site_name: '',
    city: '',
    station_land: '',
    area: '',
    revenue_type: '',
    location_coordinates: '',
    date_site_added: '',
    site_added_by: '',
    project_type: '',
    real_estate_team: '',
    traffic_count_5_min: '',
    rental_demand: '',
    lease_tenure: '',
    pictures: '',
    stage: '',
    initial_comments: '',
    approval_status_by_development_team: '',
    description: '',
    is_active: true,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.site_name.trim()) {
      newErrors.site_name = 'Site name is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.station_land.trim()) {
      newErrors.station_land = 'Station land is required';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }

    if (!formData.revenue_type.trim()) {
      newErrors.revenue_type = 'Revenue type is required';
    }

    if (!formData.location_coordinates.trim()) {
      newErrors.location_coordinates = 'Location coordinates are required';
    }

    if (!formData.date_site_added.trim()) {
      newErrors.date_site_added = 'Date site added is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date_site_added)) {
      newErrors.date_site_added = 'Date must be in YYYY-MM-DD format';
    }

    if (!formData.site_added_by.trim()) {
      newErrors.site_added_by = 'Site added by is required';
    }

    if (!formData.project_type.trim()) {
      newErrors.project_type = 'Project type is required';
    }

    if (!formData.real_estate_team.trim()) {
      newErrors.real_estate_team = 'Real estate team is required';
    }

    if (!formData.traffic_count_5_min.trim()) {
      newErrors.traffic_count_5_min = 'Traffic count is required';
    } else if (
      isNaN(Number(formData.traffic_count_5_min)) ||
      Number(formData.traffic_count_5_min) < 0
    ) {
      newErrors.traffic_count_5_min = 'Traffic count must be a positive number';
    }

    // if (!formData.expected_gasoline_sales_liters_day.trim()) {
    //   newErrors.expected_gasoline_sales_liters_day =
    //     'Expected gasoline sales is required';
    // } else if (
    //   isNaN(Number(formData.expected_gasoline_sales_liters_day)) ||
    //   Number(formData.expected_gasoline_sales_liters_day) < 0
    // ) {
    //   newErrors.expected_gasoline_sales_liters_day =
    //     'Expected gasoline sales must be a positive number';
    // }

    // if (!formData.expected_diesel_sales_liters_day2.trim()) {
    //   newErrors.expected_diesel_sales_liters_day2 =
    //     'Expected diesel sales is required';
    // } else if (
    //   isNaN(Number(formData.expected_diesel_sales_liters_day2)) ||
    //   Number(formData.expected_diesel_sales_liters_day2) < 0
    // ) {
    //   newErrors.expected_diesel_sales_liters_day2 =
    //     'Expected diesel sales must be a positive number';
    // }

    // if (!formData.real_estate_revenue_expected_sar_yr.trim()) {
    //   newErrors.real_estate_revenue_expected_sar_yr =
    //     'Real estate revenue is required';
    // } else if (
    //   isNaN(Number(formData.real_estate_revenue_expected_sar_yr)) ||
    //   Number(formData.real_estate_revenue_expected_sar_yr) < 0
    // ) {
    //   newErrors.real_estate_revenue_expected_sar_yr =
    //     'Real estate revenue must be a positive number';
    // }

    if (!formData.rental_demand.trim()) {
      newErrors.rental_demand = 'Rental demand is required';
    }

    if (!formData.lease_tenure.trim()) {
      newErrors.lease_tenure = 'Lease tenure is required';
    } else if (
      isNaN(Number(formData.lease_tenure)) ||
      Number(formData.lease_tenure) < 0
    ) {
      newErrors.lease_tenure = 'Lease tenure must be a positive number';
    }

    if (!formData.stage.trim()) {
      newErrors.stage = 'Stage is required';
    }

    if (!formData.approval_status_by_development_team.trim()) {
      newErrors.approval_status_by_development_team =
        'Approval status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectPicture = async () => {
    // Request media library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Permission to access media library is needed!'
      );
      return;
    }

    Alert.alert('Add Picture', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: async () => {
          const cameraPermission =
            await ImagePicker.requestCameraPermissionsAsync();
          if (cameraPermission.status !== 'granted') {
            Alert.alert('Camera permission required');
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
          });

          if (!result.canceled) {
            const uri = result.assets[0].uri;
            updateFormData('pictures', uri);
          }
        },
      },
      {
        text: 'Choose from Library',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
          });

          if (!result.canceled) {
            const uri = result.assets[0].uri;
            updateFormData('pictures', uri);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare the payload with correct data types
      const payload = {
        sr: '9',
        site_name: formData.site_name,
        city: formData.city,
        station_or_land: formData.station_land,
        area: formData.area,
        revenue_type: formData.revenue_type,
        location_coordinates: formData.location_coordinates,
        date_site_added: formData.date_site_added,
        site_added_by: formData.site_added_by,
        project_type: formData.project_type,
        real_estate_team: formData.real_estate_team,
        traffic_count_5_min: Number(formData.traffic_count_5_min),
        expected_gasoline_sales_lpd: 0,
        expected_diesel_sales_lpd: 0,
        expected_real_estate_revenue_sar_year: 0,
        rental_demand: formData.rental_demand,
        lease_tenure: formData.lease_tenure,
        // pictures: formData.pictures,
        pictures: 'pictures afaq nill now',
        stage: formData.stage,
        initial_comments: formData.initial_comments,
        approval_status_development_team:'processing',
        description: 'no',
        is_active: true,
      };

      const response = await axios.post(
        `${Config.BASE_ROUTE}/pipelines/`,
        payload,{
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('pipeline data submitted:', response.data);
      Alert.alert('Success', 'Site data submitted successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setFormData({
              site_name: '',
              city: '',
              station_land: '',
              area: '',
              revenue_type: '',
              location_coordinates: '',
              date_site_added: '',
              site_added_by: '',
              project_type: '',
              real_estate_team: '',
              traffic_count_5_min: '',
              rental_demand: '',
              lease_tenure: '',
              pictures: '',
              stage: '',
              initial_comments: '',
              approval_status_by_development_team: 'processing',
              description: '',
              is_active: true,
            });
            setErrors({});
            setShowForm(false);
          },
        },
      ]);
    } catch (error) {
      console.log('error', error.response.data);
      Alert.alert('Error', 'Failed to submit site data. Please try again.');
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
        <Text style={styles.formHeaderTitle}>Site Data Entry</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Fuel Station Site Information</Text>

        {/* Site Name */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Building size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.site_name && styles.inputError]}
              placeholder="Site Name"
              value={formData.site_name}
              onChangeText={(value) => updateFormData('site_name', value)}
            />
          </View>
          {errors.site_name && (
            <Text style={styles.errorText}>{errors.site_name}</Text>
          )}
        </View>

        {/* City and Area Row */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                placeholder="City"
                value={formData.city}
                onChangeText={(value) => updateFormData('city', value)}
              />
            </View>
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.area && styles.inputError]}
                placeholder="Area"
                value={formData.area}
                onChangeText={(value) => updateFormData('area', value)}
              />
            </View>
            {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}
          </View>
        </View>

        {/* Station Land */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Database size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.station_land && styles.inputError]}
              placeholder="Station Land"
              value={formData.station_land}
              onChangeText={(value) => updateFormData('station_land', value)}
            />
          </View>
          {errors.station_land && (
            <Text style={styles.errorText}>{errors.station_land}</Text>
          )}
        </View>

        {/* Revenue Type and Location Coordinates Row */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <DollarSign size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.revenue_type && styles.inputError]}
                placeholder="Revenue Type"
                value={formData.revenue_type}
                onChangeText={(value) => updateFormData('revenue_type', value)}
              />
            </View>
            {errors.revenue_type && (
              <Text style={styles.errorText}>{errors.revenue_type}</Text>
            )}
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  errors.location_coordinates && styles.inputError,
                ]}
                placeholder="Coordinates"
                value={formData.location_coordinates}
                onChangeText={(value) =>
                  updateFormData('location_coordinates', value)
                }
              />
            </View>
            {errors.location_coordinates && (
              <Text style={styles.errorText}>
                {errors.location_coordinates}
              </Text>
            )}
          </View>
        </View>

        {/* Date and Site Added By Row */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <Calendar size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  errors.date_site_added && styles.inputError,
                ]}
                placeholder="Date Added (YYYY-MM-DD)"
                value={formData.date_site_added}
                onChangeText={(value) =>
                  updateFormData('date_site_added', value)
                }
              />
            </View>
            {errors.date_site_added && (
              <Text style={styles.errorText}>{errors.date_site_added}</Text>
            )}
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <Users size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  errors.site_added_by && styles.inputError,
                ]}
                placeholder="Added By"
                value={formData.site_added_by}
                onChangeText={(value) => updateFormData('site_added_by', value)}
              />
            </View>
            {errors.site_added_by && (
              <Text style={styles.errorText}>{errors.site_added_by}</Text>
            )}
          </View>
        </View>

        {/* Project Type and Real Estate Team Row */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <FileText size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.project_type && styles.inputError]}
                placeholder="Project Type"
                value={formData.project_type}
                onChangeText={(value) => updateFormData('project_type', value)}
              />
            </View>
            {errors.project_type && (
              <Text style={styles.errorText}>{errors.project_type}</Text>
            )}
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <Users size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  errors.real_estate_team && styles.inputError,
                ]}
                placeholder="Real Estate Team"
                value={formData.real_estate_team}
                onChangeText={(value) =>
                  updateFormData('real_estate_team', value)
                }
              />
            </View>
            {errors.real_estate_team && (
              <Text style={styles.errorText}>{errors.real_estate_team}</Text>
            )}
          </View>
        </View>

        {/* Traffic Count */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <BarChart3 size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[
                styles.input,
                errors.traffic_count_5_min && styles.inputError,
              ]}
              placeholder="Traffic Count (5 min)"
              value={formData.traffic_count_5_min}
              onChangeText={(value) =>
                updateFormData('traffic_count_5_min', value)
              }
              keyboardType="numeric"
            />
          </View>
          {errors.traffic_count_5_min && (
            <Text style={styles.errorText}>{errors.traffic_count_5_min}</Text>
          )}
        </View>

        {/* Rental Demand and Lease Tenure Row */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <Building size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  errors.rental_demand && styles.inputError,
                ]}
                placeholder="Rental Demand"
                value={formData.rental_demand}
                onChangeText={(value) => updateFormData('rental_demand', value)}
              />
            </View>
            {errors.rental_demand && (
              <Text style={styles.errorText}>{errors.rental_demand}</Text>
            )}
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <Clock size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.lease_tenure && styles.inputError]}
                placeholder="Lease Tenure (years)"
                value={formData.lease_tenure}
                onChangeText={(value) => updateFormData('lease_tenure', value)}
                keyboardType="numeric"
              />
            </View>
            {errors.lease_tenure && (
              <Text style={styles.errorText}>{errors.lease_tenure}</Text>
            )}
          </View>
        </View>

        {/* Pictures */}
        {/* <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Camera size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Pictures (URLs or file paths)"
              value={formData.pictures}
              onChangeText={(value) => updateFormData('pictures', value)}
            />
          </View>
        </View> */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={handleSelectPicture}
            style={styles.inputWrapper}
          >
            <Camera size={20} color="#6b7280" style={styles.inputIcon} />
            <Text style={styles.input}>
              {formData.pictures ? 'Picture Selected' : 'Add Picture'}
            </Text>
          </TouchableOpacity>

          {formData.pictures ? (
            <Image
              source={{ uri: formData.pictures }}
              style={{ width: 100, height: 100, marginTop: 10 }}
            />
          ) : null}
        </View>

        {/* Stage and Approval Status Row */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <Settings size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.stage && styles.inputError]}
                placeholder="Stage"
                value={formData.stage}
                onChangeText={(value) => updateFormData('stage', value)}
              />
            </View>
            {errors.stage && (
              <Text style={styles.errorText}>{errors.stage}</Text>
            )}
          </View>

        </View>

        {/* Initial Comments */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <FileText size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Initial Comments (Optional)"
              value={formData.initial_comments}
              onChangeText={(value) =>
                updateFormData('initial_comments', value)
              }
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
              <Text style={styles.submitButtonText}>Submit Site Data</Text>
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
