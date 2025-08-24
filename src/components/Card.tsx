import React from 'react';
import {View, ViewStyle} from 'react-native';
import {useThemeTokens} from '@/theme/ThemeProvider';
export default function Card({children, style}:{children:React.ReactNode; style?: ViewStyle}){
  const {tokens} = useThemeTokens();
  return <View style={[{backgroundColor: tokens.card, padding:12, borderRadius:16}, style]}>{children}</View>;
}
