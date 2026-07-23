import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AcikTema, KoyuTema } from '../../sabitler/Tema';
import { KullanimDurumTipi, useKullanimDurum } from '../../durum/kullanimDurum';

export default function AdminYerlesim() {
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const aktifKullanici = useKullanimDurum((state: KullanimDurumTipi) => state.aktifKullanici);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Yalnızca adminlerin erişimine izin ver — Alert ile uyarı
  useEffect(() => {
    if (!aktifKullanici || !aktifKullanici.isAdmin) {
      Alert.alert(
        '⛔ Erişim Engellendi',
        'Bu sayfaya erişim yetkiniz bulunmamaktadır. Yalnızca yönetici hesaplarıyla giriş yapılabilir.',
        [
          {
            text: 'Tamam',
            onPress: () => router.replace('/(sekmeler)/ilanlar'),
            style: 'default',
          },
        ],
        { cancelable: false }
      );
    }
  }, [aktifKullanici]);

  if (!aktifKullanici || !aktifKullanici.isAdmin) {
    return (
      <View style={[stiller.engelliKutu, { backgroundColor: tema.arkaplan }]}>
        <Ionicons name="lock-closed" size={64} color={tema.anaRenk} />
        <Text style={[stiller.engelliBaslik, { color: tema.metin }]}>Erişim Engellendi</Text>
        <Text style={[stiller.engelliMetin, { color: tema.metinAcik }]}>
          Bu sayfa yalnızca yöneticiler içindir.
        </Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity 
            style={{ marginLeft: 15 }} 
            onPress={() => router.push('/(sekmeler)/ilanlar')}
          >
            <Ionicons name="arrow-back" size={24} color={tema.metin} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: tema.kartArkaplan,
        },
        headerTintColor: tema.metin,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: tema.kartArkaplan,
          borderTopColor: tema.kenarlik,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
          height: 60 + (insets.bottom > 0 ? insets.bottom - 5 : 0),
        },
        tabBarActiveTintColor: tema.anaRenk,
        tabBarInactiveTintColor: tema.metinAcik,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="siparisler"
        options={{
          title: 'Siparişler',
          tabBarIcon: ({ color, size }) => <Ionicons name="cube-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="kullanicilar"
        options={{
          title: 'Kullanıcılar',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stok"
        options={{
          title: 'Stok',
          tabBarIcon: ({ color, size }) => <Ionicons name="layers-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const stiller = StyleSheet.create({
  engelliKutu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  engelliBaslik: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
  },
  engelliMetin: {
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },
});
