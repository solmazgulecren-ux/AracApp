import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { AcikTema, KoyuTema } from '../sabitler/Tema';
import { Aksesuar, Araba } from '../tipler';
import { KullanimDurumTipi, useKullanimDurum } from '../durum/kullanimDurum';

type KarsilastirmaOge = (Araba | Aksesuar) & { tur: 'araba' | 'aksesuar' };

export default function KarsilastirEkrani() {
  const router = useRouter();
  const arabalar = useKullanimDurum((state: KullanimDurumTipi) => state.arabalar);
  const aksesuarlar = useKullanimDurum((state: KullanimDurumTipi) => state.aksesuarlar);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  const kullaniciKarsilastirmaListesi = useKullanimDurum((state: KullanimDurumTipi) => state.kullaniciKarsilastirmaListesi);
  const karsilastirmaListesi = kullaniciKarsilastirmaListesi();
  const karsilastirmadanCikar = useKullanimDurum((state: KullanimDurumTipi) => state.karsilastirmadanCikar);
  const karsilastirmayaEkle = useKullanimDurum((state: KullanimDurumTipi) => state.karsilastirmayaEkle);
  const karsilastirmaTemizle = useKullanimDurum((state: KullanimDurumTipi) => state.karsilastirmaTemizle);

  const [modalGorunur, setModalGorunur] = useState(false);
  const [aramaKelimesi, setAramaKelimesi] = useState('');
  const [sekmeTip, setSekmeTip] = useState<'araba' | 'aksesuar'>('araba');

  // Karşılaştırma listesindeki öğeleri bul
  const karsilastirmaOgeleri: KarsilastirmaOge[] = karsilastirmaListesi.map((id: string) => {
    const araba = arabalar.find((a: Araba) => a.id === id);
    if (araba) return { ...araba, tur: 'araba' as const };
    const aksesuar = aksesuarlar.find((a: Aksesuar) => a.id === id);
    if (aksesuar) return { ...aksesuar, tur: 'aksesuar' as const };
    return null;
  }).filter(Boolean) as KarsilastirmaOge[];

  // Modal arama sonuçları
  const aramaListesi = sekmeTip === 'araba'
    ? arabalar.filter((a: Araba) =>
        !karsilastirmaListesi.includes(a.id) &&
        (`${a.marka} ${a.model}`.toLowerCase().includes(aramaKelimesi.toLowerCase()))
      ).slice(0, 20)
    : aksesuarlar.filter((a: Aksesuar) =>
        !karsilastirmaListesi.includes(a.id) &&
        a.ad.toLowerCase().includes(aramaKelimesi.toLowerCase())
      ).slice(0, 20);

  const ogeEkle = (id: string) => {
    if (karsilastirmaListesi.length < 4) {
      karsilastirmayaEkle(id);
    }
    setModalGorunur(false);
    setAramaKelimesi('');
  };

  // Karşılaştırma kartı
  const KarsilastirmaKarti = ({ oge }: { oge: KarsilastirmaOge }) => {
    const arabaOge = oge as Araba & { tur: string };
    const aksesuarOge = oge as Aksesuar & { tur: string };
    const arabamiDir = oge.tur === 'araba';

    return (
      <View style={[stiller.kartSutun, karanlikMod && stiller.kartSutunKaranlik]}>
        {/* Çıkarma Butonu */}
        <TouchableOpacity
          style={stiller.cikarButon}
          onPress={() => karsilastirmadanCikar(oge.id)}
        >
          <Ionicons name="close-circle" size={24} color={tema.ikincilRenk || "#FF3B30"} />
        </TouchableOpacity>

        <Image source={{ uri: oge.resimler[0] }} style={stiller.kartResim} />

        <Text style={[stiller.kartBaslik, karanlikMod && stiller.metinKaranlik]} numberOfLines={2}>
          {arabamiDir ? `${arabaOge.marka} ${arabaOge.model}` : aksesuarOge.ad}
        </Text>

        {/* Fiyat */}
        <View style={stiller.ozellikSatir}>
          <Text style={[stiller.ozellikEtiket, karanlikMod && stiller.metinSoluk]}>Fiyat</Text>
          <Text style={stiller.ozellikFiyat}>{oge.fiyat.toLocaleString('tr-TR')} ₺</Text>
        </View>

        {arabamiDir ? (
          <>
            <View style={stiller.ozellikSatir}>
              <Text style={[stiller.ozellikEtiket, karanlikMod && stiller.metinSoluk]}>Yıl</Text>
              <Text style={[stiller.ozellikDeger, karanlikMod && stiller.metinKaranlik]}>{arabaOge.yil}</Text>
            </View>
            <View style={stiller.ozellikSatir}>
              <Text style={[stiller.ozellikEtiket, karanlikMod && stiller.metinSoluk]}>Kilometre</Text>
              <Text style={[stiller.ozellikDeger, karanlikMod && stiller.metinKaranlik]}>{arabaOge.kilometre.toLocaleString('tr-TR')} km</Text>
            </View>
            <View style={stiller.ozellikSatir}>
              <Text style={[stiller.ozellikEtiket, karanlikMod && stiller.metinSoluk]}>Vites</Text>
              <Text style={[stiller.ozellikDeger, karanlikMod && stiller.metinKaranlik]}>{arabaOge.vites}</Text>
            </View>
            <View style={stiller.ozellikSatir}>
              <Text style={[stiller.ozellikEtiket, karanlikMod && stiller.metinSoluk]}>Yakıt</Text>
              <Text style={[stiller.ozellikDeger, karanlikMod && stiller.metinKaranlik]}>{arabaOge.yakitTuru}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={stiller.ozellikSatir}>
              <Text style={[stiller.ozellikEtiket, karanlikMod && stiller.metinSoluk]}>Durum</Text>
              <Text style={[stiller.ozellikDeger, karanlikMod && stiller.metinKaranlik]}>{aksesuarOge.durum}</Text>
            </View>
            {aksesuarOge.kategori && (
              <View style={stiller.ozellikSatir}>
                <Text style={[stiller.ozellikEtiket, karanlikMod && stiller.metinSoluk]}>Kategori</Text>
                <Text style={[stiller.ozellikDeger, karanlikMod && stiller.metinKaranlik]}>{aksesuarOge.kategori}</Text>
              </View>
            )}
          </>
        )}

        {/* İncele Butonu */}
        <TouchableOpacity
          style={[stiller.inceleButon, { backgroundColor: tema.anaRenk }]}
          onPress={() => router.push((arabamiDir ? `/araba/${oge.id}` : `/aksesuar/${oge.id}`) as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="eye-outline" size={16} color="#FFF" />
          <Text style={stiller.inceleMetin}>İncele</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[
      stiller.anaKutu, 
      karanlikMod && stiller.anaKutuKaranlik,
      Platform.OS === 'web' && { maxWidth: 1200, alignSelf: 'center', width: '100%', borderWidth: 1, borderColor: karanlikMod ? '#2A2A3E' : '#E4E7EB' }
    ]}>
      {/* Header */}
      <View style={[stiller.baslikAlani, karanlikMod && stiller.baslikAlaniKaranlik]}>
        <TouchableOpacity onPress={() => router.back()} style={stiller.geriButon}>
          <Ionicons name="arrow-back" size={24} color={karanlikMod ? '#FFF' : '#333'} />
        </TouchableOpacity>
        <Text style={[stiller.baslik, karanlikMod && stiller.metinKaranlik]}>Karşılaştırma</Text>
        {karsilastirmaOgeleri.length > 0 && (
          <TouchableOpacity onPress={karsilastirmaTemizle} style={stiller.temizleButon}>
            <Text style={stiller.temizleMetni}>Temizle</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Karşılaştırma İçeriği */}
      {karsilastirmaOgeleri.length === 0 ? (
        <View style={stiller.bosAlani}>
          <Ionicons name="git-compare-outline" size={72} color={karanlikMod ? '#333' : '#DDD'} />
          <Text style={[stiller.bosBaslik, karanlikMod && stiller.metinKaranlik]}>Karşılaştırma Listeniz Boş</Text>
          <Text style={[stiller.bosAciklama, karanlikMod && stiller.metinSoluk]}>
            Araçları veya aksesuarları karşılaştırmak için aşağıdaki butona tıklayın.
          </Text>
          <TouchableOpacity
            style={[stiller.ekleButonBuyuk, { backgroundColor: tema.anaRenk }]}
            onPress={() => setModalGorunur(true)}
          >
            <Ionicons name="add-circle" size={22} color="#FFF" />
            <Text style={stiller.ekleButonMetni}>Ürün Ekle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView horizontal style={stiller.kaydirmaAlani} contentContainerStyle={stiller.kaydirmaIcerik}>
            {karsilastirmaOgeleri.map((oge) => (
              <KarsilastirmaKarti key={oge.id} oge={oge} />
            ))}
          </ScrollView>

          {karsilastirmaListesi.length < 4 && (
            <TouchableOpacity
              style={[stiller.ekleButonAlt, karanlikMod && stiller.ekleButonAltKaranlik, { borderColor: tema.anaRenk }]}
              onPress={() => setModalGorunur(true)}
            >
              <Ionicons name="add-circle-outline" size={22} color={tema.anaRenk} />
              <Text style={[stiller.ekleButonAltMetni, { color: tema.anaRenk }]}>Karşılaştırmaya Ekle ({4 - karsilastirmaListesi.length} kalan)</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Arama Modalı */}
      <Modal
        visible={modalGorunur}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalGorunur(false)}
      >
        <View style={stiller.modalArka}>
          <View style={[stiller.modalIcerik, karanlikMod && stiller.modalIcerikKaranlik]}>
            {/* Modal Header */}
            <View style={stiller.modalBaslik}>
              <Text style={[stiller.modalBaslikMetin, karanlikMod && stiller.metinKaranlik]}>Ürün Ekle</Text>
              <TouchableOpacity onPress={() => { setModalGorunur(false); setAramaKelimesi(''); }}>
                <Ionicons name="close" size={28} color={karanlikMod ? '#FFF' : '#333'} />
              </TouchableOpacity>
            </View>

            {/* Sekme Butonları */}
            <View style={stiller.sekmeler}>
              <TouchableOpacity
                style={[stiller.sekmeButon, sekmeTip === 'araba' && stiller.sekmeAktif]}
                onPress={() => { setSekmeTip('araba'); setAramaKelimesi(''); }}
              >
                <Ionicons name="car" size={16} color={sekmeTip === 'araba' ? '#FFF' : '#666'} />
                <Text style={[stiller.sekmeMetin, sekmeTip === 'araba' && stiller.sekmeMetinAktif]}>Araçlar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[stiller.sekmeButon, sekmeTip === 'aksesuar' && stiller.sekmeAktif]}
                onPress={() => { setSekmeTip('aksesuar'); setAramaKelimesi(''); }}
              >
                <Ionicons name="construct" size={16} color={sekmeTip === 'aksesuar' ? '#FFF' : '#666'} />
                <Text style={[stiller.sekmeMetin, sekmeTip === 'aksesuar' && stiller.sekmeMetinAktif]}>Aksesuarlar</Text>
              </TouchableOpacity>
            </View>

            {/* Arama */}
            <View style={[stiller.modalArama, karanlikMod && stiller.modalAramaKaranlik]}>
              <Ionicons name="search" size={18} color="#999" />
              <TextInput
                style={[stiller.modalAramaGirdi, karanlikMod && { color: '#FFF' }]}
                placeholder={sekmeTip === 'araba' ? 'Marka veya model ara...' : 'Aksesuar ara...'}
                placeholderTextColor="#999"
                value={aramaKelimesi}
                onChangeText={setAramaKelimesi}
              />
            </View>

            {/* Sonuçlar */}
            <FlatList
              data={aramaListesi as any[]}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }: { item: any }) => {
                const arabamiDir = sekmeTip === 'araba';
                const arabaItem = item as Araba;
                const aksesuarItem = item as Aksesuar;

                return (
                  <TouchableOpacity
                    style={[stiller.modalSonucKart, karanlikMod && stiller.modalSonucKartKaranlik]}
                    onPress={() => ogeEkle(item.id)}
                  >
                    <Image source={{ uri: item.resimler[0] }} style={stiller.modalSonucResim} />
                    <View style={stiller.modalSonucIcerik}>
                      <Text style={[stiller.modalSonucBaslik, karanlikMod && stiller.metinKaranlik]} numberOfLines={1}>
                        {arabamiDir ? `${arabaItem.marka} ${arabaItem.model}` : aksesuarItem.ad}
                      </Text>
                      <Text style={[stiller.modalSonucFiyat, { color: tema.anaRenk }]}>{item.fiyat.toLocaleString('tr-TR')} ₺</Text>
                      {arabamiDir && (
                        <Text style={stiller.modalSonucDetay}>{arabaItem.yil} • {arabaItem.vites}</Text>
                      )}
                    </View>
                    <Ionicons name="add-circle" size={28} color={tema.anaRenk} />
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={stiller.modalListe}
              ListEmptyComponent={
                <View style={stiller.bosModal}>
                  <Text style={[stiller.bosModalMetin, karanlikMod && stiller.metinSoluk]}>Sonuç bulunamadı</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: { flex: 1, backgroundColor: '#F0F2F5' },
  anaKutuKaranlik: { backgroundColor: '#0A0A0C' },
  baslikAlani: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  baslikAlaniKaranlik: { backgroundColor: '#1C1C24', borderBottomColor: '#2D2D3A' },
  geriButon: { marginRight: 12, padding: 4 },
  baslik: { fontSize: 22, fontWeight: 'bold', color: '#111111', flex: 1 },
  temizleButon: { padding: 8 },
  temizleMetni: { color: '#D32F2F', fontWeight: '600', fontSize: 14 },
  // Boş alan
  bosAlani: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  bosBaslik: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 20 },
  bosAciklama: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  ekleButonBuyuk: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#D32F2F', paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 14, marginTop: 24, elevation: 3,
  },
  ekleButonMetni: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  // Karşılaştırma kartları
  kaydirmaAlani: { flex: 1 },
  kaydirmaIcerik: { padding: 15, gap: 12 },
  kartSutun: {
    width: 220, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12,
    elevation: 3, shadowColor: '#FF2A2A', shadowOpacity: 0.1, shadowRadius: 8,
  },
  kartSutunKaranlik: { backgroundColor: '#1C1C24' },
  cikarButon: { position: 'absolute', top: 8, right: 8, zIndex: 10 },
  kartResim: { width: '100%', height: 130, borderRadius: 10, marginBottom: 12 },
  kartBaslik: { fontSize: 16, fontWeight: 'bold', color: '#111111', marginBottom: 12, textAlign: 'center' },
  ozellikSatir: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#E0E0E0',
  },
  ozellikEtiket: { fontWeight: '600', color: '#606060', fontSize: 13 },
  ozellikDeger: { fontWeight: 'bold', color: '#111111', fontSize: 13 },
  ozellikFiyat: { fontWeight: 'bold', color: '#D32F2F', fontSize: 15 },
  inceleButon: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#D32F2F', paddingVertical: 10, borderRadius: 10,
    gap: 6, marginTop: 12,
  },
  inceleMetin: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  // Ekle butonu alt
  ekleButonAlt: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    margin: 15, padding: 14, borderRadius: 14, borderWidth: 2,
    borderColor: '#D32F2F', borderStyle: 'dashed', gap: 8,
    marginBottom: 30,
  },
  ekleButonAltKaranlik: { borderColor: '#FF2A2A' },
  ekleButonAltMetni: { color: '#D32F2F', fontWeight: '600', fontSize: 14 },
  // Modal
  modalArka: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalIcerik: {
    backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '80%', paddingBottom: 30,
  },
  modalIcerikKaranlik: { backgroundColor: '#1A1A2E' },
  modalBaslik: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE',
  },
  modalBaslikMetin: { fontSize: 20, fontWeight: 'bold', color: '#111111' },
  sekmeler: { flexDirection: 'row', padding: 15, gap: 10 },
  sekmeButon: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 10, backgroundColor: '#F0F2F5', gap: 6,
  },
  sekmeAktif: { backgroundColor: '#D32F2F' },
  sekmeMetin: { fontSize: 14, fontWeight: '600', color: '#606060' },
  sekmeMetinAktif: { color: '#FFF' },
  modalArama: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 15,
    backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 12,
    paddingVertical: 10, gap: 8, marginBottom: 10,
  },
  modalAramaKaranlik: { backgroundColor: '#0F0F1A' },
  modalAramaGirdi: { flex: 1, fontSize: 15, color: '#333' },
  modalListe: { paddingHorizontal: 15, paddingBottom: 20 },
  modalSonucKart: {
    flexDirection: 'row', alignItems: 'center', padding: 10,
    borderRadius: 12, backgroundColor: '#F0F2F5', marginBottom: 8,
  },
  modalSonucKartKaranlik: { backgroundColor: '#0A0A0C' },
  modalSonucResim: { width: 55, height: 55, borderRadius: 10, marginRight: 12 },
  modalSonucIcerik: { flex: 1 },
  modalSonucBaslik: { fontSize: 14, fontWeight: 'bold', color: '#111111' },
  modalSonucFiyat: { fontSize: 13, fontWeight: 'bold', color: '#D32F2F', marginTop: 2 },
  modalSonucDetay: { fontSize: 12, color: '#606060', marginTop: 2 },
  bosModal: { padding: 40, alignItems: 'center' },
  bosModalMetin: { fontSize: 15, color: '#9E9E9E' },
  metinKaranlik: { color: '#F0F2F5' },
  metinSoluk: { color: '#9E9E9E' },
});
