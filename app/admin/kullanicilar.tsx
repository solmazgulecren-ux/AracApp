import { Kullanici } from "../../tipler";
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { FlatList, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';
import { AcikTema, Golge, KoyuTema, NeonGlow } from '../../sabitler/Tema';

export default function KullanicilarYonetim() {
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const kullanicilar = useKullanimDurum((state: KullanimDurumTipi) => state.kullanicilar);
  const arabalar = useKullanimDurum((state: KullanimDurumTipi) => state.arabalar);
  const aksesuarlar = useKullanimDurum((state: KullanimDurumTipi) => state.aksesuarlar);
  const siparisler = useKullanimDurum((state: KullanimDurumTipi) => state.siparisler);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  const insets = useSafeAreaInsets();
  const [aramaMetni, setAramaMetni] = useState('');

  const filtrelenmisKullanicilar = useMemo(() => {
    // Sadece ilan vermiş veya sipariş vermiş (reaksiyon göstermiş) aktif kullanıcılar
    const aktifKullanicilar = kullanicilar.filter(k => {
      const ilanVarMi = arabalar.some(a => a.saticiId === k.id) || aksesuarlar.some(a => a.saticiId === k.id);
      const siparisVarMi = siparisler.some(s => s.kullaniciId === k.id);
      return ilanVarMi || siparisVarMi;
    });

    // En son aktivite tarihine göre yeniden eskiye doğru sıralama
    const sirali = aktifKullanicilar.sort((a, b) => {
      const aArabalar = arabalar.filter(araba => araba.saticiId === a.id && araba.ilanTarihi);
      const bArabalar = arabalar.filter(araba => araba.saticiId === b.id && araba.ilanTarihi);
      
      const aTarih = aArabalar.length > 0 
        ? aArabalar.reduce((max, araba) => (araba.ilanTarihi! > max ? araba.ilanTarihi! : max), aArabalar[0].ilanTarihi!) 
        : (a.kayitTarihi || '');
        
      const bTarih = bArabalar.length > 0 
        ? bArabalar.reduce((max, araba) => (araba.ilanTarihi! > max ? araba.ilanTarihi! : max), bArabalar[0].ilanTarihi!) 
        : (b.kayitTarihi || '');

      return bTarih.localeCompare(aTarih);
    });

    if (aramaMetni) {
      return sirali.filter(k => 
        k.ad.toLowerCase().includes(aramaMetni.toLowerCase()) || 
        k.soyad.toLowerCase().includes(aramaMetni.toLowerCase()) || 
        k.eposta.toLowerCase().includes(aramaMetni.toLowerCase())
      );
    }
    
    return sirali;
  }, [kullanicilar, arabalar, aksesuarlar, siparisler, aramaMetni]);

  const getIlanSayisi = (kullaniciId: string) => {
    const arabaSayisi = arabalar.filter(a => a.saticiId === kullaniciId).length;
    const aksesuarSayisi = aksesuarlar.filter(a => a.saticiId === kullaniciId).length;
    return arabaSayisi + aksesuarSayisi;
  };

  const getSiparisSayisi = (kullaniciId: string) => {
    return siparisler.filter(s => s.kullaniciId === kullaniciId).length;
  };

  const getSiparisToplam = (kullaniciId: string) => {
    return siparisler
      .filter(s => s.kullaniciId === kullaniciId)
      .reduce((toplam, s) => toplam + s.toplamTutar, 0);
  };

  const kullaniciKartRender = ({ item, index }: { item: Kullanici; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 80).springify().damping(18)}>
      <View style={[stiller.kart, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }, karanlikMod ? NeonGlow : Golge]}>
        {/* Başlık */}
        <View style={stiller.kartBaslik}>
          <View style={stiller.adKapsayici}>
            <View style={[stiller.avatarKutu, { backgroundColor: item.isAdmin ? tema.ikincilRenk : tema.anaRenk }]}>
              <Text style={stiller.avatarMetin}>{item.ad.charAt(0)}{item.soyad.charAt(0)}</Text>
            </View>
            <View>
              <Text style={[stiller.ad, { color: tema.metin }]}>{item.ad} {item.soyad}</Text>
              {item.isAdmin && (
                <View style={[stiller.adminBadge, { backgroundColor: tema.ikincilRenk + '20' }]}>
                  <Ionicons name="shield-checkmark" size={10} color={tema.ikincilRenk} />
                  <Text style={[stiller.adminEtiketi, { color: tema.ikincilRenk }]}>Admin</Text>
                </View>
              )}
            </View>
          </View>
          <Text style={[stiller.tarih, { color: tema.metinAcik }]}>{item.kayitTarihi || 'Tarih Yok'}</Text>
        </View>
        
        {/* İletişim Bilgileri */}
        <View style={stiller.detaySatir}>
          <View style={[stiller.detayIkonKutu, { backgroundColor: tema.ikincilRenk + '12' }]}>
            <Ionicons name="mail-outline" size={14} color={tema.ikincilRenk} />
          </View>
          <Text style={[stiller.detayMetin, { color: tema.metinAcik }]}>{item.eposta}</Text>
        </View>
        
        <View style={stiller.detaySatir}>
          <View style={[stiller.detayIkonKutu, { backgroundColor: tema.basari + '12' }]}>
            <Ionicons name="call-outline" size={14} color={tema.basari} />
          </View>
          <Text style={[stiller.detayMetin, { color: tema.metinAcik }]}>{item.telefon}</Text>
        </View>

        <View style={stiller.detaySatir}>
          <View style={[stiller.detayIkonKutu, { backgroundColor: tema.vurguRenk + '12' }]}>
            <Ionicons name="location-outline" size={14} color={tema.vurguRenk} />
          </View>
          <Text style={[stiller.detayMetin, { color: tema.metinAcik }]} numberOfLines={1}>{item.adres}</Text>
        </View>

        {/* İstatistikler */}
        <View style={[stiller.istatistikAlani, { backgroundColor: tema.yuzeyRenk }]}>
          <View style={stiller.istatistikKutu}>
            <Ionicons name="car-outline" size={18} color={tema.anaRenk} />
            <Text style={[stiller.istatistikSayi, { color: tema.metin }]}>{getIlanSayisi(item.id)}</Text>
            <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>İlan</Text>
          </View>
          <View style={[stiller.istatistikAyiric, { backgroundColor: tema.kenarlik }]} />
          <View style={stiller.istatistikKutu}>
            <Ionicons name="cube-outline" size={18} color={tema.vurguRenk} />
            <Text style={[stiller.istatistikSayi, { color: tema.metin }]}>{getSiparisSayisi(item.id)}</Text>
            <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>Sipariş</Text>
          </View>
          <View style={[stiller.istatistikAyiric, { backgroundColor: tema.kenarlik }]} />
          <View style={stiller.istatistikKutu}>
            <Ionicons name="cash-outline" size={18} color={tema.basari} />
            <Text style={[stiller.istatistikSayi, { color: tema.metin }]}>
              {getSiparisToplam(item.id) > 0 ? `${(getSiparisToplam(item.id) / 1000).toFixed(0)}K` : '0'}
            </Text>
            <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>Harcama</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={[stiller.kapsayici, { backgroundColor: tema.arkaplan }]}>
      {/* Arama Çubuğu */}
      <View style={[stiller.aramaKutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }, Platform.OS === 'web' && { maxWidth: 800, alignSelf: 'center', width: '100%', marginTop: 16 }]}>
        <Ionicons name="search" size={20} color={tema.metinAcik} style={{ marginRight: 10 }} />
        <TextInput
          style={[stiller.aramaGirdi, { color: tema.metin, ...(Platform.OS === 'web' && { outlineStyle: 'none' as any }) }]}
          placeholder="Kullanıcı Ara (Ad, E-posta)..."
          placeholderTextColor={tema.metinAcik}
          value={aramaMetni}
          onChangeText={setAramaMetni}
        />
        {aramaMetni.length > 0 && (
          <Ionicons name="close-circle" size={20} color={tema.metinAcik} onPress={() => setAramaMetni('')} />
        )}
      </View>

      <FlatList
        data={filtrelenmisKullanicilar}
        keyExtractor={item => item.id}
        renderItem={kullaniciKartRender}
        contentContainerStyle={[stiller.liste, { paddingBottom: insets.bottom + 20 }]}
      />
    </View>
  );
}

const stiller = StyleSheet.create({
  kapsayici: {
    flex: 1,
  },
  aramaKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  aramaGirdi: {
    flex: 1,
    fontSize: 15,
  },
  liste: {
    padding: 16,
    gap: 16,
  },
  kart: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    ...Platform.select({
      web: {
        maxWidth: 800,
        alignSelf: 'center' as const,
        width: '100%' as any,
      }
    })
  },
  kartBaslik: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 14,
  },
  adKapsayici: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarKutu: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMetin: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  ad: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
    alignSelf: 'flex-start',
  },
  adminEtiketi: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tarih: {
    fontSize: 12,
    marginTop: 4,
  },
  detaySatir: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  detayIkonKutu: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detayMetin: {
    fontSize: 13,
    flex: 1,
  },
  istatistikAlani: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  istatistikKutu: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  istatistikAyiric: {
    width: 1,
    height: 30,
  },
  istatistikSayi: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  istatistikEtiket: {
    fontSize: 10,
    fontWeight: '500',
  },
});
