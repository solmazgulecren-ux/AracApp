import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AcikTema, KoyuTema } from '../sabitler/Tema';
import { KullanimDurumTipi, useKullanimDurum } from '../durum/kullanimDurum';

const { width: EKRAN_GENISLIGI } = Dimensions.get('window');

// Basit araba emoji bileşeni (Reanimated yerine Animated API ile)
const ArabaAnimasyonu = () => {
  const arabaX = useRef(new Animated.Value(-100)).current;
  const arabaOpaklik = useRef(new Animated.Value(0)).current;
  const tekerlekDonme = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Araba soldan sağa geçiş
    Animated.sequence([
      Animated.timing(arabaOpaklik, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(arabaX, {
        toValue: EKRAN_GENISLIGI + 100,
        duration: 2000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
    ]).start();

    // Tekerlek dönme animasyonu
    Animated.loop(
      Animated.timing(tekerlekDonme, {
        toValue: 1,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = tekerlekDonme.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        stiller.arabaKutu,
        {
          transform: [{ translateX: arabaX }],
          opacity: arabaOpaklik,
        },
      ]}
    >
      {/* Araba gövdesi */}
      <View style={stiller.arabaGovde}>
        <View style={stiller.arabaCati} />
        <View style={stiller.arabaAlt} />
        {/* Camlar */}
        <View style={stiller.onCam} />
        <View style={stiller.arkaCam} />
      </View>
      {/* Tekerlekler */}
      <Animated.View style={[stiller.tekerlek, stiller.onTekerlek, { transform: [{ rotate: spin }] }]}>
        <View style={stiller.tekerlekJant} />
      </Animated.View>
      <Animated.View style={[stiller.tekerlek, stiller.arkaTekerlek, { transform: [{ rotate: spin }] }]}>
        <View style={stiller.tekerlekJant} />
      </Animated.View>
      {/* Egzoz dumanı */}
      <View style={stiller.egzozDuman1} />
      <View style={stiller.egzozDuman2} />
    </Animated.View>
  );
};

// Tik İşareti Animasyonu
const TikAnimasyonu = () => {
  const tikOlcek = useRef(new Animated.Value(0)).current;
  const tikOpaklik = useRef(new Animated.Value(0)).current;
  const halkaOlcek = useRef(new Animated.Value(0.5)).current;
  const halkaOpaklik = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const gecikme = setTimeout(() => {
      Animated.parallel([
        // Halka efekti
        Animated.sequence([
          Animated.timing(halkaOpaklik, { toValue: 0.6, duration: 300, useNativeDriver: true }),
          Animated.timing(halkaOlcek, { toValue: 1.5, duration: 600, useNativeDriver: true }),
          Animated.timing(halkaOpaklik, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
        // Tik işareti
        Animated.sequence([
          Animated.delay(200),
          Animated.parallel([
            Animated.spring(tikOlcek, { toValue: 1, friction: 4, tension: 100, useNativeDriver: true }),
            Animated.timing(tikOpaklik, { toValue: 1, duration: 300, useNativeDriver: true }),
          ]),
        ]),
      ]).start();
    }, 1500);

    return () => clearTimeout(gecikme);
  }, []);

  return (
    <View style={stiller.tikAlani}>
      {/* Halka efekti */}
      <Animated.View
        style={[
          stiller.halka,
          {
            transform: [{ scale: halkaOlcek }],
            opacity: halkaOpaklik,
          },
        ]}
      />
      {/* Tik dairesi */}
      <Animated.View
        style={[
          stiller.tikDaire,
          {
            transform: [{ scale: tikOlcek }],
            opacity: tikOpaklik,
          },
        ]}
      >
        <Ionicons name="checkmark" size={52} color="#FFF" />
      </Animated.View>
    </View>
  );
};

// Confetti/Kutlama parçacıkları
const KutlamaEfekti = () => {
  const parcaciklar = Array.from({ length: 15 }, (_, i) => {
    const animY = useRef(new Animated.Value(-20)).current;
    const animX = useRef(new Animated.Value(0)).current;
    const animOpaklik = useRef(new Animated.Value(0)).current;
    const animDonme = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const gecikme = 1800 + Math.random() * 500;
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(animY, {
            toValue: 400 + Math.random() * 200,
            duration: 2000 + Math.random() * 1000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(animX, {
            toValue: (Math.random() - 0.5) * EKRAN_GENISLIGI * 0.8,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(animOpaklik, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.delay(1200),
            Animated.timing(animOpaklik, { toValue: 0, duration: 800, useNativeDriver: true }),
          ]),
          Animated.timing(animDonme, {
            toValue: Math.random() * 4,
            duration: 2500,
            useNativeDriver: true,
          }),
        ]).start();
      }, gecikme);

      return () => clearTimeout(timeout);
    }, []);

    const renkler = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD93D', '#6BCB77', '#C084FC'];
    const renk = renkler[i % renkler.length];
    const boyut = 8 + Math.random() * 12;

    const spin = animDonme.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        key={i}
        style={[
          stiller.parcacik,
          {
            backgroundColor: renk,
            width: boyut,
            height: boyut,
            borderRadius: Math.random() > 0.5 ? boyut / 2 : 2,
            left: EKRAN_GENISLIGI * 0.5,
            transform: [
              { translateX: animX },
              { translateY: animY },
              { rotate: spin },
            ],
            opacity: animOpaklik,
          },
        ]}
      />
    );
  });

  return <View style={stiller.kutlamaAlani}>{parcaciklar}</View>;
};

