import ContextMenu from '@/components/ui/ContextMenu';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

describe('ContextMenu', () => {
    const mockItems = [
        { key: 'edit', label: 'Edit', onPress: jest.fn() },
        { key: 'delete', label: 'Delete', onPress: jest.fn(), destructive: true },
    ];

    const mockAnchorFrame = {
        x: 100,
        y: 100,
        width: 50,
        height: 30,
    };

    it('renders when visible', () => {
        const mockOnRequestClose = jest.fn();
        const { getByTestId } = render(
            <ContextMenu
                visible={true}
                anchorFrame={mockAnchorFrame}
                onRequestClose={mockOnRequestClose}
                items={mockItems}
                testID="context-menu"
            />
        );
        
        expect(getByTestId('context-menu-backdrop')).toBeTruthy();
        expect(getByTestId('context-menu-menu')).toBeTruthy();
    });

    it('renders but is hidden when not visible', () => {
        const mockOnRequestClose = jest.fn();
        const { getByTestId } = render(
            <ContextMenu
                visible={false}
                anchorFrame={mockAnchorFrame}
                onRequestClose={mockOnRequestClose}
                items={mockItems}
                testID="context-menu"
            />
        );
        
        // Modal still renders but is hidden via the visible prop
        expect(getByTestId('context-menu-backdrop')).toBeTruthy();
        expect(getByTestId('context-menu-menu')).toBeTruthy();
    });

    it('renders all menu items', () => {
        const mockOnRequestClose = jest.fn();
        const { getByTestId, getByText } = render(
            <ContextMenu
                visible={true}
                anchorFrame={mockAnchorFrame}
                onRequestClose={mockOnRequestClose}
                items={mockItems}
                testID="context-menu"
            />
        );
        
        expect(getByTestId('context-menu-item-edit')).toBeTruthy();
        expect(getByTestId('context-menu-item-delete')).toBeTruthy();
        expect(getByText('Edit')).toBeTruthy();
        expect(getByText('Delete')).toBeTruthy();
    });

    it('calls onPress when menu item is pressed', () => {
        const mockOnRequestClose = jest.fn();
        const { getByTestId } = render(
            <ContextMenu
                visible={true}
                anchorFrame={mockAnchorFrame}
                onRequestClose={mockOnRequestClose}
                items={mockItems}
                testID="context-menu"
            />
        );
        
        fireEvent.press(getByTestId('context-menu-item-edit'));
        expect(mockItems[0].onPress).toHaveBeenCalledTimes(1);
    });

    it('calls onRequestClose when backdrop is pressed', () => {
        const mockOnRequestClose = jest.fn();
        const { getByTestId } = render(
            <ContextMenu
                visible={true}
                anchorFrame={mockAnchorFrame}
                onRequestClose={mockOnRequestClose}
                items={mockItems}
                testID="context-menu"
            />
        );
        
        fireEvent.press(getByTestId('context-menu-backdrop'));
        expect(mockOnRequestClose).toHaveBeenCalledTimes(1);
    });

    it('handles empty items array', () => {
        const mockOnRequestClose = jest.fn();
        const { getByTestId } = render(
            <ContextMenu
                visible={true}
                anchorFrame={mockAnchorFrame}
                onRequestClose={mockOnRequestClose}
                items={[]}
                testID="context-menu"
            />
        );
        
        expect(getByTestId('context-menu-backdrop')).toBeTruthy();
        expect(getByTestId('context-menu-menu')).toBeTruthy();
    });

    it('renders without testID when not provided', () => {
        const mockOnRequestClose = jest.fn();
        const { queryByTestId } = render(
            <ContextMenu
                visible={true}
                anchorFrame={mockAnchorFrame}
                onRequestClose={mockOnRequestClose}
                items={mockItems}
            />
        );
        
        expect(queryByTestId('context-menu-backdrop')).toBeNull();
        expect(queryByTestId('context-menu-menu')).toBeNull();
    });

    it('handles null anchorFrame', () => {
        const mockOnRequestClose = jest.fn();
        const { getByTestId } = render(
            <ContextMenu
                visible={true}
                anchorFrame={null}
                onRequestClose={mockOnRequestClose}
                items={mockItems}
                testID="context-menu"
            />
        );
        
        expect(getByTestId('context-menu-backdrop')).toBeTruthy();
        expect(getByTestId('context-menu-menu')).toBeTruthy();
    });

    it('handles destructive items', () => {
        const mockOnRequestClose = jest.fn();
        const { getByTestId } = render(
            <ContextMenu
                visible={true}
                anchorFrame={mockAnchorFrame}
                onRequestClose={mockOnRequestClose}
                items={mockItems}
                testID="context-menu"
            />
        );
        
        const deleteItem = getByTestId('context-menu-item-delete');
        const deleteText = getByTestId('context-menu-item-text-delete');
        expect(deleteItem).toBeTruthy();
        expect(deleteText).toBeTruthy();
    });

    it('handles multiple items with different keys', () => {
        const multipleItems = [
            { key: 'item1', label: 'Item 1', onPress: jest.fn() },
            { key: 'item2', label: 'Item 2', onPress: jest.fn() },
            { key: 'item3', label: 'Item 3', onPress: jest.fn() },
        ];
        
        const mockOnRequestClose = jest.fn();
        const { getByTestId } = render(
            <ContextMenu
                visible={true}
                anchorFrame={mockAnchorFrame}
                onRequestClose={mockOnRequestClose}
                items={multipleItems}
                testID="context-menu"
            />
        );
        
        expect(getByTestId('context-menu-item-item1')).toBeTruthy();
        expect(getByTestId('context-menu-item-item2')).toBeTruthy();
        expect(getByTestId('context-menu-item-item3')).toBeTruthy();
    });

    it('calls correct onPress for each item', () => {
        const item1OnPress = jest.fn();
        const item2OnPress = jest.fn();
        const multipleItems = [
            { key: 'item1', label: 'Item 1', onPress: item1OnPress },
            { key: 'item2', label: 'Item 2', onPress: item2OnPress },
        ];
        
        const mockOnRequestClose = jest.fn();
        const { getByTestId } = render(
            <ContextMenu
                visible={true}
                anchorFrame={mockAnchorFrame}
                onRequestClose={mockOnRequestClose}
                items={multipleItems}
                testID="context-menu"
            />
        );
        
        fireEvent.press(getByTestId('context-menu-item-item1'));
        expect(item1OnPress).toHaveBeenCalledTimes(1);
        expect(item2OnPress).not.toHaveBeenCalled();
        
        fireEvent.press(getByTestId('context-menu-item-item2'));
        expect(item2OnPress).toHaveBeenCalledTimes(1);
    });

    it('handles items with special characters in keys', () => {
        const specialItems = [
            { key: 'item-with-dash', label: 'Item with dash', onPress: jest.fn() },
            { key: 'item_with_underscore', label: 'Item with underscore', onPress: jest.fn() },
        ];
        
        const mockOnRequestClose = jest.fn();
        const { getByTestId } = render(
            <ContextMenu
                visible={true}
                anchorFrame={mockAnchorFrame}
                onRequestClose={mockOnRequestClose}
                items={specialItems}
                testID="context-menu"
            />
        );
        
        expect(getByTestId('context-menu-item-item-with-dash')).toBeTruthy();
        expect(getByTestId('context-menu-item-item_with_underscore')).toBeTruthy();
    });
});
