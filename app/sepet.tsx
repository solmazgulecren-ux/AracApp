import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AcikTema, KoyuTema } from '../sabitler/Tema';
import { Aksesuar, SepetUrun } from '../tipler';
import { KullanimDurumTipi, useKullanimDurum } from '../durum/kullanimDurum';

type SepetElemani = SepetUrun & { aksesuar: Aksesuar };

export default function SepetEkrani() {
  const sepet = useKullanimDurum((state: KullanimDurumTipi) => state.sepet);
  const aksesuarlar = useKullanimDurum((state: KullanimDurumTipi) => state.aksesuarlar);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  const aktifKullanici = useKullanimDurum((state: KullanimDurumTipi) => state.aktifKullanici);
  const sepettenCikar = useKullanimDurum((state: KullanimDurumTipi) => state.sepettenCikar);
  const sepetAdetGuncelle = useKullanimDurum((state: KullanimDurumTipi) => state.sepetAdetGuncelle);
  const router = useRouter();

  const kullaniciSepeti = sepet.filter((s: SepetUrun) => s.kullaniciId === aktifKullanici?.id);

  const sepetUrunleri = kullaniciSepeti
    .map((s: SepetUrun) => ({
      ...s,
      aksesuar: aksesuarlar.find((a: Aksesuar) => a.id === s.aksesuarId)
    }))
    .filter((s: any) => s.aksesuar !== undefined) as SepetElemani[];

  const toplamFiyat = sepetUrunleri.reduce((toplam: number, urun: SepetElemani) => toplam + (urun.aksesuar?.fiyat || 0) * urun.adet, 0);
  const toplamUrun = sepetUrunleri.reduce((toplam: number, urun: SepetElemani) => toplam + urun.adet, 0);

  const SepetKarti = ({ item, index }: { item: SepetElemani; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 80).springify().damping(18)}>
      <View style={[stiller.kart, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
        <Image source={{ uri: item.aksesuar.resimler[0] }} style={stiller.resim} />
        <View style={stiller.kartIcerik}>
          <Text style={[stiller.baslik, { color: tema.metin }]} numberOfLines={2}>
            {item.aksesuar.ad}
          </Text>
          <Text style={[stiller.fiyat, { color: tema.anaRenk }]}>{item.aksesuar.fiyat.toLocaleString('tr-TR')} ₺</Text>
          
          {/* Adet Kontrol */}
          <View style={stiller.adetKontrol}>
            <TouchableOpacity
              style={[stiller.adetButon, { backgroundColor: tema.yuzeyRenk }]}
              onPress={() => sepetAdetGuncelle(item.id, item.adet - 1)}
            >
              <Ionicons name="remove" size={16} color={tema.metin} />
            </TouchableOpacity>
            <Text style={[stiller.adetMetni, { color: tema.metin }]}>{item.adet}</Text>
            <TouchableOpacity
              style={[stiller.adetButon, { backgroundColor: tema.yuzeyRenk }]}
              onPress={() => sepetAdetGuncelle(item.id, item.adet + 1)}
            >
              <Ionicons name="add" size={16} color={tema.metin} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Silme Butonu */}
        <TouchableOpacity
          style={[stiller.silButon, { backgroundColor: tema.uyariKirmizi + '12' }]}
          onPress={() => sepettenCikar(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color={tema.uyariKirmizi} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={[
      stiller.anaKutu, 
      { backgroundColor: tema.arkaplan },
      Platform.OS === 'web' && { maxWidth: 900, alignSelf: 'center', width: '100%' }
    ]}>
      {/* Header */}
      <View style={[stiller.baslikAlani, { backgroundColor: tema.kartArkaplan, borderBottomColor: tema.kenarlik }]}>
        <TouchableOpacity onPress={() => router.back()} style={stiller.geriButon}>
          <Ionicons name="arrow-back" size={24} color={tema.metin} />
        </TouchableOpacity>
        <Text style={[stiller.sayfaBaslik, { color: tema.metin }]}>Sepetim</Text>
        {toplamUrun > 0 && (
          <View style={[stiller.sepetBadge, { backgroundColor: tema.vurguRenk }]}>
            <Text style={stiller.sepetBadgeMetni}>{toplamUrun}</Text>
          </View>
        )}
      </View>

      {sepetUrunleri.length > 0 ? (
        <FlatList
          data={sepetUrunleri}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => <SepetKarti item={item} index={index} />}
          contentContainerStyle={stiller.listeAlani}
        />
      ) : (
        <View style={stiller.bosSepetAlani}>
          <View style={[stiller.bosIkon, { backgroundColor: tema.vurguRenk + '12' }]}>
            <Ionicons name="cart-outline" size={48} color={tema.vurguRenk} />
          </View>
          <Text style={[stiller.bosSepetBaslik, { color: tema.metin }]}>Sepetiniz Boş</Text>
          <Text style={[stiller.bosSepetMetni, { color: tema.metinAcik }]}>
            Aksesuarlar sayfasından ürün ekleyebilirsiniz.
          </Text>
        </View>
      )}

      {/* Alt Alan - Toplam ve Satın Al */}
      {sepetUrunleri.length > 0 && (
        <View style={[stiller.altAlan, { backgroundColor: tema.kartArkaplan, borderTopColor: tema.kenarlik }]}>
          <View style={stiller.toplamSatir}>
            <Text style={[stiller.toplamEtiket, { color: tema.metinAcik }]}>Toplam ({toplamUrun} ürün)</Text>
            <Text style={[stiller.toplamFiyat, { color: tema.anaRenk }]}>{toplamFiyat.toLocaleString('tr-TR')} ₺</Text>
          </View>
          <TouchableOpacity
            style={[stiller.odemeButonu, { backgroundColor: tema.anaRenk }]}
            onPress={() => router.push('/odeme')}
            activeOpacity={0.85}
          >
            <Ionicons name="card-outline" size={22} color="#FFF" />
            <Text style={stiller.odemeButonuMetni}>Satın Al</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: {
    flex: 1,
  },
  baslikAlani: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  geriButon: {
    marginRight: 12,
    padding: 4,
  },
  sayfaBaslik: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  sepetBadge: {
    width: 26,
    height: 26,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sepetBadgeMetni: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  listeAlani: {
    padding: 14,
  },
  kart: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  resim: {
    width: 80,
    height: 80,
    borderRadius: 14,
  },
  kartIcerik: {
    flex: 1,
    paddingHorizontal: 12,
  },
  baslik: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fiyat: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  adetKontrol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  adetButon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adetMetni: {
    fontSize: 15,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  silButon: {
    padding: 8,
    borderRadius: 10,
  },
  bosSepetAlani: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  bosIkon: {
    width: 90,
    height: 90,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bosSepetBaslik: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bosSepetMetni: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  altAlan: {
    padding: 20,
    borderTopWidth: 1,
    paddingBottom: 35,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  toplamSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toplamEtiket: {
    fontSize: 15,
  },
  toplamFiyat: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  odemeButonu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  odemeButonuMetni: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
