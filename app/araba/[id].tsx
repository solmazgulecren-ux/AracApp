import { Kullanici } from "@/tipler/Kullanici";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { toastGosterGlobal } from '../../bilesenler/ToastBildirim';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';
import { Araba, Favori } from '../../tipler';

export default function ArabaDetayEkrani() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const arabalar = useKullanimDurum((state: KullanimDurumTipi) => state.arabalar);
  const kullanicilar = useKullanimDurum((state: KullanimDurumTipi) => state.kullanicilar);
  const favoriler = useKullanimDurum((state: KullanimDurumTipi) => state.favoriler);
  const favoriDegistir = useKullanimDurum((state: KullanimDurumTipi) => state.favoriDegistir);
  const aktifKullanici = useKullanimDurum((state: KullanimDurumTipi) => state.aktifKullanici);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const arabaSil = useKullanimDurum((state: KullanimDurumTipi) => state.arabaSil);
  const karsilastirmayaEkle = useKullanimDurum((state: KullanimDurumTipi) => state.karsilastirmayaEkle);
  const kullaniciKarsilastirmaListesi = useKullanimDurum((state: KullanimDurumTipi) => state.kullaniciKarsilastirmaListesi);
  const karsilastirmaListesi = kullaniciKarsilastirmaListesi();

  const araba = arabalar.find((a: Araba) => a.id === id);

  if (!araba) {
    return (
      <View style={[stiller.anaKutu, karanlikMod && stiller.anaKutuKaranlik]}>
        <Text style={[stiller.hataMetni, karanlikMod && stiller.metinKaranlik]}>Araç bulunamadı.</Text>
      </View>
    );
  }

  const satici = kullanicilar.find((k: Kullanici) => k.id === araba.saticiId);
  const favoriMi = favoriler.some((f: Favori) => f.arabaId === id && f.kullaniciId === aktifKullanici?.id);
  
  // İlan sahibi kontrolü - sadece ilan sahibi sil/düzenle butonlarını görebilir
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
    <ScrollView style={[stiller.anaKutu, karanlikMod && stiller.anaKutuKaranlik]}>
      <View style={stiller.resimKutu}>
        <Image source={{ uri: araba.resimler[0] }} style={stiller.resim} />
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
          <Ionicons name={favoriMi ? "heart" : "heart-outline"} size={28} color={favoriMi ? "#FF3B30" : "#FFF"} />
        </TouchableOpacity>
      </View>

      <View style={stiller.icerik}>
        <View style={stiller.baslikSatir}>
          <Text style={[stiller.baslik, karanlikMod && stiller.metinKaranlik]}>
            {araba.marka} {araba.model}
          </Text>
          <Text style={stiller.fiyat}>{araba.fiyat.toLocaleString('tr-TR')} ₺</Text>
        </View>

        {/* Aksyon butonları */}
        <View style={stiller.aksyonAlani}>
          <TouchableOpacity
            style={[stiller.karsilastirButon, karsilastirmadaMi && stiller.karsilastirButonAktif]}
            onPress={karsilastirIslemi}
            activeOpacity={0.8}
          >
            <Ionicons
              name={karsilastirmadaMi ? 'checkmark-circle' : 'git-compare-outline'}
              size={18}
              color={karsilastirmadaMi ? '#FFF' : '#1B4DFF'}
            />
            <Text style={[stiller.karsilastirMetin, karsilastirmadaMi && { color: '#FFF' }]}>
              {karsilastirmadaMi ? 'Eklendi' : 'Karşılaştır'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[stiller.ozellikKutu, karanlikMod && stiller.kutuKaranlik]}>
          <Text style={[stiller.ozellikMetin, karanlikMod && stiller.metinKaranlik]}>Yıl: {araba.yil}</Text>
          <Text style={[stiller.ozellikMetin, karanlikMod && stiller.metinKaranlik]}>Kilometre: {araba.kilometre.toLocaleString('tr-TR')} km</Text>
          <Text style={[stiller.ozellikMetin, karanlikMod && stiller.metinKaranlik]}>Vites: {araba.vites}</Text>
          <Text style={[stiller.ozellikMetin, karanlikMod && stiller.metinKaranlik]}>Yakıt: {araba.yakitTuru}</Text>
        </View>

        <View style={[stiller.kutu, karanlikMod && stiller.kutuKaranlik]}>
          <Text style={[stiller.kutuBaslik, karanlikMod && stiller.metinKaranlik]}>Açıklama</Text>
          <Text style={[stiller.aciklamaMetin, karanlikMod && stiller.metinSoluk]}>{araba.aciklama}</Text>
        </View>

        <View style={[stiller.kutu, karanlikMod && stiller.kutuKaranlik]}>
          <Text style={[stiller.kutuBaslik, karanlikMod && stiller.metinKaranlik]}>Donanımlar</Text>
          {araba.ozellikler.map((ozellik: string, index: number) => (
            <Text key={index} style={[stiller.ozellikMadde, karanlikMod && stiller.metinSoluk]}>
              • {ozellik}
            </Text>
          ))}
        </View>

        {satici && (
          <View style={[stiller.saticiKutu, karanlikMod && stiller.kutuKaranlik]}>
            <Text style={[stiller.kutuBaslik, karanlikMod && stiller.metinKaranlik]}>Satıcı Bilgileri</Text>
            <Text style={[stiller.saticiMetin, karanlikMod && stiller.metinKaranlik]}>{satici.ad} {satici.soyad}</Text>
            <Text style={[stiller.saticiMetin, karanlikMod && stiller.metinKaranlik]}>{satici.telefon}</Text>
            <Text style={[stiller.saticiMetin, karanlikMod && stiller.metinSoluk]}>{satici.adres}</Text>
            <View style={stiller.puanSatir}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={[stiller.saticiMetin, karanlikMod && stiller.metinKaranlik]}>
                {satici.puan} ({satici.degerlendirmeSayisi} değerlendirme)
              </Text>
            </View>
          </View>
        )}

        {/* İlan Sahibi Butonları - Sadece ilan sahibi görür */}
        {ilanSahibiMi && (
          <View style={stiller.sahibiAlani}>
            <View style={[stiller.sahibiBilgi, karanlikMod && { backgroundColor: '#1A2A4A' }]}>
              <Ionicons name="shield-checkmark" size={18} color="#1B4DFF" />
              <Text style={[stiller.sahibiBilgiMetni, karanlikMod && stiller.metinKaranlik]}>
                Bu ilan size aittir
              </Text>
            </View>

            <TouchableOpacity
              style={stiller.silButon}
              onPress={silmeIslemi}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={20} color="#FFF" />
              <Text style={stiller.silButonMetni}>İlanı Sil</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const stiller = StyleSheet.create({
  anaKutu: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  anaKutuKaranlik: {
    backgroundColor: '#121212',
  },
  hataMetni: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  resimKutu: {
    position: 'relative',
    height: 300,
  },
  resim: {
    width: '100%',
    height: '100%',
  },
  geriButon: {
    position: 'absolute',
    top: 40,
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
  icerik: {
    padding: 15,
  },
  baslikSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  baslik: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  fiyat: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
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
    borderColor: '#1B4DFF',
    gap: 6,
  },
  karsilastirButonAktif: {
    backgroundColor: '#1B4DFF',
    borderColor: '#1B4DFF',
  },
  karsilastirMetin: {
    color: '#1B4DFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ozellikKutu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  ozellikMetin: {
    width: '48%',
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  kutu: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  kutuKaranlik: {
    backgroundColor: '#1E1E1E',
  },
  kutuBaslik: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  aciklamaMetin: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  ozellikMadde: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  saticiKutu: {
    backgroundColor: '#E8F2FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  saticiMetin: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
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
    backgroundColor: '#E8EEFF',
    padding: 12,
    borderRadius: 10,
  },
  sahibiBilgiMetni: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B4DFF',
  },
  silButon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  silButonMetni: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  metinKaranlik: {
    color: '#FFF',
  },
  metinSoluk: {
    color: '#AAA',
  },
});
