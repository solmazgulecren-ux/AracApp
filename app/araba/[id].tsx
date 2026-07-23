import { Kullanici } from "../../tipler";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, useWindowDimensions } from 'react-native';
import { toastGosterGlobal } from '../../bilesenler/ToastBildirim';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';
import { Araba, Favori } from '../../tipler';
import { UstMenu } from '../../bilesenler/UstMenu';
import { AcikTema, KoyuTema } from '../../sabitler/Tema';

export default function ArabaDetayEkrani() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const genisEkran = Platform.OS === 'web' && width > 800;

  const arabalar = useKullanimDurum((state: KullanimDurumTipi) => state.arabalar);
  const kullanicilar = useKullanimDurum((state: KullanimDurumTipi) => state.kullanicilar);
  const favoriler = useKullanimDurum((state: KullanimDurumTipi) => state.favoriler);
  const favoriDegistir = useKullanimDurum((state: KullanimDurumTipi) => state.favoriDegistir);
  const aktifKullanici = useKullanimDurum((state: KullanimDurumTipi) => state.aktifKullanici);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  
  const arabaSil = useKullanimDurum((state: KullanimDurumTipi) => state.arabaSil);
  const karsilastirmayaEkle = useKullanimDurum((state: KullanimDurumTipi) => state.karsilastirmayaEkle);
  const kullaniciKarsilastirmaListesi = useKullanimDurum((state: KullanimDurumTipi) => state.kullaniciKarsilastirmaListesi);
  const karsilastirmaListesi = kullaniciKarsilastirmaListesi();

  const araba = arabalar.find((a: Araba) => a.id === id);

  if (!araba) {
    return (
      <View style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]}>
        <UstMenu />
        <Text style={[stiller.hataMetni, { color: tema.metin }]}>Araç bulunamadı.</Text>
      </View>
    );
  }

  const satici = kullanicilar.find((k: Kullanici) => k.id === araba.saticiId);
  const favoriMi = favoriler.some((f: Favori) => f.arabaId === id && f.kullaniciId === aktifKullanici?.id);
  
  const ilanSahibiMi = aktifKullanici?.id === araba.saticiId;
  const karsilastirmadaMi = karsilastirmaListesi.includes(araba.id);

  const silmeIslemi = () => {
    Alert.alert(
      'İlanı Sil',
      `"${araba.marka} ${araba.model}" ilanını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            const basarili = arabaSil(araba.id);
            if (basarili) {
              toastGosterGlobal('🗑️ İlan başarıyla silindi.', 'basari');
              router.back();
            } else {
              toastGosterGlobal('İlan silinirken bir hata oluştu.', 'hata');
            }
          }
        }
      ]
    );
  };

  const karsilastirIslemi = () => {
    if (karsilastirmadaMi) {
      toastGosterGlobal('Bu araç zaten karşılaştırma listenizde.', 'bilgi');
      return;
    }
    if (karsilastirmaListesi.length >= 4) {
      toastGosterGlobal('En fazla 4 ürün karşılaştırabilirsiniz.', 'hata');
      return;
    }
    karsilastirmayaEkle(araba.id);
    toastGosterGlobal('📊 Karşılaştırma listesine eklendi!', 'basari');
  };

  return (
    <View style={{ flex: 1, backgroundColor: tema.arkaplan }}>
      <UstMenu />
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 40 }}>
        <View style={[stiller.icerikKapsayici, genisEkran && stiller.icerikKapsayiciGenis]}>
          
          {/* SOL TARAF: Görsel */}
          <View style={[stiller.gorselAlan, genisEkran && stiller.gorselAlanGenis]}>
            <View style={stiller.resimKutu}>
              <Image source={{ uri: araba.resimler[0] }} style={stiller.resim} resizeMode="cover" />
              <TouchableOpacity
                style={stiller.geriButon}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={stiller.favoriButon}
                onPress={() => favoriDegistir(araba.id)}
              >
                <Ionicons name={favoriMi ? "heart" : "heart-outline"} size={28} color={favoriMi ? tema.uyariKirmizi : "#FFF"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* SAĞ TARAF: Bilgiler */}
          <View style={[stiller.bilgiAlan, genisEkran && stiller.bilgiAlanGenis]}>
            <View style={stiller.baslikSatir}>
              <Text style={[stiller.baslik, { color: tema.metin }]}>
                {araba.marka} {araba.model}
              </Text>
              <Text style={[stiller.fiyat, { color: tema.anaRenk }]}>{araba.fiyat.toLocaleString('tr-TR')} ₺</Text>
            </View>

            {/* Aksyon butonları */}
            <View style={stiller.aksyonAlani}>
              <TouchableOpacity
                style={[stiller.karsilastirButon, { borderColor: tema.anaRenk }, karsilastirmadaMi && { backgroundColor: tema.anaRenk }]}
                onPress={karsilastirIslemi}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={karsilastirmadaMi ? 'checkmark-circle' : 'git-compare-outline'}
                  size={18}
                  color={karsilastirmadaMi ? '#FFF' : tema.anaRenk}
                />
                <Text style={[stiller.karsilastirMetin, { color: tema.anaRenk }, karsilastirmadaMi && { color: '#FFF' }]}>
                  {karsilastirmadaMi ? 'Eklendi' : 'Karşılaştır'}
                </Text>
              </TouchableOpacity>

              {!ilanSahibiMi && (
                <TouchableOpacity
                  style={[stiller.mesajButon, { backgroundColor: tema.anaRenk }]}
                  onPress={() => router.push(`/mesaj/${araba.id}` as any)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="chatbubbles-outline" size={18} color="#FFF" />
                  <Text style={stiller.mesajButonMetin}>Satıcıya Mesaj Gönder</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={[stiller.ozellikKutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
              <Text style={[stiller.ozellikMetin, { color: tema.metin }]}>Yıl: <Text style={{ color: tema.metinAcik }}>{araba.yil}</Text></Text>
              <Text style={[stiller.ozellikMetin, { color: tema.metin }]}>Kilometre: <Text style={{ color: tema.metinAcik }}>{araba.kilometre.toLocaleString('tr-TR')} km</Text></Text>
              <Text style={[stiller.ozellikMetin, { color: tema.metin }]}>Vites: <Text style={{ color: tema.metinAcik }}>{araba.vites}</Text></Text>
              <Text style={[stiller.ozellikMetin, { color: tema.metin }]}>Yakıt: <Text style={{ color: tema.metinAcik }}>{araba.yakitTuru}</Text></Text>
            </View>

            <View style={[stiller.kutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
              <Text style={[stiller.kutuBaslik, { color: tema.metin }]}>Açıklama</Text>
              <Text style={[stiller.aciklamaMetin, { color: tema.metinAcik }]}>{araba.aciklama}</Text>
            </View>

            <View style={[stiller.kutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
              <Text style={[stiller.kutuBaslik, { color: tema.metin }]}>Donanımlar</Text>
              {araba.ozellikler.map((ozellik: string, index: number) => (
                <Text key={index} style={[stiller.ozellikMadde, { color: tema.metinAcik }]}>
                  • {ozellik}
                </Text>
              ))}
            </View>

            {satici && (
              <View style={[stiller.saticiKutu, { backgroundColor: tema.vurguRenk + '10', borderColor: tema.vurguRenk + '30' }]}>
                <Text style={[stiller.kutuBaslik, { color: tema.metin }]}>Satıcı Bilgileri</Text>
                <Text style={[stiller.saticiMetin, { color: tema.metin }]}>{satici.ad} {satici.soyad}</Text>
                <Text style={[stiller.saticiMetin, { color: tema.metin }]}>{satici.telefon}</Text>
                <Text style={[stiller.saticiMetin, { color: tema.metinAcik }]}>{satici.adres}</Text>
                <View style={stiller.puanSatir}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={[stiller.saticiMetin, { color: tema.metin }]}>
                    {satici.puan} ({satici.degerlendirmeSayisi} değerlendirme)
                  </Text>
                </View>
              </View>
            )}

            {/* İlan Sahibi Butonları */}
            {ilanSahibiMi && (
              <View style={stiller.sahibiAlani}>
                <View style={[stiller.sahibiBilgi, { backgroundColor: tema.anaRenk + '15' }]}>
                  <Ionicons name="shield-checkmark" size={18} color={tema.anaRenk} />
                  <Text style={[stiller.sahibiBilgiMetni, { color: tema.anaRenk }]}>
                    Bu ilan size aittir
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity
                    style={[stiller.guncelleButon, { flex: 1, backgroundColor: '#10B981' }]}
                    onPress={() => router.push(`/ilan-guncelle/${araba.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="create-outline" size={20} color="#FFF" />
                    <Text style={stiller.silButonMetni}>Güncelle</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[stiller.silButon, { flex: 1, backgroundColor: tema.uyariKirmizi }]}
                    onPress={silmeIslemi}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FFF" />
                    <Text style={stiller.silButonMetni}>Sil</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

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
  hataMetni: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  favoriButon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  bilgiAlan: {
    width: '100%',
    padding: 15,
  },
  bilgiAlanGenis: {
    flex: 1,
    padding: 0,
  },
  baslikSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  baslik: {
    fontSize: 26,
    fontWeight: 'bold',
    flex: 1,
  },
  fiyat: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  aksyonAlani: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  karsilastirButon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    gap: 8,
  },
  karsilastirMetin: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  mesajButon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  mesajButonMetin: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },
  ozellikKutu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
  },
  ozellikMetin: {
    width: '48%',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  kutu: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
  },
  kutuBaslik: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aciklamaMetin: {
    fontSize: 15,
    lineHeight: 24,
  },
  ozellikMadde: {
    fontSize: 15,
    marginBottom: 6,
  },
  saticiKutu: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
  },
  saticiMetin: {
    fontSize: 15,
    marginBottom: 5,
  },
  puanSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  // İlan sahibi butonları
  sahibiAlani: {
    marginBottom: 30,
    gap: 12,
  },
  sahibiBilgi: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  sahibiBilgiMetni: {
    fontSize: 14,
    fontWeight: '600',
  },
  silButon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
  },
  guncelleButon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
  },
  silButonMetni: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
