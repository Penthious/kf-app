import Card from '@/components/Card';
import { ScrollView, Text, View } from 'react-native';

export default function ThemeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Card>
          <Text style={{ color: '#fff' }}>This is the keyword tab.</Text>
        </Card>
      </ScrollView>
    </View>
  );
}
