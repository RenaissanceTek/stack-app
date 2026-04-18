import { Tabs } from 'expo-router';
import { colors } from '../../lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.ink,
        headerTitleStyle: { color: colors.ink },
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.line,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.sub,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="library" options={{ title: 'Library' }} />
      <Tabs.Screen name="log" options={{ title: 'Log' }} />
      <Tabs.Screen name="inventory" options={{ title: 'Inventory' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
    </Tabs>
  );
}
