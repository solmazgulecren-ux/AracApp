import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { toastGosterGlobal } from '../../bilesenler/ToastBildirim';
import { AcikTema, KoyuTema } from '../../sabitler/Tema';
import { Aksesuar } from '../../tipler';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';

export default function AksesuarEkrani() {
  const router = useRouter();
  const aksesuarlar = useKullanimDurum((state: KullanimDurumTipi) => state.aksesuarlar);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const sepeteEkle = useKullanimDurum((state: KullanimDurumTipi) => state.sepeteEkle);
  const tema = karanlikMod ? KoyuTema : AcikTema;

  const [aramaKelimesi, setAramaKelimesi] = useState('');
  const [seciliKategori, setSeciliKategori] = useState<string | null>(null);

  // Kategorileri topla
  const kategoriler = [...new Set(aksesuarlar.map((a: Aksesuar) => a.kategori).filter(Boolean))] as string[];

  // Filtreleme
  const filtreliAksesuarlar = aksesuarlar.filter((a: Aksesuar) => {
    const aramaUyumu = a.ad.toLowerCase().includes(aramaKelimesi.toLowerCase());
    const kategoriUyumu = !seciliKategori || a.kategori === seciliKategori;
    return aramaUyumu && kategoriUyumu;
  });

  const sepeteEkleIslemi = (aksesuar: Aksesuar) => {
    sepeteEkle(aksesuar.id);
    toastGosterGlobal('🛒 Ürün sepete eklendi!', 'basari');
    Alert.alert(
      '🛒 Sepete Eklendi',
      `"${aksesuar.ad}" başarıyla sepetinize eklendi.`,
      [
        { text: 'Alışverişe Devam', style: 'cancel' },
        { text: 'Sepete Git', onPress: () => router.push('/sepet'), style: 'default' },
      ]
    );
  };

  const AksesuarKarti = ({ item, index }: { item: Aksesuar; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 60).springify().damping(18)}>
      <View style={[stiller.kart, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }, Platform.OS === 'web' && { maxWidth: 280, marginHorizontal: 8 }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push(`/aksesuar/${item.id}` as any)}
        >
          <Image source={{ uri: item.resimler[0] }} style={stiller.resim} />
          {item.kategori && (
            <View style={[stiller.kategoriBadge, { backgroundColor: tema.ikincilRenk + 'DD' }]}>
              <Text style={stiller.kategoriBadgeMetni}>{item.kategori}</Text>
            </View>
          )}
          {item.stok <= 5 && item.stok > 0 && (
            <View style={[stiller.stokBadge, { backgroundColor: tema.vurguRenk }]}>
              <Text style={stiller.stokBadgeMetni}>Son {item.stok} adet!</Text>
            </View>
          )}
          {item.stok <= 0 && (
            <View style={[stiller.stokBadge, { backgroundColor: tema.uyariKirmizi }]}>
              <Text style={stiller.stokBadgeMetni}>Tükendi</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={stiller.kartIcerik}>
          <Text style={[stiller.baslik, { color: tema.metin }]} numberOfLines={2}>
            {item.ad}
          </Text>
          <View style={[stiller.durumKutu, item.durum === 'Sıfır' ? { backgroundColor: '#D1FAE5' } : { backgroundColor: '#FEF3C7' }]}>
            <Text style={[stiller.durumMetni, item.durum === 'Sıfır' ? { color: '#065F46' } : { color: '#92400E' }]}>{item.durum}</Text>
          </View>
          <Text style={[stiller.fiyat, { color: tema.anaRenk }]}>{item.fiyat.toLocaleString('tr-TR')} ₺</Text>
          <View style={stiller.butonAlani}>
            <TouchableOpacity
              style={[stiller.inceleButon, { backgroundColor: tema.ikincilRenk }]}
              onPress={() => router.push(`/aksesuar/${item.id}` as any)}
            >
              <Ionicons name="eye-outline" size={14} color="#FFF" />
              <Text style={stiller.butonMetin}>İncele</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[stiller.sepeteEkleButon, { backgroundColor: tema.vurguRenk }]}
              onPress={() => sepeteEkleIslemi(item)}
              disabled={item.stok <= 0}
            >
              <Ionicons name="cart-outline" size={14} color="#FFF" />
              <Text style={stiller.butonMetin}>Sepet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]}>
      {/* Arama Alanı */}
      <View style={[stiller.aramaKutu, Platform.OS === 'web' && { maxWidth: 600, width: '100%', alignSelf: 'center' }]}>
        <View style={[stiller.aramaIcerik, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
          <Ionicons name="search" size={18} color={tema.metinAcik} />
          <TextInput
            style={[stiller.aramaGirdi, { color: tema.metin }]}
            placeholder="Aksesuar ara..."
            placeholderTextColor={tema.metinAcik}
            value={aramaKelimesi}
            onChangeText={setAramaKelimesi}
          />
        </View>
      </View>

      {/* Kategori Filtreleri */}
      <View style={[stiller.kategoriAlani, Platform.OS === 'web' && { maxWidth: 1200, width: '100%', alignSelf: 'center' }]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[null, ...kategoriler]}
          keyExtractor={(item, index) => item || `tumu-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                stiller.kategoriButon,
                { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik },
                seciliKategori === item && { backgroundColor: tema.anaRenk, borderColor: tema.anaRenk },
              ]}
              onPress={() => setSeciliKategori(item)}
            >
              <Text
                style={[
                  stiller.kategoriButonMetni,
                  { color: tema.metinAcik },
                  seciliKategori === item && { color: '#FFF' },
                ]}
              >
                {item || 'Tümü'}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={stiller.kategoriListe}
        />
      </View>

      {/* Aksesuar Listesi */}
      <FlatList
        key={Platform.OS === 'web' ? 'web-grid-aks' : 'mobile-list-aks'}
        data={filtreliAksesuarlar}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <AksesuarKarti item={item} index={index} />}
        contentContainerStyle={[
          stiller.listeAlani,
          Platform.OS === 'web' && { maxWidth: 1200, alignSelf: 'center', width: '100%' }
        ]}
        numColumns={Platform.OS === 'web' ? 4 : 2}
        columnWrapperStyle={Platform.OS === 'web' ? { gap: 16, marginBottom: 16 } : stiller.sutunlar}
      />
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: {
    flex: 1,
  },
  aramaKutu: {
    paddingHorizontal: 12,
    paddingTop: 8,
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
  },
  aramaGirdi: {
    flex: 1,
    fontSize: 14,
  },
  kategoriAlani: {
    paddingTop: 6,
    paddingBottom: 4,
  },
  kategoriListe: {
    paddingHorizontal: 12,
    gap: 8,
  },
  kategoriButon: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  kategoriButonMetni: {
    fontSize: 12,
    fontWeight: '600',
  },
  listeAlani: {
    padding: 8,
  },
  sutunlar: {
    gap: 8,
  },
  kart: {
    flex: 1,
    borderRadius: 16,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  resim: {
    width: '100%',
    height: 120,
  },
  kategoriBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  kategoriBadgeMetni: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  stokBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stokBadgeMetni: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  kartIcerik: {
    padding: 10,
  },
  baslik: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    lineHeight: 16,
  },
  durumKutu: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 5,
  },
  durumMetni: {
    fontSize: 9,
    fontWeight: '700',
  },
  fiyat: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  butonAlani: {
    flexDirection: 'row',
    gap: 5,
  },
  inceleButon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 10,
    gap: 3,
  },
  sepeteEkleButon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 10,
    gap: 3,
  },
  butonMetin: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
});
