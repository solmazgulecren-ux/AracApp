import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AcikTema, KoyuTema } from '../sabitler/Tema';
import { useKullanimDurum, KullanimDurumTipi } from '../durum/kullanimDurum';
import { toastGosterGlobal } from '../bilesenler/ToastBildirim';

export default function KayitEkrani() {
  const router = useRouter();
  const kayitOl = useKullanimDurum((state: KullanimDurumTipi) => state.kayitOl);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const temaDegistir = useKullanimDurum((state: KullanimDurumTipi) => state.temaDegistir);
  const tema = karanlikMod ? KoyuTema : AcikTema;
  
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [telefon, setTelefon] = useState('');
  const [adres, setAdres] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');

  const kayitIslemi = () => {
    if (!ad || !soyad || !telefon || !adres || !eposta || !sifre) {
      setHata('Lütfen tüm alanları doldurun.');
      return;
    }

    if (!eposta.includes('@') || !eposta.includes('.')) {
      setHata('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    if (sifre.length < 6) {
      setHata('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    if (telefon.length < 10) {
      setHata('Lütfen geçerli bir telefon numarası girin.');
      return;
    }

    setHata('');
    
    kayitOl({
      ad,
      soyad,
      telefon,
      adres,
      eposta,
      sifre,
      puan: 0,
      degerlendirmeSayisi: 0,
      kayitTarihi: new Date().toISOString()
    });

    toastGosterGlobal('Kayıt Başarılı, yönlendiriliyorsunuz...', 'basari');
    setTimeout(() => {
      router.replace('/(sekmeler)/ilanlar');
    }, 1500);
  };

  const alanlar = [
    { placeholder: 'Ad', value: ad, setValue: setAd, icon: 'person-outline' as const },
    { placeholder: 'Soyad', value: soyad, setValue: setSoyad, icon: 'person-outline' as const },
    { placeholder: 'Telefon', value: telefon, setValue: setTelefon, icon: 'call-outline' as const, keyboardType: 'phone-pad' as const },
    { placeholder: 'Adres', value: adres, setValue: setAdres, icon: 'location-outline' as const },
    { placeholder: 'E-posta', value: eposta, setValue: setEposta, icon: 'mail-outline' as const, keyboardType: 'email-address' as const },
    { placeholder: 'Şifre', value: sifre, setValue: setSifre, icon: 'lock-closed-outline' as const, secureTextEntry: true },
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[stiller.anaKutu, { backgroundColor: tema.arkaplan }]}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={[stiller.temaButon, { backgroundColor: tema.kartArkaplan + '90' }]} onPress={temaDegistir}>
        <Ionicons name={karanlikMod ? 'sunny' : 'moon'} size={22} color={tema.metin} />
      </TouchableOpacity>

      <TouchableOpacity style={[stiller.geriButon, { backgroundColor: tema.kartArkaplan + '90' }]} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={tema.metin} />
      </TouchableOpacity>

      <Animated.View entering={FadeInUp.delay(100).springify()} style={stiller.baslikAlani}>
        <View style={[stiller.logoKutu, { backgroundColor: tema.anaRenk }]}>
          <Ionicons name="person-add" size={28} color="#FFF" />
        </View>
        <Text style={[stiller.baslik, { color: tema.metin }]}>Kayıt Ol</Text>
        <Text style={[stiller.altBaslik, { color: tema.metinAcik }]}>Hemen ücretsiz hesap oluşturun</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).springify()} style={stiller.formAlani}>
        <View style={[stiller.formKart, { backgroundColor: tema.kartArkaplan, borderColor: tema.kenarlik }]}>
          {hata ? (
            <View style={stiller.hataKutu}>
              <Ionicons name="warning" size={16} color="#EF4444" />
              <Text style={stiller.hataMetni}>{hata}</Text>
            </View>
          ) : null}

          {alanlar.map((alan, idx) => (
            <View key={idx} style={[stiller.girdiWrapper, { backgroundColor: tema.yuzeyRenk, borderColor: tema.kenarlik }]}>
              <Ionicons name={alan.icon} size={18} color={tema.metinAcik} />
              <TextInput
                style={[stiller.girdi, { color: tema.metin }]}
                placeholder={alan.placeholder}
                placeholderTextColor={tema.metinAcik}
                value={alan.value}
                onChangeText={alan.setValue}
                keyboardType={alan.keyboardType}
                secureTextEntry={alan.secureTextEntry}
                autoCapitalize={alan.keyboardType === 'email-address' ? 'none' : undefined}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[stiller.kayitButon, { backgroundColor: tema.anaRenk }]}
            onPress={kayitIslemi}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            <Text style={stiller.butonMetni}>Kaydı Tamamla</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
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
