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
import React, { useEffect, useState } from 'react';
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
  FileDigit,
} from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Config from '@/config/config';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';

type CompetitionStation = {
  company: string;
  stationSales: string;
  dieselSales: string;
  gasolineSales: string;
  comments: string;
};

const PipelineForm = ({ setShowForm }: any) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    city: '',
    station_land: 'station',
    area: '',
    revenue_type: '',
    location_coordinates: '',
    date_site_added: new Date(),
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
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [competitionStations, setCompetitionStations] = useState<
    CompetitionStation[]
  >([
    {
      company: '',
      stationSales: '',
      dieselSales: '',
      gasolineSales: '',
      comments: '',
    },
  ]);

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

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      console.log('Selected date:', formattedDate);
      updateFormData('date_site_added', formattedDate);
    }
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

  const handleSelectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });
      // expo-document-picker v11+ returns assets array
      if (result.assets && result.assets.length > 0) {
        setSelectedDocument(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare the payload with correct data types
      const payload = {
        site_name: formData.site_name,
        city: formData.city,
        station_or_land: formData.station_land,
        area: formData.area,
        revenue_type: formData.revenue_type,
        location_coordinates: formData.location_coordinates,
        date_site_added:
          typeof formData.date_site_added === 'string'
            ? (formData.date_site_added as string).split('T')[0]
            : (formData.date_site_added as Date).toISOString().split('T')[0],
        site_added_by: formData.site_added_by,
        project_type: formData.project_type,
        real_estate_team: formData.real_estate_team,
        traffic_count_5_min: Number(formData.traffic_count_5_min),
        expected_gasoline_sales_lpd: 0,
        expected_diesel_sales_lpd: 0,
        expected_real_estate_revenue_sar_year: 0,
        rental_demand: Number(formData.rental_demand),
        lease_tenure: formData.lease_tenure,
        pictures: formData.pictures,
        stage: formData.stage,
        initial_comments: formData.initial_comments,
        approval_status_development_team: 'pending',
        description: formData.description || '',
        is_active: true,
        competitions: competitionStations.map((station) => ({
          company_name: station.company,
          station_sales: Number(station.stationSales) || 0,
          diesel_sales: Number(station.dieselSales) || 0,
          gasoline_sales: Number(station.gasolineSales) || 0,
          additional_comments: station.comments,
        })),
      };

      const response = await axios.post(
        `${Config.BASE_ROUTE}/pipelines/with-competition`,
        payload,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('pipeline data submitted:', response.data);
      const pipelineId = response.data.id;

      // Upload document if selected
      if (selectedDocument && selectedDocument.uri) {
        console.log('uplaoding doc');
        const docFormData = new FormData();
        docFormData.append('files', {
          uri: selectedDocument.uri,
          name: selectedDocument.name || 'document',
          type: selectedDocument.mimeType || 'application/octet-stream',
        } as any);
        try {
          await axios.post(
            `${Config.BASE_ROUTE}/pipelines/${pipelineId}/upload-docs`,
            docFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          console.log('Document uploaded');
        } catch (err) {
          console.log('Document upload failed', (err as any).response?.data);
          Alert.alert('Warning', 'Document upload failed.');
        }
      }

      // Upload image if selected
      if (formData.pictures) {
        console.log('uploading pic');
        const imgFormData = new FormData();
        imgFormData.append('files', {
          uri: formData.pictures,
          name: 'image.jpg',
          type: 'image/jpeg',
        } as any);
        try {
          await axios.post(
            `${Config.BASE_ROUTE}/pipelines/${pipelineId}/upload-images`,
            imgFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          console.log('Image uploaded');
        } catch (err) {
          console.log('Image upload failed', (err as any).response?.data);
          Alert.alert('Warning', 'Image upload failed.');
        }
      }
      setLoading(false);

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
              date_site_added: new Date(),
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
    } catch (error: any) {
      console.log('error', error.response.data);
      Alert.alert('Failed to submit site data. Please try again.');
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

  const handleCompetitionChange = (
    index: number,
    field: keyof CompetitionStation,
    value: string
  ) => {
    setCompetitionStations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addCompetitionStation = () => {
    setCompetitionStations((prev) => [
      ...prev,
      {
        company: '',
        stationSales: '',
        dieselSales: '',
        gasolineSales: '',
        comments: '',
      },
    ]);
  };

  const removeCompetitionStation = (index: number) => {
    setCompetitionStations((prev) => prev.filter((_, i) => i !== index));
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

        <View>
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
                placeholder="Total Area"
                value={formData.area}
                onChangeText={(value) => updateFormData('area', value)}
              />
            </View>
            {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}
          </View>
        </View>

        {/* Station Land */}
        <Text style={{ color: '#6b7280', fontSize: 14, marginBottom: 6 }}>
          Station/Land
        </Text>

        <View
          style={{
            borderRadius: 10,
            paddingLeft: 10,
            borderWidth: 1,
            borderColor: '#bdc3c7',
            overflow: 'hidden',
            marginBottom: 12,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Picker
            selectedValue={'station'}
            style={{ color: '#6b7280' }}
            onValueChange={(value) => updateFormData('station_land', value)}
            mode="dropdown"
          >
            <Picker.Item label="Station" value="station" />
            <Picker.Item label="Land" value="land" />
          </Picker>
        </View>
        {errors.station_land && (
          <Text style={styles.errorText}>{errors.station_land}</Text>
        )}

        {/* Revenue Type */}
        <Text style={{ color: '#6b7280', fontSize: 14, marginBottom: 6 }}>
          Revenue type
        </Text>
        <View
          style={{
            borderRadius: 10,
            paddingLeft: 10,
            borderWidth: 1,
            borderColor: '#bdc3c7',
            overflow: 'hidden',
            marginBottom: 12,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Picker
            mode="dropdown"
            style={{ color: '#6b7280' }}
            placeholder="Revenue Type"
            selectedValue="fuel only"
            onValueChange={(value) => updateFormData('revenue_type', value)}
          >
            <Picker.Item label="Fuel Only" value="fuel only" />
            <Picker.Item label="Fuel + Retail" value="fuel & retail" />
            <Picker.Item label="Franchise Only" value="franchise only" />
          </Picker>
        </View>
        {errors.revenue_type && (
          <Text style={styles.errorText}>{errors.revenue_type}</Text>
        )}
        <View style={[styles.inputContainer]}>
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
            <Text style={styles.errorText}>{errors.location_coordinates}</Text>
          )}
        </View>

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
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <Users size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  errors.real_estate_team && styles.inputError,
                ]}
                placeholder="Team"
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

        {/* Date and Site Added By Row */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <View style={styles.inputWrapper}>
              <Calendar size={20} color="#6b7280" style={styles.inputIcon} />
              <TouchableOpacity
                onPress={() => {
                  setShow(true);
                }}
                style={[
                  styles.input,
                  errors.date_site_added && styles.inputError,
                  { justifyContent: 'center' },
                ]}
              >
                <Text
                  style={{
                    color: formData.date_site_added ? '#6b7280' : '#6b7280',
                  }}
                >
                  {formData.date_site_added.toString() || 'Date Added'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.date_site_added && (
              <Text style={styles.errorText}>{errors.date_site_added}</Text>
            )}
          </View>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={
                formData.date_site_added
                  ? new Date(formData.date_site_added)
                  : new Date()
              }
              mode="date"
              is24Hour={true}
              onChange={onChangeDate}
            />
          )}

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
        <Text style={{ color: '#6b7280', fontSize: 14, marginBottom: 6 }}>
          Project type
        </Text>
        <View
          style={{
            borderRadius: 10,
            paddingLeft: 10,
            borderWidth: 1,
            borderColor: '#bdc3c7',
            overflow: 'hidden',
            marginBottom: 12,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Picker
            mode="dropdown"
            style={{ color: '#6b7280' }}
            placeholder="Project Type"
            selectedValue={formData.project_type}
            onValueChange={(value) => updateFormData('project_type', value)}
          >
            <Picker.Item label="Green Field" value="Green Field" />
            <Picker.Item label="Lipstick" value="Lipstick" />
            <Picker.Item label="KDR" value="KDR" />
            <Picker.Item label="PKDR" value="PKDR" />
            <Picker.Item label="Branding Only" value="Branding Only" />
            <Picker.Item label="Revamp" value="Revamp" />
            <Picker.Item label="Finishing only" value="Finishing only" />
          </Picker>
        </View>
        {errors.project_type && (
          <Text style={styles.errorText}>{errors.project_type}</Text>
        )}

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
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={handleSelectPicture}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: '#fff',
              padding: 16,
              borderRadius: 10,
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
            }}
          >
            <Camera size={20} color="#6b7280" />
            <Text style={{ color: '#6b7280', fontSize: 16 }}>
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

        {/* Document Upload */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={handleSelectDocument}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: '#fff',
              padding: 16,
              borderRadius: 10,
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
            }}
          >
            <FileDigit size={20} color="#6b7280" />
            <Text style={{ color: '#6b7280', fontSize: 16 }}>
              {selectedDocument ? selectedDocument.name : 'Attach other files'}
            </Text>
          </TouchableOpacity>
          {selectedDocument && (
            <View style={{ marginTop: 10 }}>
              {/* <Text style={{ color: '#1f2937' }}>{selectedDocument.name}</Text> */}
              {selectedDocument.mimeType &&
              selectedDocument.mimeType.startsWith('image/') ? (
                <Image
                  source={{ uri: selectedDocument.uri }}
                  style={{ width: 100, height: 100, marginTop: 5 }}
                />
              ) : null}
            </View>
          )}
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

        {/* Competition Section */}
        <Text
          style={{
            color: '#6b7280',
            fontSize: 16,
            marginBottom: 8,
            marginTop: 0,
            fontWeight: 'bold',
          }}
        >
          Competition
        </Text>
        {competitionStations.map((station, idx) => (
          <View
            key={idx}
            style={{
              gap: 10,
              marginBottom: 12,
            }}
          >
            <View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Company Name"
                  value={station.company}
                  onChangeText={(value) =>
                    handleCompetitionChange(idx, 'company', value)
                  }
                />
              </View>
            </View>

            <View style={[styles.row]}>
              <View style={styles.halfWidth}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Gasoline Sales"
                    value={station.gasolineSales}
                    onChangeText={(value) =>
                      handleCompetitionChange(idx, 'gasolineSales', value)
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={[styles.halfWidth]}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Station Sales"
                    value={station.stationSales}
                    onChangeText={(value) =>
                      handleCompetitionChange(idx, 'stationSales', value)
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Additional Comments"
                value={station.comments}
                onChangeText={(value) =>
                  handleCompetitionChange(idx, 'comments', value)
                }
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            {competitionStations.length > 1 && (
              <TouchableOpacity
                onPress={() => removeCompetitionStation(idx)}
                style={{ alignSelf: 'flex-end', marginTop: 4 }}
              >
                <Text style={{ color: '#DC2626', fontSize: 14 }}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity
          onPress={addCompetitionStation}
          style={{
            alignSelf: 'flex-start',
            marginBottom: 16,
            backgroundColor: '#e5e7eb',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#1f2937', fontSize: 15 }}>
            + Add another station
          </Text>
        </TouchableOpacity>

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
    marginBottom: 12,
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
    alignItems: 'center',
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
