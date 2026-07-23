import { Kullanici } from "../../tipler";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { toastGosterGlobal } from '../../bilesenler/ToastBildirim';
import { AcikTema, KoyuTema } from '../../sabitler/Tema';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';
import { Aksesuar } from '../../tipler';
import { UstMenu } from '../../bilesenler/UstMenu';

export default function AksesuarDetayEkrani() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const genisEkran = Platform.OS === 'web' && width > 800;

  const aksesuarlar = useKullanimDurum((state: KullanimDurumTipi) => state.aksesuarlar);
  const kullanicilar = useKullanimDurum((state: KullanimDurumTipi) => state.kullanicilar);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const sepeteEkle = useKullanimDurum((state: KullanimDurumTipi) => state.sepeteEkle);
  const karsilastirmayaEkle = useKullanimDurum((state: KullanimDurumTipi) => state.karsilastirmayaEkle);
  const kullaniciKarsilastirmaListesi = useKullanimDurum((state: KullanimDurumTipi) => state.kullaniciKarsilastirmaListesi);
  const tema = karanlikMod ? KoyuTema : AcikTema;

  const aksesuar = aksesuarlar.find((a: Aksesuar) => a.id === id);
  const karsilastirmaListesi = kullaniciKarsilastirmaListesi();

  if (!aksesuar) {
    return (
      <View style={[stiller.anaKutu, { backgroundColor: tema.arkaplan, justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={48} color={tema.metinAcik} />
        <Text style={[stiller.hataMetni, { color: tema.metinAcik }]}>Aksesuar bulunamadı.</Text>
      </View>
    );
  }

  const satici = kullanicilar.find((k: Kullanici) => k.id === aksesuar.saticiId);
  const karsilastirmadaMi = karsilastirmaListesi.includes(aksesuar.id);

  const sepeteEkleIslemi = () => {
    if (aksesuar.stok <= 0) {
      Alert.alert('⚠️ Stok Yok', 'Bu ürün şu anda stokta bulunmamaktadır.');
      return;
    }
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

  const karsilastirIslemi = () => {
    if (karsilastirmadaMi) {
      toastGosterGlobal('Bu ürün zaten karşılaştırma listenizde.', 'bilgi');
      return;
    }
    if (karsilastirmaListesi.length >= 4) {
      toastGosterGlobal('En fazla 4 ürün karşılaştırabilirsiniz.', 'hata');
      return;
    }
    karsilastirmayaEkle(aksesuar.id);
    toastGosterGlobal('📊 Karşılaştırma listesine eklendi!', 'basari');
  };

  const stokRenk = aksesuar.stok <= 0 ? tema.uyariKirmizi : aksesuar.stok <= 10 ? tema.vurguRenk : tema.basari;

  return (
    <View style={{ flex: 1, backgroundColor: tema.arkaplan }}>
      <UstMenu />
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 40 }}>
        <View style={[stiller.icerikKapsayici, genisEkran && stiller.icerikKapsayiciGenis]}>
          
          {/* SOL TARAF: Görsel Alanı */}
          <View style={[stiller.gorselAlan, genisEkran && stiller.gorselAlanGenis]}>
            <View style={stiller.resimKutu}>
              <Image source={{ uri: aksesuar.resimler[0] }} style={stiller.resim} resizeMode="cover" />
              <TouchableOpacity style={stiller.geriButon} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              {aksesuar.kategori && (
                <View style={[stiller.kategoriBadge, { backgroundColor: tema.ikincilRenk + 'DD' }]}>
                  <Text style={stiller.kategoriMetni}>{aksesuar.kategori}</Text>
                </View>
              )}
            </View>
          </View>

          {/* SAĞ TARAF: Bilgi ve İşlem Alanı */}
          <View style={[stiller.bilgiAlan, genisEkran && stiller.bilgiAlanGenis]}>
            <View style={stiller.icerik}>
              {/* Başlık ve Fiyat */}
              <Animated.View entering={FadeInUp.delay(100).springify()} style={stiller.baslikAlani}>
                <Text style={[stiller.baslik, { color: tema.metin }]}>{aksesuar.ad}</Text>
                <View style={[stiller.fiyatKutu, { backgroundColor: tema.anaRenk + '15' }]}>
                  <Text style={[stiller.fiyat, { color: tema.anaRenk }]}>{aksesuar.fiyat.toLocaleString('tr-TR')} ₺</Text>
                </View>
              </Animated.View>

              {/* Durum ve Stok */}
              <Animated.View entering={FadeInDown.delay(200).springify()} style={stiller.badgeAlani}>
                <View style={[stiller.durumBadge, aksesuar.durum === 'Sıfır' ? stiller.sifirBadge : stiller.ikinciElBadge]}>
                  <Ionicons name={aksesuar.durum === 'Sıfır' ? 'pricetag' : 'refresh'} size={14} color="#FFF" />
                  <Text style={stiller.durumMetni}>{aksesuar.durum}</Text>
                </View>
                <View style={[stiller.stokBadge, { backgroundColor: stokRenk + '18' }]}>
                  <View style={[stiller.stokNokta, { backgroundColor: stokRenk }]} />
                  <Text style={[stiller.stokMetin, { color: stokRenk }]}>
                    {aksesuar.stok <= 0 ? 'Tükendi' : `Stok: ${aksesuar.stok}`}
                  </Text>
                </View>
              </Animated.View>

              {/* Açıklama */}
              <Animated.View entering={FadeInDown.delay(300).springify()} style={[stiller.kutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
                <Text style={[stiller.kutuBaslik, { color: tema.metin }]}>Ürün Açıklaması</Text>
                <Text style={[stiller.aciklamaMetin, { color: tema.metinAcik }]}>{aksesuar.aciklama}</Text>
              </Animated.View>

              {/* Satıcı Bilgileri */}
              {satici && (
                <Animated.View entering={FadeInDown.delay(400).springify()} style={[stiller.kutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
                  <Text style={[stiller.kutuBaslik, { color: tema.metin }]}>Satıcı Bilgileri</Text>
                  <View style={stiller.saticiSatir}>
                    <View style={[stiller.saticiIkon, { backgroundColor: tema.ikincilRenk + '15' }]}>
                      <Ionicons name="person" size={16} color={tema.ikincilRenk} />
                    </View>
                    <Text style={[stiller.saticiMetin, { color: tema.metin }]}>{satici.ad} {satici.soyad}</Text>
                  </View>
                  <View style={stiller.saticiSatir}>
                    <View style={[stiller.saticiIkon, { backgroundColor: tema.basari + '15' }]}>
                      <Ionicons name="call" size={14} color={tema.basari} />
                    </View>
                    <Text style={[stiller.saticiMetin, { color: tema.metin }]}>{satici.telefon}</Text>
                  </View>
                  <View style={stiller.saticiSatir}>
                    <View style={[stiller.saticiIkon, { backgroundColor: tema.vurguRenk + '15' }]}>
                      <Ionicons name="star" size={14} color={tema.vurguRenk} />
                    </View>
                    <Text style={[stiller.saticiMetin, { color: tema.metin }]}>
                      {satici.puan} ({satici.degerlendirmeSayisi} değerlendirme)
                    </Text>
                  </View>
                </Animated.View>
              )}

              {/* Aksyon Butonları */}
              <Animated.View entering={FadeInDown.delay(500).springify()} style={stiller.butonAlani}>
                <TouchableOpacity
                  style={[stiller.sepeteEkleButon, { backgroundColor: tema.vurguRenk, opacity: aksesuar.stok <= 0 ? 0.5 : 1 }]}
                  onPress={sepeteEkleIslemi}
                  activeOpacity={0.8}
                  disabled={aksesuar.stok <= 0}
                >
                  <Ionicons name="cart" size={22} color="#FFF" />
                  <Text style={stiller.sepeteEkleMetin}>{aksesuar.stok <= 0 ? 'Stokta Yok' : 'Sepete Ekle'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    stiller.karsilastirButon,
                    { borderColor: tema.ikincilRenk },
                    karsilastirmadaMi && { backgroundColor: tema.ikincilRenk }
                  ]}
                  onPress={karsilastirIslemi}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={karsilastirmadaMi ? 'checkmark-circle' : 'git-compare-outline'}
                    size={22}
                    color={karsilastirmadaMi ? '#FFF' : tema.ikincilRenk}
                  />
                  <Text style={[stiller.karsilastirMetin, { color: karsilastirmadaMi ? '#FFF' : tema.ikincilRenk }]}>
                    {karsilastirmadaMi ? 'Eklendi' : 'Karşılaştır'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: {
    flex: 1,
  },
  icerikKapsayici: {
    width: '100%',
    flexDirection: 'column',
  },
  icerikKapsayiciGenis: {
    flexDirection: 'row',
    maxWidth: 1200,
    marginTop: 20,
    alignItems: 'flex-start',
    gap: 24,
    paddingHorizontal: 20,
  },
  gorselAlan: {
    width: '100%',
  },
  gorselAlanGenis: {
    flex: 1,
    position: 'sticky' as any,
    top: 20,
  },
  bilgiAlan: {
    width: '100%',
  },
  bilgiAlanGenis: {
    flex: 1,
    padding: 0,
  },
  hataMetni: {
    fontSize: 16,
    marginTop: 12,
  },
  resimKutu: {
    position: 'relative',
    height: 350,
    width: '100%',
    ...(Platform.OS === 'web' && { borderRadius: 16, overflow: 'hidden' }),
  },
  resim: {
    width: '100%',
    height: '100%',
  },
  geriButon: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 10,
    borderRadius: 14,
  },
  kategoriBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  kategoriMetni: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  icerik: {
    padding: 16,
  },
  baslikAlani: {
    marginBottom: 14,
  },
  baslik: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fiyatKutu: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  fiyat: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  badgeAlani: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  durumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  sifirBadge: {
    backgroundColor: '#10B981',
  },
  ikinciElBadge: {
    backgroundColor: '#F59E0B',
  },
  durumMetni: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  stokBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  stokNokta: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stokMetin: {
    fontSize: 13,
    fontWeight: '600',
  },
  kutu: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  kutuBaslik: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aciklamaMetin: {
    fontSize: 15,
    lineHeight: 23,
  },
  saticiSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  saticiIkon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saticiMetin: {
    fontSize: 14,
  },
  butonAlani: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  sepeteEkleButon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sepeteEkleMetin: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  karsilastirButon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    gap: 8,
  },
  karsilastirMetin: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
