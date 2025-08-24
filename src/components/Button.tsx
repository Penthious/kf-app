import React from 'react';
import {Pressable, Text, ViewStyle} from 'react-native';
import {useThemeTokens} from '@/theme/ThemeProvider';
type Props = {label: string; onPress: () => void; variant?: 'solid'|'outline'|'ghost'; style?: ViewStyle};
export default function Button({label, onPress, variant='solid', style}: Props){
  const {tokens} = useThemeTokens();
  const base = {padding:12, borderRadius:14} as ViewStyle;
  const styles: Record<string, ViewStyle> = {
    solid: {backgroundColor: tokens.accent},
    outline: {borderWidth:1, borderColor: tokens.accent},
    ghost: {}
  };
  return (
    <Pressable onPress={onPress} style={[base, styles[variant], style]}>
      <Text style={{color: tokens.textPrimary, fontWeight:'600', textAlign:'center'}}>{label}</Text>
    </Pressable>
  );
}
