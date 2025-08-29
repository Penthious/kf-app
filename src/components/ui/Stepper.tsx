import SmallButton from '@/components/ui/SmallButton';
import { useThemeTokens } from '@/theme/ThemeProvider';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';


type Props = {
    label?: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    editable?: boolean;
    disabled?: boolean;
    tone?: 'default' | 'accent';
    testID?: string;
    // Optional formatting/parsing hooks
    formatValue?: (v: number) => string;
    parseValue?: (s: string) => number;
    // Optional TextInput props pass-through
    inputProps?: Partial<React.ComponentProps<typeof TextInput>>;

};

export default function Stepper({
                                    value,
                                    onChange,
                                    step = 1,
                                    min = Number.NEGATIVE_INFINITY,
                                    max = Number.POSITIVE_INFINITY,
                                    disabled = false,
                                    tone = 'default',
                                    editable = false,
                                    testID,
                                    formatValue,
                                    parseValue,
                                    inputProps,
                                }: Props) {
    const { tokens } = useThemeTokens();

    const clamp = useCallback(
        (n: number) => Math.min(max, Math.max(min, n)),
        [min, max]
    );

    const display = useMemo(
        () => (formatValue ? formatValue(value) : String(value)),
        [formatValue, value]
    );

    // local text state only when editable
    const [text, setText] = useState(display);
    useEffect(() => {
        if (!editable) return;
        setText(display);
    }, [display, editable]);

    const commitText = useCallback(
        (s: string) => {
            const parsed = clamp(
                parseValue
                    ? parseValue(s)
                    : Math.floor(Number(s || '0'))
            );
            if (!Number.isFinite(parsed)) return;
            if (parsed !== value) onChange(parsed);
            // snap input to formatted version
            setText(formatValue ? formatValue(parsed) : String(parsed));
        },
        [clamp, formatValue, onChange, parseValue, value]
    );

    const stepBy = useCallback(
        (delta: number) => {
            const next = clamp(value + delta * step);
            if (next !== value) onChange(next);
            if (editable) setText(formatValue ? formatValue(next) : String(next));
        },
        [clamp, editable, formatValue, step, value, onChange]
    );

    const border = '#0006';

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
            }}
            testID={testID}
        >
            <SmallButton
                label="−"
                onPress={() => stepBy(-1)}
                disabled={disabled || value <= min}
                tone={tone}
                testID={testID ? `${testID}-decrease` : undefined}
            />

            {editable ? (
                <TextInput
                    value={text}
                    onChangeText={setText}
                    onBlur={() => commitText(text)}
                    keyboardType={inputProps?.keyboardType ?? 'number-pad'}
                    inputMode={inputProps?.inputMode ?? 'numeric'}
                    placeholder={inputProps?.placeholder ?? '0'}
                    style={{
                        minWidth: 72,
                        height: 36,
                        borderRadius: 8,
                        backgroundColor: tokens.surface,
                        color: tokens.textPrimary,
                        borderWidth: 1,
                        borderColor: border,
                        textAlign: 'center',
                        fontWeight: '800',
                        ...(inputProps?.style as object),
                    }}
                    accessibilityLabel={inputProps?.accessibilityLabel ?? 'Stepper value'}
                    editable={!disabled}
                    testID={testID ? `${testID}-input` : undefined}
                    {...inputProps}
                />
            ) : (
                <View
                    style={{
                        minWidth: 72,
                        height: 36,
                        borderRadius: 8,
                        backgroundColor: tokens.surface,
                        borderWidth: 1,
                        borderColor: border,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 12,
                    }}
                    testID={testID ? `${testID}-display` : undefined}
                >
                    <Text
                        style={{ color: tokens.textPrimary, fontWeight: '800' }}
                        testID={testID ? `${testID}-value` : undefined}
                    >
                        {display}
                    </Text>
                </View>
            )}

            <SmallButton
                label="+"
                onPress={() => stepBy(1)}
                disabled={disabled || value >= max}
                tone={tone}
                testID={testID ? `${testID}-increase` : undefined}
            />
        </View>
    );
}
