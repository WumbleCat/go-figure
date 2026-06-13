import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import { FiguresProvider, useFigures } from '../context/FiguresContext';
import { StatsProvider, useStats } from '../context/StatsContext';
import { colors } from '../theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
  });

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FiguresProvider>
          <StatsProvider>
            <PreloadGate>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: colors.paper },
                  headerShadowVisible: false,
                  headerTintColor: colors.ink,
                  headerTitleStyle: {
                    fontFamily: 'CormorantGaramond_600SemiBold',
                    fontSize: 22,
                  },
                  contentStyle: { backgroundColor: colors.paper },
                }}
              >
                <Stack.Screen name="index" options={{ title: 'Figura' }} />
                <Stack.Screen name="play" options={{ title: 'Round' }} />
                <Stack.Screen name="stats" options={{ title: 'Stats' }} />
              </Stack>
            </PreloadGate>
          </StatsProvider>
        </FiguresProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function PreloadGate({ children }: { children: React.ReactNode }) {
  const { ready: figuresReady } = useFigures();
  const { ready: statsReady } = useStats();
  const ready = figuresReady && statsReady;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return <LoadingScreen />;
  return <>{children}</>;
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.paper, justifyContent: 'center' }}>
      <ActivityIndicator color={colors.gold} />
    </View>
  );
}
