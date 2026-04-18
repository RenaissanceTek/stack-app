import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SEED_STACKS } from '../../content/stacks';
import { appendLog, getActiveStackId, getSettings } from '../../lib/storage';
import { colors, radii, spacing } from '../../lib/theme';
import { INJECTION_SITES, InjectionSite, LogEntry, Unit } from '../../lib/types';

export default function LogScreen() {
  const [peptideName, setPeptideName] = useState('');
  const [doseAmount, setDoseAmount] = useState('');
  const [unit, setUnit] = useState<Unit>('mcg');
  const [site, setSite] = useState<InjectionSite>('Abdomen L');
  const [datetime, setDatetime] = useState(() => new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [id, s] = await Promise.all([getActiveStackId(), getSettings()]);
        if (!active) return;
        setUnit(s.defaultUnit);
        if (id) {
          const stack = SEED_STACKS.find((x) => x.id === id);
          if (stack) setSuggestions(stack.peptides.map((p) => p.name));
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  async function submit() {
    const amt = Number(doseAmount);
    if (!peptideName.trim()) {
      Alert.alert('Peptide name required');
      return;
    }
    if (!Number.isFinite(amt) || amt <= 0) {
      Alert.alert('Enter a valid dose amount');
      return;
    }
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date(datetime).toISOString(),
      peptideName: peptideName.trim(),
      doseAmount: amt,
      unit,
      site,
      notes: notes.trim() || undefined,
    };
    await appendLog(entry);
    Alert.alert('Dose logged');
    setPeptideName('');
    setDoseAmount('');
    setNotes('');
    setDatetime(new Date().toISOString().slice(0, 16));
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>Log a dose</Text>

        <Field label="Peptide">
          <TextInput
            style={styles.input}
            placeholder="e.g. BPC-157"
            placeholderTextColor={colors.sub}
            value={peptideName}
            onChangeText={setPeptideName}
            autoCapitalize="none"
          />
          {suggestions.length > 0 && !peptideName && (
            <View style={styles.chips}>
              {suggestions.map((s) => (
                <Pressable key={s} style={styles.chip} onPress={() => setPeptideName(s)}>
                  <Text style={styles.chipText}>{s}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </Field>

        <Field label="Dose amount">
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="0"
              placeholderTextColor={colors.sub}
              keyboardType="decimal-pad"
              value={doseAmount}
              onChangeText={setDoseAmount}
            />
            <Pressable
              style={[styles.toggle, unit === 'mg' && styles.toggleActive]}
              onPress={() => setUnit('mg')}
            >
              <Text style={[styles.toggleText, unit === 'mg' && styles.toggleTextActive]}>mg</Text>
            </Pressable>
            <Pressable
              style={[styles.toggle, unit === 'mcg' && styles.toggleActive]}
              onPress={() => setUnit('mcg')}
            >
              <Text style={[styles.toggleText, unit === 'mcg' && styles.toggleTextActive]}>mcg</Text>
            </Pressable>
          </View>
        </Field>

        <Field label="Injection site">
          <View style={styles.chips}>
            {INJECTION_SITES.map((s) => (
              <Pressable
                key={s}
                style={[styles.chip, site === s && styles.chipActive]}
                onPress={() => setSite(s)}
              >
                <Text style={[styles.chipText, site === s && styles.chipTextActive]}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="When">
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DDTHH:mm"
            placeholderTextColor={colors.sub}
            value={datetime}
            onChangeText={setDatetime}
          />
          <Text style={styles.hint}>Defaults to now. Format: YYYY-MM-DDTHH:mm</Text>
        </Field>

        <Field label="Notes">
          <TextInput
            style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
            placeholder="Optional"
            placeholderTextColor={colors.sub}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </Field>

        <Pressable style={[styles.btn, styles.primary]} onPress={submit}>
          <Text style={styles.primaryText}>Save log</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  h1: { color: colors.ink, fontSize: 28, fontWeight: '700' },
  field: { gap: spacing.xs },
  label: { color: colors.sub, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: spacing.md,
    color: colors.ink,
    fontSize: 16,
  },
  hint: { color: colors.sub, fontSize: 12 },
  row: { flexDirection: 'row', gap: spacing.sm },
  toggle: {
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
  },
  toggleActive: { borderColor: colors.accent, backgroundColor: '#042f2a' },
  toggleText: { color: colors.sub, fontWeight: '500' },
  toggleTextActive: { color: colors.accent, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.sm,
    backgroundColor: colors.card,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: '#042f2a' },
  chipText: { color: colors.sub, fontSize: 13 },
  chipTextActive: { color: colors.accent, fontWeight: '600' },
  btn: {
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.accent },
  primaryText: { color: '#042f2a', fontWeight: '700', fontSize: 16 },
});
