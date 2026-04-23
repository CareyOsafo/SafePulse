import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useSosStore } from '../store/sos';
import { useQuery } from '@tanstack/react-query';
import { citizenApi } from '../lib/api';
import { initSocket, onIncidentUpdate, disconnectSocket } from '../lib/socket';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SosActive'>;
  route: RouteProp<RootStackParamList, 'SosActive'>;
};

const STATUS_MESSAGES: Record<string, { title: string; subtitle: string }> = {
  pending: {
    title: 'Alert Sent',
    subtitle: 'Waiting for dispatcher...',
  },
  acknowledged: {
    title: 'Help Coming',
    subtitle: 'Dispatcher is assigning a unit',
  },
  dispatched: {
    title: 'Unit Assigned',
    subtitle: 'A response unit is being dispatched',
  },
  en_route: {
    title: 'On The Way',
    subtitle: 'Help is en route to your location',
  },
  on_scene: {
    title: 'Arrived',
    subtitle: 'Responders have arrived at your location',
  },
};

export function SosActiveScreen({ navigation, route }: Props) {
  const { incidentId } = route.params;
  const { incidentStatus, markSafe, cancelSos, updateStatus } = useSosStore();
  const [loading, setLoading] = useState<string | null>(null);

  // Poll for status updates
  const { data: incident } = useQuery({
    queryKey: ['incident', incidentId],
    queryFn: () => citizenApi.getIncident(incidentId),
    refetchInterval: 5000,
  });

  // Subscribe to real-time updates via WebSocket
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupSocket = async () => {
      try {
        await initSocket();
        unsubscribe = onIncidentUpdate(incidentId, (data) => {
          if (data.status) {
            updateStatus(data.status);
          }
        });
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
      }
    };

    setupSocket();

    return () => {
      unsubscribe?.();
    };
  }, [incidentId]);

  // Also poll as fallback
  useEffect(() => {
    if (incident?.status && incident.status !== incidentStatus) {
      updateStatus(incident.status);
    }
  }, [incident?.status]);

  const handleMarkSafe = () => {
    Alert.alert(
      "Mark as Safe",
      "Are you sure you're safe? This will close the emergency.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "I'm Safe",
          style: "destructive",
          onPress: async () => {
            setLoading('safe');
            await markSafe();
            navigation.replace('Home');
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Emergency",
      "Are you sure you want to cancel this emergency?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setLoading('cancel');
            await cancelSos();
            navigation.replace('Home');
          },
        },
      ]
    );
  };

  const status = incidentStatus || 'pending';
  const statusInfo = STATUS_MESSAGES[status] || STATUS_MESSAGES.pending;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Status indicator */}
        <View style={styles.pulseContainer}>
          <View style={[styles.pulse, styles.pulseOuter]} />
          <View style={[styles.pulse, styles.pulseMid]} />
          <View style={styles.pulseCenter}>
            <Text style={styles.pulseIcon}>📍</Text>
          </View>
        </View>

        <Text style={styles.statusTitle}>{statusInfo.title}</Text>
        <Text style={styles.statusSubtitle}>{statusInfo.subtitle}</Text>

        {/* Location tracking indicator */}
        <View style={styles.trackingBadge}>
          <View style={styles.trackingDot} />
          <Text style={styles.trackingText}>Location tracking active</Text>
        </View>

        {/* Unit info if assigned */}
        {incident?.unitCallSign && (
          <View style={styles.unitCard}>
            <Text style={styles.unitLabel}>Responding Unit</Text>
            <Text style={styles.unitName}>{incident.unitCallSign}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.safeButton}
            onPress={handleMarkSafe}
            disabled={loading !== null}
          >
            <Text style={styles.safeButtonText}>
              {loading === 'safe' ? 'Marking Safe...' : "I'M SAFE"}
            </Text>
          </TouchableOpacity>

          {status === 'pending' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading !== null}
            >
              <Text style={styles.cancelButtonText}>
                {loading === 'cancel' ? 'Cancelling...' : 'Cancel Emergency'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tracking token */}
        {incident?.trackingToken && (
          <Text style={styles.trackingId}>
            Tracking: {incident.trackingToken.substring(0, 8).toUpperCase()}
          </Text>
        )}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  pulseContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  pulse: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  pulseOuter: {
    width: 200,
    height: 200,
    opacity: 0.2,
  },
  pulseMid: {
    width: 150,
    height: 150,
    opacity: 0.4,
  },
  pulseCenter: {
    width: 100,
    height: 100,
    backgroundColor: '#3b82f6',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseIcon: {
    fontSize: 40,
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 24,
    textAlign: 'center',
  },
  trackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 8,
  },
  trackingText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  unitCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  unitLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  unitName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  actions: {
    width: '100%',
    marginTop: 20,
  },
  safeButton: {
    backgroundColor: '#22c55e',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  safeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#ef4444',
  },
  trackingId: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: '#475569',
    fontFamily: 'monospace',
  },
});
