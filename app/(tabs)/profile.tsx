import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, LogOut, Settings, Bell, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleMenuPress = (menu: string) => {
    Alert.alert('Coming Soon', `${menu} feature is coming soon!`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <User size={32} color="#ffffff" />
          </View>
          <Text style={styles.email}>{user?.username}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuPress('Settings')}
          >
            <View style={styles.menuLeft}>
              <Settings size={24} color="#6b7280" />
              <Text style={styles.menuText}>Settings</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuPress('Notifications')}
          >
            <View style={styles.menuLeft}>
              <Bell size={24} color="#6b7280" />
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuPress('Privacy')}
          >
            <View style={styles.menuLeft}>
              <Shield size={24} color="#6b7280" />
              <Text style={styles.menuText}>Privacy & Security</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#ffffff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  profileSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#DC2626',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent:"space-between",
  },
  menuSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 16,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 24,
    color: '#d1d5db',
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});