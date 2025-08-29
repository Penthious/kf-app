import HeaderMenuButton from '@/features/campaign/ui/HeaderMenuButton';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';

// ---- theme mock ----
jest.mock('@/theme/ThemeProvider', () => ({
    useThemeTokens: () => ({
        tokens: {
            bg: '#000',
            surface: '#111',
            card: '#222',
            textPrimary: '#fff',
            textMuted: '#aaa',
            accent: '#4ade80',
        },
    }),
}));

// ---- ContextMenu mock ----
jest.mock('@/components/ui/ContextMenu', () => {
    const React = require('react');
    const { View, Text, Pressable } = require('react-native');
    
    const MockContextMenu = ({ visible, items, onRequestClose, testID }: any) => {
        if (!visible) return null;
        
        return (
            <View testID={testID}>
                {items.map((item: any) => (
                    <Pressable
                        key={item.key}
                        onPress={item.onPress}
                        testID={`${testID}-item-${item.key}`}
                    >
                        <Text testID={`${testID}-item-text-${item.key}`}>
                            {item.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        );
    };
    
    MockContextMenu.measureInWindow = () => Promise.resolve({ x: 0, y: 0, width: 100, height: 50 });
    
    return MockContextMenu;
});

describe('HeaderMenuButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the menu button', () => {
        const { getByTestId, getByText } = render(
            <HeaderMenuButton testID="header-menu" />
        );
        
        expect(getByTestId('header-menu')).toBeTruthy();
        expect(getByText('☰')).toBeTruthy();
        expect(getByTestId('header-menu-icon')).toBeTruthy();
    });

    it('renders without testID when not provided', () => {
        const { queryByTestId } = render(
            <HeaderMenuButton />
        );
        
        expect(queryByTestId('header-menu')).toBeNull();
        expect(queryByTestId('header-menu-icon')).toBeNull();
    });

    it('has correct accessibility properties', () => {
        const { getByTestId } = render(
            <HeaderMenuButton testID="header-menu" />
        );
        
        const button = getByTestId('header-menu');
        expect(button.props.accessibilityRole).toBe('button');
        expect(button.props.accessibilityLabel).toBe('Open quick menu');
    });

    it('has correct hit slop for touch target', () => {
        const { getByTestId } = render(
            <HeaderMenuButton testID="header-menu" />
        );
        
        const button = getByTestId('header-menu');
        expect(button.props.hitSlop).toBe(12);
    });

    it('shows menu when button is pressed', async () => {
        const { getByTestId, getByText } = render(
            <HeaderMenuButton testID="header-menu" />
        );
        
        await act(async () => {
            fireEvent.press(getByTestId('header-menu'));
        });
        
        expect(getByTestId('header-menu-menu')).toBeTruthy();
        expect(getByText('Keywords')).toBeTruthy();
        expect(getByText('Theme')).toBeTruthy();
    });

    it('shows exit campaign option when id is present', async () => {
        const { useLocalSearchParams } = require('expo-router');
        useLocalSearchParams.mockReturnValue({ id: 'test-id' });
        
        const { getByTestId, getByText } = render(
            <HeaderMenuButton testID="header-menu" />
        );
        
        await act(async () => {
            fireEvent.press(getByTestId('header-menu'));
        });
        
        expect(getByText('Exit Campaign')).toBeTruthy();
        expect(getByTestId('header-menu-menu-item-exit')).toBeTruthy();
    });

    it('does not show exit campaign option when id is not present', async () => {
        const { useLocalSearchParams } = require('expo-router');
        useLocalSearchParams.mockReturnValue({});
        
        const { getByTestId, queryByText } = render(
            <HeaderMenuButton testID="header-menu" />
        );
        
        await act(async () => {
            fireEvent.press(getByTestId('header-menu'));
        });
        
        expect(queryByText('Exit Campaign')).toBeNull();
    });

    it('has correct menu items structure', async () => {
        const { getByTestId } = render(
            <HeaderMenuButton testID="header-menu" />
        );
        
        await act(async () => {
            fireEvent.press(getByTestId('header-menu'));
        });
        
        // Check that menu items exist
        expect(getByTestId('header-menu-menu-item-keywords')).toBeTruthy();
        expect(getByTestId('header-menu-menu-item-theme')).toBeTruthy();
    });

    it('has correct menu items when id is present', async () => {
        const { useLocalSearchParams } = require('expo-router');
        useLocalSearchParams.mockReturnValue({ id: 'test-id' });
        
        const { getByTestId } = render(
            <HeaderMenuButton testID="header-menu" />
        );
        
        await act(async () => {
            fireEvent.press(getByTestId('header-menu'));
        });
        
        // Check that all menu items exist including exit
        expect(getByTestId('header-menu-menu-item-keywords')).toBeTruthy();
        expect(getByTestId('header-menu-menu-item-theme')).toBeTruthy();
        expect(getByTestId('header-menu-menu-item-exit')).toBeTruthy();
    });

    it('has correct styling properties', () => {
        const { getByTestId } = render(
            <HeaderMenuButton testID="header-menu" />
        );
        
        const button = getByTestId('header-menu');
        expect(button.props.style).toMatchObject({
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#0006',
        });
    });
});
