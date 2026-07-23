import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { AcikTema, KoyuTema } from '../../sabitler/Tema';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';
import { Araba, Kullanici } from '../../tipler';
import { UstMenu } from '../../bilesenler/UstMenu';

type Mesaj = {
  id: string;
  gonderen: 'ben' | 'satici';
  metin: string;
  zaman: string;
};

export default function MesajEkran() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const arabalar = useKullanimDurum((state: KullanimDurumTipi) => state.arabalar);
  const kullanicilar = useKullanimDurum((state: KullanimDurumTipi) => state.kullanicilar);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const tema = karanlikMod ? KoyuTema : AcikTema;

  const araba = arabalar.find((a: Araba) => a.id === id);
  const satici = kullanicilar.find((k: Kullanici) => k.id === araba?.saticiId);

  const [mesajlar, setMesajlar] = useState<Mesaj[]>([
    {
      id: '1',
      gonderen: 'satici',
      metin: `Merhaba, ${araba?.marka} ${araba?.model} ilanıyla ilgili size nasıl yardımcı olabilirim?`,
      zaman: new Date(Date.now() - 3600000).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [yeniMesaj, setYeniMesaj] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  if (!araba || !satici) {
    return (
      <View style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]}>
        <UstMenu />
        <Text style={[stiller.hataMetni, { color: tema.metin }]}>İlan veya Satıcı bulunamadı.</Text>
        <TouchableOpacity style={[stiller.geriButonBuyuk, { backgroundColor: tema.anaRenk }]} onPress={() => router.back()}>
           <Text style={{ color: '#FFF' }}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const gonder = () => {
    if (!yeniMesaj.trim()) return;

    const yeni = {
      id: Date.now().toString(),
      gonderen: 'ben' as const,
      metin: yeniMesaj.trim(),
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setMesajlar(prev => [...prev, yeni]);
    setYeniMesaj('');

    // Sahte otomatik yanıt (Chatbot simülasyonu değil, sadece mock)
    setTimeout(() => {
      const yanit = {
        id: (Date.now() + 1).toString(),
        gonderen: 'satici' as const,
        metin: "Mesajınızı aldım, şu an müsait değilim ancak en kısa sürede dönüş yapacağım. Teşekkürler!",
        zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      setMesajlar(prev => [...prev, yanit]);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView 
      style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <UstMenu />

      {/* Mesaj Header (Satıcı Bilgisi) */}
      <View style={[stiller.header, { backgroundColor: tema.kartArkaplan, borderBottomColor: tema.kenarlik }]}>
        <TouchableOpacity onPress={() => router.back()} style={stiller.geriButon}>
          <Ionicons name="arrow-back" size={24} color={tema.metin} />
        </TouchableOpacity>
        
        <View style={stiller.kullaniciKutu}>
          <View style={[stiller.avatar, { backgroundColor: tema.anaRenk }]}>
            <Text style={stiller.avatarMetin}>{satici.ad.charAt(0)}{satici.soyad.charAt(0)}</Text>
          </View>
          <View style={stiller.kullaniciMetinKutu}>
            <Text style={[stiller.kullaniciAd, { color: tema.metin }]}>{satici.ad} {satici.soyad}</Text>
            <Text style={[stiller.durumMetni, { color: tema.basari || '#10B981' }]}>Çevrimiçi</Text>
          </View>
        </View>
        
        {/* İlan Ufak Önizleme */}
        <TouchableOpacity style={[stiller.ilanOnizleme, { backgroundColor: tema.yuzeyRenk }]} onPress={() => router.back()}>
          <Image source={{ uri: araba.resimler[0] }} style={stiller.ilanResim} />
        </TouchableOpacity>
      </View>

      {/* Mesaj Listesi */}
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={stiller.mesajListesi}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <View style={stiller.ilanBilgiKart}>
           <Text style={[stiller.ilanBilgiMetin, { color: tema.metinAcik }]}>
             Bu sohbet <Text style={{ fontWeight: 'bold' }}>{araba.marka} {araba.model}</Text> ilanı hakkında başlatıldı.
           </Text>
           <Text style={[stiller.ilanFiyatMetin, { color: tema.anaRenk }]}>İlan Fiyatı: {araba.fiyat.toLocaleString('tr-TR')} ₺</Text>
        </View>

        {mesajlar.map((msj) => {
          const benMi = msj.gonderen === 'ben';
          return (
            <View key={msj.id} style={[stiller.mesajSatir, benMi ? stiller.mesajSatirBen : stiller.mesajSatirSatici]}>
              <View style={[
                stiller.mesajBalon, 
                benMi ? [stiller.mesajBalonBen, { backgroundColor: tema.anaRenk }] : [stiller.mesajBalonSatici, { backgroundColor: tema.yuzeyRenk, borderWidth: 1, borderColor: tema.kenarlik }]
              ]}>
                <Text style={[stiller.mesajMetin, { color: benMi ? '#FFF' : tema.metin }]}>{msj.metin}</Text>
                <Text style={[stiller.mesajZaman, { color: benMi ? 'rgba(255,255,255,0.7)' : tema.metinAcik }]}>{msj.zaman}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Mesaj Yazma Alanı */}
      <View style={[stiller.yazmaAlani, { backgroundColor: tema.kartArkaplan, borderTopColor: tema.kenarlik }]}>
        <View style={[stiller.girdiKutu, { backgroundColor: tema.yuzeyRenk }]}>
          <TextInput
            style={[stiller.girdi, { color: tema.metin }]}
            placeholder="Mesajınızı yazın..."
            placeholderTextColor={tema.metinAcik}
            value={yeniMesaj}
            onChangeText={setYeniMesaj}
            multiline
            maxLength={500}
            onSubmitEditing={gonder}
          />
        </View>
        <TouchableOpacity 
          style={[stiller.gonderButon, { backgroundColor: yeniMesaj.trim() ? tema.anaRenk : tema.metinAcik + '50' }]} 
          onPress={gonder}
          disabled={!yeniMesaj.trim()}
        >
          <Ionicons name="send" size={18} color="#FFF" style={{ marginLeft: 3 }} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  geriButonBuyuk: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  geriButon: {
    padding: 5,
    marginRight: 10,
  },
  kullaniciKutu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMetin: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  kullaniciMetinKutu: {
    justifyContent: 'center',
  },
  kullaniciAd: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  durumMetni: {
    fontSize: 12,
    marginTop: 2,
  },
  ilanOnizleme: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ilanResim: {
    width: 50,
    height: 40,
  },
  mesajListesi: {
    padding: 15,
    paddingBottom: 30,
  },
  ilanBilgiKart: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  ilanBilgiMetin: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
  },
  ilanFiyatMetin: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  mesajSatir: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mesajSatirBen: {
    justifyContent: 'flex-end',
  },
  mesajSatirSatici: {
    justifyContent: 'flex-start',
  },
  mesajBalon: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  mesajBalonBen: {
    borderBottomRightRadius: 4,
  },
  mesajBalonSatici: {
    borderBottomLeftRadius: 4,
  },
  mesajMetin: {
    fontSize: 15,
    lineHeight: 20,
  },
  mesajZaman: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  yazmaAlani: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  girdiKutu: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    minHeight: 40,
    maxHeight: 100,
    justifyContent: 'center',
  },
  girdi: {
    fontSize: 15,
    paddingVertical: 10,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' as any })
  },
  gonderButon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
