import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { computeReconstitution, roundTo } from '../../lib/reconstitution';
import { colors, radii, spacing } from '../../lib/theme';

export default function Reconstitution() {
  const [vialMg, setVialMg] = useState('5');
  const [bacWaterMl, setBacWaterMl] = useState('2');
  const [doseMcg, setDoseMcg] = useState('250');

  const result = useMemo(() => {
    try {
      return computeReconstitution({
        vialMg: Number(vialMg),
        bacWaterMl: Number(bacWaterMl),
        doseMcg: Number(doseMcg),
      });
    } catch {
      return null;
    }
  }, [vialMg, bacWaterMl, doseMcg]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>Reconstitution</Text>
        <Text style={styles.sub}>
          Figure out how much to draw from a reconstituted vial.
        </Text>

        <Field label="Vial peptide (mg)">
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={vialMg}
            onChangeText={setVialMg}
          />
        </Field>

        <Field label="Bac water (ml)">
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={bacWaterMl}
            onChangeText={setBacWaterMl}
          />
        </Field>

        <Field label="Desired dose (mcg)">
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={doseMcg}
            onChangeText={setDoseMcg}
          />
        </Field>

        <View style={styles.result}>
          {result ? (
            <>
              <ResultRow
                label="Concentration"
                value={`${roundTo(result.concentrationMgPerMl, 4)} mg/ml`}
              />
              <ResultRow label="Volume to draw" value={`${roundTo(result.volumeMl, 4)} ml`} />
              <ResultRow label="U-100 units" value={`${roundTo(result.unitsU100, 2)} units`} />
              {result.doseExceedsVial && (
                <Text style={styles.warn}>
                  Warning: this dose exceeds the total peptide in the vial.
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.warn}>Enter valid positive numbers for all three fields.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Formula</Text>
          <Text style={styles.cardBody}>concentration = vialMg / bacWaterMl (mg/ml)</Text>
          <Text style={styles.cardBody}>volume = (doseMcg / 1000) / concentration (ml)</Text>
          <Text style={styles.cardBody}>units (U-100) = volume × 100</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Worked example</Text>
          <Text style={styles.cardBody}>
            5 mg + 2 ml water = 2.5 mg/ml. 250 mcg dose = 0.1 ml = 10 units on a U-100 insulin
            syringe.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  h1: { color: colors.ink, fontSize: 24, fontWeight: '700' },
  sub: { color: colors.sub, fontSize: 14 },
  label: { color: colors.sub, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: spacing.md,
    color: colors.ink,
    fontSize: 16,
  },
  result: {
    backgroundColor: '#042f2a',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultLabel: { color: colors.sub, fontSize: 13 },
  resultValue: { color: colors.accent, fontSize: 18, fontWeight: '700' },
  warn: { color: '#fbbf24', fontSize: 13 },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardTitle: { color: colors.ink, fontSize: 14, fontWeight: '600' },
  cardBody: { color: colors.sub, fontSize: 13, lineHeight: 20 },
});