export default function SiparisBasariliEkrani() {
  const router = useRouter();
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const tema = karanlikMod ? KoyuTema : AcikTema;

  const mesajOpaklik = useRef(new Animated.Value(0)).current;
  const mesajY = useRef(new Animated.Value(30)).current;
  const butonOpaklik = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Mesaj ve butonlar gecikmeli görünüm
    const t1 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(mesajOpaklik, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(mesajY, { toValue: 0, duration: 600, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      ]).start();
    }, 2200);

    const t2 = setTimeout(() => {
      Animated.timing(butonOpaklik, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, 2800);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <View style={[stiller.anaKutu, karanlikMod && stiller.anaKutuKaranlik]}>
      <KutlamaEfekti />

      {/* Araba animasyonu yol çizgisi ile */}
      <View style={stiller.yolAlani}>
        <View style={[stiller.yolCizgi, { backgroundColor: tema.kenarlik }]} />
        <ArabaAnimasyonu />
      </View>

      {/* Tik İşareti */}
      <TikAnimasyonu />

      {/* Başarı Mesajı */}
      <Animated.View
        style={[
          stiller.mesajAlani,
          {
            opacity: mesajOpaklik,
            transform: [{ translateY: mesajY }],
          },
        ]}
      >
        <Text style={[stiller.basariBaslik, karanlikMod && stiller.metinKaranlik]}>
          Siparişiniz Alındı! 🎉
        </Text>
        <Text style={[stiller.basariAciklama, karanlikMod && stiller.metinSoluk]}>
          Siparişiniz başarıyla oluşturuldu. Kısa süre içinde hazırlanıp kargoya verilecektir.
        </Text>
      </Animated.View>

      {/* Butonlar */}
      <Animated.View style={[stiller.butonAlani, { opacity: butonOpaklik }]}>
        <TouchableOpacity
          style={[stiller.siparislerimButon, { backgroundColor: tema.anaRenk }]}
          onPress={() => router.replace('/(sekmeler)/profil')}
          activeOpacity={0.85}
        >
          <Ionicons name="list-outline" size={20} color="#FFF" />
          <Text style={stiller.siparislerimMetin}>Siparişlerimi Gör</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[stiller.anaSayfaButon, { backgroundColor: tema.kartArkaplan, borderColor: tema.anaRenk }]}
          onPress={() => router.replace('/(sekmeler)/ilanlar')}
          activeOpacity={0.85}
        >
          <Ionicons name="home-outline" size={20} color={tema.anaRenk} />
          <Text style={[stiller.anaSayfaMetin, { color: tema.anaRenk }]}>Ana Sayfaya Dön</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  anaKutuKaranlik: { backgroundColor: '#0A0A0C' },
  // Yol alanı
  yolAlani: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    marginBottom: 30,
  },
  yolCizgi: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#E0E0E0',
  },
  // Araba
  arabaKutu: {
    position: 'absolute',
    bottom: 15,
    width: 80,
    height: 40,
  },
  arabaGovde: {
    position: 'relative',
    width: 80,
    height: 30,
  },
  arabaCati: {
    position: 'absolute',
    top: 0,
    left: 18,
    width: 40,
    height: 14,
    backgroundColor: '#1B4DFF',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 12,
  },
  arabaAlt: {
    position: 'absolute',
    bottom: 0,
    left: 2,
    width: 76,
    height: 16,
    backgroundColor: '#1B4DFF',
    borderRadius: 4,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 8,
  },
  onCam: {
    position: 'absolute',
    top: 2,
    left: 44,
    width: 12,
    height: 10,
    backgroundColor: '#87CEEB',
    borderTopRightRadius: 6,
  },
  arkaCam: {
    position: 'absolute',
    top: 2,
    left: 22,
    width: 14,
    height: 10,
    backgroundColor: '#87CEEB',
    borderTopLeftRadius: 4,
  },
  tekerlek: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#333',
    bottom: -4,
  },
  onTekerlek: { right: 10 },
  arkaTekerlek: { left: 10 },
  tekerlekJant: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999',
  },
  egzozDuman1: {
    position: 'absolute',
    left: -8,
    bottom: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(200,200,200,0.4)',
  },
  egzozDuman2: {
    position: 'absolute',
    left: -18,
    bottom: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(200,200,200,0.2)',
  },
  // Tik animasyonu
  tikAlani: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    height: 120,
  },
  halka: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#34C759',
  },
  tikDaire: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  // Mesaj
  mesajAlani: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  basariBaslik: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 12,
  },
  basariAciklama: {
    fontSize: 15,
    color: '#606060',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Butonlar
  butonAlani: {
    width: '100%',
    paddingHorizontal: 30,
    gap: 12,
  },
  siparislerimButon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    elevation: 4,
  },
  siparislerimMetin: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  anaSayfaButon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    borderWidth: 2,
    borderColor: '#D32F2F',
  },
  anaSayfaButonKaranlik: { backgroundColor: '#1C1C24' },
  anaSayfaMetin: { color: '#D32F2F', fontSize: 16, fontWeight: 'bold' },
  // Kutlama
  kutlamaAlani: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  parcacik: {
    position: 'absolute',
    top: 0,
  },
  metinKaranlik: { color: '#F0F2F5' },
  metinSoluk: { color: '#9E9E9E' },
});
