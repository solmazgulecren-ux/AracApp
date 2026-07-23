export interface TemaTipi {
  arkaplan: string;
  kartArkaplan: string;
  yuzeyRenk: string;
  anaRenk: string;
  ikincilRenk: string;
  vurguRenk: string;
  metin: string;
  metinAcik: string;
  kenarlik: string;
  basari: string;
  hata: string;
  uyariKirmizi: string;
  tabBarAktif: string;
  tabBarPasif: string;
}

export const AcikTema: TemaTipi = {
  arkaplan: '#F9F9F9',
  kartArkaplan: '#FFFFFF',
  yuzeyRenk: '#F3F4F6',
  anaRenk: '#B91C1C', // Kırmızı
  ikincilRenk: '#7F1D1D', // Bordo
  vurguRenk: '#991B1B', // Koyu Kırmızı
  metin: '#111827',
  metinAcik: '#6B7280',
  kenarlik: '#E5E7EB',
  basari: '#10B981',
  hata: '#EF4444',
  uyariKirmizi: '#EF4444',
  tabBarAktif: '#B91C1C',
  tabBarPasif: '#9CA3AF'
};

export const KoyuTema: TemaTipi = {
  arkaplan: '#0A0A0A', // Siyah
  kartArkaplan: '#171717', // Koyu Gri/Siyah
  yuzeyRenk: '#262626',
  anaRenk: '#DC2626', // Parlak Kırmızı
  ikincilRenk: '#991B1B', // Bordo
  vurguRenk: '#B91C1C', // Kırmızı
  metin: '#F9FAFB',
  metinAcik: '#9CA3AF',
  kenarlik: '#404040',
  basari: '#34D399',
  hata: '#F87171',
  uyariKirmizi: '#F87171',
  tabBarAktif: '#DC2626',
  tabBarPasif: '#6B7280'
};

export const Olculer = {
  kucuk: 8,
  orta: 12,
  buyuk: 16,
  xl: 24,
  xxl: 32,
  yuvarlak: 9999
};

export const Golge = {
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4
};

export const NeonGlow = {
  elevation: 4,
  shadowColor: '#DC2626',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 6
};