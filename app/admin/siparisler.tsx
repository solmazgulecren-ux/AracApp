import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';
import { AcikTema, Golge, KoyuTema, NeonGlow } from '../../sabitler/Tema';
import { Siparis } from '../../tipler';

const DURUMLAR: Siparis['durum'][] = ['Onay Bekliyor', 'Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi', 'İptal Edildi'];

const durumIkonu = (durum: Siparis['durum']) => {
  switch (durum) {
    case 'Onay Bekliyor': return { ikon: 'time-outline' as const, renk: '#6B7280' };
    case 'Hazırlanıyor': return { ikon: 'construct-outline' as const, renk: '#F59E0B' };
    case 'Kargoya Verildi': return { ikon: 'airplane-outline' as const, renk: '#3B82F6' };
    case 'Teslim Edildi': return { ikon: 'checkmark-circle-outline' as const, renk: '#10B981' };
    case 'İptal Edildi': return { ikon: 'close-circle-outline' as const, renk: '#EF4444' };
  }
};

export default function SiparislerYonetim() {
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const siparisler = useKullanimDurum((state: KullanimDurumTipi) => state.siparisler);
  const kullanicilar = useKullanimDurum((state: KullanimDurumTipi) => state.kullanicilar);
  const siparisDurumuGuncelle = useKullanimDurum((state: KullanimDurumTipi) => state.siparisDurumuGuncelle);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  const insets = useSafeAreaInsets();

  const getKullaniciAd = (kullaniciId: string) => {
    const k = kullanicilar.find(u => u.id === kullaniciId);
    return k ? `${k.ad} ${k.soyad}` : 'Bilinmeyen Kullanıcı';
  };

  const durumDegistirOnay = (siparis: Siparis, yeniDurum: Siparis['durum']) => {
    const kullaniciAd = getKullaniciAd(siparis.kullaniciId);
    const baslik = yeniDurum === 'İptal Edildi' ? '❌ Sipariş İptal' : '✅ Durum Güncelle';
    const mesaj = yeniDurum === 'İptal Edildi'
      ? `${kullaniciAd} kullanıcısının #${siparis.id.split('-')[1]} numaralı siparişini iptal etmek istediğinize emin misiniz?`
      : `${kullaniciAd} kullanıcısının siparişini "${yeniDurum}" olarak güncellemek istiyor musunuz?`;

    Alert.alert(baslik, mesaj, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: yeniDurum === 'İptal Edildi' ? 'İptal Et' : 'Onayla',
        style: yeniDurum === 'İptal Edildi' ? 'destructive' : 'default',
        onPress: () => siparisDurumuGuncelle(siparis.id, yeniDurum),
      },
    ]);
  };

  const siparisKartRender = ({ item, index }: { item: Siparis; index: number }) => {
    const durumBilgi = durumIkonu(item.durum);
    return (
      <Animated.View entering={FadeInDown.delay(index * 80).springify().damping(18)}>
        <View style={[stiller.kart, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }, karanlikMod ? NeonGlow : Golge]}>
          {/* Başlık */}
          <View style={stiller.kartBaslik}>
            <View style={stiller.siparisBaslikSol}>
              <View style={[stiller.siparisNoBadge, { backgroundColor: tema.anaRenk + '18' }]}>
                <Text style={[stiller.siparisId, { color: tema.anaRenk }]}>#{item.id.split('-')[1]}</Text>
              </View>
              <Text style={[stiller.tarih, { color: tema.metinAcik }]}>{item.tarih}</Text>
            </View>
            <View style={[stiller.durumAktifBadge, { backgroundColor: durumBilgi.renk + '20' }]}>
              <Ionicons name={durumBilgi.ikon} size={14} color={durumBilgi.renk} />
              <Text style={[stiller.durumAktifMetin, { color: durumBilgi.renk }]}>{item.durum}</Text>
            </View>
          </View>
          
          {/* Kullanıcı */}
          <View style={stiller.detaySatir}>
            <View style={[stiller.detayIkonKutu, { backgroundColor: tema.ikincilRenk + '15' }]}>
              <Ionicons name="person-outline" size={16} color={tema.ikincilRenk} />
            </View>
            <Text style={[stiller.detayMetin, { color: tema.metin }]}>{getKullaniciAd(item.kullaniciId)}</Text>
          </View>
          
          {/* Tutar */}
          <View style={stiller.detaySatir}>
            <View style={[stiller.detayIkonKutu, { backgroundColor: tema.vurguRenk + '15' }]}>
              <Ionicons name="cash-outline" size={16} color={tema.vurguRenk} />
            </View>
            <Text style={[stiller.detayMetin, { color: tema.vurguRenk, fontWeight: 'bold' }]}>
              {item.toplamTutar.toLocaleString('tr-TR')} ₺
            </Text>
          </View>

          {/* Ürünler */}
          <View style={[stiller.urunlerKutu, { backgroundColor: tema.yuzeyRenk }]}>
            <Text style={[stiller.urunlerBaslik, { color: tema.metinAcik }]}>Sipariş Kalemleri</Text>
            {item.urunler.map((urun, idx) => (
              <View key={idx} style={stiller.urunSatir}>
                <Text style={[stiller.urunAd, { color: tema.metin }]} numberOfLines={1}>{urun.ad}</Text>
                <Text style={[stiller.urunDetay, { color: tema.metinAcik }]}>x{urun.adet}</Text>
                <Text style={[stiller.urunFiyat, { color: tema.metin }]}>
                  {(urun.fiyat * urun.adet).toLocaleString('tr-TR')} ₺
                </Text>
              </View>
            ))}
          </View>

          {/* Hızlı Aksiyon Butonları */}
          <View style={stiller.aksiyonAlani}>
            {item.durum !== 'İptal Edildi' && item.durum !== 'Teslim Edildi' && (
              <>
                <TouchableOpacity
                  style={[stiller.onaylaButon, { backgroundColor: tema.basari }]}
                  onPress={() => {
                    const sonrakiDurum = DURUMLAR[DURUMLAR.indexOf(item.durum) + 1];
                    if (sonrakiDurum && sonrakiDurum !== 'İptal Edildi') {
                      durumDegistirOnay(item, sonrakiDurum);
                    }
                  }}
                >
                  <Ionicons name="checkmark" size={18} color="#FFF" />
                  <Text style={stiller.aksiyonMetin}>
                    {item.durum === 'Onay Bekliyor' ? 'Onayla' : 'Sonraki Aşama'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[stiller.iptalButon, { backgroundColor: tema.uyariKirmizi }]}
                  onPress={() => durumDegistirOnay(item, 'İptal Edildi')}
                >
                  <Ionicons name="close" size={18} color="#FFF" />
                  <Text style={stiller.aksiyonMetin}>İptal</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Tüm Durumlar */}
          <Text style={[stiller.durumBaslik, { color: tema.metinAcik }]}>Durum Geçişi:</Text>
          <View style={stiller.durumKapsayici}>
            {DURUMLAR.map(durum => {
              const aktif = item.durum === durum;
              const bilgi = durumIkonu(durum);
              return (
                <TouchableOpacity
                  key={durum}
                  style={[
                    stiller.durumButon,
                    { 
                      backgroundColor: aktif ? bilgi.renk : 'transparent',
                      borderColor: aktif ? bilgi.renk : tema.kenarlik
                    }
                  ]}
                  onPress={() => durumDegistirOnay(item, durum)}
                >
                  <Text style={[
                    stiller.durumMetin,
                    { color: aktif ? '#FFF' : tema.metinAcik }
                  ]}>
                    {durum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[stiller.kapsayici, { backgroundColor: tema.arkaplan }]}>
      {/* İstatistik Başlık */}
      <View style={[stiller.istatistikAlani, { backgroundColor: tema.kartArkaplan }]}>
        <View style={[stiller.istatistikKart, { backgroundColor: tema.basari + '15' }]}>
          <Text style={[stiller.istatistikSayi, { color: tema.basari }]}>
            {siparisler.filter(s => s.durum === 'Teslim Edildi').length}
          </Text>
          <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>Teslim</Text>
        </View>
        <View style={[stiller.istatistikKart, { backgroundColor: '#F59E0B15' }]}>
          <Text style={[stiller.istatistikSayi, { color: '#F59E0B' }]}>
            {siparisler.filter(s => s.durum === 'Onay Bekliyor').length}
          </Text>
          <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>Bekleyen</Text>
        </View>
        <View style={[stiller.istatistikKart, { backgroundColor: tema.uyariKirmizi + '15' }]}>
          <Text style={[stiller.istatistikSayi, { color: tema.uyariKirmizi }]}>
            {siparisler.filter(s => s.durum === 'İptal Edildi').length}
          </Text>
          <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>İptal</Text>
        </View>
        <View style={[stiller.istatistikKart, { backgroundColor: tema.ikincilRenk + '15' }]}>
          <Text style={[stiller.istatistikSayi, { color: tema.ikincilRenk }]}>
            {siparisler.length}
          </Text>
          <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>Toplam</Text>
        </View>
      </View>

      <FlatList
        data={siparisler}
        keyExtractor={item => item.id}
        renderItem={siparisKartRender}
        contentContainerStyle={[stiller.liste, { paddingBottom: insets.bottom + 20 }]}
        ListEmptyComponent={
          <View style={stiller.bosDurum}>
            <Ionicons name="cube-outline" size={64} color={tema.metinAcik} />
            <Text style={[stiller.bosDurumMetin, { color: tema.metinAcik }]}>Henüz hiç sipariş yok.</Text>
          </View>
        }
      />
    </View>
  );
}

const stiller = StyleSheet.create({
  kapsayici: {
    flex: 1,
  },
  istatistikAlani: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  istatistikKart: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  istatistikSayi: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  istatistikEtiket: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
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
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  siparisBaslikSol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  siparisNoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  siparisId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tarih: {
    fontSize: 13,
  },
  durumAktifBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  durumAktifMetin: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  detaySatir: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  detayIkonKutu: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detayMetin: {
    fontSize: 15,
  },
  urunlerKutu: {
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  urunlerBaslik: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  urunSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  urunAd: {
    flex: 1,
    fontSize: 13,
  },
  urunDetay: {
    fontSize: 12,
    marginHorizontal: 8,
  },
  urunFiyat: {
    fontSize: 13,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'right',
  },
  aksiyonAlani: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  onaylaButon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  iptalButon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  aksiyonMetin: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  durumBaslik: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  durumKapsayici: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  durumButon: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  durumMetin: {
    fontSize: 11,
    fontWeight: '500',
  },
  bosDurum: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  bosDurumMetin: {
    marginTop: 16,
    fontSize: 18,
  }
});
