import TextRow from '@/components/ui/TextRow';

interface KnightNameSectionProps {
    name: string;
    setName: (name: string) => void;
    testID?: string;
}

export function KnightNameSection({ name, setName, testID }: KnightNameSectionProps) {
    return (
        <TextRow 
            label="Name" 
            value={name} 
            onChangeText={setName} 
            placeholder="Knight name"
            testID={testID ? `${testID}-name-input` : undefined}
        />
    );
}
