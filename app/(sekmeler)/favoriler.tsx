import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AcikTema, KoyuTema } from '../../sabitler/Tema';
import { Aksesuar, Araba, Favori } from '../../tipler';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';

export default function FavorilerEkrani() {
  const router = useRouter();
  const arabalar = useKullanimDurum((state: KullanimDurumTipi) => state.arabalar);
  const aksesuarlar = useKullanimDurum((state: KullanimDurumTipi) => state.aksesuarlar);
  const favoriler = useKullanimDurum((state: KullanimDurumTipi) => state.favoriler);
  const aktifKullanici = useKullanimDurum((state: KullanimDurumTipi) => state.aktifKullanici);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const favoriDegistir = useKullanimDurum((state: KullanimDurumTipi) => state.favoriDegistir);
  const favoriAksesuarDegistir = useKullanimDurum((state: KullanimDurumTipi) => state.favoriAksesuarDegistir);
  const tema = karanlikMod ? KoyuTema : AcikTema;

  const [aktifSekme, setAktifSekme] = useState<'arabalar' | 'aksesuarlar'>('arabalar');

  const kullaniciFavorileri = favoriler.filter((f: Favori) => f.kullaniciId === aktifKullanici?.id);
  const favoriArabalar = arabalar.filter((araba: Araba) => kullaniciFavorileri.some((f: Favori) => f.arabaId === araba.id));
  const favoriAksesuarListesi = aksesuarlar.filter((aks: Aksesuar) => kullaniciFavorileri.some((f: Favori) => f.aksesuarId === aks.id));

  const arabaKartiCiz = ({ item, index }: { item: Araba; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 80).springify().damping(18)}>
      <TouchableOpacity
        style={[stiller.kart, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }, Platform.OS === 'web' && { maxWidth: 600, alignSelf: 'center', width: '100%' }]}
        onPress={() => router.push(`/araba/${item.id}` as any)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.resimler[0] }} style={stiller.resim} />
        <View style={stiller.kartIcerik}>
          <Text style={[stiller.baslik, { color: tema.metin }]}>
            {item.marka} {item.model}
          </Text>
          <Text style={[stiller.fiyat, { color: tema.anaRenk }]}>
            {item.fiyat.toLocaleString('tr-TR')} ₺
          </Text>
          <View style={stiller.detaySatir}>
            <View style={[stiller.detayKutu, { backgroundColor: tema.yuzeyRenk }]}>
              <Text style={[stiller.detayMetin, { color: tema.metinAcik }]}>{item.yil}</Text>
            </View>
            <View style={[stiller.detayKutu, { backgroundColor: tema.yuzeyRenk }]}>
              <Text style={[stiller.detayMetin, { color: tema.metinAcik }]}>{item.vites}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={stiller.favoriButon}
          onPress={() => favoriDegistir(item.id)}
        >
          <Ionicons name="heart" size={22} color={tema.anaRenk} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  const aksesuarKartiCiz = ({ item, index }: { item: Aksesuar; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 80).springify().damping(18)}>
      <TouchableOpacity
        style={[stiller.kart, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }, Platform.OS === 'web' && { maxWidth: 600, alignSelf: 'center', width: '100%' }]}
        onPress={() => router.push(`/aksesuar/${item.id}` as any)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.resimler[0] }} style={stiller.resim} />
        <View style={stiller.kartIcerik}>
          <Text style={[stiller.baslik, { color: tema.metin }]}>
            {item.ad}
          </Text>
          <Text style={[stiller.fiyat, { color: tema.anaRenk }]}>
            {item.fiyat.toLocaleString('tr-TR')} ₺
          </Text>
          <View style={stiller.detaySatir}>
            <View style={[stiller.detayKutu, { backgroundColor: tema.yuzeyRenk }]}>
              <Text style={[stiller.detayMetin, { color: tema.metinAcik }]}>{item.kategori}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={stiller.favoriButon}
          onPress={() => favoriAksesuarDegistir(item.id)}
        >
          <Ionicons name="heart" size={22} color={tema.anaRenk} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  const veriListesi = aktifSekme === 'arabalar' ? favoriArabalar : favoriAksesuarListesi;

  return (
    <View style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]}>
      
      {/* Sekmeler */}
      <View style={stiller.sekmeKutu}>
        <TouchableOpacity 
          style={[stiller.sekmeButon, aktifSekme === 'arabalar' && { borderBottomColor: tema.anaRenk, borderBottomWidth: 2 }]}
          onPress={() => setAktifSekme('arabalar')}
        >
          <Ionicons name="car-sport" size={18} color={aktifSekme === 'arabalar' ? tema.anaRenk : tema.metinAcik} />
          <Text style={[stiller.sekmeMetin, { color: aktifSekme === 'arabalar' ? tema.anaRenk : tema.metinAcik }]}>Arabalar ({favoriArabalar.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[stiller.sekmeButon, aktifSekme === 'aksesuarlar' && { borderBottomColor: tema.anaRenk, borderBottomWidth: 2 }]}
          onPress={() => setAktifSekme('aksesuarlar')}
        >
          <Ionicons name="cube" size={18} color={aktifSekme === 'aksesuarlar' ? tema.anaRenk : tema.metinAcik} />
          <Text style={[stiller.sekmeMetin, { color: aktifSekme === 'aksesuarlar' ? tema.anaRenk : tema.metinAcik }]}>Aksesuarlar ({favoriAksesuarListesi.length})</Text>
        </TouchableOpacity>
      </View>

      {veriListesi.length === 0 ? (
        <View style={stiller.merkez}>
          <View style={[stiller.bosIkon, { backgroundColor: tema.anaRenk + '15' }]}>
            <Ionicons name="heart-outline" size={48} color={tema.anaRenk} />
          </View>
          <Text style={[stiller.bosBaslik, { color: tema.metin }]}>
            Henüz favori {aktifSekme === 'arabalar' ? 'ilanınız' : 'aksesuarınız'} yok
          </Text>
          <Text style={[stiller.bosMetin, { color: tema.metinAcik }]}>
            Beğendiğiniz ürünleri favorilere ekleyin
          </Text>
        </View>
      ) : (
        <FlatList<any>
          key={aktifSekme}
          data={veriListesi}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => 
            aktifSekme === 'arabalar' ? arabaKartiCiz({ item: item as Araba, index }) : aksesuarKartiCiz({ item: item as Aksesuar, index })
          }
          contentContainerStyle={[stiller.listeAlani, Platform.OS === 'web' && { width: '100%' }]}
        />
      )}
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: {
    flex: 1,
  },
  sekmeKutu: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    justifyContent: 'center',
  },
  sekmeButon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  sekmeMetin: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  merkez: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  bosIkon: {
    width: 90,
    height: 90,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bosBaslik: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  bosMetin: {
    fontSize: 14,
    textAlign: 'center',
  },
  listeAlani: {
    padding: 12,
  },
  kart: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  resim: {
    width: 100,
    height: 80,
    borderRadius: 12,
  },
  kartIcerik: {
    flex: 1,
    paddingHorizontal: 12,
  },
  baslik: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fiyat: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  detaySatir: {
    flexDirection: 'row',
    gap: 6,
  },
  detayKutu: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  detayMetin: {
    fontSize: 10,
    fontWeight: '600',
  },
  favoriButon: {
    padding: 8,
  },
});
