import { Kullanici } from "@/tipler/Kullanici";
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandDepolama } from '../araclar/veriTabani';
import { sahteAksesuarlarUret, sahteArabalarUret, sahteKullanicilarUret } from '../araclar/sahteVeriUret';
import { Aksesuar, Araba, Favori, SepetUrun, Siparis, SiparisUrun } from '../tipler';

export interface KullanimDurumTipi {
  kullanicilar: Kullanici[];
  arabalar: Araba[];
  aksesuarlar: Aksesuar[];
  favoriler: Favori[];
  sepet: SepetUrun[];
  siparisler: Siparis[];
  karsilastirmaListesi: Record<string, string[]>;
  aktifKullanici: Kullanici | null;
  karanlikMod: boolean;

  girisYap: (eposta: string, sifre: string) => boolean;
  cikisYap: () => void;
  kayitOl: (kullanici: Omit<Kullanici, 'id'>) => void;
  profilGuncelle: (kullaniciId: string, guncelVeri: Partial<Kullanici>) => void;
  arabaEkle: (araba: Omit<Araba, 'id' | 'saticiId'>) => void;
  arabaSil: (arabaId: string) => boolean;
  aksesuarEkle: (aksesuar: Omit<Aksesuar, 'id' | 'saticiId'>) => void;
  favoriDegistir: (arabaId: string) => void;
  sepeteEkle: (aksesuarId: string) => void;
  sepettenCikar: (sepetId: string) => void;
  sepetAdetGuncelle: (sepetId: string, yeniAdet: number) => void;
  sepetTemizle: () => void;
  siparisOlustur: (teslimatBilgileri: Siparis['teslimatBilgileri']) => string | null;
  karsilastirmayaEkle: (id: string) => void;
  karsilastirmadanCikar: (id: string) => void;
  karsilastirmaTemizle: () => void;
  temaDegistir: () => void;
  verileriYukle: () => void;
  siparisDurumuGuncelle: (siparisId: string, yeniDurum: Siparis['durum']) => void;
  stokGuncelle: (aksesuarId: string, yeniStok: number) => void;
  kullaniciKarsilastirmaListesi: () => string[];
}

