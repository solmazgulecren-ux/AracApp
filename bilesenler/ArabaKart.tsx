import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { KullanimDurumTipi, useKullanimDurum } from '../durum/kullanimDurum';
import { AcikTema, KoyuTema, Olculer } from '../sabitler/Tema';
import { Araba, Favori } from '../tipler';

export const ArabaKart = ({ araba }: { araba: Araba }) => {
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const aktifKullanici = useKullanimDurum((state: KullanimDurumTipi) => state.aktifKullanici);
  const favoriler = useKullanimDurum((state: KullanimDurumTipi) => state.favoriler);
  const favoriDegistir = useKullanimDurum((state: KullanimDurumTipi) => state.favoriDegistir);

  const tema = karanlikMod ? KoyuTema : AcikTema;
  const favoriMi = favoriler.some((f: Favori) => f.kullaniciId === aktifKullanici?.id && f.arabaId === araba.id);

  return (
    <Link href={`/araba/${araba.id}`} asChild>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          backgroundColor: tema.kartArkaplan,
          borderRadius: Olculer.orta,
          marginBottom: Olculer.orta,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: tema.kenarlik,
          ...(Platform.OS === 'web' ? { width: 270, marginHorizontal: 8 } : {})
        }}
      >
        <View style={{ height: 200 }}>
          <Image source={{ uri: araba.resimler[0] }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
          <TouchableOpacity
            onPress={() => favoriDegistir(araba.id)}
            style={{
              position: 'absolute',
              top: Olculer.orta,
              right: Olculer.orta,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: Olculer.kucuk,
              borderRadius: Olculer.yuvarlak
            }}
          >
            <Ionicons name={favoriMi ? "heart" : "heart-outline"} size={24} color={favoriMi ? tema.ikincilRenk : '#FFF'} />
          </TouchableOpacity>
        </View>
        <View style={{ padding: Olculer.orta }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: tema.metin }}>{araba.yil} {araba.marka} {araba.model}</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: tema.anaRenk, marginTop: 4 }}>{araba.fiyat} ₺</Text>

          <View style={{ flexDirection: 'row', marginTop: Olculer.orta, paddingTop: Olculer.kucuk, borderTopWidth: 1, borderTopColor: tema.kenarlik, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="speedometer-outline" size={16} color={tema.metinAcik} />
              <Text style={{ color: tema.metinAcik, fontSize: 12, marginLeft: 4 }}>{araba.kilometre} km</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="cog-outline" size={16} color={tema.metinAcik} />
              <Text style={{ color: tema.metinAcik, fontSize: 12, marginLeft: 4 }}>{araba.vites}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="water-outline" size={16} color={tema.metinAcik} />
              <Text style={{ color: tema.metinAcik, fontSize: 12, marginLeft: 4 }}>{araba.yakitTuru}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
