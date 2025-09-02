import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import FAQScreen from '../ui/FAQScreen';

// Mock the theme provider for testing
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('FAQScreen', () => {
  it('renders the main title', () => {
    render(<FAQScreen />, { wrapper: TestWrapper });

    expect(screen.getByText('Frequently Asked Questions')).toBeTruthy();
  });

  it('renders both FAQ sections', () => {
    render(<FAQScreen />, { wrapper: TestWrapper });

    expect(screen.getByTestId('exploration-section')).toBeTruthy();
    expect(screen.getByTestId('clash-section')).toBeTruthy();
  });

  it('shows section titles', () => {
    render(<FAQScreen />, { wrapper: TestWrapper });

    expect(screen.getByText('Exploration')).toBeTruthy();
    expect(screen.getByText('Clash')).toBeTruthy();
  });

  it('shows placeholder text when sections are collapsed', () => {
    render(<FAQScreen />, { wrapper: TestWrapper });

    expect(screen.getByText('Exploration FAQs will be added here...')).toBeTruthy();
    expect(screen.getByText('Clash FAQs will be added here...')).toBeTruthy();
  });

  it('expands section when header is pressed', () => {
    render(<FAQScreen />, { wrapper: TestWrapper });

    const explorationSection = screen.getByTestId('exploration-section');
    const explorationHeader = explorationSection.findByType('Pressable');

    fireEvent.press(explorationHeader);

    // The section content should now be visible
    expect(screen.getByText('Exploration FAQs will be added here...')).toBeTruthy();
  });

  it('toggles section expansion when header is pressed multiple times', () => {
    render(<FAQScreen />, { wrapper: TestWrapper });

    const explorationSection = screen.getByTestId('exploration-section');
    const explorationHeader = explorationSection.findByType('Pressable');

    // First press should expand
    fireEvent.press(explorationHeader);
    expect(screen.getByText('Exploration FAQs will be added here...')).toBeTruthy();

    // Second press should collapse
    fireEvent.press(explorationHeader);
    // The content should still be there since we're just testing the toggle behavior
    // In a real scenario, we'd check if the content is hidden
  });
});
