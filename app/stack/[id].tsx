import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SEED_STACKS } from '../../content/stacks';
import { setActiveStackId } from '../../lib/storage';
import { colors, radii, spacing } from '../../lib/theme';

export default function StackDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const stack = SEED_STACKS.find((s) => s.id === id);

  if (!stack) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.cardTitle}>Stack not found</Text>
          <Pressable style={[styles.btn, styles.secondary]} onPress={() => router.back()}>
            <Text style={styles.secondaryText}>Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  async function makeActive() {
    if (!stack) return;
    await setActiveStackId(stack.id);
    Alert.alert('Active stack updated', stack.name);
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.head}>
          <Text style={styles.h1}>{stack.name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{stack.goal}</Text>
          </View>
        </View>
        <Text style={styles.summary}>{stack.summary}</Text>

        <Section title="Peptides">
          <View style={styles.table}>
            <View style={[styles.tr, styles.trHead]}>
              <Text style={[styles.th, { flex: 2 }]}>Name</Text>
              <Text style={[styles.th, { flex: 2 }]}>Dose</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>Freq</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>Route</Text>
            </View>
            {stack.peptides.map((p) => (
              <View key={p.name} style={styles.tr}>
                <Text style={[styles.td, { flex: 2 }]}>{p.name}</Text>
                <Text style={[styles.td, { flex: 2 }]}>{p.doseRange}</Text>
                <Text style={[styles.td, { flex: 1.5 }]}>{p.frequency}</Text>
                <Text style={[styles.td, { flex: 1.5 }]}>{p.route}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Timeline">
          {stack.timelineWeeks.map((w) => (
            <View key={w.week} style={styles.timelineRow}>
              <View style={styles.weekBadge}>
                <Text style={styles.weekBadgeText}>W{w.week}</Text>
              </View>
              <Text style={styles.timelineNote}>{w.note}</Text>
            </View>
          ))}
        </Section>

        <Section title="Sources">
          {stack.sources.map((s, i) => (
            <Text key={i} style={styles.source}>
              · {s.label}
              {s.url ? ` (${s.url})` : ''}
            </Text>
          ))}
        </Section>

        <Pressable style={[styles.btn, styles.primary]} onPress={makeActive}>
          <Text style={styles.primaryText}>Make this my active stack</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  h1: { color: colors.ink, fontSize: 26, fontWeight: '700', flex: 1 },
  badge: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { color: colors.accent, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  summary: { color: colors.sub, fontSize: 15, lineHeight: 22 },
  section: { gap: spacing.sm },
  sectionTitle: {
    color: colors.sub,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.md,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  tr: { flexDirection: 'row', padding: spacing.sm, gap: spacing.sm, borderTopWidth: 1, borderColor: colors.line },
  trHead: { backgroundColor: colors.card, borderTopWidth: 0 },
  th: { color: colors.sub, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  td: { color: colors.ink, fontSize: 13 },
  timelineRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  weekBadge: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    minWidth: 48,
    alignItems: 'center',
  },
  weekBadgeText: { color: colors.accent, fontWeight: '700', fontSize: 12 },
  timelineNote: { color: colors.ink, fontSize: 14, flex: 1, lineHeight: 20 },
  source: { color: colors.sub, fontSize: 13 },
  btn: { borderRadius: radii.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.md },
  primary: { backgroundColor: colors.accent },
  primaryText: { color: '#042f2a', fontWeight: '700', fontSize: 16 },
  secondary: { borderWidth: 1, borderColor: colors.line },
  secondaryText: { color: colors.ink, fontWeight: '500' },
  cardTitle: { color: colors.ink, fontSize: 18, fontWeight: '600' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
});
