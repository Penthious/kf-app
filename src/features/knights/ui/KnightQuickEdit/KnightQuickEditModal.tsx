import { KnightActionButtons } from './KnightActionButtons';
import { KnightChapterSection } from './KnightChapterSection';
import { KnightFlagsSection } from './KnightFlagsSection';
import { KnightNameSection } from './KnightNameSection';
import { ModalWrapper } from './ModalWrapper';
import type { QuickEditProps } from './types';
import { useKnightQuickEdit } from './useKnightQuickEdit';

export function KnightQuickEditModal({
    visible, 
    onClose, 
    knight, 
    onSave, 
    onOpenFullSheet,
    testID
}: QuickEditProps) {
    const {
        name,
        setName,
        chapter,
        questCompleted,
        setQuestCompleted,
        completedCount,
        setCompletedCount,
        prologueDone,
        setPrologue,
        postgameDone,
        setPostgame,
        firstDeath,
        setFirstDeath,
        canSave,
        createPatch,
    } = useKnightQuickEdit(knight);

    const handleSave = () => {
        if (!canSave) return;
        onSave(createPatch());
        onClose();
    };

    const handleOpenFullSheet = () => {
        onClose();
        onOpenFullSheet?.();
    };

    const title = `Quick Edit ${knight ? `• ${knight.name}` : ''}`;

    return (
        <ModalWrapper
            visible={visible}
            onRequestClose={onClose}
            title={title}
            testID={testID}
        >
            <KnightNameSection
                name={name}
                setName={setName}
                testID={testID}
            />

            <KnightChapterSection
                chapter={chapter}
                questCompleted={questCompleted}
                setQuestCompleted={setQuestCompleted}
                completedCount={completedCount}
                setCompletedCount={setCompletedCount}
                testID={testID}
            />

            <KnightFlagsSection
                prologueDone={prologueDone}
                setPrologue={setPrologue}
                postgameDone={postgameDone}
                setPostgame={setPostgame}
                firstDeath={firstDeath}
                setFirstDeath={setFirstDeath}
                testID={testID}
            />

            <KnightActionButtons
                onClose={onClose}
                onSave={handleSave}
                onOpenFullSheet={handleOpenFullSheet}
                canSave={canSave}
                testID={testID}
            />
        </ModalWrapper>
    );
}
