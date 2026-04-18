import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SEED_STACKS, SeedStack } from '../../content/stacks';
import { getActiveStackId, getLogs } from '../../lib/storage';
import { computeStreak } from '../../lib/streak';
import { colors, radii, spacing } from '../../lib/theme';
import { LogEntry } from '../../lib/types';

export default function Home() {
  const router = useRouter();
  const [activeStack, setActiveStack] = useState<SeedStack | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const id = await getActiveStackId();
        const found = id ? SEED_STACKS.find((s) => s.id === id) ?? null : null;
        const allLogs = await getLogs();
        if (!active) return;
        setActiveStack(found);
        setLogs(allLogs);
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const streak = computeStreak(logs);
  const recent = [...logs].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 5);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>Home</Text>

        {!activeStack ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No active stack</Text>
            <Text style={styles.cardBody}>Browse the library and pick one to get started.</Text>
            <Pressable
              style={[styles.btn, styles.primary]}
              onPress={() => router.push('/(tabs)/library')}
            >
              <Text style={styles.primaryText}>Browse library</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.kicker}>Active stack</Text>
              <Text style={styles.cardTitle}>{activeStack.name}</Text>
              <Text style={styles.cardBody}>{activeStack.summary}</Text>
            </View>

            <View style={styles.row}>
              <View style={[styles.stat, { flex: 1 }]}>
                <Text style={styles.statLabel}>Streak</Text>
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statUnit}>days</Text>
              </View>
              <View style={[styles.stat, { flex: 1 }]}>
                <Text style={styles.statLabel}>Logs</Text>
                <Text style={styles.statValue}>{logs.length}</Text>
                <Text style={styles.statUnit}>total</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Today&apos;s schedule</Text>
              {activeStack.peptides.map((p) => (
                <View key={p.name} style={styles.scheduleRow}>
                  <Text style={styles.peptideName}>{p.name}</Text>
                  <Text style={styles.peptideMeta}>
                    {p.doseRange} · {p.frequency}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recent logs</Text>
              {recent.length === 0 ? (
                <Text style={styles.cardBody}>No logs yet.</Text>
              ) : (
                recent.map((l) => (
                  <View key={l.id} style={styles.scheduleRow}>
                    <Text style={styles.peptideName}>{l.peptideName}</Text>
                    <Text style={styles.peptideMeta}>
                      {l.doseAmount} {l.unit} · {l.site} · {new Date(l.timestamp).toLocaleString()}
                    </Text>
                  </View>
                ))
              )}
            </View>

            <Pressable
              style={[styles.btn, styles.primary]}
              onPress={() => router.push('/(tabs)/log')}
            >
              <Text style={styles.primaryText}>Log a dose</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  h1: { color: colors.ink, fontSize: 28, fontWeight: '700' },
  kicker: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: { color: colors.ink, fontSize: 18, fontWeight: '600' },
  cardBody: { color: colors.sub, fontSize: 14, lineHeight: 20 },
  row: { flexDirection: 'row', gap: spacing.sm },
  stat: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  statLabel: { color: colors.sub, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  statValue: { color: colors.ink, fontSize: 32, fontWeight: '700', marginTop: spacing.xs },
  statUnit: { color: colors.sub, fontSize: 12 },
  scheduleRow: { paddingVertical: spacing.xs },
  peptideName: { color: colors.ink, fontSize: 15, fontWeight: '500' },
  peptideMeta: { color: colors.sub, fontSize: 13, marginTop: 2 },
  btn: {
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.accent },
  primaryText: { color: '#042f2a', fontWeight: '700', fontSize: 16 },
});
