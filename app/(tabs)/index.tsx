import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import {
  superadminOptions,
  adminOptions,
  agentOptions,
  viewerOptions,
} from '@/data/roleBasedOptions';
import PipelineForm from '@/components/PipelineForm';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const gridOptions = useMemo(() => {
    switch (user?.role) {
      case 'Super Admin':
        return superadminOptions;
      case 'Agent':
        return agentOptions;
      case 'Viewer':
        return viewerOptions;
      default:
        return [];
    }
  }, [user?.role]);

  const handleOptionPress = (option: any) => {
    if (!option.enabled) {
      Alert.alert(
        'Coming Soon',
        `${option.title} feature will be available soon!`
      );
      return;
    }

    switch (option.id) {
      case 1:
        // All roles: show form
        setShowForm(true);
        break;
      case 2:
        // Example: Navigate or handle for other feature
        Alert.alert('Feature Clicked', `${option.title} tapped.`);
        break;
      case 3:
        // Add more logic here as needed
        Alert.alert('Feature Clicked', `${option.title} tapped.`);
        break;
      default:
        Alert.alert('Feature Clicked', `${option.title} tapped.`);
    }
  };

  if (showForm) {
    return <PipelineForm setShowForm={setShowForm} />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#ff2800', '#ff0800', '#eb5406']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View
          style={{
            width: '100%',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            source={require('@/assets/images/circlek-white.png')}
            style={{ width: 200, height: 80 }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.greeting}>Hello, {user?.username}!</Text>
        <Text style={styles.subGreeting}>Manage your pipeline operations</Text>
      </LinearGradient>

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
                  !option.enabled && styles.gridCardDisabled,
                ]}
                onPress={() => handleOptionPress(option)}
                disabled={!option.enabled}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: option.enabled
                        ? `${option.color}15`
                        : '#F3F4F6',
                    },
                  ]}
                >
                  <IconComponent size={32} color={option.color} />
                </View>
                <Text
                  style={[
                    styles.cardTitle,
                    !option.enabled && styles.cardTitleDisabled,
                  ]}
                >
                  {option.title}
                </Text>
                <Text
                  style={[
                    styles.cardSubtitle,
                    !option.enabled && styles.cardSubtitleDisabled,
                  ]}
                >
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
    padding: 18,
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 18,
    color: 'white',
    marginBottom: 4,
    fontFamily: 'GothamBlack',
  },
  subGreeting: {
    fontSize: 14,
    color: '#e3e3e3',
    fontFamily: 'GothamMedium',
    letterSpacing: -1,
  },
  gridContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'GothamBold',
    letterSpacing: -1,
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'left',
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
    padding: 16,
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
    letterSpacing: -1,
    color: '#1f2937',
    marginBottom: 8,
    fontFamily: 'GothamBold',
  },
  cardTitleDisabled: {
    color: '#9CA3AF',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'GothamMedium',
    letterSpacing: -1,
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
