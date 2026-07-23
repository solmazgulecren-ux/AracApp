import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Aksesuar, Araba, ChatMesaj } from '../tipler';
import { KullanimDurumTipi, useKullanimDurum } from '../durum/kullanimDurum';
import { UstMenu } from '../bilesenler/UstMenu';
import { AcikTema, KoyuTema } from '../sabitler/Tema';

// Bot yanıt üretici - Kıdemli Otomotiv Uzmanı System Prompt
const botYanitUret = async (
  mesaj: string,
  arabalar: Araba[],
  aksesuarlar: Aksesuar[]
): Promise<{ metin: string; tip: ChatMesaj['tip']; karsilastirmaVerileri?: Araba[]; aramaVerileri?: (Araba | Aksesuar)[] }> => {
  const kucukMesaj = mesaj.toLowerCase().replace(/[ıİ]/g, (c) => c === 'ı' ? 'i' : 'i');

  // Karşılaştırma komutu
  const karsilastirmaRegex = /(.+)\s+(ile|vs|ve)\s+(.+)\s*(karşılaştır|kıyasla|karsilastir|kiyasla)/i;
  const karsilastirmaRegex2 = /(karşılaştır|kıyasla|karsilastir|kiyasla)\s+(.+)\s+(ile|vs|ve)\s+(.+)/i;

  let eslesme = mesaj.match(karsilastirmaRegex) || mesaj.match(karsilastirmaRegex2);

  if (eslesme) {
    let arac1Adi: string, arac2Adi: string;
    if (mesaj.match(karsilastirmaRegex)) {
      arac1Adi = eslesme[1].trim().toLowerCase();
      arac2Adi = eslesme[3].trim().toLowerCase();
    } else {
      arac1Adi = eslesme[2].trim().toLowerCase();
      arac2Adi = eslesme[4].trim().toLowerCase();
    }

    const arac1 = arabalar.find((a: Araba) =>
      `${a.marka} ${a.model}`.toLowerCase().includes(arac1Adi) ||
      a.marka.toLowerCase().includes(arac1Adi) ||
      a.model.toLowerCase().includes(arac1Adi)
    );
    const arac2 = arabalar.find((a: Araba) =>
      `${a.marka} ${a.model}`.toLowerCase().includes(arac2Adi) ||
      a.marka.toLowerCase().includes(arac2Adi) ||
      a.model.toLowerCase().includes(arac2Adi)
    );

    if (arac1 && arac2) {
      const karsilastirmaMetni = `📋 Kapsamlı Otomotiv Uzmanı Karşılaştırma Raporu:
──────────────────────────────
🚗 ${arac1.marka} ${arac1.model} vs 🚙 ${arac2.marka} ${arac2.model}

⚙️ MOTOR VE PERFORMANS
• ${arac1.marka}: ${arac1.motorHacmi || 'Belirtilmemiş'} / ${arac1.yakitTuru} / ${arac1.vites}
• ${arac2.marka}: ${arac2.motorHacmi || 'Belirtilmemiş'} / ${arac2.yakitTuru} / ${arac2.vites}

💰 FİYAT VE MODEL YILI
• ${arac1.marka}: ${arac1.yil} model - ${arac1.fiyat.toLocaleString('tr-TR')} ₺
• ${arac2.marka}: ${arac2.yil} model - ${arac2.fiyat.toLocaleString('tr-TR')} ₺

──────────────────────────────
Editör Kararı: ${arac1.fiyat < arac2.fiyat ? arac1.marka : arac2.marka} fiyat/performans açısından daha avantajlı görünürken, ${arac1.yil > arac2.yil ? arac1.marka : arac2.marka} daha yeni model yılıyla dikkat çekiyor.`;

      return {
        metin: karsilastirmaMetni,
        tip: 'karsilastirma',
        karsilastirmaVerileri: [arac1, arac2]
      };
    }
  }

  // Araç Arama
  const bulunanAraclar = arabalar.filter((a: Araba) => 
    kucukMesaj.includes(a.marka.toLowerCase()) || 
    kucukMesaj.includes(a.model.toLowerCase())
  ).slice(0, 3);

  if (bulunanAraclar.length > 0) {
    return {
      metin: `🚗 Arama Sonuçları:\n\nAradığınız kriterlere uygun ${bulunanAraclar.length} adet araç bulundu.`,
      tip: 'arama',
      aramaVerileri: bulunanAraclar
    };
  }

  // Aksesuar Arama
  const bulunanAksesuarlar = aksesuarlar.filter((a: Aksesuar) => 
    kucukMesaj.split(' ').some((kelime: string) => kelime.length > 2 && a.ad.toLowerCase().includes(kelime))
  ).slice(0, 5);

  if (bulunanAksesuarlar.length > 0) {
    return {
      metin: `🔧 Aksesuar Sonuçları:\n\nAradığınız kriterlere uygun ${bulunanAksesuarlar.length} adet aksesuar bulundu.`,
      tip: 'arama',
      aramaVerileri: bulunanAksesuarlar
    };
  }

  // Fiyat sorgusu
  if (kucukMesaj.includes('fiyat') || kucukMesaj.includes('ucuz') || kucukMesaj.includes('pahalı') || kucukMesaj.includes('pahali')) {
    if (kucukMesaj.includes('ucuz')) {
      const enUcuz = [...arabalar].sort((a, b) => a.fiyat - b.fiyat).slice(0, 3);
      return {
        metin: `💰 En Uygun Fiyatlı Araçlar:\n\nBütçe dostu araçlarımız aşağıda listelenmiştir:`,
        tip: 'arama',
        aramaVerileri: enUcuz
      };
    }
    if (kucukMesaj.includes('pahalı') || kucukMesaj.includes('pahali')) {
      const enPahali = [...arabalar].sort((a, b) => b.fiyat - a.fiyat).slice(0, 3);
      return {
        metin: `💎 Premium Araçlar:\n\nEn üst segment araçlarımız aşağıda listelenmiştir:`,
        tip: 'arama',
        aramaVerileri: enPahali
      };
    }
  }

  // İstatistik
  if (kucukMesaj.includes('kaç') || kucukMesaj.includes('istatistik') || kucukMesaj.includes('özet') || kucukMesaj.includes('bilgi')) {
    const ortalamFiyat = Math.round(arabalar.reduce((t, a) => t + a.fiyat, 0) / (arabalar.length || 1));
    return {
      metin: `📊 Portföy Analitiği:\n\n🚗 Aktif İlan: ${arabalar.length} araç\n🔧 Aksesuar: ${aksesuarlar.length} adet\n💰 Ortalama Fiyat: ${ortalamFiyat.toLocaleString('tr-TR')} ₺`,
      tip: 'normal'
    };
  }

  // Yardım / Selam
  if (kucukMesaj.includes('merhaba') || kucukMesaj.includes('selam') || kucukMesaj.includes('hey')) {
    return {
      metin: `Merhaba! Ben AracApp Asistanınız. 🏎️\n\nSize araç karşılaştırmaları, aksesuar arama ve fiyat analizlerinde yardımcı olabilirim.\n\nÖrn: "BMW ile Mercedes karşılaştır" veya "en ucuz araçlar"`,
      tip: 'normal'
    };
  }

  // Varsayılan
  return {
    metin: `Anlayamadım. Lütfen "BMW ara", "lastik bul" veya "BMW ile Audi karşılaştır" şeklinde sorgulayın.`,
    tip: 'normal'
  };
};

