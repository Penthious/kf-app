import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import FAQScreen from '../ui/FAQScreen';

describe('FAQScreen', () => {
  it('renders FAQ sections correctly', () => {
    render(
      <ThemeProvider>
        <FAQScreen />
      </ThemeProvider>
    );

    // Check that both sections are rendered
    expect(screen.getByTestId('exploration-section')).toBeTruthy();
    expect(screen.getByTestId('clash-section')).toBeTruthy();
  });

  it('shows section titles', () => {
    render(
      <ThemeProvider>
        <FAQScreen />
      </ThemeProvider>
    );

    expect(screen.getByText('Exploration')).toBeTruthy();
    expect(screen.getByText('Clash')).toBeTruthy();
  });

  it('has correct accessibility labels for sections', () => {
    render(
      <ThemeProvider>
        <FAQScreen />
      </ThemeProvider>
    );

    // Check that sections have proper accessibility labels
    expect(screen.getByLabelText('Expand Exploration section')).toBeTruthy();
    expect(screen.getByLabelText('Expand Clash section')).toBeTruthy();
  });

  it('renders with proper structure', () => {
    render(
      <ThemeProvider>
        <FAQScreen />
      </ThemeProvider>
    );

    // Verify the basic structure is in place
    const explorationSection = screen.getByTestId('exploration-section');
    const clashSection = screen.getByTestId('clash-section');

    expect(explorationSection).toBeTruthy();
    expect(clashSection).toBeTruthy();

    // Check that sections contain their titles
    expect(explorationSection).toHaveTextContent('Exploration');
    expect(clashSection).toHaveTextContent('Clash');
  });
});