export const useKullanimDurum = create<KullanimDurumTipi>()(
  persist(
    (set, get) => ({
      kullanicilar: [],
      arabalar: [],
      aksesuarlar: [],
      favoriler: [],
      sepet: [],
      siparisler: [],
      karsilastirmaListesi: {},
      aktifKullanici: null,
      karanlikMod: false,

      girisYap: (eposta, sifre) => {
        const kullanici = get().kullanicilar.find((k: Kullanici) => k.eposta === eposta && k.sifre === sifre);
        if (kullanici) {
          set({ aktifKullanici: kullanici });
          return true;
        }
        return false;
      },

      cikisYap: () => {
        set({ aktifKullanici: null });
      },

      kayitOl: (kullaniciData) => {
        const yeniKullanici: Kullanici = { 
          ...kullaniciData, 
          id: `kullanici-${Date.now()}`,
          kayitTarihi: new Date().toISOString().split('T')[0]
        };
        set((state: KullanimDurumTipi) => ({
          kullanicilar: [...state.kullanicilar, yeniKullanici],
          aktifKullanici: yeniKullanici
        }));
      },

      profilGuncelle: (kullaniciId, guncelVeri) => {
        set((state: KullanimDurumTipi) => ({
          kullanicilar: state.kullanicilar.map((k: Kullanici) => k.id === kullaniciId ? { ...k, ...guncelVeri } : k),
          aktifKullanici: state.aktifKullanici?.id === kullaniciId ? { ...state.aktifKullanici, ...guncelVeri } : state.aktifKullanici
        }));
      },

      arabaEkle: (arabaData) => {
        const aktifKullanici = get().aktifKullanici;
        if (!aktifKullanici) return;

        const yeniAraba: Araba = {
          ...arabaData,
          id: `araba-${Date.now()}`,
          saticiId: aktifKullanici.id
        };

        set((state: KullanimDurumTipi) => ({
          arabalar: [yeniAraba, ...state.arabalar]
        }));
      },

      arabaSil: (arabaId) => {
        const aktifKullanici = get().aktifKullanici;
        if (!aktifKullanici) return false;

        const araba = get().arabalar.find((a: Araba) => a.id === arabaId);
        if (!araba || araba.saticiId !== aktifKullanici.id) return false;

        set((state: KullanimDurumTipi) => ({
          arabalar: state.arabalar.filter((a: Araba) => a.id !== arabaId),
          favoriler: state.favoriler.filter((f: Favori) => f.arabaId !== arabaId),
          karsilastirmaListesi: Object.fromEntries(
            Object.entries(state.karsilastirmaListesi).map(([uid, ids]) => [uid, ids.filter(id => id !== arabaId)])
          )
        }));
        return true;
      },

      aksesuarEkle: (aksesuarData) => {
        const aktifKullanici = get().aktifKullanici;
        if (!aktifKullanici) return;

        const yeniAksesuar: Aksesuar = {
          ...aksesuarData,
          id: `aksesuar-${Date.now()}`,
          saticiId: aktifKullanici.id
        };

        set((state: KullanimDurumTipi) => ({
          aksesuarlar: [yeniAksesuar, ...state.aksesuarlar]
        }));
      },

      favoriDegistir: (arabaId) => {
        const aktifKullanici = get().aktifKullanici;
        if (!aktifKullanici) return;

        const mevcutFavori = get().favoriler.find((f: Favori) => f.kullaniciId === aktifKullanici.id && f.arabaId === arabaId);

        if (mevcutFavori) {
          set((state: KullanimDurumTipi) => ({
            favoriler: state.favoriler.filter((f: Favori) => f.id !== mevcutFavori.id)
          }));
        } else {
          set((state: KullanimDurumTipi) => ({
            favoriler: [...state.favoriler, { id: `fav-${Date.now()}`, kullaniciId: aktifKullanici.id, arabaId }]
          }));
        }
      },

      sepeteEkle: (aksesuarId) => {
        const aktifKullanici = get().aktifKullanici;
        if (!aktifKullanici) return;

        const mevcutUrun = get().sepet.find((s: SepetUrun) => s.kullaniciId === aktifKullanici.id && s.aksesuarId === aksesuarId);

        if (mevcutUrun) {
          set((state: KullanimDurumTipi) => ({
            sepet: state.sepet.map((s: SepetUrun) => 
              s.id === mevcutUrun.id ? { ...s, adet: s.adet + 1 } : s
            )
          }));
        } else {
          set((state: KullanimDurumTipi) => ({
            sepet: [...state.sepet, { id: `sepet-${Date.now()}`, kullaniciId: aktifKullanici.id, aksesuarId, adet: 1 }]
          }));
        }
      },

      sepettenCikar: (sepetId) => {
        set((state: KullanimDurumTipi) => ({
          sepet: state.sepet.filter((s: SepetUrun) => s.id !== sepetId)
        }));
      },

      sepetAdetGuncelle: (sepetId, yeniAdet) => {
        if (yeniAdet <= 0) {
          get().sepettenCikar(sepetId);
          return;
        }
        set((state: KullanimDurumTipi) => ({
          sepet: state.sepet.map((s: SepetUrun) => 
            s.id === sepetId ? { ...s, adet: yeniAdet } : s
          )
        }));
      },

      sepetTemizle: () => {
        const aktifKullanici = get().aktifKullanici;
        if (!aktifKullanici) return;
        set((state: KullanimDurumTipi) => ({
          sepet: state.sepet.filter((s: SepetUrun) => s.kullaniciId !== aktifKullanici.id)
        }));
      },

      siparisOlustur: (teslimatBilgileri) => {
        const aktifKullanici = get().aktifKullanici;
        if (!aktifKullanici) return null;

        const kullaniciSepeti = get().sepet.filter((s: SepetUrun) => s.kullaniciId === aktifKullanici.id);
        if (kullaniciSepeti.length === 0) return null;

        const urunler: SiparisUrun[] = kullaniciSepeti.map((s: SepetUrun) => {
          const aksesuar = get().aksesuarlar.find((a: Aksesuar) => a.id === s.aksesuarId);
          return {
            aksesuarId: s.aksesuarId,
            ad: aksesuar?.ad || 'Bilinmeyen Ürün',
            fiyat: aksesuar?.fiyat || 0,
            adet: s.adet,
            resim: aksesuar?.resimler[0] || ''
          };
        });

        const toplamTutar = urunler.reduce((toplam, urun) => toplam + urun.fiyat * urun.adet, 0);

        const yeniSiparis: Siparis = {
          id: `siparis-${Date.now()}`,
          kullaniciId: aktifKullanici.id,
          urunler,
          toplamTutar,
          durum: 'Onay Bekliyor',
          tarih: new Date().toLocaleDateString('tr-TR'),
          teslimatBilgileri
        };

        // Stok düşür
        const guncelAksesuarlar = get().aksesuarlar.map((a: Aksesuar) => {
          const siparisinUrun = kullaniciSepeti.find(s => s.aksesuarId === a.id);
          if (siparisinUrun) {
            return { ...a, stok: Math.max(0, a.stok - siparisinUrun.adet) };
          }
          return a;
        });

        set((state: KullanimDurumTipi) => ({
          siparisler: [yeniSiparis, ...state.siparisler],
          sepet: state.sepet.filter((s: SepetUrun) => s.kullaniciId !== aktifKullanici.id),
          aksesuarlar: guncelAksesuarlar
        }));

        return yeniSiparis.id;
      },

      karsilastirmayaEkle: (id) => {
        const aktifKullanici = get().aktifKullanici;
        if (!aktifKullanici) return;
        const kullaniciListesi = get().karsilastirmaListesi[aktifKullanici.id] || [];
        if (!kullaniciListesi.includes(id) && kullaniciListesi.length < 4) {
          set((state: KullanimDurumTipi) => ({
            karsilastirmaListesi: {
              ...state.karsilastirmaListesi,
              [aktifKullanici.id]: [...kullaniciListesi, id]
            }
          }));
        }
      },

      karsilastirmadanCikar: (id) => {
        const aktifKullanici = get().aktifKullanici;
        if (!aktifKullanici) return;
        set((state: KullanimDurumTipi) => ({
          karsilastirmaListesi: {
            ...state.karsilastirmaListesi,
            [aktifKullanici.id]: (state.karsilastirmaListesi[aktifKullanici.id] || []).filter(itemId => itemId !== id)
          }
        }));
      },

      karsilastirmaTemizle: () => {
        const aktifKullanici = get().aktifKullanici;
        if (!aktifKullanici) return;
        set((state: KullanimDurumTipi) => ({
          karsilastirmaListesi: {
            ...state.karsilastirmaListesi,
            [aktifKullanici.id]: []
          }
        }));
      },

      temaDegistir: () => {
        set((state: KullanimDurumTipi) => ({ karanlikMod: !state.karanlikMod }));
      },

      verileriYukle: () => {
        if (get().kullanicilar.length === 0) {
          const sahteKullanicilar = sahteKullanicilarUret();
          const sahteArabalar = sahteArabalarUret(sahteKullanicilar);
          const sahteAksesuarlar = sahteAksesuarlarUret(sahteKullanicilar);
          set({ kullanicilar: sahteKullanicilar, arabalar: sahteArabalar, aksesuarlar: sahteAksesuarlar });
        }
      },

      siparisDurumuGuncelle: (siparisId, yeniDurum) => {
        set((state: KullanimDurumTipi) => ({
          siparisler: state.siparisler.map(s => 
            s.id === siparisId ? { ...s, durum: yeniDurum } : s
          )
        }));
      },

      stokGuncelle: (aksesuarId, yeniStok) => {
        set((state: KullanimDurumTipi) => ({
          aksesuarlar: state.aksesuarlar.map(a =>
            a.id === aksesuarId ? { ...a, stok: Math.max(0, yeniStok) } : a
          )
        }));
      },

      kullaniciKarsilastirmaListesi: () => {
        const aktifKullanici = get().aktifKullanici;
        if (!aktifKullanici) return [];
        return get().karsilastirmaListesi[aktifKullanici.id] || [];
      },
    }),
    {
      name: 'arac-app-depolama',
      storage: createJSONStorage(() => zustandDepolama),
      partialize: (state) => ({
        kullanicilar: state.kullanicilar,
        arabalar: state.arabalar,
        aksesuarlar: state.aksesuarlar,
        favoriler: state.favoriler,
        sepet: state.sepet,
        siparisler: state.siparisler,
        karsilastirmaListesi: state.karsilastirmaListesi,
        karanlikMod: state.karanlikMod,
      }),
    }
  )
);
