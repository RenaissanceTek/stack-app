import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLogs } from '../lib/storage';
import { colors, radii, spacing } from '../lib/theme';
import { INJECTION_SITES, InjectionSite, LogEntry } from '../lib/types';

// Positioned as front-of-body layout (percentages of a 320x480 box).
const SITE_POS: Record<InjectionSite, { left: number; top: number }> = {
  'Delt L': { left: 22, top: 16 },
  'Delt R': { left: 62, top: 16 },
  'Abdomen L': { left: 34, top: 36 },
  'Abdomen R': { left: 50, top: 36 },
  'Glute L': { left: 30, top: 54 },
  'Glute R': { left: 54, top: 54 },
  'Thigh L': { left: 30, top: 72 },
  'Thigh R': { left: 54, top: 72 },
};

export default function Sites() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => setLogs(await getLogs()))();
    }, []),
  );

  const counts = useMemo(() => {
    const recent = [...logs]
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 10);
    const c: Record<string, number> = {};
    for (const l of recent) c[l.site] = (c[l.site] ?? 0) + 1;
    return c;
  }, [logs]);

  function color(count: number) {
    if (count === 0) return colors.line;
    if (count === 1) return '#0f766e';
    if (count === 2) return '#14b8a6';
    return '#fbbf24'; // saturated warning = rotate
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <Text style={styles.h1}>Injection sites</Text>
        <Text style={styles.sub}>Dots show count from your last 10 logs. Brighter = rotate.</Text>

        <View style={styles.body}>
          <View style={styles.torso} />
          <View style={styles.head} />
          <View style={[styles.arm, { left: '8%' }]} />
          <View style={[styles.arm, { right: '8%' }]} />
          <View style={[styles.leg, { left: '30%' }]} />
          <View style={[styles.leg, { left: '54%' }]} />

          {INJECTION_SITES.map((s) => {
            const pos = SITE_POS[s];
            const count = counts[s] ?? 0;
            return (
              <View
                key={s}
                style={[
                  styles.dot,
                  {
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    backgroundColor: color(count),
                    borderColor: count > 0 ? colors.ink : colors.line,
                  },
                ]}
              >
                <Text style={styles.dotLabel}>{count > 0 ? count : ''}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.legend}>
          {INJECTION_SITES.map((s) => (
            <View key={s} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: color(counts[s] ?? 0) }]} />
              <Text style={styles.legendLabel}>
                {s} · {counts[s] ?? 0}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg, gap: spacing.md, flex: 1 },
  h1: { color: colors.ink, fontSize: 24, fontWeight: '700' },
  sub: { color: colors.sub, fontSize: 13 },
  body: {
    width: 320,
    height: 480,
    alignSelf: 'center',
    position: 'relative',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
  },
  head: {
    position: 'absolute',
    left: '42%',
    top: '3%',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1f1f23',
    borderWidth: 1,
    borderColor: colors.line,
  },
  torso: {
    position: 'absolute',
    left: '25%',
    top: '14%',
    width: '50%',
    height: '38%',
    backgroundColor: '#1a1a1e',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
  },
  arm: {
    position: 'absolute',
    top: '15%',
    width: 24,
    height: '35%',
    backgroundColor: '#1a1a1e',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
  },
  leg: {
    position: 'absolute',
    top: '52%',
    width: 48,
    height: '42%',
    backgroundColor: '#1a1a1e',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
  },
  dot: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotLabel: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: '45%' },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendLabel: { color: colors.sub, fontSize: 12 },
});
