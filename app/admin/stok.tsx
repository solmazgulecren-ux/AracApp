import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { Alert, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';
import { AcikTema, Golge, KoyuTema, NeonGlow } from '../../sabitler/Tema';
import { Aksesuar } from '../../tipler';

export default function StokYonetim() {
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const aksesuarlar = useKullanimDurum((state: KullanimDurumTipi) => state.aksesuarlar);
  const stokGuncelle = useKullanimDurum((state: KullanimDurumTipi) => state.stokGuncelle);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  const insets = useSafeAreaInsets();

  const [aramaKelimesi, setAramaKelimesi] = useState('');
  const [seciliFiltre, setSeciliFiltre] = useState<'Tümü' | 'Stokta' | 'Azalan' | 'Tükenen'>('Tümü');

  const filtreliAksesuarlar = useMemo(() => {
    let filtrelenmis = aksesuarlar;
    
    // Arama
    if (aramaKelimesi) {
      filtrelenmis = filtrelenmis.filter(a => 
        a.ad.toLowerCase().includes(aramaKelimesi.toLowerCase()) ||
        a.kategori.toLowerCase().includes(aramaKelimesi.toLowerCase())
      );
    }
    
    // Stok Filtresi
    if (seciliFiltre === 'Stokta') {
      filtrelenmis = filtrelenmis.filter(a => a.stok > 10);
    } else if (seciliFiltre === 'Azalan') {
      filtrelenmis = filtrelenmis.filter(a => a.stok > 0 && a.stok <= 10);
    } else if (seciliFiltre === 'Tükenen') {
      filtrelenmis = filtrelenmis.filter(a => a.stok <= 0);
    }

    return filtrelenmis;
  }, [aksesuarlar, aramaKelimesi, seciliFiltre]);

  const stokDurumRenk = (stok: number) => {
    if (stok <= 0) return tema.uyariKirmizi;
    if (stok <= 10) return tema.vurguRenk;
    return tema.basari;
  };

  const stokDurumMetin = (stok: number) => {
    if (stok <= 0) return 'Tükendi';
    if (stok <= 10) return 'Azalıyor';
    return 'Yeterli';
  };

  const stokGuncelleIslemi = (aksesuar: Aksesuar, yeniStok: number) => {
    Alert.alert(
      '📦 Stok Güncelle',
      `"${aksesuar.ad}" ürününün stok miktarını ${yeniStok} olarak güncellemek istiyor musunuz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Güncelle',
          onPress: () => stokGuncelle(aksesuar.id, yeniStok),
        },
      ]
    );
  };

  const stokKartRender = ({ item, index }: { item: Aksesuar; index: number }) => {
    const stokRenk = stokDurumRenk(item.stok);
    return (
      <Animated.View entering={FadeInDown.delay(index * 60).springify().damping(18)}>
        <View style={[stiller.kart, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }, karanlikMod ? NeonGlow : Golge]}>
          <View style={stiller.kartIcerik}>
            <Image source={{ uri: item.resimler[0] }} style={stiller.resim} />
            <View style={stiller.bilgiAlani}>
              <Text style={[stiller.ad, { color: tema.metin }]} numberOfLines={2}>{item.ad}</Text>
              <Text style={[stiller.fiyat, { color: tema.vurguRenk }]}>
                {item.fiyat.toLocaleString('tr-TR')} ₺
              </Text>
              {item.kategori && (
                <View style={[stiller.kategoriBadge, { backgroundColor: tema.ikincilRenk + '15' }]}>
                  <Text style={[stiller.kategoriMetin, { color: tema.ikincilRenk }]}>{item.kategori}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Stok Bilgisi */}
          <View style={[stiller.stokAlani, { backgroundColor: tema.yuzeyRenk }]}>
            <View style={stiller.stokBaslik}>
              <View style={[stiller.stokDurumBadge, { backgroundColor: stokRenk + '20' }]}>
                <View style={[stiller.stokDurumNokta, { backgroundColor: stokRenk }]} />
                <Text style={[stiller.stokDurumMetin, { color: stokRenk }]}>{stokDurumMetin(item.stok)}</Text>
              </View>
              <Text style={[stiller.stokMiktar, { color: tema.metin }]}>
                Stok: <Text style={{ fontWeight: 'bold', color: stokRenk }}>{item.stok}</Text>
              </Text>
            </View>

            {/* Stok Kontrol Butonları */}
            <View style={stiller.stokKontrol}>
              <TouchableOpacity
                style={[stiller.stokButon, { backgroundColor: tema.uyariKirmizi + '15' }]}
                onPress={() => {
                  if (item.stok > 0) {
                    stokGuncelleIslemi(item, item.stok - 5 >= 0 ? item.stok - 5 : 0);
                  }
                }}
              >
                <Ionicons name="remove" size={18} color={tema.uyariKirmizi} />
                <Text style={[stiller.stokButonMetin, { color: tema.uyariKirmizi }]}>-5</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[stiller.stokButon, { backgroundColor: tema.uyariKirmizi + '10' }]}
                onPress={() => {
                  if (item.stok > 0) stokGuncelleIslemi(item, item.stok - 1);
                }}
              >
                <Ionicons name="remove" size={16} color={tema.uyariKirmizi} />
              </TouchableOpacity>

              <View style={[stiller.stokGosterge, { borderColor: stokRenk }]}>
                <Text style={[stiller.stokGostergeSayi, { color: stokRenk }]}>{item.stok}</Text>
              </View>

              <TouchableOpacity
                style={[stiller.stokButon, { backgroundColor: tema.basari + '10' }]}
                onPress={() => stokGuncelleIslemi(item, item.stok + 1)}
              >
                <Ionicons name="add" size={16} color={tema.basari} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[stiller.stokButon, { backgroundColor: tema.basari + '15' }]}
                onPress={() => stokGuncelleIslemi(item, item.stok + 10)}
              >
                <Ionicons name="add" size={18} color={tema.basari} />
                <Text style={[stiller.stokButonMetin, { color: tema.basari }]}>+10</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  // Özet istatistikler
  const toplamUrun = aksesuarlar.length;
  const tukenenUrun = aksesuarlar.filter(a => a.stok <= 0).length;
  const azalanUrun = aksesuarlar.filter(a => a.stok > 0 && a.stok <= 10).length;
  const stoktaUrun = aksesuarlar.filter(a => a.stok > 10).length;

  return (
    <View style={[stiller.kapsayici, { backgroundColor: tema.arkaplan }]}>
      {/* İstatistikler (Filtreler) */}
      <View style={[stiller.istatistikAlani, { backgroundColor: tema.kartArkaplan }]}>
        <TouchableOpacity 
          style={[stiller.istatistikKart, { backgroundColor: tema.ikincilRenk + (seciliFiltre === 'Tümü' ? '30' : '12'), borderColor: seciliFiltre === 'Tümü' ? tema.ikincilRenk : 'transparent', borderWidth: 1 }]}
          onPress={() => setSeciliFiltre('Tümü')}
        >
          <Text style={[stiller.istatistikSayi, { color: tema.ikincilRenk }]}>{toplamUrun}</Text>
          <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>Tümü</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[stiller.istatistikKart, { backgroundColor: tema.basari + (seciliFiltre === 'Stokta' ? '30' : '12'), borderColor: seciliFiltre === 'Stokta' ? tema.basari : 'transparent', borderWidth: 1 }]}
          onPress={() => setSeciliFiltre('Stokta')}
        >
          <Text style={[stiller.istatistikSayi, { color: tema.basari }]}>{stoktaUrun}</Text>
          <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>Stokta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[stiller.istatistikKart, { backgroundColor: tema.vurguRenk + (seciliFiltre === 'Azalan' ? '30' : '12'), borderColor: seciliFiltre === 'Azalan' ? tema.vurguRenk : 'transparent', borderWidth: 1 }]}
          onPress={() => setSeciliFiltre('Azalan')}
        >
          <Text style={[stiller.istatistikSayi, { color: tema.vurguRenk }]}>{azalanUrun}</Text>
          <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>Azalan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[stiller.istatistikKart, { backgroundColor: tema.uyariKirmizi + (seciliFiltre === 'Tükenen' ? '30' : '12'), borderColor: seciliFiltre === 'Tükenen' ? tema.uyariKirmizi : 'transparent', borderWidth: 1 }]}
          onPress={() => setSeciliFiltre('Tükenen')}
        >
          <Text style={[stiller.istatistikSayi, { color: tema.uyariKirmizi }]}>{tukenenUrun}</Text>
          <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>Tükenen</Text>
        </TouchableOpacity>
      </View>

      {/* Arama */}
      <View style={stiller.aramaKutu}>
        <View style={[stiller.aramaIcerik, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
          <Ionicons name="search" size={18} color={tema.metinAcik} />
          <TextInput
            style={[stiller.aramaGirdi, { color: tema.metin }]}
            placeholder="Ürün ara..."
            placeholderTextColor={tema.metinAcik}
            value={aramaKelimesi}
            onChangeText={setAramaKelimesi}
          />
        </View>
      </View>

      <FlatList
        data={filtreliAksesuarlar}
        keyExtractor={item => item.id}
        renderItem={stokKartRender}
        contentContainerStyle={[stiller.liste, { paddingBottom: insets.bottom + 20 }]}
        ListEmptyComponent={
          <View style={stiller.bosDurum}>
            <Ionicons name="layers-outline" size={64} color={tema.metinAcik} />
            <Text style={[stiller.bosDurumMetin, { color: tema.metinAcik }]}>Ürün bulunamadı.</Text>
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
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  istatistikKart: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  istatistikSayi: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  istatistikEtiket: {
    fontSize: 9,
    marginTop: 2,
    fontWeight: '600',
  },
  aramaKutu: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  aramaIcerik: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  aramaGirdi: {
    flex: 1,
    fontSize: 14,
  },
  liste: {
    padding: 16,
    gap: 12,
  },
  kart: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    ...Platform.select({
      web: {
        maxWidth: 800,
        alignSelf: 'center' as const,
        width: '100%' as any,
      }
    })
  },
  kartIcerik: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  resim: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  bilgiAlani: {
    flex: 1,
    marginLeft: 12,
  },
  ad: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  fiyat: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  kategoriBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  kategoriMetin: {
    fontSize: 10,
    fontWeight: '600',
  },
  stokAlani: {
    borderRadius: 12,
    padding: 12,
  },
  stokBaslik: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stokDurumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  stokDurumNokta: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stokDurumMetin: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  stokMiktar: {
    fontSize: 13,
  },
  stokKontrol: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stokButon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 2,
  },
  stokButonMetin: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  stokGosterge: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  stokGostergeSayi: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bosDurum: {
    alignItems: 'center',
    paddingTop: 80,
  },
  bosDurumMetin: {
    marginTop: 12,
    fontSize: 16,
  },
});
