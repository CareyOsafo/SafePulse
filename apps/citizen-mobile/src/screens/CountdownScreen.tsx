import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useSosStore } from '../store/sos';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Countdown'>;
  route: RouteProp<RootStackParamList, 'Countdown'>;
};

const COUNTDOWN_SECONDS = 5;

const EMERGENCY_COLORS: Record<string, string> = {
  medical: '#ef4444',
  fire: '#f97316',
  safety: '#8b5cf6',
  security: '#3b82f6',
};

export function CountdownScreen({ navigation, route }: Props) {
  const { emergencyType } = route.params;
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [loading, setLoading] = useState(false);
  const startSos = useSosStore((state) => state.startSos);

  useEffect(() => {
    // Vibrate pattern
    Vibration.vibrate([0, 200, 100, 200]);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerSos();
          return 0;
        }
        Vibration.vibrate(100);
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      Vibration.cancel();
    };
  }, []);

  const triggerSos = async () => {
    setLoading(true);
    try {
      const { incidentId } = await startSos(emergencyType);
      navigation.replace('SosActive', { incidentId });
    } catch (error) {
      console.error('Failed to trigger SOS:', error);
      navigation.goBack();
    }
  };

  const handleCancel = () => {
    Vibration.cancel();
    navigation.goBack();
  };

  const color = EMERGENCY_COLORS[emergencyType] || '#3b82f6';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color }]}>
      <View style={styles.content}>
        <Text style={styles.label}>SENDING ALERT IN</Text>

        <View style={styles.countdownContainer}>
          <Text style={styles.countdown}>{countdown}</Text>
        </View>

        <Text style={styles.type}>{emergencyType.toUpperCase()}</Text>
        <Text style={styles.subtitle}>Emergency</Text>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          disabled={loading}
        >
          <Text style={styles.cancelText}>
            {loading ? 'Sending...' : 'TAP TO CANCEL'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  countdownContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  countdown: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#fff',
  },
  type: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 60,
  },
  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 40,
  },
  cancelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
