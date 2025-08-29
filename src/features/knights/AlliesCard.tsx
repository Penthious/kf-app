import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import Card from '@/components/Card';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useKnights } from '@/store/knights';
import alliesDB from '@/catalogs/allies.json';

type AllyOpt = { id: string; name: string };

function Chip({ label, onRemove }:{ label:string; onRemove:()=>void }) {
    const { tokens } = useThemeTokens();
    return (
        <View style={{
            flexDirection:'row', alignItems:'center', marginRight:8, marginBottom:8,
            backgroundColor: tokens.surface, borderWidth:1, borderColor:'#0006', borderRadius:16, paddingHorizontal:10, height:32
        }}>
            <Text style={{ color: tokens.textPrimary, fontWeight:'700' }}>{label}</Text>
            <Pressable onPress={onRemove} style={{ marginLeft:8 }}>
                <Text style={{ color: tokens.textMuted }}>✕</Text>
            </Pressable>
        </View>
    );
}

function PickerModal({
                         visible, title, options, onSelect, onClose
                     }:{
    visible: boolean; title: string; options: AllyOpt[];
    onSelect: (opt: AllyOpt)=>void; onClose: ()=>void
}){
    const { tokens } = useThemeTokens();
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={{ flex:1, backgroundColor:'#0009', justifyContent:'flex-end' }}>
                <View style={{ backgroundColor: tokens.card, maxHeight: '70%', borderTopLeftRadius:16, borderTopRightRadius:16, padding:12 }}>
                    <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                        <Text style={{ color: tokens.textPrimary, fontWeight:'800', fontSize:16 }}>{title}</Text>
                        <Pressable onPress={onClose} style={{ paddingHorizontal:10, paddingVertical:6, backgroundColor: tokens.surface, borderRadius:8, borderWidth:1, borderColor:'#0006' }}>
                            <Text style={{ color: tokens.textPrimary, fontWeight:'700' }}>Close</Text>
                        </Pressable>
                    </View>
                    <FlatList
                        data={options}
                        keyExtractor={(it)=>it.id}
                        ItemSeparatorComponent={()=><View style={{ height:8 }} />}
                        renderItem={({item})=>(
                            <Pressable
                                onPress={()=>onSelect(item)}
                                style={{ padding:12, borderRadius:10, backgroundColor: tokens.surface, borderWidth:1, borderColor:'#0006' }}>
                                <Text style={{ color: tokens.textPrimary, fontWeight:'700' }}>{item.name}</Text>
                                <Text style={{ color: tokens.textMuted, fontSize:12 }}>{item.id}</Text>
                            </Pressable>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
}

export default function AlliesCard({ knightUID }:{ knightUID: string }){
    const { tokens } = useThemeTokens();
    const { knightsById, updateKnightSheet } = useKnights() as any;
    const k = knightsById[knightUID];
    const saintsSel: string[] = k.sheet.saints ?? [];
    const mercsSel: string[]  = k.sheet.mercenaries ?? [];

    const saintsOpts = useMemo(()=> alliesDB.saints as AllyOpt[], []);
    const mercsOpts  = useMemo(()=> alliesDB.mercenaries as AllyOpt[], []);

    const [pick, setPick] = useState<null | { kind:'saints'|'mercs'; title:string; options: AllyOpt[] }>(null);

    const add = (kind:'saints'|'mercs', opt: AllyOpt) => {
        if (kind === 'saints') {
            const next = Array.from(new Set([...saintsSel, opt.name]));
            updateKnightSheet(knightUID, { saints: next });
        } else {
            const next = Array.from(new Set([...mercsSel, opt.name]));
            updateKnightSheet(knightUID, { mercenaries: next });
        }
    };
    const remove = (kind:'saints'|'mercs', name:string) => {
        if (kind === 'saints') updateKnightSheet(knightUID, { saints: saintsSel.filter(s=>s!==name) });
        else updateKnightSheet(knightUID, { mercenaries: mercsSel.filter(s=>s!==name) });
    };

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>Saints & Mercenaries</Text>

            {/* Saints */}
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                <Text style={{ color: tokens.textPrimary, fontWeight:'700' }}>Saints</Text>
                <Pressable onPress={()=> setPick({ kind:'saints', title:'Select Saint', options: saintsOpts })}
                           style={{ paddingHorizontal:12, height:32, borderRadius:16, alignItems:'center', justifyContent:'center', backgroundColor: tokens.accent }}>
                    <Text style={{ color:'#0B0B0B', fontWeight:'800' }}>Add</Text>
                </Pressable>
            </View>
            <View style={{ flexDirection:'row', flexWrap:'wrap', marginBottom:12 }}>
                {saintsSel.length === 0 ? <Text style={{ color: tokens.textMuted }}>None</Text> :
                    saintsSel.map(s => <Chip key={s} label={s} onRemove={()=>remove('saints', s)} />)}
            </View>

            {/* Mercenaries */}
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                <Text style={{ color: tokens.textPrimary, fontWeight:'700' }}>Mercenaries</Text>
                <Pressable onPress={()=> setPick({ kind:'mercs', title:'Select Mercenary', options: mercsOpts })}
                           style={{ paddingHorizontal:12, height:32, borderRadius:16, alignItems:'center', justifyContent:'center', backgroundColor: tokens.accent }}>
                    <Text style={{ color:'#0B0B0B', fontWeight:'800' }}>Add</Text>
                </Pressable>
            </View>
            <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
                {mercsSel.length === 0 ? <Text style={{ color: tokens.textMuted }}>None</Text> :
                    mercsSel.map(s => <Chip key={s} label={s} onRemove={()=>remove('mercs', s)} />)}
            </View>

            <PickerModal
                visible={!!pick}
                title={pick?.title || ''}
                options={pick?.options || []}
                onClose={()=> setPick(null)}
                onSelect={(opt)=>{
                    if (!pick) return;
                    add(pick.kind === 'saints' ? 'saints' : 'mercs', opt);
                    setPick(null);
                }}
            />
        </Card>
    );
}