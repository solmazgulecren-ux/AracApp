import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KullanimDurumTipi, useKullanimDurum } from '../durum/kullanimDurum';

export default function IlanVerEkrani() {
  const router = useRouter();
  const arabaEkle = useKullanimDurum((state: KullanimDurumTipi) => state.arabaEkle);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const temaDegistir = useKullanimDurum((state: KullanimDurumTipi) => state.temaDegistir);

  const [marka, setMarka] = useState('');
  const [model, setModel] = useState('');
  const [yil, setYil] = useState('');
  const [fiyat, setFiyat] = useState('');
  const [kilometre, setKilometre] = useState('');
  const [vites, setVites] = useState<'Otomatik' | 'Manuel'>('Manuel');
  const [yakitTuru, setYakitTuru] = useState<'Benzin' | 'Dizel' | 'Elektrik' | 'Hibrit'>('Benzin');
  const [aciklama, setAciklama] = useState('');
  const [hata, setHata] = useState('');

  const ilanVerIslemi = () => {
    if (!marka || !model || !yil || !fiyat || !kilometre) {
      setHata('Lütfen tüm zorunlu alanları doldurun.');
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
      aciklama,
      ozellikler: [],
      resimler: ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1000'] // Default generic placeholder image
    });

    router.back();
  };

  return (
    <View style={[stiller.anaKutu, karanlikMod && stiller.anaKutuKaranlik]}>
      <TouchableOpacity style={stiller.temaButon} onPress={temaDegistir}>
        <Ionicons name={karanlikMod ? 'sunny' : 'moon'} size={24} color={karanlikMod ? '#FFF' : '#333'} />
      </TouchableOpacity>

      <View style={stiller.baslikKutu}>
        <TouchableOpacity onPress={() => router.back()} style={stiller.geriButon}>
          <Ionicons name="arrow-back" size={24} color={karanlikMod ? '#FFF' : '#333'} />
        </TouchableOpacity>
        <Text style={[stiller.baslik, karanlikMod && stiller.metinKaranlik]}>İlan Ver</Text>
      </View>

      <ScrollView contentContainerStyle={stiller.merkezKutu}>
        {hata ? <Text style={stiller.hataMetni}>{hata}</Text> : null}

        <TextInput style={[stiller.girdi, karanlikMod && stiller.girdiKaranlik]} placeholder="Marka" placeholderTextColor={karanlikMod ? '#999' : '#666'} value={marka} onChangeText={setMarka} />
        <TextInput style={[stiller.girdi, karanlikMod && stiller.girdiKaranlik]} placeholder="Model" placeholderTextColor={karanlikMod ? '#999' : '#666'} value={model} onChangeText={setModel} />
        <TextInput style={[stiller.girdi, karanlikMod && stiller.girdiKaranlik]} placeholder="Yıl" placeholderTextColor={karanlikMod ? '#999' : '#666'} value={yil} onChangeText={setYil} keyboardType="numeric" />
        <TextInput style={[stiller.girdi, karanlikMod && stiller.girdiKaranlik]} placeholder="Fiyat (TL)" placeholderTextColor={karanlikMod ? '#999' : '#666'} value={fiyat} onChangeText={setFiyat} keyboardType="numeric" />
        <TextInput style={[stiller.girdi, karanlikMod && stiller.girdiKaranlik]} placeholder="Kilometre" placeholderTextColor={karanlikMod ? '#999' : '#666'} value={kilometre} onChangeText={setKilometre} keyboardType="numeric" />

        <View style={stiller.secenekKutu}>
          <Text style={[stiller.secenekBaslik, karanlikMod && stiller.metinKaranlik]}>Vites:</Text>
          <View style={stiller.butonGrup}>
            <TouchableOpacity style={[stiller.secenekButon, vites === 'Manuel' && stiller.secenekAktif]} onPress={() => setVites('Manuel')}>
              <Text style={[stiller.secenekMetin, vites === 'Manuel' && stiller.secenekMetinAktif]}>Manuel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[stiller.secenekButon, vites === 'Otomatik' && stiller.secenekAktif]} onPress={() => setVites('Otomatik')}>
              <Text style={[stiller.secenekMetin, vites === 'Otomatik' && stiller.secenekMetinAktif]}>Otomatik</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={stiller.secenekKutu}>
          <Text style={[stiller.secenekBaslik, karanlikMod && stiller.metinKaranlik]}>Yakıt Türü:</Text>
          <View style={stiller.butonGrup}>
            {['Benzin', 'Dizel', 'Elektrik', 'Hibrit'].map((tur) => (
              <TouchableOpacity key={tur} style={[stiller.secenekButon, yakitTuru === tur && stiller.secenekAktif]} onPress={() => setYakitTuru(tur as any)}>
                <Text style={[stiller.secenekMetin, yakitTuru === tur && stiller.secenekMetinAktif]}>{tur}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextInput style={[stiller.girdi, stiller.cokluSati, karanlikMod && stiller.girdiKaranlik]} placeholder="Açıklama" placeholderTextColor={karanlikMod ? '#999' : '#666'} value={aciklama} onChangeText={setAciklama} multiline numberOfLines={3} />

        <TouchableOpacity style={stiller.kayitButon} onPress={ilanVerIslemi}>
          <Text style={stiller.butonMetni}>İlanı Yayınla</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: { flex: 1, backgroundColor: '#F5F5F5' },
  anaKutuKaranlik: { backgroundColor: '#121212' },
  baslikKutu: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50 },
  geriButon: { marginRight: 15 },
  baslik: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  metinKaranlik: { color: '#FFF' },
  merkezKutu: { alignItems: 'center', padding: 20, paddingBottom: 50 },
  girdi: { width: '80%', maxWidth: 300, backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#DDD', textAlign: 'center' },
  girdiKaranlik: { backgroundColor: '#1E1E1E', borderColor: '#333', color: '#FFF' },
  cokluSati: { height: 80, textAlignVertical: 'top' },
  secenekKutu: { width: '80%', maxWidth: 300, marginBottom: 15, alignItems: 'center' },
  secenekBaslik: { fontSize: 16, fontWeight: '600', marginBottom: 5, color: '#333' },
  butonGrup: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  secenekButon: { paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: '#DDD', borderRadius: 20, margin: 5, backgroundColor: '#FFF' },
  secenekAktif: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  secenekMetin: { color: '#333' },
  secenekMetinAktif: { color: '#FFF', fontWeight: 'bold' },
  kayitButon: { width: '80%', maxWidth: 300, backgroundColor: '#34C759', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  butonMetni: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  hataMetni: { color: '#FF3B30', marginBottom: 15 },
  temaButon: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 50 }
});
