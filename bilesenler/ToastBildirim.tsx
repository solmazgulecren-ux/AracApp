import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { AcikTema, Golge, KoyuTema, NeonGlow } from '../sabitler/Tema';
import { KullanimDurumTipi, useKullanimDurum } from '../durum/kullanimDurum';

interface ToastVerisi {
  mesaj: string;
  tip: 'basari' | 'hata' | 'bilgi';
  id: number;
}

// Global toast fonksiyonu
let toastGoster: ((mesaj: string, tip?: 'basari' | 'hata' | 'bilgi') => void) | null = null;

export const toastGosterGlobal = (mesaj: string, tip: 'basari' | 'hata' | 'bilgi' = 'basari') => {
  if (toastGoster) {
    toastGoster(mesaj, tip);
  }
};

export const ToastBildirim = () => {
  const [toastlar, setToastlar] = useState<ToastVerisi[]>([]);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  const animasyonDeger = useRef(new Animated.Value(-120)).current;
  const opaklikDeger = useRef(new Animated.Value(0)).current;
  const olcekDeger = useRef(new Animated.Value(0.8)).current;
  const aktifToast = useRef<ToastVerisi | null>(null);

  const toastEkle = useCallback((mesaj: string, tip: 'basari' | 'hata' | 'bilgi' = 'basari') => {
    const yeniToast: ToastVerisi = {
      mesaj,
      tip,
      id: Date.now()
    };
    aktifToast.current = yeniToast;
    setToastlar(prev => [...prev, yeniToast]);

    // Giriş animasyonu
    animasyonDeger.setValue(-120);
    opaklikDeger.setValue(0);
    olcekDeger.setValue(0.8);

    Animated.parallel([
      Animated.spring(animasyonDeger, {
        toValue: 60,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opaklikDeger, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(olcekDeger, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Otomatik kapanma
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(animasyonDeger, {
          toValue: -120,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opaklikDeger, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(olcekDeger, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToastlar(prev => prev.filter(t => t.id !== yeniToast.id));
        aktifToast.current = null;
      });
    }, 2500);
  }, [animasyonDeger, opaklikDeger, olcekDeger]);

  useEffect(() => {
    toastGoster = toastEkle;
    return () => { toastGoster = null; };
  }, [toastEkle]);

  const tipRenkleri = {
    basari: { arka: tema.basari, gradyan: '#059669', ikon: 'checkmark-circle' as const },
    hata: { arka: tema.anaRenk, gradyan: '#DC2626', ikon: 'close-circle' as const },
    bilgi: { arka: tema.ikincilRenk, gradyan: '#2563EB', ikon: 'information-circle' as const },
  };

  if (!aktifToast.current) return null;

  const toast = aktifToast.current;
  const renkler = tipRenkleri[toast.tip];

  return (
    <Animated.View
      style={[
        [stiller.toastKutu, karanlikMod ? NeonGlow : Golge],
        {
          backgroundColor: renkler.arka,
          transform: [
            { translateY: animasyonDeger },
            { scale: olcekDeger }
          ],
          opacity: opaklikDeger,
        },
      ]}
      pointerEvents="none"
    >
      <View style={[stiller.gradyanSerit, { backgroundColor: renkler.gradyan }]} />
      <View style={stiller.icerik}>
        <View style={stiller.ikonKutu}>
          <Ionicons name={renkler.ikon} size={26} color="#FFF" />
        </View>
        <Text style={stiller.mesajMetni} numberOfLines={2}>
          {toast.mesaj}
        </Text>
      </View>
    </Animated.View>
  );
};

const stiller = StyleSheet.create({
  toastKutu: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 99999,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradyanSerit: {
    height: 4,
    width: '100%',
  },
  icerik: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  ikonKutu: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mesajMetni: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    letterSpacing: 0.3,
  },
});
