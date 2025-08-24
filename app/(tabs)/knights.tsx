import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function KnightsScreen(){
  return (
      <View style={{flex:1}}>
          <ScrollView contentContainerStyle={{padding:16, gap:12}}>
              <Card><Text style={{color:'#fff'}}>This is the keyword tab.</Text></Card>
          </ScrollView>
      </View>
  );
}
