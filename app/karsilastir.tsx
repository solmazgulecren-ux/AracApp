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
import { UstMenu } from '../bilesenler/UstMenu';

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

  const karsilastirmaOgeleri: KarsilastirmaOge[] = karsilastirmaListesi.map((id: string) => {
    const araba = arabalar.find((a: Araba) => a.id === id);
    if (araba) return { ...araba, tur: 'araba' as const };
    const aksesuar = aksesuarlar.find((a: Aksesuar) => a.id === id);
    if (aksesuar) return { ...aksesuar, tur: 'aksesuar' as const };
    return null;
  }).filter(Boolean) as KarsilastirmaOge[];

  const aramaListesi = sekmeTip === 'araba'
    ? arabalar.filter((a: Araba) => !karsilastirmaListesi.includes(a.id) && (`${a.marka} ${a.model}`.toLowerCase().includes(aramaKelimesi.toLowerCase()))).slice(0, 20)
    : aksesuarlar.filter((a: Aksesuar) => !karsilastirmaListesi.includes(a.id) && a.ad.toLowerCase().includes(aramaKelimesi.toLowerCase())).slice(0, 20);

  const ogeEkle = (id: string) => {
    if (karsilastirmaListesi.length < 4) {
      karsilastirmayaEkle(id);
    }
    setModalGorunur(false);
    setAramaKelimesi('');
  };

  const ButunOgelerAyniMi = karsilastirmaOgeleri.every(o => o.tur === 'araba') || karsilastirmaOgeleri.every(o => o.tur === 'aksesuar');

  return (
    <View style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]}>
      <UstMenu />

      <View style={[stiller.baslikAlani, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
        <TouchableOpacity onPress={() => router.back()} style={stiller.geriButon}>
          <Ionicons name="arrow-back" size={24} color={tema.metin} />
        </TouchableOpacity>
        <Text style={[stiller.baslik, { color: tema.metin }]}>Karşılaştırma</Text>
        {karsilastirmaOgeleri.length > 0 && (
          <TouchableOpacity onPress={karsilastirmaTemizle} style={stiller.temizleButon}>
            <Text style={{ color: tema.uyariKirmizi, fontWeight: 'bold' }}>Temizle</Text>
          </TouchableOpacity>
        )}
      </View>

      {karsilastirmaOgeleri.length === 0 ? (
        <View style={stiller.bosAlani}>
          <Ionicons name="git-compare-outline" size={72} color={tema.metinAcik} />
          <Text style={[stiller.bosBaslik, { color: tema.metin }]}>Karşılaştırma Listeniz Boş</Text>
          <Text style={[stiller.bosAciklama, { color: tema.metinAcik }]}>
            Araçları veya aksesuarları karşılaştırmak için aşağıdaki butona tıklayın.
          </Text>
          <TouchableOpacity style={[stiller.ekleButonBuyuk, { backgroundColor: tema.anaRenk }]} onPress={() => setModalGorunur(true)}>
            <Ionicons name="add-circle" size={22} color="#FFF" />
            <Text style={stiller.ekleButonMetni}>Ürün Ekle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={stiller.kaydirmaAlani}>
          {!ButunOgelerAyniMi && (
             <View style={[stiller.uyariKutu, { backgroundColor: tema.uyariKirmizi + '15' }]}>
                <Ionicons name="alert-circle" size={20} color={tema.uyariKirmizi} />
                <Text style={{ color: tema.uyariKirmizi, flex: 1 }}>Araba ve aksesuarları aynı anda karşılaştırmak tablo düzenini bozabilir.</Text>
             </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stiller.tabloScroll}>
            <View style={[stiller.tabloTasiyici, { borderColor: tema.kenarlik }]}>
              
              {/* Tablo Header (Resimler ve İsimler) */}
              <View style={[stiller.tabloSatir, stiller.headerSatir, { borderBottomColor: tema.kenarlik }]}>
                <View style={[stiller.tabloHucre, stiller.etiketHucre, { backgroundColor: tema.yuzeyRenk, borderRightColor: tema.kenarlik }]} />
                {karsilastirmaOgeleri.map((oge) => (
                  <View key={`header-${oge.id}`} style={[stiller.tabloHucre, stiller.degerHucre, { backgroundColor: tema.kartArkaplan, borderRightColor: tema.kenarlik }]}>
                    <TouchableOpacity style={stiller.cikarButon} onPress={() => karsilastirmadanCikar(oge.id)}>
                      <Ionicons name="close-circle" size={24} color={tema.uyariKirmizi} />
                    </TouchableOpacity>
                    <Image source={{ uri: oge.resimler[0] }} style={stiller.kartResim} />
                    <Text style={[stiller.kartBaslik, { color: tema.metin }]} numberOfLines={2}>
                      {oge.tur === 'araba' ? `${(oge as Araba).marka} ${(oge as Araba).model}` : (oge as Aksesuar).ad}
                    </Text>
                    <Text style={[stiller.fiyat, { color: tema.anaRenk }]}>{oge.fiyat.toLocaleString('tr-TR')} ₺</Text>
                    <TouchableOpacity style={[stiller.inceleButon, { backgroundColor: tema.anaRenk }]} onPress={() => router.push((oge.tur === 'araba' ? `/araba/${oge.id}` : `/aksesuar/${oge.id}`) as any)}>
                       <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>İncele</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Fiyat Satırı */}
              <View style={[stiller.tabloSatir, { borderBottomColor: tema.kenarlik }]}>
                <View style={[stiller.tabloHucre, stiller.etiketHucre, { backgroundColor: tema.yuzeyRenk, borderRightColor: tema.kenarlik }]}>
                  <Text style={[stiller.ozellikEtiket, { color: tema.metin }]}>Fiyat</Text>
                </View>
                {karsilastirmaOgeleri.map((oge) => (
                  <View key={`fiyat-${oge.id}`} style={[stiller.tabloHucre, stiller.degerHucre, { backgroundColor: tema.kartArkaplan, borderRightColor: tema.kenarlik }]}>
                    <Text style={[stiller.ozellikDeger, { color: tema.metin }]}>{oge.fiyat.toLocaleString('tr-TR')} ₺</Text>
                  </View>
                ))}
              </View>

              {/* Araba Özellikleri */}
              {['Yıl', 'Kilometre', 'Vites', 'Yakıt', 'Kasa Tipi', 'Motor', 'Hasar', 'Boya'].map(ozellik => {
                // Eğer seçili öğelerde bu özellik hiçbiri için yoksa satırı gizle (sadece aksesuarlar varsa)
                if (karsilastirmaOgeleri.every(o => o.tur !== 'araba')) return null;

                return (
                  <View key={ozellik} style={[stiller.tabloSatir, { borderBottomColor: tema.kenarlik }]}>
                    <View style={[stiller.tabloHucre, stiller.etiketHucre, { backgroundColor: tema.yuzeyRenk, borderRightColor: tema.kenarlik }]}>
                      <Text style={[stiller.ozellikEtiket, { color: tema.metin }]}>{ozellik}</Text>
                    </View>
                    {karsilastirmaOgeleri.map((oge) => {
                      let deger = '-';
                      if (oge.tur === 'araba') {
                         const a = oge as Araba;
                         switch (ozellik) {
                           case 'Yıl': deger = a.yil.toString(); break;
                           case 'Kilometre': deger = `${a.kilometre.toLocaleString('tr-TR')} km`; break;
                           case 'Vites': deger = a.vites; break;
                           case 'Yakıt': deger = a.yakitTuru; break;
                           case 'Kasa Tipi': deger = a.kasaTipi || '-'; break;
                           case 'Motor': deger = a.motorHacmi || '-'; break;
                           case 'Hasar': deger = a.hasarKaydi || '-'; break;
                           case 'Boya': deger = a.boyaliDegisen || '-'; break;
                         }
                      }
                      return (
                        <View key={`${ozellik}-${oge.id}`} style={[stiller.tabloHucre, stiller.degerHucre, { backgroundColor: tema.kartArkaplan, borderRightColor: tema.kenarlik }]}>
                          <Text style={[stiller.ozellikDeger, { color: tema.metin }]}>{deger}</Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}

              {/* Aksesuar Özellikleri */}
              {['Kategori', 'Durum'].map(ozellik => {
                if (karsilastirmaOgeleri.every(o => o.tur !== 'aksesuar')) return null;

                return (
                  <View key={ozellik} style={[stiller.tabloSatir, { borderBottomColor: tema.kenarlik }]}>
                    <View style={[stiller.tabloHucre, stiller.etiketHucre, { backgroundColor: tema.yuzeyRenk, borderRightColor: tema.kenarlik }]}>
                      <Text style={[stiller.ozellikEtiket, { color: tema.metin }]}>{ozellik}</Text>
                    </View>
                    {karsilastirmaOgeleri.map((oge) => {
                      let deger = '-';
                      if (oge.tur === 'aksesuar') {
                         const a = oge as Aksesuar;
                         switch (ozellik) {
                           case 'Kategori': deger = a.kategori || '-'; break;
                           case 'Durum': deger = a.durum; break;
                         }
                      }
                      return (
                        <View key={`${ozellik}-${oge.id}`} style={[stiller.tabloHucre, stiller.degerHucre, { backgroundColor: tema.kartArkaplan, borderRightColor: tema.kenarlik }]}>
                          <Text style={[stiller.ozellikDeger, { color: tema.metin }]}>{deger}</Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
              
            </View>
          </ScrollView>

          {karsilastirmaListesi.length < 4 && (
            <TouchableOpacity style={[stiller.ekleButonAlt, { borderColor: tema.anaRenk, marginTop: 20 }]} onPress={() => setModalGorunur(true)}>
              <Ionicons name="add-circle-outline" size={22} color={tema.anaRenk} />
              <Text style={{ color: tema.anaRenk, fontWeight: 'bold' }}>Karşılaştırmaya Ekle ({4 - karsilastirmaListesi.length} kalan)</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* Arama Modalı */}
      <Modal visible={modalGorunur} animationType="slide" transparent={true} onRequestClose={() => setModalGorunur(false)}>
        <View style={stiller.modalArka}>
          <View style={[stiller.modalIcerik, { backgroundColor: tema.kartArkaplan }]}>
            <View style={stiller.modalBaslikKutu}>
              <Text style={[stiller.modalBaslikMetin, { color: tema.metin }]}>Ürün Ekle</Text>
              <TouchableOpacity onPress={() => { setModalGorunur(false); setAramaKelimesi(''); }}>
                <Ionicons name="close" size={28} color={tema.metin} />
              </TouchableOpacity>
            </View>

            <View style={stiller.sekmeler}>
              <TouchableOpacity style={[stiller.sekmeButon, sekmeTip === 'araba' && stiller.sekmeAktif, sekmeTip === 'araba' && { backgroundColor: tema.anaRenk }]} onPress={() => { setSekmeTip('araba'); setAramaKelimesi(''); }}>
                <Ionicons name="car" size={16} color={sekmeTip === 'araba' ? '#FFF' : tema.metinAcik} />
                <Text style={[stiller.sekmeMetin, { color: tema.metinAcik }, sekmeTip === 'araba' && { color: '#FFF' }]}>Araçlar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[stiller.sekmeButon, sekmeTip === 'aksesuar' && stiller.sekmeAktif, sekmeTip === 'aksesuar' && { backgroundColor: tema.anaRenk }]} onPress={() => { setSekmeTip('aksesuar'); setAramaKelimesi(''); }}>
                <Ionicons name="construct" size={16} color={sekmeTip === 'aksesuar' ? '#FFF' : tema.metinAcik} />
                <Text style={[stiller.sekmeMetin, { color: tema.metinAcik }, sekmeTip === 'aksesuar' && { color: '#FFF' }]}>Aksesuarlar</Text>
              </TouchableOpacity>
            </View>

            <View style={[stiller.modalArama, { backgroundColor: tema.yuzeyRenk }]}>
              <Ionicons name="search" size={18} color={tema.metinAcik} />
              <TextInput
                style={[stiller.modalAramaGirdi, { color: tema.metin }]}
                placeholder={sekmeTip === 'araba' ? 'Marka veya model ara...' : 'Aksesuar ara...'}
                placeholderTextColor={tema.metinAcik}
                value={aramaKelimesi}
                onChangeText={setAramaKelimesi}
              />
            </View>

            <FlatList
              data={aramaListesi as any[]}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }: { item: any }) => {
                const arabamiDir = sekmeTip === 'araba';
                const resim = item.resimler[0];
                return (
                  <TouchableOpacity style={[stiller.modalOgeKart, { borderBottomColor: tema.kenarlik }]} onPress={() => ogeEkle(item.id)}>
                    <Image source={{ uri: resim }} style={stiller.modalOgeResim} />
                    <View style={stiller.modalOgeBilgi}>
                      <Text style={[stiller.modalOgeAd, { color: tema.metin }]} numberOfLines={1}>{arabamiDir ? `${item.marka} ${item.model}` : item.ad}</Text>
                      <Text style={[stiller.modalOgeFiyat, { color: tema.anaRenk }]}>{item.fiyat.toLocaleString('tr-TR')} ₺</Text>
                    </View>
                    <Ionicons name="add-circle" size={24} color={tema.anaRenk} />
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: tema.metinAcik }}>Sonuç bulunamadı.</Text>}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: { flex: 1 },
  baslikAlani: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, borderBottomWidth: 1 },
  geriButon: { marginRight: 15 },
  baslik: { fontSize: 24, fontWeight: 'bold', flex: 1 },
  temizleButon: { padding: 8 },
  
  bosAlani: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  bosBaslik: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10, textAlign: 'center' },
  bosAciklama: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  ekleButonBuyuk: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30, gap: 8 },
  ekleButonMetni: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
  kaydirmaAlani: { flex: 1 },
  uyariKutu: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 12, borderRadius: 12, gap: 8 },
  
  tabloScroll: { padding: 16, paddingBottom: 40 },
  tabloTasiyici: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, backgroundColor: '#FFF' },
  tabloSatir: { flexDirection: 'row', borderBottomWidth: 1 },
  headerSatir: { alignItems: 'flex-start' },
  tabloHucre: { padding: 16, borderRightWidth: 1, justifyContent: 'center' },
  etiketHucre: { width: 90, alignItems: 'flex-start' },
  degerHucre: { width: 130, alignItems: 'center' },
  
  cikarButon: { position: 'absolute', top: 4, right: 4, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 12 },
  kartResim: { width: 100, height: 70, borderRadius: 8, marginBottom: 8, resizeMode: 'cover' },
  kartBaslik: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, height: 36 },
  fiyat: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  inceleButon: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, width: '95%', alignItems: 'center' },
  
  ozellikEtiket: { fontSize: 12, fontWeight: 'bold' },
  ozellikDeger: { fontSize: 12, textAlign: 'center', fontWeight: '500' },
  
  ekleButonAlt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, marginHorizontal: 16, marginBottom: 40, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', gap: 8 },
  
  modalArka: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalIcerik: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, height: '80%' },
  modalBaslikKutu: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalBaslikMetin: { fontSize: 20, fontWeight: 'bold' },
  
  sekmeler: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 12, padding: 4, marginBottom: 15 },
  sekmeButon: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 6 },
  sekmeAktif: {},
  sekmeMetin: { fontSize: 14, fontWeight: '600' },
  
  modalArama: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12, marginBottom: 15, gap: 10 },
  modalAramaGirdi: { flex: 1, fontSize: 16 },
  
  modalOgeKart: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  modalOgeResim: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  modalOgeBilgi: { flex: 1 },
  modalOgeAd: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  modalOgeFiyat: { fontSize: 15, fontWeight: 'bold' }
});
