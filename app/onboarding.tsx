import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setOnboarded } from '../lib/storage';
import { colors, radii, spacing } from '../lib/theme';

export default function Onboarding() {
  const router = useRouter();

  async function acknowledge() {
    await setOnboarded(true);
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.title}>Stack</Text>
          <Text style={styles.subtitle}>Peptide protocols, tracked properly.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Before you start</Text>
          <Text style={styles.cardBody}>
            For educational and tracking use. Not medical advice. Consult a licensed provider
            before starting any protocol.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.btn, styles.primary]} onPress={acknowledge}>
            <Text style={styles.primaryText}>I understand — continue</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.secondary]} onPress={acknowledge}>
            <Text style={styles.secondaryText}>Learn more</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.lg, justifyContent: 'space-between' },
  top: { marginTop: spacing.xl },
  title: { color: colors.ink, fontSize: 48, fontWeight: '700', letterSpacing: -1 },
  subtitle: { color: colors.sub, fontSize: 18, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  cardTitle: { color: colors.ink, fontSize: 16, fontWeight: '600', marginBottom: spacing.sm },
  cardBody: { color: colors.sub, fontSize: 15, lineHeight: 22 },
  actions: { gap: spacing.sm },
  btn: {
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.accent },
  primaryText: { color: '#042f2a', fontWeight: '700', fontSize: 16 },
  secondary: { borderWidth: 1, borderColor: colors.line, backgroundColor: 'transparent' },
  secondaryText: { color: colors.ink, fontWeight: '500', fontSize: 15 },
});
