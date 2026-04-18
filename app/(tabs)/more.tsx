import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing } from '../../lib/theme';

export default function More() {
  const router = useRouter();

  const items: { label: string; sub: string; href: string }[] = [
    { label: 'Injection sites', sub: 'See where recent doses have gone', href: '/sites' },
    { label: 'Reconstitution calculator', sub: 'Vial mg + water ml → volume + units', href: '/tools/reconstitution' },
    { label: 'Settings', sub: 'Units, theme, export, reset', href: '/settings' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.h1}>More</Text>
        {items.map((it) => (
          <Pressable key={it.href} style={styles.row} onPress={() => router.push(it.href as never)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{it.label}</Text>
              <Text style={styles.sub}>{it.sub}</Text>
            </View>
            <Text style={styles.chev}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg, gap: spacing.sm },
  h1: { color: colors.ink, fontSize: 28, fontWeight: '700', marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  label: { color: colors.ink, fontSize: 16, fontWeight: '600' },
  sub: { color: colors.sub, fontSize: 13, marginTop: 2 },
  chev: { color: colors.accent, fontSize: 24 },
});
