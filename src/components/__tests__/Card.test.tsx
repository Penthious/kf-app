import Card from '@/components/Card';
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

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

describe('Card', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Card>
        <Text>Test Content</Text>
      </Card>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies default styling', () => {
    const { getByTestId } = render(
      <Card testID='test-card'>
        <Text>Content</Text>
      </Card>
    );

    const card = getByTestId('test-card');
    expect(card).toBeTruthy();
  });

  it('merges custom styles with default styles', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <Card testID='test-card' style={customStyle}>
        <Text>Content</Text>
      </Card>
    );

    const card = getByTestId('test-card');
    expect(card).toBeTruthy();
  });

  it('passes through additional props', () => {
    const { getByTestId } = render(
      <Card testID='test-card' accessibilityLabel='Test Card'>
        <Text>Content</Text>
      </Card>
    );

    const card = getByTestId('test-card');
    expect(card).toBeTruthy();
  });
});

describe('Card.Title', () => {
  it('renders title with correct styling', () => {
    const { getByText } = render(<Card.Title>Test Title</Card.Title>);

    expect(getByText('Test Title')).toBeTruthy();
  });

  it('applies title styling', () => {
    const { getByText } = render(<Card.Title>Test Title</Card.Title>);

    const title = getByText('Test Title');
    expect(title).toBeTruthy();
  });
});

describe('Card.BodyText', () => {
  it('renders body text with correct styling', () => {
    const { getByText } = render(<Card.BodyText>Test Body Text</Card.BodyText>);

    expect(getByText('Test Body Text')).toBeTruthy();
  });

  it('applies body text styling', () => {
    const { getByText } = render(<Card.BodyText>Test Body Text</Card.BodyText>);

    const bodyText = getByText('Test Body Text');
    expect(bodyText).toBeTruthy();
  });
});

describe('Card composition', () => {
  it('renders Card with Title and BodyText', () => {
    const { getByText } = render(
      <Card>
        <Card.Title>Card Title</Card.Title>
        <Card.BodyText>Card body content</Card.BodyText>
      </Card>
    );

    expect(getByText('Card Title')).toBeTruthy();
    expect(getByText('Card body content')).toBeTruthy();
  });

  it('handles complex nested content', () => {
    const { getByText } = render(
      <Card>
        <Card.Title>Complex Card</Card.Title>
        <Card.BodyText>First paragraph</Card.BodyText>
        <View>
          <Text>Nested content</Text>
        </View>
        <Card.BodyText>Second paragraph</Card.BodyText>
      </Card>
    );

    expect(getByText('Complex Card')).toBeTruthy();
    expect(getByText('First paragraph')).toBeTruthy();
    expect(getByText('Nested content')).toBeTruthy();
    expect(getByText('Second paragraph')).toBeTruthy();
  });
});
