import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AcikTema, KoyuTema } from '../sabitler/Tema';
import { Aksesuar, SepetUrun } from '../tipler';
import { KullanimDurumTipi, useKullanimDurum } from '../durum/kullanimDurum';

export default function OdemeEkrani() {
  const router = useRouter();
  const sepet = useKullanimDurum((state: KullanimDurumTipi) => state.sepet);
  const aksesuarlar = useKullanimDurum((state: KullanimDurumTipi) => state.aksesuarlar);
  const aktifKullanici = useKullanimDurum((state: KullanimDurumTipi) => state.aktifKullanici);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  const siparisOlustur = useKullanimDurum((state: KullanimDurumTipi) => state.siparisOlustur);

  const [ad, setAd] = useState(aktifKullanici?.ad || '');
  const [soyad, setSoyad] = useState(aktifKullanici?.soyad || '');
  const [telefon, setTelefon] = useState(aktifKullanici?.telefon || '');
  const [adres, setAdres] = useState(aktifKullanici?.adres || '');
  const [eposta, setEposta] = useState(aktifKullanici?.eposta || '');
  const [hata, setHata] = useState('');

  const kullaniciSepeti = sepet.filter((s: SepetUrun) => s.kullaniciId === aktifKullanici?.id);
  const sepetUrunleri = kullaniciSepeti.map((s: SepetUrun) => {
    const aksesuar = aksesuarlar.find((a: Aksesuar) => a.id === s.aksesuarId);
    return { ...s, aksesuar };
  }).filter(s => s.aksesuar);

  const toplamFiyat = sepetUrunleri.reduce((t, u) => t + (u.aksesuar?.fiyat || 0) * u.adet, 0);

  const siparisiOnayla = () => {
    if (!ad.trim() || !soyad.trim() || !telefon.trim() || !adres.trim() || !eposta.trim()) {
      setHata('Lütfen tüm alanları doldurun.');
      return;
    }

    const siparisId = siparisOlustur({
      ad: ad.trim(),
      soyad: soyad.trim(),
      telefon: telefon.trim(),
      adres: adres.trim(),
      eposta: eposta.trim(),
    });

    if (siparisId) {
      router.replace('/siparisBasarili');
    } else {
      setHata('Sipariş oluşturulurken bir hata oluştu.');
    }
  };

  return (
    <View style={[
      stiller.anaKutu, 
      { backgroundColor: tema.arkaplan },
      Platform.OS === 'web' && { maxWidth: 700, alignSelf: 'center', width: '100%' }
    ]}>
      {/* Header */}
      <View style={[stiller.baslikAlani, { backgroundColor: tema.kartArkaplan, borderBottomColor: tema.kenarlik }]}>
        <TouchableOpacity onPress={() => router.back()} style={stiller.geriButon}>
          <Ionicons name="arrow-back" size={24} color={tema.metin} />
        </TouchableOpacity>
        <Text style={[stiller.sayfaBaslik, { color: tema.metin }]}>Sipariş Bilgileri</Text>
      </View>

      <ScrollView contentContainerStyle={stiller.formAlani}>
        {/* Sipariş Özeti */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={[stiller.ozetKutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
            <View style={stiller.ozetBaslikSatir}>
              <View style={[stiller.ozetIkon, { backgroundColor: tema.anaRenk + '15' }]}>
                <Ionicons name="receipt-outline" size={18} color={tema.anaRenk} />
              </View>
              <Text style={[stiller.ozetBaslik, { color: tema.metin }]}>Sipariş Özeti</Text>
            </View>
            {sepetUrunleri.map((urun, index) => (
              <View key={index} style={[stiller.ozetSatir, { borderBottomColor: tema.kenarlik }]}>
                <Text style={[stiller.ozetUrunAd, { color: tema.metinAcik }]} numberOfLines={1}>
                  {urun.aksesuar?.ad} x{urun.adet}
                </Text>
                <Text style={[stiller.ozetUrunFiyat, { color: tema.metin }]}>
                  {((urun.aksesuar?.fiyat || 0) * urun.adet).toLocaleString('tr-TR')} ₺
                </Text>
              </View>
            ))}
            <View style={stiller.ozetToplamSatir}>
              <Text style={[stiller.ozetToplamEtiket, { color: tema.metin }]}>Toplam</Text>
              <Text style={[stiller.ozetToplamFiyat, { color: tema.anaRenk }]}>{toplamFiyat.toLocaleString('tr-TR')} ₺</Text>
            </View>
          </View>
        </Animated.View>

        {/* Teslimat Bilgileri Formu */}
        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <View style={[stiller.formKutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
            <View style={stiller.formBaslikSatir}>
              <View style={[stiller.ozetIkon, { backgroundColor: tema.ikincilRenk + '15' }]}>
                <Ionicons name="location-outline" size={18} color={tema.ikincilRenk} />
              </View>
              <Text style={[stiller.formBaslik, { color: tema.metin }]}>Teslimat Bilgileri</Text>
            </View>

            {hata ? (
              <View style={stiller.hataKutu}>
                <Ionicons name="warning" size={16} color="#EF4444" />
                <Text style={stiller.hataMetni}>{hata}</Text>
              </View>
            ) : null}

            <View style={stiller.satirGrup}>
              <View style={stiller.yarimAlani}>
                <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Ad *</Text>
                <TextInput
                  style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik, color: tema.metin }]}
                  value={ad} onChangeText={setAd}
                  placeholder="Adınız" placeholderTextColor={tema.metinAcik}
                />
              </View>
              <View style={stiller.yarimAlani}>
                <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Soyad *</Text>
                <TextInput
                  style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik, color: tema.metin }]}
                  value={soyad} onChangeText={setSoyad}
                  placeholder="Soyadınız" placeholderTextColor={tema.metinAcik}
                />
              </View>
            </View>

            <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Telefon *</Text>
            <TextInput
              style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik, color: tema.metin }]}
              value={telefon} onChangeText={setTelefon}
              placeholder="0555 123 4567" placeholderTextColor={tema.metinAcik}
              keyboardType="phone-pad"
            />

            <Text style={[stiller.etiket, { color: tema.metinAcik }]}>E-posta *</Text>
            <TextInput
              style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik, color: tema.metin }]}
              value={eposta} onChangeText={setEposta}
              placeholder="ornek@mail.com" placeholderTextColor={tema.metinAcik}
              keyboardType="email-address" autoCapitalize="none"
            />

            <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Teslimat Adresi *</Text>
            <TextInput
              style={[stiller.girdi, stiller.adresGirdi, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik, color: tema.metin }]}
              value={adres} onChangeText={setAdres}
              placeholder="Tam adresinizi girin" placeholderTextColor={tema.metinAcik}
              multiline numberOfLines={3}
            />
          </View>
        </Animated.View>

        {/* Siparişi Onayla Butonu */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <TouchableOpacity
            style={[stiller.onaylaButon, { backgroundColor: tema.anaRenk }]}
            onPress={siparisiOnayla}
            activeOpacity={0.85}
          >
            <Ionicons name="shield-checkmark" size={22} color="#FFF" />
            <Text style={stiller.onaylaMetin}>Siparişi Onayla</Text>
          </TouchableOpacity>

          <Text style={[stiller.guvenlikNotu, { color: tema.metinAcik }]}>
            🔒 Bilgileriniz güvenle saklanmaktadır.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: { flex: 1 },
  baslikAlani: {
    flexDirection: 'row', alignItems: 'center', padding: 15, paddingTop: 50,
    borderBottomWidth: 1,
  },
  geriButon: { marginRight: 12, padding: 4 },
  sayfaBaslik: { fontSize: 22, fontWeight: 'bold' },
  formAlani: { padding: 14, paddingBottom: 40 },
  // Sipariş Özeti
  ozetKutu: {
    borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
  },
  ozetBaslikSatir: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  ozetIkon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  ozetBaslik: { fontSize: 17, fontWeight: 'bold' },
  ozetSatir: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8,
    borderBottomWidth: 1,
  },
  ozetUrunAd: { flex: 1, fontSize: 13, marginRight: 10 },
  ozetUrunFiyat: { fontSize: 13, fontWeight: '600' },
  ozetToplamSatir: {
    flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14, marginTop: 6,
  },
  ozetToplamEtiket: { fontSize: 16, fontWeight: 'bold' },
  ozetToplamFiyat: { fontSize: 20, fontWeight: 'bold' },
  // Form
  formKutu: {
    borderRadius: 16, padding: 18, marginBottom: 18, borderWidth: 1,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
  },
  formBaslikSatir: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  formBaslik: { fontSize: 17, fontWeight: 'bold' },
  hataKutu: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF2F2',
    padding: 12, borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: '#FECACA',
  },
  hataMetni: { color: '#EF4444', fontSize: 13, flex: 1 },
  satirGrup: { flexDirection: 'row', gap: 12 },
  yarimAlani: { flex: 1 },
  etiket: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  girdi: {
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, borderWidth: 1,
  },
  adresGirdi: { height: 80, textAlignVertical: 'top' },
  // Onay Butonu
  onaylaButon: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, borderRadius: 16, gap: 10,
    elevation: 5, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10,
  },
  onaylaMetin: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  guvenlikNotu: { textAlign: 'center', fontSize: 12, marginTop: 12 },
});
