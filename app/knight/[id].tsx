import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useKnights } from '@/store/knights';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import Stepper from '@/components/Stepper';
import SwitchRow from '@/components/SwitchRow';
import TextRow from '@/components/TextRow';

/**
 * Simple header bar with safe touch targets
 */
function HeaderBar({ title, onBack, onDelete }: {
    title: string; onBack: () => void; onDelete: () => void
}) {
    const { tokens } = useThemeTokens();
    return (
        <View style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: tokens.surface,
            borderBottomWidth: 1,
            borderColor: '#0006',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <Pressable onPress={onBack} style={{ paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, backgroundColor: tokens.card }}>
                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Back</Text>
            </Pressable>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800' }} numberOfLines={1}>{title}</Text>
            <Pressable onPress={onDelete} style={{ paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#2A1313', borderWidth: 1, borderColor: '#0006' }}>
                <Text style={{ color: '#F9DADA', fontWeight: '800' }}>Delete</Text>
            </Pressable>
        </View>
    );
}

// Helper component for checkbox-style vices/banes rows (enhanced UI)
function BaneRow({
  label,
  subtitle,
  value,
  onChange
}: {
  label: string;
  subtitle?: string;
  value: 0|1|2|3|4;
  onChange: (v: 0|1|2|3|4) => void;
}){
  const { tokens } = useThemeTokens();
  // 4 clickable dot chips representing ticks (tap to set, tap again to lower, long-press to clear)
  return (
    <View style={{ marginBottom: 12 }}>
      {/* Header row: label + count pill */}
      <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
        <View>
          <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>{label}</Text>
          {subtitle ? (
            <Text style={{ color: tokens.textMuted, marginTop: 2, fontSize: 12 }}>{subtitle}</Text>
          ) : null}
        </View>
        <View style={{
          minWidth: 44, height: 28, paddingHorizontal: 10, borderRadius: 14,
          alignItems:'center', justifyContent:'center',
          backgroundColor: tokens.surface, borderWidth: 1, borderColor:'#0006'
        }}>
          <Text style={{ color: tokens.textPrimary, fontWeight:'800' }}>{value}/4</Text>
        </View>
      </View>

      {/* Dot chips */}
      <View style={{ flexDirection:'row', gap:10, marginTop: 10 }}>
        {Array.from({length:4}, (_,i)=> i).map((i)=>{
          const active = value > i; // if value >= i+1 the dot is active
          return (
            <Pressable
              key={i}
              onPress={()=>{
                const next = (value === (i+1) ? i : (i+1)) as 0|1|2|3|4;
                onChange(next);
              }}
              onLongPress={()=> onChange(0)}
              style={{
                width:22, height:22, borderRadius:11,
                alignItems:'center', justifyContent:'center',
                backgroundColor: active ? tokens.accent : 'transparent',
                borderWidth: active ? 0 : 2,
                borderColor: '#0008'
              }}
              hitSlop={8}
            >
              {/* empty content – purely visual dot */}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Choice Matrix keys
const MATRIX_KEYS_NUM = Array.from({ length: 30 }, (_, i) => String(i + 1));
const MATRIX_KEYS_E = Array.from({ length: 10 }, (_, i) => `E${i + 1}`);

export default function KnightDetail() {
    // Inline “modal” state for the condensed investigations editor
    const [invModal, setInvModal] = React.useState<{
        open: boolean;
        chapterIndex: number;
        slot: number;
        code: string;
        result: 'pass' | 'fail';
    }>({ open: false, chapterIndex: 0, slot: 0, code: '', result: 'pass' });

    const { id } = useLocalSearchParams<{ id: string }>();
    const { tokens } = useThemeTokens();
    const router = useRouter();

    const {
        knightsById,
        updateKnightSheet,
        removeKnight,
        renameKnight,
        toggleChoiceMatrix,
        addInvestigationAttempt,
        toggleInvestigationCompleted,
        setInvestigations
    } = useKnights();

    const k = id ? knightsById[id] : undefined;

    if (!k) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                <Text style={{ color: tokens.textPrimary, fontWeight: '800', fontSize: 18 }}>Knight not found</Text>
                <Pressable onPress={() => router.back()} style={{ marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: tokens.accent }}>
                    <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Go back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    const onBack = () => router.back();
    const onDelete = () => {
        removeKnight(k.knightUID);
        router.replace('/(tabs)/knights');
    };

    const sheet = k.sheet;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
            <HeaderBar title={k.name} onBack={onBack} onDelete={onDelete} />

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Editable name */}
                <Card style={{ marginBottom: 12 }}>
                    <Text style={{ color: tokens.textPrimary, fontSize: 18, fontWeight: '800', marginBottom: 8 }}>Identity</Text>
                    <TextRow
                        label="Name"
                        value={k.name}
                        onChangeText={(t) => renameKnight(k.knightUID, t)} // store now accepts empty string (then you can retype)
                        placeholder="Knight name"
                    />
                    <Text style={{ color: tokens.textMuted, marginTop: 8 }}>Catalog: {k.catalogId}</Text>
                </Card>

                {/* Counters */}
                <Card style={{ marginBottom: 12 }}>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Counters</Text>
                    <Stepper label="Gold" value={sheet.gold} onChange={(v) => updateKnightSheet(k.knightUID, { gold: v })} min={0} />
                    <Stepper label="Leads" value={sheet.leads} onChange={(v) => updateKnightSheet(k.knightUID, { leads: v })} min={0} />
                    <Stepper label="Bane" value={sheet.bane} onChange={(v) => updateKnightSheet(k.knightUID, { bane: v })} min={0} />
                    <Stepper label="Chapter" value={sheet.chapter} onChange={(v) => updateKnightSheet(k.knightUID, { chapter: v })} min={0} max={5} />
                    <SwitchRow label="Sigh of Graal" value={sheet.sighOfGraal === 1} onValueChange={(on) => updateKnightSheet(k.knightUID, { sighOfGraal: on ? 1 : 0 })} />
                </Card>

                {/* Phases */}
                <Card style={{ marginBottom: 12 }}>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Phases</Text>
                    <SwitchRow label="Prologue complete" value={sheet.prologueDone} onValueChange={(v) => updateKnightSheet(k.knightUID, { prologueDone: v })} />
                    <SwitchRow label="Postgame complete" value={sheet.postgameDone} onValueChange={(v) => updateKnightSheet(k.knightUID, { postgameDone: v })} />
                </Card>

                {/* Chapter Quest & Investigations (condensed) */}
                <Card style={{ marginBottom: 12 }}>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Chapter Quest &amp; Investigations</Text>
                    <TextRow
                        label="Chapter Quest"
                        value={sheet.chapterQuest ?? ''}
                        onChangeText={(t) => updateKnightSheet(k.knightUID, { chapterQuest: t })}
                        placeholder="Notes about this chapter's quest"
                    />

                    <View style={{ height: 12 }} />

                    {[0, 1, 2, 3, 4].map((ci) => {
                        const chapterNum = ci + 1;
                        const inv = sheet.investigations?.[ci] ?? { attempts: [], completed: [] };
                        const codes = Array.from({ length: 5 }, (_, i) => `I${chapterNum}-${i + 1}`);
                        const availableCodes = codes.filter(c => !inv.completed.includes(c)); // hide completed codes in the editor
                        const attempts = inv.attempts.slice(0, 6); // show first 6 attempts (oldest-first)

                        return (
                            <View key={`ch-${ci}`} style={{ marginBottom: 14 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <Text style={{ color: tokens.textMuted, fontWeight: '700' }}>Chapter {chapterNum}</Text>
                                    {inv.completed.length ? (
                                        <Text style={{ color: tokens.textMuted }}>Completed: {inv.completed.join(', ')}</Text>
                                    ) : null}
                                </View>

                                {/* Six slots — label shows attempt code when present, otherwise slot # */}
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {Array.from({ length: 6 }, (_, slot) => {
                                        const attempt = attempts[slot];
                                        const has = !!attempt;
                                        const res = has ? attempt.result : undefined;
                                        const bg = !has ? tokens.surface : (res === 'pass' ? '#29d398' : '#e05661');
                                        const fg = !has ? tokens.textPrimary : '#0B0B0B';
                                        const label = has ? attempt.code : `${slot + 1}`;
                                        return (
                                            <Pressable
                                                key={`slot-${slot}`}
                                                onPress={() => {
                                                    setInvModal({
                                                        open: true,
                                                        chapterIndex: ci,
                                                        slot,
                                                        code: has ? attempt.code : (availableCodes[0] || ''), // default to first available code, or none
                                                        result: has ? (attempt.result as 'pass' | 'fail') : 'pass'
                                                    });
                                                }}
                                                style={{
                                                    minWidth: 64, height: 36, borderRadius: 8,
                                                    paddingHorizontal: 8,
                                                    alignItems: 'center', justifyContent: 'center',
                                                    backgroundColor: bg, borderWidth: 1, borderColor: '#0006'
                                                }}
                                            >
                                                <Text style={{ color: fg, fontWeight: '800', fontSize: 12 }} numberOfLines={1}>{label}</Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>

                                {/* Inline “modal” editor — appears under the chapter you tapped */}
                                {invModal.open && invModal.chapterIndex === ci ? (
                                    <View style={{
                                        marginTop: 10, padding: 12, borderRadius: 12,
                                        backgroundColor: tokens.surface, borderWidth: 1, borderColor: '#0006'
                                    }}>
                                        <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                                            Log attempt – Chapter {ci + 1}
                                        </Text>

                                        {/* If all codes are done, explain and disable actions */}
                                        {availableCodes.length === 0 ? (
                                            <Text style={{ color: tokens.textMuted, marginBottom: 12 }}>
                                                All investigations for Chapter {ci + 1} are completed. No further attempts allowed.
                                            </Text>
                                        ) : null}

                                        {/* Code chips (completed codes hidden) */}
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                                            {availableCodes.map(code => (
                                                <Pressable
                                                    key={code}
                                                    onPress={() => setInvModal(m => ({ ...m, code }))}
                                                    style={{
                                                        paddingHorizontal: 12, height: 36, borderRadius: 18,
                                                        alignItems: 'center', justifyContent: 'center',
                                                        backgroundColor: invModal.code === code ? tokens.accent : tokens.bg,
                                                        borderWidth: 1, borderColor: '#0006'
                                                    }}
                                                >
                                                    <Text style={{ color: invModal.code === code ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}>{code}</Text>
                                                </Pressable>
                                            ))}
                                        </View>

                                        {/* Fail / Pass selectors (disabled when nothing selectable) */}
                                        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                                            <Pressable
                                                onPress={() => { if (availableCodes.length > 0 && invModal.code) setInvModal(m => ({ ...m, result: 'fail' })); }}
                                                style={{
                                                    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10,
                                                    backgroundColor: invModal.result === 'fail' ? '#e05661' : tokens.bg,
                                                    borderWidth: 1, borderColor: '#0006',
                                                    opacity: (availableCodes.length === 0 || !invModal.code) ? 0.5 : 1
                                                }}
                                            >
                                                <Text style={{ color: invModal.result === 'fail' ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}>Fail</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => { if (availableCodes.length > 0 && invModal.code) setInvModal(m => ({ ...m, result: 'pass' })); }}
                                                style={{
                                                    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10,
                                                    backgroundColor: invModal.result === 'pass' ? '#29d398' : tokens.bg,
                                                    borderWidth: 1, borderColor: '#0006',
                                                    opacity: (availableCodes.length === 0 || !invModal.code) ? 0.5 : 1
                                                }}
                                            >
                                                <Text style={{ color: invModal.result === 'pass' ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}>Pass</Text>
                                            </Pressable>
                                        </View>

                                        {/* Actions */}
                                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                                            <Pressable
                                                onPress={() => setInvModal(m => ({ ...m, open: false }))}
                                                style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: tokens.bg, borderWidth: 1, borderColor: '#0006' }}
                                            >
                                                <Text style={{ textAlign: 'center', color: tokens.textPrimary, fontWeight: '800' }}>Cancel</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => {
                                                    // No selectable codes → just close
                                                    if (availableCodes.length === 0 || !invModal.code) {
                                                        setInvModal(m => ({ ...m, open: false }));
                                                        return;
                                                    }
                                                    const codeToUse = invModal.code;
                                                    // Store has a hard guard: if completed, it won't write
                                                    addInvestigationAttempt(k.knightUID, ci, codeToUse, invModal.result);
                                                    // Pass automatically marks completed
                                                    if (invModal.result === 'pass') {
                                                        toggleInvestigationCompleted(k.knightUID, ci, codeToUse);
                                                    }
                                                    setInvModal(m => ({ ...m, open: false }));
                                                }}
                                                style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: tokens.accent, opacity: (availableCodes.length === 0 || !invModal.code) ? 0.6 : 1 }}
                                            >
                                                <Text style={{ textAlign: 'center', color: '#0B0B0B', fontWeight: '800' }}>Save Attempt</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                        );
                    })}
                </Card>

                {/* Milestones */}
                <Card style={{ marginBottom: 12 }}>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Milestones</Text>
                    <SwitchRow
                        label="First death occurred"
                        value={!!sheet.firstDeath}
                        onValueChange={(v) => updateKnightSheet(k.knightUID, { firstDeath: v })}
                    />
                </Card>

                {/* Virtues */}
                <Card style={{ marginBottom: 12 }}>
                  <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Virtues</Text>

                  <Stepper
                    label="Bravery"
                    value={sheet.virtues.bravery}
                    onChange={(v) => updateKnightSheet(k.knightUID, { virtues: { ...sheet.virtues, bravery: v } })}
                    min={0}
                  />
                  <Stepper
                    label="Tenacity"
                    value={sheet.virtues.tenacity}
                    onChange={(v) => updateKnightSheet(k.knightUID, { virtues: { ...sheet.virtues, tenacity: v } })}
                    min={0}
                  />
                  <Stepper
                    label="Sagacity"
                    value={sheet.virtues.sagacity}
                    onChange={(v) => updateKnightSheet(k.knightUID, { virtues: { ...sheet.virtues, sagacity: v } })}
                    min={0}
                  />
                  <Stepper
                    label="Fortitude"
                    value={sheet.virtues.fortitude}
                    onChange={(v) => updateKnightSheet(k.knightUID, { virtues: { ...sheet.virtues, fortitude: v } })}
                    min={0}
                  />
                  <Stepper
                    label="Might"
                    value={sheet.virtues.might}
                    onChange={(v) => updateKnightSheet(k.knightUID, { virtues: { ...sheet.virtues, might: v } })}
                    min={0}
                  />
                  <Stepper
                    label="Insight"
                    value={sheet.virtues.insight}
                    onChange={(v) => updateKnightSheet(k.knightUID, { virtues: { ...sheet.virtues, insight: v } })}
                    min={0}
                  />
                </Card>

                {/* Vices / Banes (dot chips, 0–4 each) */}
                <Card style={{ marginBottom: 12 }}>
                  <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Vices</Text>

                  <BaneRow
                    label="Cowardice"
                    subtitle="vs Bravery"
                    value={sheet.banes?.cowardice ?? 0}
                    onChange={(v)=> updateKnightSheet(k.knightUID, { banes: { ...sheet.banes, cowardice: v } as any })}
                  />
                  <BaneRow
                    label="Dishonor"
                    subtitle="vs Tenacity"
                    value={sheet.banes?.dishonor ?? 0}
                    onChange={(v)=> updateKnightSheet(k.knightUID, { banes: { ...sheet.banes, dishonor: v } as any })}
                  />
                  <BaneRow
                    label="Duplicity"
                    subtitle="vs Sagacity"
                    value={sheet.banes?.duplicity ?? 0}
                    onChange={(v)=> updateKnightSheet(k.knightUID, { banes: { ...sheet.banes, duplicity: v } as any })}
                  />
                  <BaneRow
                    label="Disregard"
                    subtitle="vs Fortitude"
                    value={sheet.banes?.disregard ?? 0}
                    onChange={(v)=> updateKnightSheet(k.knightUID, { banes: { ...sheet.banes, disregard: v } as any })}
                  />
                  <BaneRow
                    label="Cruelty"
                    subtitle="vs Might"
                    value={sheet.banes?.cruelty ?? 0}
                    onChange={(v)=> updateKnightSheet(k.knightUID, { banes: { ...sheet.banes, cruelty: v } as any })}
                  />
                  <BaneRow
                    label="Treachery"
                    subtitle="vs Insight"
                    value={sheet.banes?.treachery ?? 0}
                    onChange={(v)=> updateKnightSheet(k.knightUID, { banes: { ...sheet.banes, treachery: v } as any })}
                  />
                </Card>

                {/* Saints & Mercenaries */}
                <Card style={{ marginBottom: 12 }}>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Saints &amp; Mercenaries</Text>
                    <TextRow
                        label="Saints (comma-separated)"
                        value={(sheet.saints ?? []).join(', ')}
                        onChangeText={(t) => updateKnightSheet(k.knightUID, { saints: t.split(',').map(s => s.trim()).filter(Boolean) })}
                        placeholder="e.g., Saint X, Saint Y"
                    />
                    <TextRow
                        label="Mercenaries (comma-separated)"
                        value={(sheet.mercenaries ?? []).join(', ')}
                        onChangeText={(t) => updateKnightSheet(k.knightUID, { mercenaries: t.split(',').map(s => s.trim()).filter(Boolean) })}
                        placeholder="e.g., Blacksmith, Scout"
                    />
                </Card>

                {/* Choice Matrix */}
                <Card style={{ marginBottom: 24 }}>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Choice Matrix (1–30, E1–E10)</Text>

                    {/* 1..30 grid */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {MATRIX_KEYS_NUM.map((key) => {
                            const active = !!sheet.choiceMatrix?.[key];
                            return (
                                <Pressable
                                    key={key}
                                    onPress={() => toggleChoiceMatrix(k.knightUID, key)}
                                    style={{
                                        width: 44, height: 36, borderRadius: 8,
                                        alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: active ? tokens.accent : tokens.surface,
                                        borderWidth: 1, borderColor: '#0006'
                                    }}
                                >
                                    <Text style={{ color: active ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}>{key}</Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <View style={{ height: 12 }} />

                    {/* E1..E10 row */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {MATRIX_KEYS_E.map((key) => {
                            const active = !!sheet.choiceMatrix?.[key];
                            return (
                                <Pressable
                                    key={key}
                                    onPress={() => toggleChoiceMatrix(k.knightUID, key)}
                                    style={{
                                        paddingHorizontal: 12, height: 36, borderRadius: 18,
                                        alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: active ? tokens.accent : tokens.surface,
                                        borderWidth: 1, borderColor: '#0006'
                                    }}
                                >
                                    <Text style={{ color: active ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}>{key}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </Card>

                {/* Rapport */}
                <RapportCard knightId={k.knightUID} />
            </ScrollView>
        </SafeAreaView>
    );
}

/**
 * Rapport block
 */
function RapportCard({ knightId }: { knightId: string }) {
    const { tokens } = useThemeTokens();
    const { knightsById, setRapport } = useKnights();
    const k = knightsById[knightId];

    return (
        <Card style={{ marginBottom: 12 }}>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Rapport</Text>
            {k.rapport.map((r, idx) => (
                <View key={`${r.withKnightUID}-${idx}`} style={{ marginBottom: 10 }}>
                    <Text style={{ color: tokens.textMuted, marginBottom: 6 }}>{r.displayName || r.withKnightUID}</Text>
                    <Stepper
                        label="Ticks (0–3)"
                        value={r.ticks}
                        min={0}
                        max={3}
                        onChange={(v) => setRapport(knightId, r.withKnightUID, r.displayName, v as 0 | 1 | 2 | 3, r.boon)}
                    />
                    <TextRow
                        label="Boon (optional)"
                        value={r.boon ?? ''}
                        onChangeText={(t) => setRapport(knightId, r.withKnightUID, r.displayName, r.ticks, t)}
                        placeholder="Granted when rapport = 3"
                    />
                </View>
            ))}

            {/* Quick add: picks another existing knight if available; otherwise creates a placeholder external ID */}
            <Pressable
                onPress={() => {
                    const others = Object.values(knightsById).filter(x => x.knightUID !== knightId);
                    const candidate = others[0];
                    const name = candidate ? candidate.name : 'External Knight';
                    const idToUse = candidate ? candidate.knightUID : Math.random().toString(36).slice(2);
                    setRapport(knightId, idToUse, name, 0);
                }}
                style={{ marginTop: 8, padding: 12, borderRadius: 12, backgroundColor: tokens.surface, borderWidth: 1, borderColor: '#0006' }}
            >
                <Text style={{ color: tokens.textPrimary, textAlign: 'center', fontWeight: '700' }}>+ Add Rapport</Text>
            </Pressable>
        </Card>
    );
}