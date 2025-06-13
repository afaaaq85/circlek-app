import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Star,
  Sparkles,
  Flame,
  LandPlot,
  DollarSign,
  Stars,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={styles.gradient}
      >
        {/* Hero image */}
        <Image
          source={require('@/assets/images/fuel-station.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Streamline your{'\n'}workflow with us.
            </Text>
            <Text style={styles.subtitle}>
              Let's make work feel effortless. {'\n'}Sign in to unlock your
              workspace.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#dc381f', '#c32148']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.loginButtonText}>Log in</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
    backgroundColor:"white"
  },
  heroSection: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  heroImage: {
    width: width,
    height: height * 0.55,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
   backgroundColor:"white"
  },
  contentSection: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
    zIndex: 2,

  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'GothamBold',
    color: '#1A1A1A',
    letterSpacing: -1,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'GothamMedium',
    color: '#666666',
    letterSpacing: -1,
    textAlign: 'center',
    lineHeight: 24,
  },
  loginButton: {
    borderRadius: 16,
    shadowColor: '#FF4500',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontFamily: 'GothamMedium',
    color: 'white',
    textAlign: 'center',
  },
});
