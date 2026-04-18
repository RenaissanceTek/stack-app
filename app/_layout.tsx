import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getOnboarded } from '../lib/storage';
import { colors } from '../lib/theme';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const onboarded = await getOnboarded();
      if (!active) return;
      if (!onboarded) {
        router.replace('/onboarding');
      }
      setReady(true);
    })();
    return () => {
      active = false;
    };
    // Run once on mount; segments changes shouldn't re-trigger the redirect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.ink,
          headerTitleStyle: { color: colors.ink },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="stack/[id]" options={{ title: 'Stack' }} />
        <Stack.Screen name="sites" options={{ title: 'Injection sites' }} />
        <Stack.Screen name="tools/reconstitution" options={{ title: 'Reconstitution' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
