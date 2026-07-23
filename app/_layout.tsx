import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { ToastBildirim } from '../bilesenler/ToastBildirim';
import { KullanimDurumTipi, useKullanimDurum } from '../durum/kullanimDurum';

export default function KokYerlesim() {
  const verileriYukle = useKullanimDurum((state: KullanimDurumTipi) => state.verileriYukle);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);

  useEffect(() => {
    verileriYukle();

    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        input:focus, textarea:focus, select:focus {
          outline: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="kayit" />
        <Stack.Screen name="ilanver" />
        <Stack.Screen name="karsilastir" />
        <Stack.Screen name="chatbot" />
        <Stack.Screen name="sepet" />
        <Stack.Screen name="odeme" />
        <Stack.Screen name="siparisBasarili" />
        <Stack.Screen name="(sekmeler)" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="araba/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="aksesuar/[id]" options={{ presentation: 'card' }} />
      </Stack>
      <ToastBildirim />
      <StatusBar style={karanlikMod ? 'light' : 'dark'} />
    </>
  );
}
