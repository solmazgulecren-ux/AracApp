import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useKullanimDurum, KullanimDurumTipi } from '../durum/kullanimDurum';
import { AcikTema, KoyuTema, Olculer } from '../sabitler/Tema';

export const UstMenu = () => {
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const aktifKullanici = useKullanimDurum((state: KullanimDurumTipi) => state.aktifKullanici);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: tema.kartArkaplan }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Olculer.orta, borderBottomWidth: 1, borderBottomColor: tema.kenarlik }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: tema.anaRenk }}>Araç Piyasası</Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 50 }}>
          {aktifKullanici?.isAdmin && (
            <TouchableOpacity 
              onPress={() => router.push('/admin')} 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: '#1A1A1A', 
                paddingHorizontal: 10, 
                paddingVertical: 6, 
                borderRadius: 8, 
                borderWidth: 1, 
                borderColor: '#E51400', 
                marginRight: 15,
                shadowColor: '#E51400',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 3
              }}
            >
              <Text style={{ color: '#E51400', fontWeight: 'bold', fontSize: 12 }}>⚙️ YÖNETİM PANELİ</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => router.push('/(sekmeler)/profil')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="person-circle-outline" size={24} color={tema.anaRenk} />
            <Text style={{ color: tema.anaRenk, fontWeight: 'bold', marginLeft: 4 }}>Profil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
