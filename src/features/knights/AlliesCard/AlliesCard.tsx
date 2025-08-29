import Card from '@/components/Card';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import { Text } from 'react-native';
import { AllyPickerModal } from './AllyPickerModal';
import { AllySection } from './AllySection';
import { useAlliesData } from './useAlliesData';

interface AlliesCardProps {
    knightUID: string;
}

export default function AlliesCard({ knightUID }: AlliesCardProps) {
    const { tokens } = useThemeTokens();
    const { saints, mercenaries, addAlly, removeAlly } = useAlliesData(knightUID);
    const [pickerState, setPickerState] = useState<{
        kind: 'saints' | 'mercs';
        title: string;
        options: Array<{ id: string; name: string }>;
    } | null>(null);

    const openSaintsPicker = () => {
        setPickerState({
            kind: 'saints',
            title: 'Select Saint',
            options: saints.options,
        });
    };

    const openMercenariesPicker = () => {
        setPickerState({
            kind: 'mercs',
            title: 'Select Mercenary',
            options: mercenaries.options,
        });
    };

    const handleSelectAlly = (ally: { id: string; name: string }) => {
        if (pickerState) {
            addAlly(pickerState.kind, ally);
            setPickerState(null);
        }
    };

    const handleClosePicker = () => {
        setPickerState(null);
    };

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                Saints & Mercenaries
            </Text>

            <AllySection
                title="Saints"
                allies={saints.selected}
                onAdd={openSaintsPicker}
                onRemove={(name: string) => removeAlly('saints', name)}
            />

            <AllySection
                title="Mercenaries"
                allies={mercenaries.selected}
                onAdd={openMercenariesPicker}
                onRemove={(name: string) => removeAlly('mercs', name)}
            />

            <AllyPickerModal
                visible={!!pickerState}
                title={pickerState?.title || ''}
                options={pickerState?.options || []}
                onSelect={handleSelectAlly}
                onClose={handleClosePicker}
            />
        </Card>
    );
}
