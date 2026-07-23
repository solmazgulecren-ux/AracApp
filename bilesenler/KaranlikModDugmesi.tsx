import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useKullanimDurum, KullanimDurumTipi } from '../durum/kullanimDurum';
import { AcikTema, KoyuTema } from '../sabitler/Tema';

export const KaranlikModDugmesi = () => {
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const temaDegistir = useKullanimDurum((state: KullanimDurumTipi) => state.temaDegistir);
  const tema = karanlikMod ? KoyuTema : AcikTema;

  return (
    <TouchableOpacity 
      onPress={temaDegistir}
      style={{
        padding: 8,
        backgroundColor: tema.kartArkaplan,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: tema.kenarlik,
        position: 'absolute',
        top: 40,
        right: 16,
        zIndex: 100,
        elevation: 10,
      }}
    >
      <Ionicons 
        name={karanlikMod ? "sunny" : "moon"} 
        size={24} 
        color={tema.metin} 
      />
    </TouchableOpacity>
  );
};
