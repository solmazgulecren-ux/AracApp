import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

// Zustand persist için AsyncStorage adaptörü
export const zustandDepolama: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const deger = await AsyncStorage.getItem(name);
    return deger ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};

// Yardımcı fonksiyonlar
export const tumVerileriTemizle = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (hata) {
    console.error('Veriler temizlenirken hata:', hata);
  }
};

export const veriAnahtarlariniListele = async (): Promise<string[]> => {
  try {
    return await AsyncStorage.getAllKeys() as string[];
  } catch (hata) {
    console.error('Anahtarlar listelenirken hata:', hata);
    return [];
  }
};
