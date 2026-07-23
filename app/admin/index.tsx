import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, Platform, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AcikTema, KoyuTema } from '../../sabitler/Tema';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';

export default function AdminDashboard() {
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  
  const arabalar = useKullanimDurum((state: KullanimDurumTipi) => state.arabalar);
  const aksesuarlar = useKullanimDurum((state: KullanimDurumTipi) => state.aksesuarlar);
  const siparisler = useKullanimDurum((state: KullanimDurumTipi) => state.siparisler);
  const kullanicilar = useKullanimDurum((state: KullanimDurumTipi) => state.kullanicilar);

  const toplamCiro = siparisler.filter(s => s.durum === 'Teslim Edildi').reduce((top, s) => top + s.toplamTutar, 0);
  const bekleyenSiparisler = siparisler.filter(s => s.durum === 'Onay Bekliyor').length;
  
  const KPICard = ({ title, value, icon, color, delay }: { title: string, value: string | number, icon: any, color: string, delay: number }) => (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={[stiller.kpiKart, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
      <View style={[stiller.kpiIconWrapper, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[stiller.kpiValue, { color: tema.metin }]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
        <Text style={[stiller.kpiTitle, { color: tema.metinAcik }]} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>
      </View>
    </Animated.View>
  );

  return (
    <ScrollView style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]} contentContainerStyle={stiller.icerik}>
      
      <View style={stiller.baslikSatir}>
        <View>
          <Text style={[stiller.anaBaslik, { color: tema.metin }]}>Dashboard</Text>
          <Text style={[stiller.altBaslik, { color: tema.metinAcik }]}>Genel durum ve istatistikler</Text>
        </View>
        <TouchableOpacity style={[stiller.raporButon, { backgroundColor: tema.anaRenk }]}>
          <Ionicons name="download-outline" size={16} color="#FFF" />
          <Text style={stiller.raporButonMetin}>Rapor İndir</Text>
        </TouchableOpacity>
      </View>

      <View style={stiller.kpiGrid}>
        <KPICard title="Toplam Ciro" value={`${toplamCiro.toLocaleString('tr-TR')} ₺`} icon="wallet" color="#10B981" delay={100} />
        <KPICard title="Kayıtlı Kullanıcı" value={kullanicilar.length} icon="people" color="#3B82F6" delay={200} />
        <KPICard title="Aktif Araç İlanı" value={arabalar.length} icon="car-sport" color="#F59E0B" delay={300} />
        <KPICard title="Bekleyen Sipariş" value={bekleyenSiparisler} icon="cube" color="#EF4444" delay={400} />
      </View>

      <View style={stiller.altAlan}>
        {/* Son İşlemler Tablosu */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={[stiller.tabloKutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
          <View style={stiller.tabloBaslikSatir}>
            <Text style={[stiller.tabloBaslik, { color: tema.metin }]}>Son Satışlar & Siparişler</Text>
          </View>
          {siparisler.slice(0, 5).map((siparis, idx) => (
            <View key={siparis.id} style={[stiller.satir, { borderBottomColor: tema.kenarlik }]}>
              <View style={stiller.satirSol}>
                <View style={[stiller.durumNokta, { backgroundColor: siparis.durum === 'Onay Bekliyor' ? '#F59E0B' : siparis.durum === 'İptal Edildi' ? '#EF4444' : '#10B981' }]} />
                <View>
                  <Text style={[stiller.musteriIsim, { color: tema.metin }]}>{siparis.teslimatBilgileri.adSoyad}</Text>
                  <Text style={[stiller.siparisTarih, { color: tema.metinAcik }]}>{siparis.tarih}</Text>
                </View>
              </View>
              <View style={stiller.satirSag}>
                <Text style={[stiller.siparisFiyat, { color: tema.metin }]}>{siparis.toplamTutar.toLocaleString('tr-TR')} ₺</Text>
                <View style={[stiller.durumBadge, { backgroundColor: siparis.durum === 'Onay Bekliyor' ? '#FEF3C7' : siparis.durum === 'İptal Edildi' ? '#FEE2E2' : '#D1FAE5' }]}>
                  <Text style={[stiller.durumMetin, { color: siparis.durum === 'Onay Bekliyor' ? '#D97706' : siparis.durum === 'İptal Edildi' ? '#B91C1C' : '#059669' }]}>
                    {siparis.durum}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          {siparisler.length === 0 && (
             <Text style={{ textAlign: 'center', padding: 20, color: tema.metinAcik }}>Henüz sipariş bulunmuyor.</Text>
          )}
        </Animated.View>

        {/* Hızlı İstatistikler */}
        <Animated.View entering={FadeInDown.delay(600).springify()} style={[stiller.istatistikKutu, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
           <Text style={[stiller.tabloBaslik, { color: tema.metin, marginBottom: 15 }]}>Sistem Özeti</Text>
           
           <View style={stiller.istatistikSatir}>
             <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>Aksesuar Stoğu</Text>
             <Text style={[stiller.istatistikDeger, { color: tema.metin }]}>{aksesuarlar.reduce((top, a) => top + a.stok, 0)} Adet</Text>
           </View>
           
           <View style={stiller.istatistikSatir}>
             <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>Yönetici Sayısı</Text>
             <Text style={[stiller.istatistikDeger, { color: tema.metin }]}>{kullanicilar.filter(k => k.isAdmin).length} Kişi</Text>
           </View>

           <View style={stiller.istatistikSatir}>
             <Text style={[stiller.istatistikEtiket, { color: tema.metinAcik }]}>Sistem Durumu</Text>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
               <View style={[stiller.durumNokta, { backgroundColor: '#10B981' }]} />
               <Text style={[stiller.istatistikDeger, { color: '#10B981' }]}>Sağlıklı</Text>
             </View>
           </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const stiller = StyleSheet.create({
  anaKutu: {
    flex: 1,
  },
  icerik: {
    padding: 20,
    ...(Platform.OS === 'web' && { maxWidth: 1200, alignSelf: 'center', width: '100%' })
  },
  baslikSatir: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    gap: 15,
  },
  anaBaslik: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  altBaslik: {
    fontSize: 15,
  },
  raporButon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  raporButonMetin: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  kpiKart: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 240 : '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  kpiIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  kpiTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  altAlan: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 24,
  },
  tabloKutu: {
    flex: 2,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  tabloBaslikSatir: {
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    paddingBottom: 15,
    marginBottom: 10,
  },
  tabloBaslik: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  satir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  satirSol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  durumNokta: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  musteriIsim: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  siparisTarih: {
    fontSize: 12,
  },
  satirSag: {
    alignItems: 'flex-end',
    gap: 6,
  },
  siparisFiyat: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  durumBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durumMetin: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  istatistikKutu: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignSelf: 'flex-start',
    width: '100%',
  },
  istatistikSatir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  istatistikEtiket: {
    fontSize: 14,
    fontWeight: '500',
  },
  istatistikDeger: {
    fontSize: 14,
    fontWeight: 'bold',
  }
});
