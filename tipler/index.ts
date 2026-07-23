export interface Kullanici {
  id: string;
  ad: string;
  soyad: string;
  telefon: string;
  eposta: string;
  sifre: string;
  adres: string;
  puan: number;
  degerlendirmeSayisi: number;
  isAdmin?: boolean;
  kayitTarihi: string;
}

export interface Araba {
  id: string;
  saticiId: string;
  marka: string;
  model: string;
  yil: number;
  fiyat: number;
  kilometre: number;
  vites: 'Otomatik' | 'Manuel';
  yakitTuru: 'Benzin' | 'Dizel' | 'Elektrik' | 'Hibrit';
  resimler: string[];
  aciklama: string;
  ozellikler: string[];
  ilanTarihi?: string;
  hasarKaydi?: string;
  boyaliDegisen?: string;
  motorHacmi?: string;
  kasaTipi?: string;
  renk?: string;
}

export interface Aksesuar {
  id: string;
  saticiId: string;
  ad: string;
  fiyat: number;
  durum: 'Sıfır' | 'İkinci El';
  aciklama: string;
  resimler: string[];
  kategori: string;
  stok: number;
}

export interface Favori {
  id: string;
  kullaniciId: string;
  arabaId?: string;
  aksesuarId?: string;
}

export interface SepetUrun {
  id: string;
  kullaniciId: string;
  aksesuarId: string;
  adet: number;
}

export interface SiparisUrun {
  aksesuarId: string;
  ad: string;
  fiyat: number;
  adet: number;
  resim: string;
}

export interface Siparis {
  id: string;
  kullaniciId: string;
  urunler: SiparisUrun[];
  toplamTutar: number;
  durum: 'Onay Bekliyor' | 'Hazırlanıyor' | 'Kargoya Verildi' | 'Teslim Edildi' | 'İptal Edildi';
  tarih: string;
  teslimatBilgileri: {
    adSoyad: string;
    telefon: string;
    adres: string;
    il: string;
    ilce: string;
  };
}

export interface ChatMesaj {
  id: string;
  gonderen: 'bot' | 'kullanici';
  metin: string;
  tip: 'normal' | 'karsilastirma' | 'arama';
  zaman: string;
  karsilastirmaVerileri?: Araba[];
  aramaVerileri?: (Araba | Aksesuar)[];
}
