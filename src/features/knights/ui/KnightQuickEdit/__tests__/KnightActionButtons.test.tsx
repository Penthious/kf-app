import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { KnightActionButtons } from '../KnightActionButtons';

// Mock the theme provider
jest.mock('@/theme/ThemeProvider', () => ({
    useThemeTokens: () => ({
        tokens: {
            surface: '#222',
            textPrimary: '#fff',
            accent: '#4ade80',
        },
    }),
}));

describe('KnightActionButtons', () => {
    const mockOnClose = jest.fn<() => void>();
    const mockOnSave = jest.fn<() => void>();
    const mockOnOpenFullSheet = jest.fn<() => void>();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders cancel and save buttons', () => {
        const { getByText, getByTestId } = render(
            <KnightActionButtons
                onClose={mockOnClose}
                onSave={mockOnSave}
                canSave={true}
                testID="action-buttons"
            />
        );

        expect(getByText('Cancel')).toBeTruthy();
        expect(getByText('Save')).toBeTruthy();
        expect(getByTestId('action-buttons-cancel-button')).toBeTruthy();
        expect(getByTestId('action-buttons-save-button')).toBeTruthy();
    });

    it('calls onClose when cancel button is pressed', () => {
        const { getByTestId } = render(
            <KnightActionButtons
                onClose={mockOnClose}
                onSave={mockOnSave}
                canSave={true}
                testID="action-buttons"
            />
        );

        fireEvent.press(getByTestId('action-buttons-cancel-button'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onSave when save button is pressed', () => {
        const { getByTestId } = render(
            <KnightActionButtons
                onClose={mockOnClose}
                onSave={mockOnSave}
                canSave={true}
                testID="action-buttons"
            />
        );

        fireEvent.press(getByTestId('action-buttons-save-button'));
        expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('renders open full sheet button when onOpenFullSheet is provided', () => {
        const { getByText, getByTestId } = render(
            <KnightActionButtons
                onClose={mockOnClose}
                onSave={mockOnSave}
                onOpenFullSheet={mockOnOpenFullSheet}
                canSave={true}
                testID="action-buttons"
            />
        );

        expect(getByText('Open Full Sheet')).toBeTruthy();
        expect(getByTestId('action-buttons-open-full-sheet-button')).toBeTruthy();
    });

    it('does not render open full sheet button when onOpenFullSheet is not provided', () => {
        const { queryByText, queryByTestId } = render(
            <KnightActionButtons
                onClose={mockOnClose}
                onSave={mockOnSave}
                canSave={true}
                testID="action-buttons"
            />
        );

        expect(queryByText('Open Full Sheet')).toBeNull();
        expect(queryByTestId('action-buttons-open-full-sheet-button')).toBeNull();
    });

    it('calls onOpenFullSheet when open full sheet button is pressed', () => {
        const { getByTestId } = render(
            <KnightActionButtons
                onClose={mockOnClose}
                onSave={mockOnSave}
                onOpenFullSheet={mockOnOpenFullSheet}
                canSave={true}
                testID="action-buttons"
            />
        );

        fireEvent.press(getByTestId('action-buttons-open-full-sheet-button'));
        expect(mockOnOpenFullSheet).toHaveBeenCalledTimes(1);
    });

    it('disables save button when canSave is false', () => {
        const { getByTestId } = render(
            <KnightActionButtons
                onClose={mockOnClose}
                onSave={mockOnSave}
                canSave={false}
                testID="action-buttons"
            />
        );

        const saveButton = getByTestId('action-buttons-save-button');
        expect(saveButton.props.disabled).toBe(true);
        expect(saveButton.props.style.opacity).toBe(0.5);
    });

    it('enables save button when canSave is true', () => {
        const { getByTestId } = render(
            <KnightActionButtons
                onClose={mockOnClose}
                onSave={mockOnSave}
                canSave={true}
                testID="action-buttons"
            />
        );

        const saveButton = getByTestId('action-buttons-save-button');
        expect(saveButton.props.disabled).toBe(false);
        expect(saveButton.props.style.opacity).toBe(1);
    });

    it('renders without testID when not provided', () => {
        const { queryByTestId } = render(
            <KnightActionButtons
                onClose={mockOnClose}
                onSave={mockOnSave}
                canSave={true}
            />
        );

        expect(queryByTestId('action-buttons-cancel-button')).toBeNull();
        expect(queryByTestId('action-buttons-save-button')).toBeNull();
    });
});
