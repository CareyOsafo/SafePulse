import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useQuery } from '@tanstack/react-query';
import { citizenApi } from '../lib/api';
import { useAuthStore } from '../store/auth';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const KYC_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  not_started: { label: 'Not Verified', color: '#64748b' },
  pending: { label: 'Pending', color: '#f59e0b' },
  verified: { label: 'Verified', color: '#22c55e' },
  failed: { label: 'Failed', color: '#ef4444' },
};

export function ProfileScreen({ navigation }: Props) {
  const signOut = useAuthStore((state) => state.signOut);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: citizenApi.getProfile,
  });

  const { data: kycStatus } = useQuery({
    queryKey: ['kycStatus'],
    queryFn: citizenApi.getKycStatus,
  });

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const kycInfo = KYC_STATUS_LABELS[kycStatus?.status || 'not_started'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.fullName?.[0] || '?'}
            </Text>
          </View>
          <Text style={styles.name}>{profile?.fullName || 'Add your name'}</Text>
          <Text style={styles.phone}>{profile?.phoneNumber}</Text>
        </View>

        {/* KYC Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity Verification</Text>
          <TouchableOpacity
            style={styles.kycCard}
            onPress={() => navigation.navigate('KycStart')}
          >
            <View>
              <Text style={styles.kycLabel}>Status</Text>
              <Text style={[styles.kycValue, { color: kycInfo.color }]}>
                {kycInfo.label}
              </Text>
            </View>
            {kycStatus?.ghanaCardLast4 && (
              <Text style={styles.cardLast4}>
                ****{kycStatus.ghanaCardLast4}
              </Text>
            )}
            {kycStatus?.status !== 'verified' && (
              <Text style={styles.verifyLink}>Verify →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Saved Places */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Places</Text>
          <View style={styles.placesCard}>
            <View style={styles.placeRow}>
              <Text style={styles.placeIcon}>🏠</Text>
              <View style={styles.placeInfo}>
                <Text style={styles.placeLabel}>Home</Text>
                <Text style={styles.placeValue}>
                  {profile?.savedPlaces?.home
                    ? profile.savedPlaces.home.address || 'Location saved'
                    : 'Not set'}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.placeRow}>
              <Text style={styles.placeIcon}>💼</Text>
              <View style={styles.placeInfo}>
                <Text style={styles.placeLabel}>Work</Text>
                <Text style={styles.placeValue}>
                  {profile?.savedPlaces?.work
                    ? profile.savedPlaces.work.address || 'Location saved'
                    : 'Not set'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => navigation.navigate('Contacts')}
          >
            <Text style={styles.linkText}>Emergency Contacts</Text>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>SafePulse v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#94a3b8',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  kycCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kycLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  kycValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardLast4: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  verifyLink: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  placesCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  placeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  placeValue: {
    fontSize: 12,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#0f172a',
  },
  linkItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#fff',
  },
  linkArrow: {
    fontSize: 16,
    color: '#64748b',
  },
  signOutBtn: {
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  signOutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 12,
    marginTop: 24,
  },
});
