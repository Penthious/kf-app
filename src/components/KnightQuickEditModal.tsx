import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';
import TextRow from '@/components/TextRow';
import SwitchRow from '@/components/SwitchRow';
import Stepper from '@/components/Stepper';

type KnightSheetQuick = {
    chapter: number;
    investigations?: Record<number, { questCompleted?: boolean; completed?: string[] }>;
    prologueDone?: boolean;
    postgameDone?: boolean;
    firstDeath?: boolean;
};

type KnightQuick = {
    knightUID: string;
    name: string;
    sheet: KnightSheetQuick;
};

type QuickEditPatch = {
    name?: string;
    sheet?: Partial<KnightSheetQuick>;
    // For nested chapter data:
    investigationsPatch?: {
        chapter: number;
        questCompleted?: boolean;
        completedCount?: number;
    };
};

type QuickEditProps = {
    visible: boolean;
    onClose: () => void;
    knight?: KnightQuick;
    onSave: (patch: QuickEditPatch) => void;
    onOpenFullSheet?: () => void;
};

export default function KnightQuickEditModal({
                                                 visible, onClose, knight, onSave, onOpenFullSheet
                                             }: QuickEditProps) {
    const { tokens } = useThemeTokens();

    const chapter = knight?.sheet.chapter ?? 1;
    const chData = useMemo(
        () => (knight?.sheet.investigations?.[chapter] ?? { questCompleted: false, completed: [] }),
        [knight?.knightUID, chapter]
    );

    const [name, setName] = useState(knight?.name ?? '');
    const [questCompleted, setQuestCompleted] = useState<boolean>(!!chData.questCompleted);
    const [completedCount, setCompletedCount] = useState<number>(Array.isArray(chData.completed) ? chData.completed.length : 0);

    const [prologueDone, setPrologue] = useState<boolean>(!!knight?.sheet.prologueDone);
    const [postgameDone, setPostgame] = useState<boolean>(!!knight?.sheet.postgameDone);
    const [firstDeath, setFirstDeath] = useState<boolean>(!!knight?.sheet.firstDeath);

    useEffect(() => {
        setName(knight?.name ?? '');
        const freshCh = knight?.sheet.chapter ?? 1;
        const fresh = knight?.sheet.investigations?.[freshCh] ?? { questCompleted: false, completed: [] };
        setQuestCompleted(!!fresh.questCompleted);
        setCompletedCount(Array.isArray(fresh.completed) ? fresh.completed.length : 0);
        setPrologue(!!knight?.sheet.prologueDone);
        setPostgame(!!knight?.sheet.postgameDone);
        setFirstDeath(!!knight?.sheet.firstDeath);
    }, [knight?.knightUID]);

    const canSave = !!knight && name.trim().length > 0;

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'flex-end' }}>
                <View
                    style={{
                        maxHeight: '85%',
                        backgroundColor: tokens.bg,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingBottom: 12,
                    }}
                >
                    <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 6 }}>
                        <View style={{ width: 48, height: 5, borderRadius: 3, backgroundColor: tokens.surface, opacity: 0.7 }} />
                    </View>

                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                        <Text style={{ color: tokens.textPrimary, fontWeight: '800', fontSize: 18, marginBottom: 12 }}>
                            Quick Edit {knight ? `• ${knight.name}` : ''}
                        </Text>

                        <TextRow label="Name" value={name} onChangeText={setName} placeholder="Knight name" />

                        {/* Current chapter (read-only) */}
                        <View style={{ height: 10 }} />
                        <Text style={{ color: tokens.textMuted, marginBottom: 4 }}>Current Chapter</Text>
                        <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>{chapter}</Text>

                        {/* Current chapter: quest/investigations */}
                        <SwitchRow label="Quest Completed (this chapter)" value={questCompleted} onValueChange={setQuestCompleted} />
                        <Text style={{ color: tokens.textMuted, marginTop: 8, marginBottom: 6 }}>Completed Investigations (this chapter)</Text>
                        <Stepper value={completedCount} onChange={setCompletedCount} min={0} max={5} />

                        {/* Global flags */}
                        <View style={{ height: 8 }} />
                        <SwitchRow label="Prologue Completed" value={prologueDone} onValueChange={setPrologue} />
                        <SwitchRow label="Postgame Completed" value={postgameDone} onValueChange={setPostgame} />
                        <SwitchRow label="First Death" value={firstDeath} onValueChange={setFirstDeath} />

                        <View style={{ height: 12 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Pressable
                                onPress={onClose}
                                style={{
                                    paddingHorizontal: 16, height: 44, borderRadius: 12,
                                    alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: tokens.surface, borderWidth: 1, borderColor: '#0006',
                                }}
                            >
                                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Cancel</Text>
                            </Pressable>

                            <View style={{ flexDirection: 'row' }}>
                                {onOpenFullSheet ? (
                                    <Pressable
                                        onPress={() => { onClose(); onOpenFullSheet(); }} // close FIRST, then navigate
                                        style={{
                                            marginRight: 8,
                                            paddingHorizontal: 16, height: 44, borderRadius: 12,
                                            alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: tokens.surface, borderWidth: 1, borderColor: '#0006',
                                        }}
                                    >
                                        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Open Full Sheet</Text>
                                    </Pressable>
                                ) : null}

                                <Pressable
                                    disabled={!canSave}
                                    onPress={() => {
                                        if (!canSave) return;
                                        onSave({
                                            name: name.trim(),
                                            sheet: { prologueDone, postgameDone, firstDeath },
                                            investigationsPatch: { chapter, questCompleted, completedCount },
                                        });
                                        onClose();
                                    }}
                                    style={{
                                        paddingHorizontal: 16, height: 44, borderRadius: 12,
                                        alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: canSave ? tokens.accent : '#333',
                                        opacity: canSave ? 1 : 0.5,
                                    }}
                                >
                                    <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Save</Text>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}