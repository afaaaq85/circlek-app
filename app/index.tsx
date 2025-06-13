import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useFonts } from 'expo-font';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

   const [fontsLoaded] = useFonts({
    'GothamLight': require('@/assets/fonts/gothamssm_light.otf'),
    'GothamMedium': require('@/assets/fonts/gothamssm_medium.otf'),
    'GothamBold': require('@/assets/fonts/gothamssm_bold.otf'),
    'GothamBlack': require('@/assets/fonts/gothamssm_black.otf'),
  });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#DC2626',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
  // if (!fontsLoaded) {
  //   return null; // or a loading spinner
  // }
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/getStarted');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
         <View style={{ width: 200, overflow: 'hidden' }}>
                  <Image
                    source={require('@/assets/images/circlek.png')}
                    style={{ width: 200, height: 80 }}
                    resizeMode="contain"
                  />
                </View>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.subText}>Pipelines made easy</Text>
      </View>
    </View>
  );
}

