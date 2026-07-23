import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AcikTema, KoyuTema } from '../../sabitler/Tema';
import { Araba } from '../../tipler';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';

export default function IlanlarEkrani() {
  const router = useRouter();
  const arabalar = useKullanimDurum((state: KullanimDurumTipi) => state.arabalar);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const tema = karanlikMod ? KoyuTema : AcikTema;

  const [aramaKelimesi, setAramaKelimesi] = useState('');
  const [seciliArabaIdleri, setSeciliArabaIdleri] = useState<string[]>([]);

  const filtreliArabalar = arabalar.filter((araba: Araba) =>
    araba.marka.toLowerCase().includes(aramaKelimesi.toLowerCase()) ||
    araba.model.toLowerCase().includes(aramaKelimesi.toLowerCase())
  );

  const arabaSecToggle = (id: string) => {
    setSeciliArabaIdleri(prev =>
      prev.includes(id) ? prev.filter((aId: string) => aId !== id) : [...prev, id]
    );
  };

  const karsilastirGecis = () => {
    if (seciliArabaIdleri.length >= 2) {
      router.push(`/karsilastir?ids=${seciliArabaIdleri.join(',')}`);
    }
  };

  const ArabaKarti = ({ item, index }: { item: Araba; index: number }) => {
    const seciliMi = seciliArabaIdleri.includes(item.id);
    return (
      <Animated.View entering={FadeInDown.delay(index * 60).springify().damping(18)}>
        <TouchableOpacity
          style={[
            stiller.kart,
            { backgroundColor: tema.kartArkaplan, borderColor: seciliMi ? tema.basari : tema.kenarlik },
            seciliMi && { borderWidth: 2 }
          ]}
          onPress={() => router.push(`/araba/${item.id}`)}
          onLongPress={() => arabaSecToggle(item.id)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: item.resimler[0] }} style={stiller.resim} />
          
          {/* Yakıt Türü Badge */}
          <View style={[stiller.yakitBadge, { backgroundColor: item.yakitTuru === 'Elektrik' ? '#10B981' : item.yakitTuru === 'Hibrit' ? '#3B82F6' : tema.vurguRenk }]}>
            <Text style={stiller.yakitMetin}>{item.yakitTuru}</Text>
          </View>

          <View style={stiller.kartIcerik}>
            <Text style={[stiller.baslik, { color: tema.metin }]}>
              {item.marka} {item.model}
            </Text>
            <Text style={[stiller.fiyat, { color: tema.anaRenk }]}>
              {item.fiyat.toLocaleString('tr-TR')} ₺
            </Text>
            <View style={stiller.detayAlani}>
              <View style={[stiller.detayKutu, { backgroundColor: tema.yuzeyRenk }]}>
                <Ionicons name="calendar-outline" size={12} color={tema.metinAcik} />
                <Text style={[stiller.detayMetin, { color: tema.metinAcik }]}>{item.yil}</Text>
              </View>
              <View style={[stiller.detayKutu, { backgroundColor: tema.yuzeyRenk }]}>
                <Ionicons name="speedometer-outline" size={12} color={tema.metinAcik} />
                <Text style={[stiller.detayMetin, { color: tema.metinAcik }]}>{(item.kilometre / 1000).toFixed(0)}K km</Text>
              </View>
              <View style={[stiller.detayKutu, { backgroundColor: tema.yuzeyRenk }]}>
                <Ionicons name="cog-outline" size={12} color={tema.metinAcik} />
                <Text style={[stiller.detayMetin, { color: tema.metinAcik }]}>{item.vites}</Text>
              </View>
            </View>
          </View>
          {seciliMi && (
            <View style={[stiller.secimIkonu, { backgroundColor: tema.basari }]}>
              <Ionicons name="checkmark" size={16} color="#FFF" />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]}>
      {/* Arama */}
      <View style={stiller.aramaKutu}>
        <View style={[stiller.aramaIcerik, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
          <Ionicons name="search" size={18} color={tema.metinAcik} />
          <TextInput
            style={[stiller.aramaGirdi, { color: tema.metin }]}
            placeholder="Marka veya model ara..."
            placeholderTextColor={tema.metinAcik}
            value={aramaKelimesi}
            onChangeText={setAramaKelimesi}
          />
          {aramaKelimesi.length > 0 && (
            <TouchableOpacity onPress={() => setAramaKelimesi('')}>
              <Ionicons name="close-circle" size={18} color={tema.metinAcik} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        key={Platform.OS === 'web' ? 'web-grid' : 'mobile-list'}
        numColumns={Platform.OS === 'web' ? 4 : 1}
        data={filtreliArabalar}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <ArabaKarti item={item} index={index} />}
        contentContainerStyle={[
          stiller.listeAlani,
          Platform.OS === 'web' && { maxWidth: 1200, alignSelf: 'center', width: '100%' }
        ]}
      />

      {seciliArabaIdleri.length >= 2 && (
        <Animated.View entering={FadeInDown.springify()}>
          <TouchableOpacity style={[stiller.karsilastirButon, { backgroundColor: tema.ikincilRenk }]} onPress={karsilastirGecis}>
            <Ionicons name="git-compare" size={20} color="#FFF" />
            <Text style={stiller.karsilastirMetni}>Karşılaştır ({seciliArabaIdleri.length})</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: {
    flex: 1,
  },
  aramaKutu: {
    padding: 12,
    paddingBottom: 4,
  },
  aramaIcerik: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  aramaGirdi: {
    flex: 1,
    fontSize: 14,
  },
  listeAlani: {
    padding: 10,
  },
  kart: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    ...(Platform.OS === 'web' ? { width: 270, marginHorizontal: 10 } : {})
  },
  resim: {
    width: '100%',
    height: 190,
  },
  yakitBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  yakitMetin: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  kartIcerik: {
    padding: 14,
  },
  baslik: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fiyat: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detayAlani: {
    flexDirection: 'row',
    gap: 6,
  },
  detayKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  detayMetin: {
    fontSize: 11,
    fontWeight: '500',
  },
  secimIkonu: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  karsilastirButon: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    gap: 8,
  },
  karsilastirMetni: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
