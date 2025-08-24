import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Card from '@/components/Card';
import Button from '@/components/Button';
import {useThemeTokens} from "@/theme/ThemeProvider";

export default function EncounterScreen(){
    const {tokens} = useThemeTokens();
  return (
    <View style={{flex:1, }}>
      <ScrollView contentContainerStyle={{padding:16, gap:12}}>
        <Card><Text style={{color:'#fff'}}>This is the Encounter tab.</Text></Card>
      </ScrollView>
    </View>
  );
}
