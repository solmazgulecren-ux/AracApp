import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { toastGosterGlobal } from '../bilesenler/ToastBildirim';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AcikTema, KoyuTema } from '../sabitler/Tema';
import { KullanimDurumTipi, useKullanimDurum } from '../durum/kullanimDurum';

const { width } = Dimensions.get('window');

export default function GirisEkrani() {
  const router = useRouter();
  const girisYap = useKullanimDurum((state: KullanimDurumTipi) => state.girisYap);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const temaDegistir = useKullanimDurum((state: KullanimDurumTipi) => state.temaDegistir);
  const tema = karanlikMod ? KoyuTema : AcikTema;

  const [eposta, setEposta] = useState('eco@ornek.com');
  const [sifre, setSifre] = useState('1234');
  const [hata, setHata] = useState('');

  const girisIslemi = () => {
    const basarili = girisYap(eposta, sifre);
    if (basarili) {
      toastGosterGlobal('Başarıyla giriş yapıldı.', 'basari');
      router.replace('/(sekmeler)/ilanlar');
    } else {
      setHata('Hatalı e-posta veya şifre.');
    }
  };

  return (
    <View style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]}>
      {/* Tema Butonu */}
      <TouchableOpacity style={[stiller.temaButon, { backgroundColor: tema.kartArkaplan + '90' }]} onPress={temaDegistir}>
        <Ionicons name={karanlikMod ? 'sunny' : 'moon'} size={22} color={tema.metin} />
      </TouchableOpacity>

      {/* Logo Alanı */}
      <Animated.View entering={FadeInUp.delay(100).springify()} style={stiller.logoAlani}>
        <View style={[stiller.logoKutu, { backgroundColor: tema.anaRenk }]}>
          <Ionicons name="car-sport" size={40} color="#FFF" />
        </View>
        <Text style={[stiller.logoMetin, { color: tema.metin }]}>AraçApp</Text>
        <Text style={[stiller.logoAltMetin, { color: tema.metinAcik }]}>
          Araç Alım Satım & Aksesuar
        </Text>
      </Animated.View>

      {/* Form Alanı */}
      <Animated.View entering={FadeInDown.delay(300).springify()} style={stiller.formAlani}>
        <View style={[stiller.formKart, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
          <Text style={[stiller.formBaslik, { color: tema.metin }]}>Hoş Geldiniz</Text>
          <Text style={[stiller.formAltBaslik, { color: tema.metinAcik }]}>Hesabınıza giriş yapın</Text>

          {hata ? (
            <View style={stiller.hataKutu}>
              <Ionicons name="warning" size={16} color="#EF4444" />
              <Text style={stiller.hataMetni}>{hata}</Text>
            </View>
          ) : null}

          <View style={stiller.girdiKutu}>
            <View style={[stiller.girdiWrapper, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik }]}>
              <Ionicons name="mail-outline" size={20} color={tema.metinAcik} />
              <TextInput
                style={[stiller.girdi, { color: tema.metin }]}
                placeholder="E-posta"
                placeholderTextColor={tema.metinAcik}
                value={eposta}
                onChangeText={setEposta}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={[stiller.girdiWrapper, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik }]}>
              <Ionicons name="lock-closed-outline" size={20} color={tema.metinAcik} />
              <TextInput
                style={[stiller.girdi, { color: tema.metin }]}
                placeholder="Şifre"
                placeholderTextColor={tema.metinAcik}
                value={sifre}
                onChangeText={setSifre}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={[stiller.girisButon, { backgroundColor: tema.anaRenk }]}
            onPress={girisIslemi}
            activeOpacity={0.85}
          >
            <Ionicons name="log-in-outline" size={20} color="#FFF" />
            <Text style={stiller.butonMetni}>Giriş Yap</Text>
          </TouchableOpacity>

          <View style={stiller.linklerKutu}>
            <TouchableOpacity onPress={() => router.push('/sifremi-unuttum')}>
              <Text style={[stiller.kayitMetni, { color: tema.metinAcik }]}>
                Şifremi Unuttum
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('/kayit')}>
              <Text style={[stiller.kayitMetni, { color: tema.metinAcik }]}>
                Hesabın yok mu?{' '}
                <Text style={{ color: tema.anaRenk, fontWeight: 'bold' }}>Kayıt Ol</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Alt Bilgi */}
      <Animated.View entering={FadeInDown.delay(500)} style={stiller.altBilgi}>
        <View style={stiller.ozellikSatir}>
          <View style={stiller.ozellikKutu}>
            <Ionicons name="shield-checkmark-outline" size={18} color={tema.basari} />
            <Text style={[stiller.ozellikMetin, { color: tema.metinAcik }]}>Güvenli</Text>
          </View>
          <View style={stiller.ozellikKutu}>
            <Ionicons name="flash-outline" size={18} color={tema.vurguRenk} />
            <Text style={[stiller.ozellikMetin, { color: tema.metinAcik }]}>Hızlı</Text>
          </View>
          <View style={stiller.ozellikKutu}>
            <Ionicons name="car-sport-outline" size={18} color={tema.ikincilRenk} />
            <Text style={[stiller.ozellikMetin, { color: tema.metinAcik }]}>100+ İlan</Text>
          </View>
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
  logoAlani: {
    alignItems: 'center',
    paddingTop: 80,
    marginBottom: 10,
  },
  logoKutu: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoMetin: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  logoAltMetin: {
    fontSize: 14,
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
  },
  formBaslik: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  formAltBaslik: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  hataKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  hataMetni: {
    color: '#EF4444',
    fontSize: 13,
    flex: 1,
  },
  girdiKutu: {
    gap: 16,
    marginBottom: 24,
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
  girisButon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
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
  linklerKutu: {
    marginTop: 24,
    alignItems: 'center',
    gap: 16,
  },
  kayitMetni: {
    fontSize: 13,
  },
  altBilgi: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  ozellikSatir: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  ozellikKutu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ozellikMetin: {
    fontSize: 12,
    fontWeight: '600',
  },
});