export default function ChatbotEkrani() {
  const router = useRouter();
  const arabalar = useKullanimDurum((state: KullanimDurumTipi) => state.arabalar);
  const aksesuarlar = useKullanimDurum((state: KullanimDurumTipi) => state.aksesuarlar);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const insets = useSafeAreaInsets();
  const tema = karanlikMod ? KoyuTema : AcikTema;

  const [mesajlar, setMesajlar] = useState<ChatMesaj[]>([
    {
      id: 'hosgeldin',
      gonderen: 'bot',
      metin: 'Merhaba! Ben AracApp Kıdemli Otomotiv Uzmanı asistanınızım. 🏎️\n\nBMW, Mercedes, Audi ve Tesla gibi markaların tüm detaylarını analiz edebilir, araçları kıyaslayabilir ve en uygun aksesuarları bulabilirim.\n\nHangi iki aracı karşılaştırmak istersiniz?',
      tip: 'normal',
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [girdi, setGirdi] = useState('');
  const [yaziyor, setYaziyor] = useState(false);
  const listeRef = useRef<FlatList>(null);

  // Klavye açıldığında listenin en alta kaydırılması
  useEffect(() => {
    const klavyeGoster = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        listeRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
    return () => {
      klavyeGoster.remove();
    };
  }, []);

  const mesajGonder = () => {
    if (!girdi.trim()) return;

    const kullaniciMesaji: ChatMesaj = {
      id: `msg-${Date.now()}`,
      gonderen: 'kullanici',
      metin: girdi.trim(),
      tip: 'normal',
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setMesajlar(prev => [...prev, kullaniciMesaji]);
    const gonderilecekMesaj = girdi.trim();
    setGirdi('');
    setYaziyor(true);

    setTimeout(() => {
      listeRef.current?.scrollToEnd({ animated: true });
    }, 50);

    // Bot yanıt gecikmesi
    setTimeout(async () => {
      const yanit = await botYanitUret(gonderilecekMesaj, arabalar, aksesuarlar);
      const botMesaji: ChatMesaj = {
        id: `msg-${Date.now()}-bot`,
        gonderen: 'bot',
        metin: yanit.metin,
        tip: yanit.tip,
        karsilastirmaVerileri: yanit.karsilastirmaVerileri,
        aramaVerileri: yanit.aramaVerileri,
        zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      setMesajlar(prev => [...prev, botMesaji]);
      setYaziyor(false);
      
      setTimeout(() => {
        listeRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 500);
  };

  const hizliOneriButonlari = [
    { metin: '🏁 BMW 3 vs Mercedes C', komut: 'BMW 3 Series ile Mercedes-Benz C-Class karşılaştır' },
    { metin: '⚡ Tesla Model 3 vs Model Y', komut: 'Tesla Model 3 ile Tesla Model Y karşılaştır' },
    { metin: '🔧 Aksesuar Bul', komut: 'paspas bul' },
    { metin: '📊 Portföy Bilgisi', komut: 'uygulama bilgi' },
  ];

  // Araç karşılaştırma kartı
  const KarsilastirmaKarti = ({ araba }: { araba: Araba }) => (
    <TouchableOpacity
      style={[stiller.karsilastirmaKart, karanlikMod && stiller.kartKaranlik]}
      onPress={() => router.push(`/araba/${araba.id}` as any)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: araba.resimler[0] }} style={stiller.karsilastirmaResim} />
      <Text style={[stiller.karsilastirmaBaslik, karanlikMod && stiller.metinKaranlik]} numberOfLines={1}>
        {araba.marka} {araba.model}
      </Text>
      <Text style={stiller.karsilastirmaFiyat}>{araba.fiyat.toLocaleString('tr-TR')} ₺</Text>
      <View style={stiller.ozelliklerAlani}>
        <Text style={[stiller.miniOzellik, karanlikMod && stiller.metinSoluk]}>📅 {araba.yil}</Text>
        <Text style={[stiller.miniOzellik, karanlikMod && stiller.metinSoluk]}>⚙️ {araba.vites}</Text>
        <Text style={[stiller.miniOzellik, karanlikMod && stiller.metinSoluk]}>⛽ {araba.yakitTuru}</Text>
        <Text style={[stiller.miniOzellik, karanlikMod && stiller.metinSoluk]}>🛣️ {araba.kilometre.toLocaleString('tr-TR')} km</Text>
      </View>
      <View style={stiller.inceleButonMini}>
        <Ionicons name="eye-outline" size={12} color="#FFF" />
        <Text style={stiller.inceleMetinMini}>İncele</Text>
      </View>
    </TouchableOpacity>
  );

  // Arama sonucu kartı
  const AramaSonucKarti = ({ item }: { item: Araba | Aksesuar }) => {
    const arabaItem = item as Araba;
    const aksesuarItem = item as Aksesuar;
    const arabamiDir = 'marka' in item;

    return (
      <TouchableOpacity
        style={[stiller.aramaSonucKart, karanlikMod && stiller.kartKaranlik]}
        onPress={() => router.push((arabamiDir ? `/araba/${item.id}` : `/aksesuar/${item.id}`) as any)}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: item.resimler[0] }}
          style={stiller.aramaSonucResim}
        />
        <View style={stiller.aramaSonucIcerik}>
          <Text style={[stiller.aramaSonucBaslik, karanlikMod && stiller.metinKaranlik]} numberOfLines={1}>
            {arabamiDir ? `${arabaItem.marka} ${arabaItem.model}` : aksesuarItem.ad}
          </Text>
          <Text style={stiller.aramaSonucFiyat}>
            {item.fiyat.toLocaleString('tr-TR')} ₺
          </Text>
          {arabamiDir && (
            <Text style={[stiller.aramaSonucDetay, karanlikMod && stiller.metinSoluk]}>
              {arabaItem.yil} • {arabaItem.vites} • {arabaItem.yakitTuru}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={karanlikMod ? '#666' : '#CCC'} />
      </TouchableOpacity>
    );
  };

  const MesajBalonu = ({ item }: { item: ChatMesaj }) => {
    const kullaniciMi = item.gonderen === 'kullanici';

    return (
      <View style={[stiller.mesajSatir, kullaniciMi && stiller.mesajSatirKullanici]}>
        {!kullaniciMi && (
          <View style={stiller.botAvatar}>
            <Ionicons name="car-sport" size={18} color="#FFF" />
          </View>
        )}
        <View style={stiller.mesajIcerik}>
          <View style={[
            stiller.mesajBalon,
            kullaniciMi ? stiller.kullaniciBalonRenk : (karanlikMod ? stiller.botBalonKaranlik : stiller.botBalonRenk)
          ]}>
            <Text style={[
              stiller.mesajMetin,
              kullaniciMi ? stiller.kullaniciMetinRenk : (karanlikMod ? stiller.metinKaranlik : { color: '#333' })
            ]}>
              {item.metin}
            </Text>
          </View>

          {/* Karşılaştırma kartları */}
          {item.tip === 'karsilastirma' && item.karsilastirmaVerileri && (
            <View>
              <View style={stiller.karsilastirmaAlani}>
                {item.karsilastirmaVerileri.map((araba: Araba) => (
                  <KarsilastirmaKarti key={araba.id} araba={araba} />
                ))}
              </View>

              {/* Dinamik ve Akıllı Karşılaştırma UI Buton Grubu Entegrasyonu */}
              <View style={stiller.incelemeButonlarGrup}>
                <Text style={[stiller.incelemeButonlarGrupBaslik, karanlikMod && stiller.metinKaranlik]}>
                  🚗 Bu Araçları Detaylı İncele:
                </Text>
                <View style={stiller.incelemeButonlarSatir}>
                  {item.karsilastirmaVerileri.map((araba: Araba) => (
                    <TouchableOpacity
                      key={`yonlendir-${araba.id}`}
                      style={stiller.incelemeYonlendirButon}
                      onPress={() => router.push(`/araba/${araba.id}` as any)}
                    >
                      <Ionicons name="search-outline" size={12} color="#FFF" style={{ marginRight: 4 }} />
                      <Text style={stiller.incelemeYonlendirMetin} numberOfLines={1}>
                        {araba.marka}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Arama sonuçları */}
          {item.tip === 'arama' && item.aramaVerileri && (
            <View style={stiller.aramaSonuclari}>
              {item.aramaVerileri.map((sonuc) => (
                <AramaSonucKarti key={sonuc.id} item={sonuc} />
              ))}
            </View>
          )}

          <Text style={[stiller.zamanMetni, karanlikMod && stiller.metinSoluk]}>
            {item.zaman}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[{ flex: 1, backgroundColor: tema.arkaplan }]}>
      <UstMenu />
      <TouchableOpacity style={[stiller.geriButon, { backgroundColor: tema.kartArkaplan }]} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={tema.metin} />
      </TouchableOpacity>
      <KeyboardAvoidingView
        style={[
          stiller.anaKutu, 
          { backgroundColor: tema.arkaplan },
          Platform.OS === 'web' && { maxWidth: 900, alignSelf: 'center', width: '100%', borderWidth: 1, borderColor: tema.kenarlik }
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 40}
      >
        {/* Header - Kaldırıldı, yerine UstMenu eklendi */}

        {/* Mesaj Listesi */}
      <FlatList
        ref={listeRef}
        data={mesajlar}
        keyExtractor={item => item.id}
        renderItem={MesajBalonu}
        contentContainerStyle={stiller.mesajListesi}
        onContentSizeChange={() => listeRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => listeRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={yaziyor ? (
          <View style={stiller.yaziyorAlani}>
            <View style={stiller.botAvatar}>
              <Ionicons name="car-sport" size={18} color="#FFF" />
            </View>
            <View style={[stiller.yaziyorBalon, karanlikMod && stiller.botBalonKaranlik]}>
              <Text style={[stiller.yaziyorMetin, karanlikMod && stiller.metinSoluk]}>Editör analiz ediyor...</Text>
            </View>
          </View>
        ) : null}
      />

      {/* Hızlı Öneriler */}
      <View style={stiller.oneriAlani}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={hizliOneriButonlari}
          keyExtractor={(item, i) => `oneri-${i}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[stiller.oneriButon, karanlikMod && stiller.oneriButonKaranlik]}
              onPress={() => {
                setGirdi(item.komut);
              }}
            >
              <Text style={[stiller.oneriMetin, karanlikMod && stiller.metinKaranlik]}>{item.metin}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={stiller.oneriListe}
        />
      </View>

      <View style={[
        stiller.girdiAlani, 
        { backgroundColor: tema.kartArkaplan, borderTopColor: tema.kenarlik },
        { paddingBottom: Platform.OS === 'android' ? insets.bottom + 15 : (insets.bottom > 0 ? insets.bottom : 12) }
      ]}>
        <TextInput
          style={[stiller.mesajGirdi, { backgroundColor: tema.yuzeyRenk, color: tema.metin }]}
          placeholder="Bir mesaj yazın..."
          placeholderTextColor={karanlikMod ? '#666' : '#999'}
          value={girdi}
          onChangeText={setGirdi}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[stiller.gonderButon, !girdi.trim() && stiller.gonderButonPasif]}
          onPress={mesajGonder}
          disabled={!girdi.trim() || yaziyor}
        >
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: {
    flex: 1,
  },
  geriButon: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
  },
  baslikAlani: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    ...(Platform.OS === 'web' ? { maxWidth: 900, alignSelf: 'center', width: '100%' } : {})
  },
  baslikAlaniKaranlik: {
    backgroundColor: '#1A1A2E',
    borderBottomColor: '#2A2A3E',
  },

  baslikOrta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botIkon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1B4DFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  baslikMetin: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  altBaslik: {
    fontSize: 12,
    color: '#8B8FA3',
  },
  mesajListesi: {
    padding: 15,
    paddingBottom: 10,
  },
  mesajSatir: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  mesajSatirKullanici: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1B4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  mesajIcerik: {
    maxWidth: '78%',
  },
  mesajBalon: {
    padding: 12,
    borderRadius: 18,
  },
  kullaniciBalonRenk: {
    backgroundColor: '#1B4DFF',
    borderBottomRightRadius: 4,
  },
  botBalonRenk: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  botBalonKaranlik: {
    backgroundColor: '#1A1A2E',
  },
  mesajMetin: {
    fontSize: 15,
    lineHeight: 22,
  },
  kullaniciMetinRenk: {
    color: '#FFF',
  },
  zamanMetni: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    marginLeft: 4,
  },
  // Karşılaştırma kartları
  karsilastirmaAlani: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  karsilastirmaKart: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  kartKaranlik: {
    backgroundColor: '#1A1A2E',
  },
  karsilastirmaResim: {
    width: '100%',
    height: 90,
  },
  karsilastirmaBaslik: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  karsilastirmaFiyat: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B4DFF',
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  ozelliklerAlani: {
    padding: 8,
    gap: 2,
  },
  miniOzellik: {
    fontSize: 10,
    color: '#666',
  },
  inceleButonMini: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B4DFF',
    paddingVertical: 6,
    gap: 4,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  inceleMetinMini: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Arama sonuçları
  aramaSonuclari: {
    marginTop: 8,
    gap: 6,
  },
  aramaSonucKart: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  aramaSonucResim: {
    width: 60,
    height: 60,
  },
  aramaSonucIcerik: {
    flex: 1,
    padding: 10,
  },
  aramaSonucBaslik: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  aramaSonucFiyat: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B4DFF',
    marginTop: 2,
  },
  aramaSonucDetay: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  // Yazıyor animasyonu
  yaziyorAlani: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  yaziyorBalon: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  yaziyorMetin: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  // Hızlı öneriler
  oneriAlani: {
    borderTopWidth: 1,
    borderTopColor: '#E4E7EB',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    ...(Platform.OS === 'web' ? { maxWidth: 900, alignSelf: 'center', width: '100%' } : {})
  },
  oneriListe: {
    paddingHorizontal: 15,
    gap: 8,
  },
  oneriButon: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F0F4FF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0DCFF',
  },
  oneriButonKaranlik: {
    backgroundColor: '#1A1A2E',
    borderColor: '#2A2A3E',
  },
  oneriMetin: {
    fontSize: 13,
    color: '#1B4DFF',
    fontWeight: '600',
  },
  // Mesaj yazma alanı
  girdiAlani: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'flex-end',
    borderTopColor: '#E4E7EB',
    backgroundColor: '#FFF',
    ...(Platform.OS === 'web' ? { maxWidth: 900, alignSelf: 'center', width: '100%' } : {})
  },
  girdiAlaniKaranlik: {
    backgroundColor: '#1A1A2E',
    borderTopColor: '#2A2A3E',
  },
  mesajGirdi: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 10,
    backgroundColor: '#F5F7FA',
    color: '#333',
  },
  mesajGirdiKaranlik: {
    backgroundColor: '#0F0F1A',
    color: '#FFF',
  },
  gonderButon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1B4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  gonderButonPasif: {
    backgroundColor: '#A0B4FF',
  },
  metinKaranlik: {
    color: '#EAEAEA',
  },
  metinSoluk: {
    color: '#8B8FA3',
  },
  // İnceleme yonlendirme butonlari
  incelemeButonlarGrup: {
    marginTop: 12,
    backgroundColor: 'rgba(27, 77, 255, 0.05)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(27, 77, 255, 0.1)',
  },
  incelemeButonlarGrupBaslik: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1B4DFF',
    marginBottom: 8,
  },
  incelemeButonlarSatir: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  incelemeYonlendirButon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B4DFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  incelemeYonlendirMetin: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
