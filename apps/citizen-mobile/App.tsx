import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuthStore } from './src/store/auth';
import { AuthPhoneScreen } from './src/screens/AuthPhoneScreen';
import { AuthVerifyScreen } from './src/screens/AuthVerifyScreen';
import { KycStartScreen } from './src/screens/KycStartScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { CountdownScreen } from './src/screens/CountdownScreen';
import { SosActiveScreen } from './src/screens/SosActiveScreen';
import { ContactsScreen } from './src/screens/ContactsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

export type RootStackParamList = {
  AuthPhone: undefined;
  AuthVerify: { phone: string };
  KycStart: undefined;
  Home: undefined;
  Countdown: { emergencyType: string };
  SosActive: { incidentId: string };
  Contacts: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0f172a',
    card: '#1e293b',
    border: '#334155',
  },
};

export default function App() {
  const { session, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (loading) {
    return null; // Or a splash screen
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer theme={MyTheme}>
          <StatusBar style="light" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            {!session ? (
              <>
                <Stack.Screen name="AuthPhone" component={AuthPhoneScreen} />
                <Stack.Screen name="AuthVerify" component={AuthVerifyScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="KycStart" component={KycStartScreen} />
                <Stack.Screen
                  name="Countdown"
                  component={CountdownScreen}
                  options={{ gestureEnabled: false }}
                />
                <Stack.Screen
                  name="SosActive"
                  component={SosActiveScreen}
                  options={{ gestureEnabled: false }}
                />
                <Stack.Screen name="Contacts" component={ContactsScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
