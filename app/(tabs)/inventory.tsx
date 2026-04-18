import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appendVial, getLogs, getVials } from '../../lib/storage';
import { colors, radii, spacing } from '../../lib/theme';
import { LogEntry, Vial } from '../../lib/types';

export default function Inventory() {
  const [vials, setVials] = useState<Vial[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ peptideName: '', totalMg: '', bacWaterMl: '', expiresAt: '' });

  const load = useCallback(async () => {
    const [v, l] = await Promise.all([getVials(), getLogs()]);
    setVials(v);
    setLogs(l);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const remaining = useMemo(() => {
    const byPeptide = new Map<string, number>();
    for (const log of logs) {
      const mg = log.unit === 'mg' ? log.doseAmount : log.doseAmount / 1000;
      byPeptide.set(log.peptideName, (byPeptide.get(log.peptideName) ?? 0) + mg);
    }
    return byPeptide;
  }, [logs]);

  async function submit() {
    const totalMg = Number(form.totalMg);
    const bacWaterMl = Number(form.bacWaterMl);
    if (!form.peptideName.trim()) return Alert.alert('Peptide name required');
    if (!Number.isFinite(totalMg) || totalMg <= 0) return Alert.alert('Total mg must be > 0');
    if (!Number.isFinite(bacWaterMl) || bacWaterMl <= 0) return Alert.alert('Bac water ml must be > 0');

    const vial: Vial = {
      id: `vial-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      peptideName: form.peptideName.trim(),
      totalMg,
      bacWaterMl,
      reconstitutedAt: new Date().toISOString(),
      expiresAt: form.expiresAt.trim() || undefined,
    };
    await appendVial(vial);
    setForm({ peptideName: '', totalMg: '', bacWaterMl: '', expiresAt: '' });
    setModalOpen(false);
    load();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.h1}>Inventory</Text>
          <Pressable style={styles.addBtn} onPress={() => setModalOpen(true)}>
            <Text style={styles.addBtnText}>+ Add vial</Text>
          </Pressable>
        </View>

        {vials.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No vials yet</Text>
            <Text style={styles.emptyBody}>Add one to start tracking.</Text>
          </View>
        ) : (
          vials.map((v) => {
            const usedMg = remaining.get(v.peptideName) ?? 0;
            const remainingMg = Math.max(0, v.totalMg - usedMg);
            return (
              <View key={v.id} style={styles.card}>
                <Text style={styles.cardTitle}>{v.peptideName}</Text>
                <View style={styles.statRow}>
                  <StatCell label="Total" value={`${v.totalMg} mg`} />
                  <StatCell label="Remaining" value={`${remainingMg.toFixed(2)} mg`} />
                  <StatCell label="Bac water" value={`${v.bacWaterMl} ml`} />
                </View>
                {v.expiresAt && <Text style={styles.meta}>Expires: {v.expiresAt}</Text>}
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal visible={modalOpen} animationType="slide" transparent onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modal}>
            <Text style={styles.h2}>Add vial</Text>
            <TextInput
              style={styles.input}
              placeholder="Peptide name"
              placeholderTextColor={colors.sub}
              value={form.peptideName}
              onChangeText={(t) => setForm({ ...form, peptideName: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Total mg"
              placeholderTextColor={colors.sub}
              keyboardType="decimal-pad"
              value={form.totalMg}
              onChangeText={(t) => setForm({ ...form, totalMg: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Bac water ml"
              placeholderTextColor={colors.sub}
              keyboardType="decimal-pad"
              value={form.bacWaterMl}
              onChangeText={(t) => setForm({ ...form, bacWaterMl: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Expires (YYYY-MM-DD, optional)"
              placeholderTextColor={colors.sub}
              value={form.expiresAt}
              onChangeText={(t) => setForm({ ...form, expiresAt: t })}
            />
            <View style={styles.modalActions}>
              <Pressable style={[styles.btn, styles.secondary]} onPress={() => setModalOpen(false)}>
                <Text style={styles.secondaryText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.primary]} onPress={submit}>
                <Text style={styles.primaryText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h1: { color: colors.ink, fontSize: 28, fontWeight: '700' },
  h2: { color: colors.ink, fontSize: 20, fontWeight: '700', marginBottom: spacing.sm },
  addBtn: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addBtnText: { color: colors.accent, fontWeight: '600' },
  empty: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: { color: colors.ink, fontSize: 16, fontWeight: '600' },
  emptyBody: { color: colors.sub, marginTop: spacing.xs },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: { color: colors.ink, fontSize: 17, fontWeight: '600' },
  statRow: { flexDirection: 'row', gap: spacing.md },
  statCell: { flex: 1 },
  statLabel: { color: colors.sub, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  statValue: { color: colors.ink, fontSize: 16, fontWeight: '600', marginTop: 2 },
  meta: { color: colors.sub, fontSize: 13 },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderTopWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: spacing.md,
    color: colors.ink,
    fontSize: 16,
  },
  modalActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  btn: { flex: 1, borderRadius: radii.md, padding: spacing.md, alignItems: 'center' },
  primary: { backgroundColor: colors.accent },
  primaryText: { color: '#042f2a', fontWeight: '700', fontSize: 16 },
  secondary: { borderWidth: 1, borderColor: colors.line },
  secondaryText: { color: colors.ink, fontWeight: '500' },
});
