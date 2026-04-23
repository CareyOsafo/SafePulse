import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { citizenApi } from '../lib/api';
import * as WebBrowser from 'expo-web-browser';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'KycStart'>;
};

export function KycStartScreen({ navigation }: Props) {
  const [ghanaCard, setGhanaCard] = useState('');
  const [loading, setLoading] = useState(false);

  const formatGhanaCard = (value: string) => {
    // Remove non-alphanumeric chars
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Format as GHA-XXXXXXXXX-X
    if (clean.length <= 3) return clean;
    if (clean.length <= 12) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
    return `${clean.slice(0, 3)}-${clean.slice(3, 12)}-${clean.slice(12, 13)}`;
  };

  const handleStart = async () => {
    // Validate format
    if (!/^GHA-[0-9]{9}-[0-9]$/.test(ghanaCard)) {
      Alert.alert('Invalid Format', 'Please enter a valid Ghana Card number (GHA-XXXXXXXXX-X)');
      return;
    }

    setLoading(true);

    try {
      const result = await citizenApi.startKyc(ghanaCard);

      // Handle different verification outcomes
      if (result.status === 'verified') {
        Alert.alert(
          'Verification Successful',
          'Your Ghana Card has been verified successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }

      if (result.status === 'failed') {
        Alert.alert(
          'Verification Failed',
          result.message || 'Ghana Card verification failed. Please check your card number and try again.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Verification in progress
      if (result.verificationUrl) {
        // Open verification in browser for interactive flow
        await WebBrowser.openBrowserAsync(result.verificationUrl);
      }

      Alert.alert(
        'Verification Started',
        result.message || 'Your verification is in progress. You will be notified when complete.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Identity</Text>
          <Text style={styles.subtitle}>
            Enter your Ghana Card number to verify your identity. This helps us
            respond faster in emergencies.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Ghana Card Number</Text>
          <TextInput
            style={styles.input}
            value={ghanaCard}
            onChangeText={(v) => setGhanaCard(formatGhanaCard(v))}
            placeholder="GHA-123456789-0"
            placeholderTextColor="#64748b"
            autoCapitalize="characters"
            maxLength={15}
          />
          <Text style={styles.hint}>Format: GHA-XXXXXXXXX-X</Text>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleStart}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Starting...' : 'Start Verification'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>Why verify?</Text>
          <Text style={styles.infoText}>
            • Faster emergency response{'\n'}
            • Trusted caller status{'\n'}
            • Priority dispatch{'\n'}
            • Your card details are securely stored
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  back: {
    marginBottom: 24,
  },
  backText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
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
    lineHeight: 24,
  },
});
