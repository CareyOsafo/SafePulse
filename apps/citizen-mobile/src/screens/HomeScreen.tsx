import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useQuery } from '@tanstack/react-query';
import { citizenApi } from '../lib/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const EMERGENCY_TYPES = [
  { id: 'medical', label: 'Medical', color: '#ef4444', icon: '🏥' },
  { id: 'fire', label: 'Fire', color: '#f97316', icon: '🔥' },
  { id: 'safety', label: 'Safety', color: '#8b5cf6', icon: '🛡️' },
  { id: 'security', label: 'Security', color: '#3b82f6', icon: '🚨' },
];

export function HomeScreen({ navigation }: Props) {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: citizenApi.getProfile,
  });

  const handleEmergency = (type: string) => {
    // Check KYC status
    if (profile?.kycStatus === 'failed') {
      navigation.navigate('KycStart');
      return;
    }

    navigation.navigate('Countdown', { emergencyType: type });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {profile?.fullName?.split(' ')[0] || 'there'}
            </Text>
            <Text style={styles.subtitle}>What's your emergency?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileInitial}>
              {profile?.fullName?.[0] || '?'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* KYC Banner */}
        {profile?.kycStatus === 'not_started' && (
          <TouchableOpacity
            style={styles.kycBanner}
            onPress={() => navigation.navigate('KycStart')}
          >
            <Text style={styles.kycBannerText}>
              Verify your identity for faster response
            </Text>
            <Text style={styles.kycBannerAction}>Verify Now →</Text>
          </TouchableOpacity>
        )}

        {/* Emergency Buttons */}
        <View style={styles.emergencyGrid}>
          {EMERGENCY_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[styles.emergencyButton, { backgroundColor: type.color }]}
              onPress={() => handleEmergency(type.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.emergencyIcon}>{type.icon}</Text>
              <Text style={styles.emergencyLabel}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Contacts')}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionLabel}>Emergency Contacts</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>In an emergency:</Text>
          <Text style={styles.infoText}>
            1. Tap the emergency type{'\n'}
            2. Wait 5 seconds (or cancel){'\n'}
            3. Your location is shared automatically{'\n'}
            4. Help is dispatched to you
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  kycBanner: {
    backgroundColor: '#1e3a5f',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  kycBannerText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  kycBannerAction: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '600',
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  emergencyButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emergencyLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  quickActions: {
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionLabel: {
    fontSize: 16,
    color: '#fff',
  },
  infoCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
  },
});
