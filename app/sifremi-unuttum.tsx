import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AcikTema, KoyuTema } from '../sabitler/Tema';
import { useKullanimDurum, KullanimDurumTipi } from '../durum/kullanimDurum';

export default function SifremiUnuttumEkrani() {
  const router = useRouter();
  const sifreSifirla = useKullanimDurum((state: KullanimDurumTipi) => state.sifreSifirla);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const temaDegistir = useKullanimDurum((state: KullanimDurumTipi) => state.temaDegistir);
  const tema = karanlikMod ? KoyuTema : AcikTema;

  const [eposta, setEposta] = useState('');
  const [yeniSifre, setYeniSifre] = useState('');
  const [hata, setHata] = useState('');
  const [basarili, setBasarili] = useState(false);

  const sifirlamaIslemi = () => {
    if (!eposta || !yeniSifre) {
      setHata('Lütfen tüm alanları doldurun.');
      return;
    }

    const sonuc = sifreSifirla(eposta, yeniSifre);
    
    if (sonuc) {
      setHata('');
      setBasarili(true);
      setTimeout(() => {
        router.replace('/');
      }, 2000);
    } else {
      setHata('Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.');
    }
  };

  return (
    <View style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]}>
      <TouchableOpacity style={[stiller.temaButon, { backgroundColor: tema.kartArkaplan + '90' }]} onPress={temaDegistir}>
        <Ionicons name={karanlikMod ? 'sunny' : 'moon'} size={22} color={tema.metin} />
      </TouchableOpacity>

      <TouchableOpacity style={[stiller.geriButon, { backgroundColor: tema.kartArkaplan + '90' }]} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={tema.metin} />
      </TouchableOpacity>

      <Animated.View entering={FadeInUp.delay(100).springify()} style={stiller.baslikAlani}>
        <View style={[stiller.logoKutu, { backgroundColor: tema.anaRenk }]}>
          <Ionicons name="key-outline" size={28} color="#FFF" />
        </View>
        <Text style={[stiller.baslik, { color: tema.metin }]}>Şifremi Unuttum</Text>
        <Text style={[stiller.altBaslik, { color: tema.metinAcik }]}>Şifrenizi güvenle yenileyin</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).springify()} style={stiller.formAlani}>
        <View style={[stiller.formKart, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
          
          {basarili ? (
            <View style={[stiller.hataKutu, { backgroundColor: '#DEF7EC', borderColor: '#31C48D' }]}>
              <Ionicons name="checkmark-circle" size={16} color="#0E9F6E" />
              <Text style={[stiller.hataMetni, { color: '#0E9F6E' }]}>Şifreniz başarıyla yenilendi. Giriş sayfasına yönlendiriliyorsunuz...</Text>
            </View>
          ) : (
            <>
              {hata ? (
                <View style={stiller.hataKutu}>
                  <Ionicons name="warning" size={16} color="#EF4444" />
                  <Text style={stiller.hataMetni}>{hata}</Text>
                </View>
              ) : null}

              <View style={[stiller.girdiWrapper, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik }]}>
                <Ionicons name="mail-outline" size={18} color={tema.metinAcik} />
                <TextInput
                  style={[stiller.girdi, { color: tema.metin }]}
                  placeholder="Kayıtlı E-posta"
                  placeholderTextColor={tema.metinAcik}
                  value={eposta}
                  onChangeText={setEposta}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={[stiller.girdiWrapper, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik }]}>
                <Ionicons name="lock-closed-outline" size={18} color={tema.metinAcik} />
                <TextInput
                  style={[stiller.girdi, { color: tema.metin }]}
                  placeholder="Yeni Şifre"
                  placeholderTextColor={tema.metinAcik}
                  value={yeniSifre}
                  onChangeText={setYeniSifre}
                  secureTextEntry={true}
                />
              </View>

              <TouchableOpacity
                style={[stiller.kayitButon, { backgroundColor: tema.anaRenk }]}
                onPress={sifirlamaIslemi}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh" size={20} color="#FFF" />
                <Text style={stiller.butonMetni}>Şifreyi Yenile</Text>
              </TouchableOpacity>
            </>
          )}

        </View>
      </Animated.View>
    </View>
  );
}

const stiller = StyleSheet.create({
  anaKutu: {
    flex: 1,
  },
  temaButon: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    borderRadius: 14,
  },
  geriButon: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    borderRadius: 14,
  },
  baslikAlani: {
    alignItems: 'center',
    paddingTop: 80,
    marginBottom: 10,
  },
  logoKutu: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  baslik: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  altBaslik: {
    fontSize: 13,
    marginTop: 4,
  },
  formAlani: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  formKart: {
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    width: '100%',
    maxWidth: 420,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    gap: 12,
  },
  hataKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  hataMetni: {
    color: '#EF4444',
    fontSize: 13,
    flex: 1,
  },
  girdiWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  girdi: {
    flex: 1,
    fontSize: 14,
  },
  kayitButon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  butonMetni: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
