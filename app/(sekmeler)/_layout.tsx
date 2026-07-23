import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AcikTema, KoyuTema } from '../../sabitler/Tema';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';

export default function SekmelerYerlesim() {
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const temaDegistir = useKullanimDurum((state: KullanimDurumTipi) => state.temaDegistir);
  const sepet = useKullanimDurum((state: KullanimDurumTipi) => state.sepet);
  const aktifKullanici = useKullanimDurum((state: KullanimDurumTipi) => state.aktifKullanici);
  const kullaniciKarsilastirmaListesi = useKullanimDurum((state: KullanimDurumTipi) => state.kullaniciKarsilastirmaListesi);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tema = karanlikMod ? KoyuTema : AcikTema;

  const karsilastirmaListesi = kullaniciKarsilastirmaListesi();
  const sepetSayisi = sepet.filter(s => s.kullaniciId === aktifKullanici?.id).reduce((t, s) => t + s.adet, 0);

  const adminSayfasinaGit = () => {
    if (!aktifKullanici?.isAdmin) {
      Alert.alert(
        '⛔ Erişim Engellendi',
        'Bu sayfaya erişim yetkiniz bulunmamaktadır. Yalnızca yönetici hesaplarıyla giriş yapılabilir.',
        [{ text: 'Tamam', style: 'default' }]
      );
      return;
    }
    router.push('/admin' as any);
  };

  const UstAlanButonlari = () => (
    <View style={stiller.ustGrup}>
      {/* ⚙️ Yönetim Paneli Butonu */}
      <TouchableOpacity
        style={[stiller.yonetimPanelButon, { backgroundColor: tema.kartArkaplan, borderColor: tema.anaRenk }]}
        onPress={adminSayfasinaGit}
      >
        <Ionicons name="shield-checkmark" size={12} color={tema.anaRenk} />
        <Text style={[stiller.yonetimPanelMetni, { color: tema.anaRenk }]}>ADMİN</Text>
      </TouchableOpacity>

      {/* İlan Ver Butonu */}
      <TouchableOpacity
        style={[stiller.ilanButon, { backgroundColor: tema.basari }]}
        onPress={() => router.push('/ilanver')}
      >
        <Ionicons name="add-circle" size={16} color="#FFF" />
        <Text style={stiller.ilanButonMetni}>İlan Ver</Text>
      </TouchableOpacity>

      {/* Chatbot Butonu */}
      <TouchableOpacity style={stiller.ikonButon} onPress={() => router.push('/chatbot')}>
        <Ionicons name="chatbubble-ellipses" size={20} color={tema.metin} />
      </TouchableOpacity>

      {/* Karşılaştırma Butonu */}
      <TouchableOpacity style={stiller.ikonButon} onPress={() => router.push('/karsilastir')}>
        <Ionicons name="git-compare-outline" size={20} color={tema.metin} />
        {karsilastirmaListesi.length > 0 && (
          <View style={[stiller.badge, { backgroundColor: tema.ikincilRenk }]}>
            <Text style={stiller.badgeMetni}>{karsilastirmaListesi.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Sepet Butonu */}
      <TouchableOpacity style={stiller.ikonButon} onPress={() => router.push('/sepet')}>
        <Ionicons name="cart" size={20} color={tema.metin} />
        {sepetSayisi > 0 && (
          <View style={[stiller.badge, { backgroundColor: tema.vurguRenk }]}>
            <Text style={stiller.badgeMetni}>{sepetSayisi}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Tema Butonu */}
      <TouchableOpacity style={stiller.ikonButon} onPress={temaDegistir}>
        <Ionicons name={karanlikMod ? 'sunny' : 'moon'} size={20} color={tema.metin} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerRight: () => <UstAlanButonlari />,
        headerStyle: {
          backgroundColor: tema.kartArkaplan,
        },
        headerTintColor: tema.metin,
        tabBarStyle: {
          backgroundColor: tema.kartArkaplan,
          borderTopColor: tema.kenarlik,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
          height: 60 + (insets.bottom > 0 ? insets.bottom - 5 : 0),
        },
        tabBarActiveTintColor: tema.tabBarAktif,
        tabBarInactiveTintColor: tema.tabBarPasif,
      }}
    >
      <Tabs.Screen
        name="ilanlar"
        options={{
          title: 'İlanlar',
          tabBarIcon: ({ color, size }) => <Ionicons name="car-sport" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="aksesuar"
        options={{
          title: 'Aksesuar',
          tabBarIcon: ({ color, size }) => <Ionicons name="construct" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favoriler"
        options={{
          title: 'Favoriler',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const stiller = StyleSheet.create({
  ustGrup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  yonetimPanelButon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1.5,
    marginRight: 2,
    gap: 3,
  },
  yonetimPanelMetni: {
    fontWeight: 'bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  ilanButon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 3,
  },
  ilanButonMetni: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  ikonButon: {
    padding: 5,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeMetni: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
