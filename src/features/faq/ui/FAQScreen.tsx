import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

interface FAQSectionProps {
  title: string;
  children: React.ReactNode;
  testID?: string;
}

function FAQSection({ title, children, testID }: FAQSectionProps) {
  const { tokens } = useThemeTokens();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.section, { backgroundColor: tokens.card }]} testID={testID}>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.sectionHeader}
        accessibilityRole='button'
        accessibilityLabel={`${isExpanded ? 'Collapse' : 'Expand'} ${title} section`}
      >
        <Text style={[styles.sectionTitle, { color: tokens.textPrimary }]}>{title}</Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={tokens.textPrimary}
        />
      </Pressable>

      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
}

export default function FAQScreen() {
  const { tokens } = useThemeTokens();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: tokens.bg }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: tokens.textPrimary }]}>Frequently Asked Questions</Text>

      <FAQSection title='Exploration' testID='exploration-section'>
        <Text style={[styles.placeholderText, { color: tokens.textMuted }]}>
          Exploration FAQs will be added here...
        </Text>
      </FAQSection>

      <FAQSection title='Clash' testID='clash-section'>
        <Text style={[styles.placeholderText, { color: tokens.textMuted }]}>
          Clash FAQs will be added here...
        </Text>
      </FAQSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  placeholderText: {
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
