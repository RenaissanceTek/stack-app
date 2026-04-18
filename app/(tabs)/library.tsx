import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SEED_STACKS, SeedStack } from '../../content/stacks';
import { colors, radii, spacing } from '../../lib/theme';

export default function Library() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.h1}>Protocol library</Text>
        <Text style={styles.sub}>Seeded reference stacks. Pick one to see the detail.</Text>
      </View>
      <FlatList
        data={SEED_STACKS}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <StackCard stack={item} onPress={() => router.push(`/stack/${item.id}`)} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
    </SafeAreaView>
  );
}

function StackCard({ stack, onPress }: { stack: SeedStack; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHead}>
        <Text style={styles.cardTitle}>{stack.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{stack.goal}</Text>
        </View>
      </View>
      <Text style={styles.cardBody}>{stack.summary}</Text>
      <Text style={styles.chev}>View detail ›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  h1: { color: colors.ink, fontSize: 28, fontWeight: '700' },
  sub: { color: colors.sub, fontSize: 14, marginTop: spacing.xs },
  list: { padding: spacing.lg, paddingTop: spacing.sm },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: colors.ink, fontSize: 17, fontWeight: '600', flex: 1, paddingRight: spacing.sm },
  badge: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { color: colors.accent, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  cardBody: { color: colors.sub, fontSize: 14, lineHeight: 20 },
  chev: { color: colors.accent, fontSize: 14, fontWeight: '500' },
});
