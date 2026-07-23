import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KullanimDurumTipi, useKullanimDurum } from '../durum/kullanimDurum';
import { AcikTema, KoyuTema } from '../sabitler/Tema';
import { UstMenu } from '../bilesenler/UstMenu';

export default function IlanVerEkrani() {
  const router = useRouter();
  const arabaEkle = useKullanimDurum((state: KullanimDurumTipi) => state.arabaEkle);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const tema = karanlikMod ? KoyuTema : AcikTema;

  const [marka, setMarka] = useState('');
  const [model, setModel] = useState('');
  const [yil, setYil] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [kilometre, setKilometre] = useState('');
  const [vites, setVites] = useState<'Otomatik' | 'Manuel'>('Manuel');
  const [yakitTuru, setYakitTuru] = useState<'Benzin' | 'Dizel' | 'Elektrik' | 'Hibrit'>('Benzin');
  const [kasaTipi, setKasaTipi] = useState<'Sedan' | 'Hatchback' | 'SUV' | 'Station Wagon' | 'Coupe' | 'Cabrio' | 'Pickup'>('Sedan');
  
  const [hasarDurumu, setHasarDurumu] = useState<'Yok' | 'Hasar Kayıtlı' | 'Ağır Hasarlı'>('Yok');
  const [boyaDurumu, setBoyaDurumu] = useState<'Orijinal' | 'Boyalı' | 'Değişenli' | 'Boyalı ve Değişenli'>('Orijinal');
  const [motorHacmi, setMotorHacmi] = useState('');
  const [renk, setRenk] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [hata, setHata] = useState('');

  const ilanVerIslemi = () => {
    if (!marka || !model || !yil || !fiyat || !kilometre) {
      setHata('Lütfen temel araç bilgilerini eksiksiz doldurun.');
      return;
    }

    arabaEkle({
      marka,
      model,
      yil: parseInt(yil, 10),
      fiyat: parseInt(fiyat, 10),
      kilometre: parseInt(kilometre, 10),
      vites,
      yakitTuru,
      kasaTipi,
      renk: renk || 'Belirtilmemiş',
      hasarKaydi: hasarDurumu,
      boyaliDegisen: boyaDurumu,
      motorHacmi: motorHacmi ? `${motorHacmi} cc` : undefined,
      aciklama,
      ozellikler: [
        `Kasa: ${kasaTipi}`,
        `Hasar: ${hasarDurumu}`,
        `Boya: ${boyaDurumu}`,
        motorHacmi ? `Motor: ${motorHacmi} cc` : 'Motor: Belirtilmemiş',
        renk ? `Renk: ${renk}` : 'Renk: Belirtilmemiş'
      ],
      resimler: [fotoUrl.trim() || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000']
    });

    router.back();
  };

  return (
    <View style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]}>
      <UstMenu />

      <TouchableOpacity style={[stiller.geriButon, { backgroundColor: tema.kartArkaplan }]} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={tema.metin} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={stiller.scrollIcerik}>
        <View style={[stiller.formKutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }, Platform.OS === 'web' && { maxWidth: 600, alignSelf: 'center', width: '100%' }]}>
          <Text style={[stiller.baslik, { color: tema.metin }]}>Yeni İlan Ver</Text>
          <Text style={[stiller.altBaslik, { color: tema.metinAcik }]}>Aracınızın detaylarını girerek hemen satışa çıkarın.</Text>
          
          {hata ? (
            <View style={[stiller.hataKutu, { backgroundColor: tema.hata + '20', borderColor: tema.hata }]}>
              <Ionicons name="alert-circle" size={20} color={tema.hata} />
              <Text style={[stiller.hataMetni, { color: tema.hata }]}>{hata}</Text>
            </View>
          ) : null}

          <View style={stiller.satirGrup}>
            <View style={stiller.yarimAlan}>
              <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Marka *</Text>
              <TextInput style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, color: tema.metin, borderColor: tema.kenarlik }]} placeholder="Örn: BMW" placeholderTextColor={tema.metinAcik} value={marka} onChangeText={setMarka} />
            </View>
            <View style={stiller.yarimAlan}>
              <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Model *</Text>
              <TextInput style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, color: tema.metin, borderColor: tema.kenarlik }]} placeholder="Örn: 320i" placeholderTextColor={tema.metinAcik} value={model} onChangeText={setModel} />
            </View>
          </View>

          <View style={stiller.satirGrup}>
            <View style={stiller.yarimAlan}>
              <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Yıl *</Text>
              <TextInput style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, color: tema.metin, borderColor: tema.kenarlik }]} placeholder="Örn: 2020" placeholderTextColor={tema.metinAcik} value={yil} onChangeText={setYil} keyboardType="numeric" />
            </View>
            <View style={stiller.yarimAlan}>
              <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Kilometre *</Text>
              <TextInput style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, color: tema.metin, borderColor: tema.kenarlik }]} placeholder="Örn: 45000" placeholderTextColor={tema.metinAcik} value={kilometre} onChangeText={setKilometre} keyboardType="numeric" />
            </View>
          </View>

          <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Fiyat (TL) *</Text>
          <TextInput style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, color: tema.metin, borderColor: tema.kenarlik }]} placeholder="Örn: 1500000" placeholderTextColor={tema.metinAcik} value={fiyat} onChangeText={setFiyat} keyboardType="numeric" />

          {/* Seçenekler Alanı */}
          <Text style={[stiller.etiket, { color: tema.metinAcik, marginTop: 10 }]}>Vites Tipi *</Text>
          <View style={stiller.butonGrup}>
            {['Manuel', 'Otomatik'].map((tur) => (
              <TouchableOpacity key={tur} style={[stiller.secenekButon, { borderColor: tema.kenarlik, backgroundColor: tema.yuzeyRenk }, vites === tur && { backgroundColor: tema.anaRenk, borderColor: tema.anaRenk }]} onPress={() => setVites(tur as any)}>
                <Text style={[stiller.secenekMetin, { color: tema.metin }, vites === tur && { color: '#FFF' }]}>{tur}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[stiller.etiket, { color: tema.metinAcik, marginTop: 10 }]}>Yakıt Türü *</Text>
          <View style={stiller.butonGrup}>
            {['Benzin', 'Dizel', 'Elektrik', 'Hibrit'].map((tur) => (
              <TouchableOpacity key={tur} style={[stiller.secenekButon, { borderColor: tema.kenarlik, backgroundColor: tema.yuzeyRenk }, yakitTuru === tur && { backgroundColor: tema.anaRenk, borderColor: tema.anaRenk }]} onPress={() => setYakitTuru(tur as any)}>
                <Text style={[stiller.secenekMetin, { color: tema.metin }, yakitTuru === tur && { color: '#FFF' }]}>{tur}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[stiller.etiket, { color: tema.metinAcik, marginTop: 10 }]}>Kasa Tipi</Text>
          <View style={stiller.butonGrup}>
            {['Sedan', 'Hatchback', 'SUV', 'Station Wagon', 'Coupe'].map((tur) => (
              <TouchableOpacity key={tur} style={[stiller.secenekButon, { borderColor: tema.kenarlik, backgroundColor: tema.yuzeyRenk }, kasaTipi === tur && { backgroundColor: tema.anaRenk, borderColor: tema.anaRenk }]} onPress={() => setKasaTipi(tur as any)}>
                <Text style={[stiller.secenekMetin, { color: tema.metin }, kasaTipi === tur && { color: '#FFF' }]}>{tur}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Ekspertiz & Tramer */}
          <View style={[stiller.bolumAyrac, { borderTopColor: tema.kenarlik }]} />
          <Text style={[stiller.bolumBaslik, { color: tema.metin }]}>Ekspertiz ve Durum Bilgisi</Text>

          <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Tramer / Hasar Kaydı</Text>
          <View style={stiller.butonGrup}>
            {['Yok', 'Hasar Kayıtlı', 'Ağır Hasarlı'].map((durum) => (
              <TouchableOpacity key={durum} style={[stiller.secenekButon, { borderColor: tema.kenarlik, backgroundColor: tema.yuzeyRenk }, hasarDurumu === durum && { backgroundColor: tema.anaRenk, borderColor: tema.anaRenk }]} onPress={() => setHasarDurumu(durum as any)}>
                <Text style={[stiller.secenekMetin, { color: tema.metin }, hasarDurumu === durum && { color: '#FFF' }]}>{durum}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[stiller.etiket, { color: tema.metinAcik, marginTop: 10 }]}>Boya / Değişen</Text>
          <View style={stiller.butonGrup}>
            {['Orijinal', 'Boyalı', 'Değişenli', 'Boyalı ve Değişenli'].map((durum) => (
              <TouchableOpacity key={durum} style={[stiller.secenekButon, { borderColor: tema.kenarlik, backgroundColor: tema.yuzeyRenk }, boyaDurumu === durum && { backgroundColor: tema.anaRenk, borderColor: tema.anaRenk }]} onPress={() => setBoyaDurumu(durum as any)}>
                <Text style={[stiller.secenekMetin, { color: tema.metin }, boyaDurumu === durum && { color: '#FFF' }]}>{durum}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={stiller.satirGrup}>
            <View style={stiller.yarimAlan}>
              <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Renk</Text>
              <TextInput style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, color: tema.metin, borderColor: tema.kenarlik }]} placeholder="Örn: Beyaz" placeholderTextColor={tema.metinAcik} value={renk} onChangeText={setRenk} />
            </View>
            <View style={stiller.yarimAlan}>
              <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Motor Hacmi (cc)</Text>
              <TextInput style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, color: tema.metin, borderColor: tema.kenarlik }]} placeholder="Örn: 1598" placeholderTextColor={tema.metinAcik} value={motorHacmi} onChangeText={setMotorHacmi} keyboardType="numeric" />
            </View>
          </View>

          <Text style={[stiller.etiket, { color: tema.metinAcik }]}>Araç Fotoğrafı (URL)</Text>
          <TextInput style={[stiller.girdi, { backgroundColor: tema.yuzeyRenk, color: tema.metin, borderColor: tema.kenarlik }]} placeholder="https://ornek.com/araba.jpg" placeholderTextColor={tema.metinAcik} value={fotoUrl} onChangeText={setFotoUrl} autoCapitalize="none" />

          <Text style={[stiller.etiket, { color: tema.metinAcik }]}>İlan Açıklaması</Text>
          <TextInput style={[stiller.girdi, stiller.cokluSati, { backgroundColor: tema.yuzeyRenk, color: tema.metin, borderColor: tema.kenarlik }]} placeholder="Aracın durumu hakkında detaylı bilgi verin..." placeholderTextColor={tema.metinAcik} value={aciklama} onChangeText={setAciklama} multiline numberOfLines={4} />

          <TouchableOpacity style={[stiller.kayitButon, { backgroundColor: tema.anaRenk }]} onPress={ilanVerIslemi} activeOpacity={0.8}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#FFF" />
            <Text style={stiller.butonMetni}>İlanı Yayınla</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: { flex: 1 },
  geriButon: { position: 'absolute', top: 50, left: 16, zIndex: 10, padding: 8, borderRadius: 20 },
  scrollIcerik: { padding: 16, paddingBottom: 40, paddingTop: 60 },
  formKutu: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  baslik: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  altBaslik: { fontSize: 14, marginBottom: 24 },
  hataKutu: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 20, gap: 8 },
  hataMetni: { fontSize: 14, fontWeight: '500', flex: 1 },
  satirGrup: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  yarimAlan: { flex: 1 },
  etiket: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  girdi: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, borderWidth: 1, marginBottom: 16 },
  cokluSati: { height: 100, textAlignVertical: 'top' },
  butonGrup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  secenekButon: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  secenekMetin: { fontSize: 14, fontWeight: '500' },
  bolumAyrac: { borderTopWidth: 1, marginVertical: 20 },
  bolumBaslik: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  kayitButon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, marginTop: 10, gap: 8 },
  butonMetni: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
