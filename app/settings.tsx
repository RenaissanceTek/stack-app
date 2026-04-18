import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { exportAll, getSettings, resetAll, setSettings } from '../lib/storage';
import { colors, radii, spacing } from '../lib/theme';
import { DEFAULT_SETTINGS, Settings, Unit } from '../lib/types';

export default function SettingsScreen() {
  const [settings, setLocal] = useState<Settings>(DEFAULT_SETTINGS);

  useFocusEffect(
    useCallback(() => {
      (async () => setLocal(await getSettings()))();
    }, []),
  );

  async function update(partial: Partial<Settings>) {
    const next = { ...settings, ...partial };
    setLocal(next);
    await setSettings(next);
  }

  async function exportData() {
    const json = await exportAll();
    if (Platform.OS === 'web') {
      // On web, fall back to a download.
      try {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stack-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        Alert.alert('Export failed');
      }
      return;
    }
    try {
      const path = `${FileSystem.cacheDirectory}stack-export-${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(path, json);
      const can = await Sharing.isAvailableAsync();
      if (can) {
        await Sharing.shareAsync(path);
      } else {
        Alert.alert('Exported', path);
      }
    } catch {
      Alert.alert('Export failed');
    }
  }

  function confirmReset() {
    Alert.alert(
      'Reset all data?',
      'This clears your active stack, logs, vials, and settings. Cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetAll();
            setLocal(DEFAULT_SETTINGS);
            Alert.alert('Reset complete');
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Default unit</Text>
          <View style={styles.row}>
            {(['mg', 'mcg'] as Unit[]).map((u) => (
              <Pressable
                key={u}
                style={[styles.toggle, settings.defaultUnit === u && styles.toggleActive]}
                onPress={() => update({ defaultUnit: u })}
              >
                <Text
                  style={[
                    styles.toggleText,
                    settings.defaultUnit === u && styles.toggleTextActive,
                  ]}
                >
                  {u}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Theme</Text>
          <View style={styles.row}>
            {(['dark', 'light'] as const).map((t) => (
              <Pressable
                key={t}
                style={[styles.toggle, settings.theme === t && styles.toggleActive]}
                onPress={() => update({ theme: t })}
              >
                <Text
                  style={[styles.toggleText, settings.theme === t && styles.toggleTextActive]}
                >
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.hint}>Dark is the only rendered theme in v1.</Text>
        </View>

        <View style={styles.section}>
          <Pressable style={[styles.btn, styles.secondary]} onPress={exportData}>
            <Text style={styles.secondaryText}>Export data</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.danger]} onPress={confirmReset}>
            <Text style={styles.dangerText}>Reset all data</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg, gap: spacing.lg },
  h1: { color: colors.ink, fontSize: 24, fontWeight: '700' },
  section: { gap: spacing.sm },
  label: { color: colors.sub, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  row: { flexDirection: 'row', gap: spacing.sm },
  toggle: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  toggleActive: { borderColor: colors.accent, backgroundColor: '#042f2a' },
  toggleText: { color: colors.sub, fontWeight: '500' },
  toggleTextActive: { color: colors.accent, fontWeight: '700' },
  hint: { color: colors.sub, fontSize: 12 },
  btn: { borderRadius: radii.md, padding: spacing.md, alignItems: 'center' },
  secondary: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card },
  secondaryText: { color: colors.ink, fontWeight: '600' },
  danger: { borderWidth: 1, borderColor: colors.danger, backgroundColor: 'transparent' },
  dangerText: { color: colors.danger, fontWeight: '600' },
});
