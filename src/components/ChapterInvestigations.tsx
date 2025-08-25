// src/components/ChapterInvestigations.tsx
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Card from '@/components/Card';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useKnights } from '@/store/knights';
import {
    ensureChapter,
    countDistinctNormal,
    countDistinctTotal,
    type ChapterProgress,
    type InvestigationResult,
} from '@/models/knight';

type Props = { knightUID: string; chapter: number };
const INV_IDS = ['1','2','3','4','5'];

function Pill({ label, tone = 'default', onPress }:{
    label: string;
    tone?: 'default'|'muted'|'success'|'warning'|'danger'|'accent';
    onPress?: () => void;
}) {
    const { tokens } = useThemeTokens();
    const bg =
        tone === 'success' ? '#2b6b3f' :
            tone === 'warning' ? '#7a5e15' :
                tone === 'danger'  ? '#7a2d2d' :
                    tone === 'accent'  ? tokens.accent :
                        tone === 'muted'   ? tokens.surface :
                            tokens.surface;
    const color = tone === 'accent' ? '#0B0B0B' : tokens.textPrimary;
    return (
        <Pressable onPress={onPress} style={{
            paddingHorizontal: 12, height: 32, borderRadius: 16,
            alignItems:'center', justifyContent:'center',
            backgroundColor: bg, borderWidth:1, borderColor:'#0006', marginRight:8, marginBottom:8
        }}>
            <Text style={{ color, fontWeight:'800' }}>{label}</Text>
        </Pressable>
    );
}

export default function ChapterInvestigations({ knightUID, chapter }: Props){
    const { tokens } = useThemeTokens();
    const { knightsById, addNormalInvestigation, addLeadCompletion, convertFailToLead, isNormalLocked } = useKnights() as any;

    const k = knightsById[knightUID];
    const ch: ChapterProgress = ensureChapter(k.sheet, chapter);
    const locked = isNormalLocked(knightUID, chapter);

    const [selected, setSelected] = useState<string|undefined>();

    const normals = countDistinctNormal(ch);   // <-- recomputed every render
    const total   = countDistinctTotal(ch);

    const entries = ch.investigations.entries;

    function stateTone(invKey: string){
        const e = entries[`I${chapter}-${invKey}`];
        if (!e) return { label: `I${chapter}-${invKey}`, tone:'muted' as const };
        if (e.via === 'lead') return { label: `I${chapter}-${invKey} • Lead • ${e.outcome}`, tone:'accent' as const };
        if (e.outcome === 'pass') return { label: `I${chapter}-${invKey} • Pass`, tone:'success' as const };
        return { label: `I${chapter}-${invKey} • Fail`, tone:'danger' as const };
    }

    const onAdd = async (invKey: string, via: 'normal'|'lead', result?: InvestigationResult) => {
        const invId = `I${chapter}-${invKey}`;
        const r = via === 'normal'
            ? await addNormalInvestigation(knightUID, chapter, invId, result ?? 'fail')
            : await addLeadCompletion(knightUID, chapter, invId);
        if (!r.ok) alert(r.error);
        setSelected(undefined);
    };

    const onConvert = async (invKey: string) => {
        const invId = `I${chapter}-${invKey}`;
        const r = await convertFailToLead(knightUID, chapter, invId);
        if (!r.ok) alert(r.error);
        setSelected(undefined);
    };

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>
                Chapter {chapter} • Investigations
            </Text>
            <Text style={{ color: tokens.textMuted, marginBottom:8 }}>
                Normal: {normals}/3 • Total: {total}/5 {locked ? '• Normal locked' : ''}
            </Text>

            <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
                {INV_IDS.map(key=>{
                    const { label, tone } = stateTone(key);
                    return (
                        <Pill key={key} label={label} tone={tone as any} onPress={()=> setSelected(key)} />
                    );
                })}
            </View>

            {selected ? (
                <View style={{ marginTop:12, gap:8 }}>
                    <Text style={{ color: tokens.textPrimary, fontWeight:'700' }}>
                        I{chapter}-{selected} • Actions
                    </Text>
                    <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
                        <Pill label="Normal • Pass" tone="success" onPress={()=> onAdd(selected, 'normal', 'pass')} />
                        <Pill label="Normal • Fail"  tone="danger"  onPress={()=> onAdd(selected, 'normal', 'fail')} />
                        <Pill label="Lead • Pass"    tone="accent"  onPress={()=> onAdd(selected, 'lead')} />
                        {(() => {
                            const e = entries[`I${chapter}-${selected}`];
                            const show = e && e.via === 'normal' && e.outcome === 'fail';
                            return show ? <Pill label="Convert Fail → Lead Pass" tone="accent" onPress={()=> onConvert(selected)} /> : null;
                        })()}
                    </View>
                    {locked && (
                        <Text style={{ color: tokens.textMuted }}>
                            Normal is locked (Quest completed + 3 normals). You can still use Leads up to 5 total.
                        </Text>
                    )}
                </View>
            ) : null}
        </Card>
    );
}