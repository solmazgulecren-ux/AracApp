import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AcikTema, KoyuTema } from '../../sabitler/Tema';
import { Araba, Siparis, SiparisUrun } from '../../tipler';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';

export default function ProfilEkrani() {
  const router = useRouter();
  const aktifKullanici = useKullanimDurum((state: KullanimDurumTipi) => state.aktifKullanici);
  const cikisYap = useKullanimDurum((state: KullanimDurumTipi) => state.cikisYap);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  const arabalar = useKullanimDurum((state: KullanimDurumTipi) => state.arabalar);
  const siparisler = useKullanimDurum((state: KullanimDurumTipi) => state.siparisler);

  const [duzenleMod, setDuzenleMod] = useState(false);
  const [ad, setAd] = useState(aktifKullanici?.ad || '');
  const [soyad, setSoyad] = useState(aktifKullanici?.soyad || '');
  const [telefon, setTelefon] = useState(aktifKullanici?.telefon || '');
  const [adres, setAdres] = useState(aktifKullanici?.adres || '');
  const [aktifSekme, setAktifSekme] = useState<'bilgiler' | 'ilanlar' | 'siparisler'>('bilgiler');

  const kullaniciIlanlari = arabalar.filter((araba: Araba) => araba.saticiId === aktifKullanici?.id);
  const kullaniciSiparisleri = siparisler.filter((s: Siparis) => s.kullaniciId === aktifKullanici?.id);
  const profilGuncelle = useKullanimDurum((state: KullanimDurumTipi) => state.profilGuncelle);

  const kaydet = () => {
    if (aktifKullanici) {
      profilGuncelle(aktifKullanici.id, { ad, soyad, telefon, adres });
      setDuzenleMod(false);
    }
  };

  const cikisIslemi = () => {
    cikisYap();
    router.replace('/');
  };

  if (!aktifKullanici) return null;

  // Sipariş durumu renk ve ilerleme yüzdesi
  const durumBilgisi = (durum: Siparis['durum']) => {
    switch (durum) {
      case 'Onay Bekliyor': return { renk: '#6B7280', ikon: 'time-outline' as const, ilerleme: 0 };
      case 'Hazırlanıyor': return { renk: '#F59E0B', ikon: 'construct-outline' as const, ilerleme: 33 };
      case 'Kargoya Verildi': return { renk: '#3B82F6', ikon: 'airplane-outline' as const, ilerleme: 66 };
      case 'Teslim Edildi': return { renk: '#10B981', ikon: 'checkmark-circle-outline' as const, ilerleme: 100 };
      case 'İptal Edildi': return { renk: '#EF4444', ikon: 'close-circle-outline' as const, ilerleme: 0 };
    }
  };

  // Sipariş Kartı
  const SiparisKarti = ({ siparis, index }: { siparis: Siparis; index: number }) => {
    const bilgi = durumBilgisi(siparis.durum);
    const iptalMi = siparis.durum === 'İptal Edildi';
    return (
      <Animated.View entering={FadeInDown.delay(index * 80).springify().damping(18)}>
        <View style={[stiller.siparisKart, { backgroundColor: tema.kartArkaplan, borderColor: iptalMi ? tema.uyariKirmizi + '40' : tema.kenarlik }]}>
          {/* Sipariş Header */}
          <View style={stiller.siparisHeader}>
            <View>
              <Text style={[stiller.siparisNo, { color: tema.metinAcik }]}>
                #{siparis.id.slice(-6).toUpperCase()}
              </Text>
              <Text style={[stiller.siparisTarih, { color: tema.metinAcik }]}>{siparis.tarih}</Text>
            </View>
            <View style={[stiller.durumBadge, { backgroundColor: bilgi.renk + '18' }]}>
              <Ionicons name={bilgi.ikon} size={14} color={bilgi.renk} />
              <Text style={[stiller.durumMetni, { color: bilgi.renk }]}>{siparis.durum}</Text>
            </View>
          </View>

          {/* İlerleme Çubuğu */}
          {!iptalMi && (
            <View style={stiller.ilerlemeAlani}>
              <View style={[stiller.ilerlemeCubuk, { backgroundColor: tema.yuzeyRenk }]}>
                <View style={[stiller.ilerlemeDolu, { width: `${bilgi.ilerleme}%`, backgroundColor: bilgi.renk }]} />
              </View>
              <View style={stiller.ilerlemeDurumlar}>
                <Text style={[stiller.durumEtiket, bilgi.ilerleme >= 33 && { color: bilgi.renk, fontWeight: 'bold' }, { color: tema.metinAcik }]}>
                  Hazırlanıyor
                </Text>
                <Text style={[stiller.durumEtiket, bilgi.ilerleme >= 66 && { color: bilgi.renk, fontWeight: 'bold' }, { color: tema.metinAcik }]}>
                  Kargoda
                </Text>
                <Text style={[stiller.durumEtiket, bilgi.ilerleme >= 100 && { color: bilgi.renk, fontWeight: 'bold' }, { color: tema.metinAcik }]}>
                  Teslim
                </Text>
              </View>
            </View>
          )}

          {/* İptal mesajı */}
          {iptalMi && (
            <View style={[stiller.iptalMesajKutu, { backgroundColor: tema.uyariKirmizi + '10' }]}>
              <Ionicons name="information-circle" size={16} color={tema.uyariKirmizi} />
              <Text style={[stiller.iptalMesaj, { color: tema.uyariKirmizi }]}>Bu sipariş yönetici tarafından iptal edilmiştir.</Text>
            </View>
          )}

          {/* Ürünler */}
          {siparis.urunler.map((urun: SiparisUrun, idx: number) => (
            <View key={idx} style={[stiller.urunSatir, { borderBottomColor: tema.kenarlik }]}>
              <Text style={[stiller.urunAd, { color: tema.metinAcik }]} numberOfLines={1}>
                {urun.ad} x{urun.adet}
              </Text>
              <Text style={[stiller.urunFiyat, { color: tema.metin }]}>
                {(urun.fiyat * urun.adet).toLocaleString('tr-TR')} ₺
              </Text>
            </View>
          ))}

          {/* Toplam */}
          <View style={stiller.siparisToplamSatir}>
            <Text style={[stiller.siparisToplamEtiket, { color: tema.metin }]}>Toplam</Text>
            <Text style={[stiller.siparisToplamFiyat, { color: tema.vurguRenk }]}>{siparis.toplamTutar.toLocaleString('tr-TR')} ₺</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScrollView style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]}>
      {/* Profil Başlığı */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <View style={[stiller.profilBaslik, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
          <View style={[stiller.avatarKutu, { backgroundColor: tema.anaRenk }]}>
            <Text style={stiller.avatarMetin}>
              {aktifKullanici.ad.charAt(0)}{aktifKullanici.soyad.charAt(0)}
            </Text>
          </View>
          <Text style={[stiller.profilAd, { color: tema.metin }]}>
            {aktifKullanici.ad} {aktifKullanici.soyad}
          </Text>
          <Text style={[stiller.profilEposta, { color: tema.metinAcik }]}>
            {aktifKullanici.eposta}
          </Text>
          {aktifKullanici.puan > 0 && (
            <View style={[stiller.puanSatir, { backgroundColor: tema.vurguRenk + '15' }]}>
              <Ionicons name="star" size={14} color={tema.vurguRenk} />
              <Text style={[stiller.puanMetin, { color: tema.vurguRenk }]}>
                {aktifKullanici.puan} ({aktifKullanici.degerlendirmeSayisi})
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Sekmeler */}
      <View style={stiller.sekmeler}>
        {[
          { key: 'bilgiler' as const, ikon: 'person-outline' as const, etiket: 'Bilgiler' },
          { key: 'ilanlar' as const, ikon: 'car-outline' as const, etiket: `İlanlar (${kullaniciIlanlari.length})` },
          { key: 'siparisler' as const, ikon: 'receipt-outline' as const, etiket: `Siparişler (${kullaniciSiparisleri.length})` },
        ].map((sekme) => (
          <TouchableOpacity
            key={sekme.key}
            style={[
              stiller.sekmeButon,
              { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik },
              aktifSekme === sekme.key && { backgroundColor: tema.anaRenk, borderColor: tema.anaRenk },
            ]}
            onPress={() => setAktifSekme(sekme.key)}
          >
            <Ionicons
              name={sekme.ikon}
              size={14}
              color={aktifSekme === sekme.key ? '#FFF' : tema.metinAcik}
            />
            <Text
              style={[
                stiller.sekmeMetin,
                { color: tema.metinAcik },
                aktifSekme === sekme.key && { color: '#FFF' },
              ]}
              numberOfLines={1}
            >
              {sekme.etiket}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bilgiler Sekmesi */}
      {aktifSekme === 'bilgiler' && (
        <View style={[stiller.bilgiKutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
          <View style={stiller.baslikSatiri}>
            <Text style={[stiller.bilgiBaslik, { color: tema.metin }]}>Kişisel Bilgiler</Text>
            <TouchableOpacity onPress={() => duzenleMod ? kaydet() : setDuzenleMod(true)}>
              <Text style={[stiller.duzenleMetni, { color: tema.anaRenk }]}>{duzenleMod ? 'Kaydet' : 'Düzenle'}</Text>
            </TouchableOpacity>
          </View>

          <View style={stiller.satir}>
            <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Ad Soyad:</Text>
            {duzenleMod ? (
              <View style={stiller.deger}>
                <TextInput style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik, color: tema.metin }]} value={ad} onChangeText={setAd} placeholder="Ad" placeholderTextColor={tema.metinAcik} />
                <TextInput style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik, color: tema.metin }]} value={soyad} onChangeText={setSoyad} placeholder="Soyad" placeholderTextColor={tema.metinAcik} />
              </View>
            ) : (
              <Text style={[stiller.deger, { color: tema.metin }]}>
                {aktifKullanici.ad} {aktifKullanici.soyad}
              </Text>
            )}
          </View>

          <View style={stiller.satir}>
            <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Telefon:</Text>
            {duzenleMod ? (
              <TextInput style={[stiller.girdi, stiller.deger, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik, color: tema.metin }]} value={telefon} onChangeText={setTelefon} placeholderTextColor={tema.metinAcik} />
            ) : (
              <Text style={[stiller.deger, { color: tema.metin }]}>
                {aktifKullanici.telefon}
              </Text>
            )}
          </View>

          <View style={stiller.satir}>
            <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Adres:</Text>
            {duzenleMod ? (
              <TextInput style={[stiller.girdi, stiller.deger, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik, color: tema.metin }]} value={adres} onChangeText={setAdres} placeholderTextColor={tema.metinAcik} />
            ) : (
              <Text style={[stiller.deger, { color: tema.metin }]}>
                {aktifKullanici.adres}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* İlanlar Sekmesi */}
      {aktifSekme === 'ilanlar' && (
        <View style={[stiller.bilgiKutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
          {kullaniciIlanlari.length === 0 ? (
            <View style={stiller.bosAlani}>
              <View style={[stiller.bosIkon, { backgroundColor: tema.anaRenk + '12' }]}>
                <Ionicons name="car-outline" size={36} color={tema.anaRenk} />
              </View>
              <Text style={[stiller.bosMetin, { color: tema.metinAcik }]}>
                Henüz ilanınız bulunmuyor.
              </Text>
            </View>
          ) : (
            kullaniciIlanlari.map((ilan: Araba, idx: number) => (
              <TouchableOpacity
                key={ilan.id}
                style={[stiller.ilanSatir, { borderBottomColor: tema.kenarlik }]}
                onPress={() => router.push(`/araba/${ilan.id}`)}
              >
                <View style={stiller.ilanIcerik}>
                  <Text style={[stiller.ilanAd, { color: tema.metin }]}>
                    {ilan.marka} {ilan.model}
                  </Text>
                  <Text style={[stiller.ilanFiyat, { color: tema.anaRenk }]}>{ilan.fiyat.toLocaleString('tr-TR')} ₺</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={tema.metinAcik} />
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* Siparişlerim Sekmesi */}
      {aktifSekme === 'siparisler' && (
        <View style={stiller.siparislerAlani}>
          {kullaniciSiparisleri.length === 0 ? (
            <View style={[stiller.bilgiKutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
              <View style={stiller.bosAlani}>
                <View style={[stiller.bosIkon, { backgroundColor: tema.vurguRenk + '12' }]}>
                  <Ionicons name="receipt-outline" size={36} color={tema.vurguRenk} />
                </View>
                <Text style={[stiller.bosMetin, { color: tema.metinAcik }]}>
                  Henüz siparişiniz bulunmuyor.
                </Text>
              </View>
            </View>
          ) : (
            kullaniciSiparisleri.map((siparis: Siparis, index: number) => (
              <SiparisKarti key={siparis.id} siparis={siparis} index={index} />
            ))
          )}
        </View>
      )}

      {/* Yönetim Paneli Butonu (Adminlere Özel) */}
      {aktifKullanici.isAdmin && (
        <TouchableOpacity style={[stiller.adminButon, { backgroundColor: tema.ikincilRenk }]} onPress={() => router.push('/admin' as any)}>
          <Ionicons name="shield-checkmark" size={20} color="#FFF" />
          <Text style={stiller.cikisMetni}>Yönetim Paneli</Text>
        </TouchableOpacity>
      )}

      {/* Çıkış Butonu */}
      <TouchableOpacity style={[stiller.cikisButon, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]} onPress={cikisIslemi}>
        <Ionicons name="log-out-outline" size={20} color={tema.uyariKirmizi} />
        <Text style={[stiller.cikisMetniKirmizi, { color: tema.uyariKirmizi }]}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const stiller = StyleSheet.create({
  anaKutu: { flex: 1 },
  // Profil başlık
  profilBaslik: {
    alignItems: 'center', padding: 24, margin: 14, marginBottom: 0,
    borderRadius: 20, borderWidth: 1, elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12,
  },
  avatarKutu: {
    width: 72, height: 72, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarMetin: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  profilAd: { fontSize: 20, fontWeight: 'bold' },
  profilEposta: { fontSize: 14, marginTop: 4 },
  puanSatir: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  puanMetin: { fontSize: 13, fontWeight: 'bold' },
  // Sekmeler
  sekmeler: { flexDirection: 'row', margin: 14, gap: 8 },
  sekmeButon: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 12, borderWidth: 1, gap: 4,
  },
  sekmeMetin: { fontSize: 11, fontWeight: '600' },
  // Bilgi kutusu
  bilgiKutu: {
    margin: 14, marginTop: 0, padding: 18, borderRadius: 16, borderWidth: 1,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8,
  },
  bilgiBaslik: { fontSize: 17, fontWeight: 'bold' },
  baslikSatiri: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 10,
  },
  satir: { flexDirection: 'row', marginBottom: 10 },
  etiket: { flex: 1, fontSize: 13, fontWeight: '600' },
  deger: { flex: 2, fontSize: 14 },
  duzenleMetni: { fontWeight: 'bold', fontSize: 14 },
  girdi: {
    padding: 8, borderRadius: 10, borderWidth: 1, marginBottom: 5, fontSize: 13,
  },
  // İlanlar
  ilanSatir: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1,
  },
  ilanIcerik: { flex: 1 },
  ilanAd: { fontSize: 14, fontWeight: '600' },
  ilanFiyat: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  bosAlani: { alignItems: 'center', padding: 24 },
  bosIkon: { width: 70, height: 70, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  bosMetin: { fontSize: 14 },
  // Siparişler
  siparislerAlani: { paddingHorizontal: 14 },
  siparisKart: {
    borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
  },
  siparisHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  siparisNo: { fontSize: 12, fontWeight: '600' },
  siparisTarih: { fontSize: 11, marginTop: 2 },
  durumBadge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10,
    paddingVertical: 5, borderRadius: 10, gap: 4,
  },
  durumMetni: { fontSize: 12, fontWeight: 'bold' },
  // İptal mesajı
  iptalMesajKutu: {
    flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, marginBottom: 12, gap: 8,
  },
  iptalMesaj: { fontSize: 12, flex: 1 },
  // İlerleme çubuğu
  ilerlemeAlani: { marginBottom: 14 },
  ilerlemeCubuk: {
    height: 5, borderRadius: 3, overflow: 'hidden',
  },
  ilerlemeDolu: { height: '100%', borderRadius: 3 },
  ilerlemeDurumlar: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 6,
  },
  durumEtiket: { fontSize: 10 },
  // Ürünler
  urunSatir: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6,
    borderBottomWidth: 1,
  },
  urunAd: { flex: 1, fontSize: 13, marginRight: 10 },
  urunFiyat: { fontSize: 13, fontWeight: '600' },
  siparisToplamSatir: {
    flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginTop: 6,
  },
  siparisToplamEtiket: { fontSize: 15, fontWeight: 'bold' },
  siparisToplamFiyat: { fontSize: 16, fontWeight: 'bold' },
  // Butonlar
  cikisButon: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    margin: 14, marginTop: 5, padding: 15, borderRadius: 14, gap: 8, marginBottom: 40,
    borderWidth: 1,
  },
  adminButon: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    margin: 14, marginBottom: 5, padding: 15, borderRadius: 14, gap: 8,
  },
  cikisMetni: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  cikisMetniKirmizi: { fontWeight: 'bold', fontSize: 16 },
});
