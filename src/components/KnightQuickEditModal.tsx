import Stepper from '@/components/ui/Stepper';
import SwitchRow from '@/components/ui/SwitchRow';
import TextRow from '@/components/ui/TextRow';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

interface KnightSheetQuick {
    chapter: number;
    investigations?: Record<number, { questCompleted?: boolean; completed?: string[] }>;
    prologueDone?: boolean;
    postgameDone?: boolean;
    firstDeath?: boolean;
}

interface KnightQuick {
    knightUID: string;
    name: string;
    sheet: KnightSheetQuick;
}

interface QuickEditPatch {
    name?: string;
    sheet?: Partial<KnightSheetQuick>;
    // For nested chapter data:
    investigationsPatch?: {
        chapter: number;
        questCompleted?: boolean;
        completedCount?: number;
    };
}

interface QuickEditProps {
    visible: boolean;
    onClose: () => void;
    knight?: KnightQuick;
    onSave: (patch: QuickEditPatch) => void;
    onOpenFullSheet?: () => void;
    testID?: string;
}

export default function KnightQuickEditModal({
    visible, 
    onClose, 
    knight, 
    onSave, 
    onOpenFullSheet,
    testID
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

    const handleSave = () => {
        if (!canSave) return;
        onSave({
            name: name.trim(),
            sheet: { prologueDone, postgameDone, firstDeath },
            investigationsPatch: { chapter, questCompleted, completedCount },
        });
        onClose();
    };

    const handleOpenFullSheet = () => {
        onClose();
        onOpenFullSheet?.();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View 
                style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'flex-end' }}
                testID={testID}
            >
                <View
                    style={{
                        maxHeight: '85%',
                        backgroundColor: tokens.bg,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingBottom: 12,
                    }}
                    testID={testID ? `${testID}-content` : undefined}
                >
                    <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 6 }}>
                        <View 
                            style={{ width: 48, height: 5, borderRadius: 3, backgroundColor: tokens.surface, opacity: 0.7 }}
                            testID={testID ? `${testID}-handle` : undefined}
                        />
                    </View>

                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                        <Text 
                            style={{ color: tokens.textPrimary, fontWeight: '800', fontSize: 18, marginBottom: 12 }}
                            testID={testID ? `${testID}-title` : undefined}
                        >
                            Quick Edit {knight ? `• ${knight.name}` : ''}
                        </Text>

                        <TextRow 
                            label="Name" 
                            value={name} 
                            onChangeText={setName} 
                            placeholder="Knight name"
                            testID={testID ? `${testID}-name-input` : undefined}
                        />

                        {/* Current chapter (read-only) */}
                        <View style={{ height: 10 }} />
                        <Text style={{ color: tokens.textMuted, marginBottom: 4 }}>Current Chapter</Text>
                        <Text 
                            style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}
                            testID={testID ? `${testID}-chapter` : undefined}
                        >
                            {chapter}
                        </Text>

                        {/* Current chapter: quest/investigations */}
                        <SwitchRow 
                            label="Quest Completed (this chapter)" 
                            value={questCompleted} 
                            onValueChange={setQuestCompleted}
                            testID={testID ? `${testID}-quest-completed` : undefined}
                        />
                        <Text style={{ color: tokens.textMuted, marginTop: 8, marginBottom: 6 }}>Completed Investigations (this chapter)</Text>
                        <Stepper 
                            value={completedCount} 
                            onChange={setCompletedCount} 
                            min={0} 
                            max={5}
                            testID={testID ? `${testID}-completed-count` : undefined}
                        />

                        {/* Global flags */}
                        <View style={{ height: 8 }} />
                        <SwitchRow 
                            label="Prologue Completed" 
                            value={prologueDone} 
                            onValueChange={setPrologue}
                            testID={testID ? `${testID}-prologue-done` : undefined}
                        />
                        <SwitchRow 
                            label="Postgame Completed" 
                            value={postgameDone} 
                            onValueChange={setPostgame}
                            testID={testID ? `${testID}-postgame-done` : undefined}
                        />
                        <SwitchRow 
                            label="First Death" 
                            value={firstDeath} 
                            onValueChange={setFirstDeath}
                            testID={testID ? `${testID}-first-death` : undefined}
                        />

                        <View style={{ height: 12 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Pressable
                                onPress={onClose}
                                testID={testID ? `${testID}-cancel-button` : undefined}
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
                                        onPress={handleOpenFullSheet}
                                        testID={testID ? `${testID}-open-full-sheet-button` : undefined}
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
                                    onPress={handleSave}
                                    testID={testID ? `${testID}-save-button` : undefined}
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