import { Kullanici } from "../tipler";
import { Aksesuar, Araba } from '../tipler';

const MARKALAR = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Nissan', 'Hyundai'];
const MODELLER: Record<string, string[]> = {
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
  'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Bronco'],
  'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Camaro'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'M4'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class'],
  'Audi': ['A4', 'Q5', 'A6', 'Q7', 'e-tron'],
  'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'],
  'Nissan': ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Frontier'],
  'Hyundai': ['Elantra', 'Tucson', 'Santa Fe', 'Sonata', 'Palisade']
};
const YAKIT_TURLERI: Araba['yakitTuru'][] = ['Benzin', 'Dizel', 'Elektrik', 'Hibrit'];
const VITES_TURLERI: Araba['vites'][] = ['Otomatik', 'Manuel'];
const OZELLIKLER_LISTESI = ['Bluetooth', 'Geri Görüş Kamerası', 'Navigasyon', 'Sunroof', 'Deri Koltuklar', 'Koltuk Isıtma', 'Apple CarPlay', 'Kör Nokta Uyarı', 'Hız Sabitleyici', 'Şerit Takip', 'Otomatik Park', 'LED Farlar', 'Kablosuz Şarj', 'Bose Ses Sistemi'];

const ACIKLAMALAR = [
  'Araç çok temiz durumda, tek sahibinden. Tüm bakımları zamanında yapıldı.',
  'Şehir içi kullanım için harika. Çok az yakıyor ve çok güvenilir.',
  'Geniş aile aracı, bagaj hacmi çok büyük. Sigara içilmemiştir.',
  'Acil satılık olduğu için fiyat uygun tutuldu. Motor kusursuz.',
  'Lüks donanım paketi. Sürüş keyfi inanılmaz.',
  'Garaj arabası, hiç kaza yapmamış. Tam bakımlı.',
  'İlk sahibinden, boyasız değişensiz. Servis bakımlı.',
  'Ekonomik ve güvenilir aile aracı. Düşük kilometre.',
];

const GERCEK_RESIMLER = [
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', // Mustang/Sport
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', // Porsche/Sport
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3b?w=800&q=80', // Corvette/Chevrolet
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', // BMW 3
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', // Mercedes C
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80', // Audi A4
  'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80', // Tesla M3
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80', // SUV/Toyota
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80', // Sedan
  'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&q=80', // SUV
  'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&q=80', // Classic
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80', // Supercar
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80', // Hatchback
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80', // Yellow Sport
  'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800&q=80', // SUV Mercedes
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80', // SUV BMW
];

// 10 farklı araç modeli için çok şık ve gerçeğe yakın görsel URL'leri haritası
const MODEL_RESIMLERI: Record<string, string[]> = {
  'BMW_3 Series': [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80',
    'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80'
  ],
  'BMW_5 Series': [
    'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80'
  ],
  'Mercedes-Benz_C-Class': [
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'
  ],
  'Mercedes-Benz_E-Class': [
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'
  ],
  'Audi_A4': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80'
  ],
  'Audi_Q5': [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80'
  ],
  'Tesla_Model 3': [
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80',
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80'
  ],
  'Tesla_Model Y': [
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80'
  ],
  'Ford_Mustang': [
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
    'https://images.unsplash.com/photo-1611245801312-51a3a022de44?w=800&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80'
  ],
  'Toyota_Corolla': [
    'https://images.unsplash.com/photo-1629897048514-3dd7414272aa?w=800&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80'
  ]
};

const MARKA_RESIMLERI: Record<string, string> = {
  'Toyota': 'https://images.unsplash.com/photo-1629897048514-3dd7414272aa?w=800&q=80',
  'Honda': 'https://images.unsplash.com/photo-1610901598285-0d2f0998fde0?w=800&q=80',
  'Ford': 'https://images.unsplash.com/photo-1551830116-d9818cf5efa6?w=800&q=80',
  'Chevrolet': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3b?w=800&q=80',
  'BMW': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  'Mercedes-Benz': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
  'Audi': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
  'Tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
  'Nissan': 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80',
  'Hyundai': 'https://images.unsplash.com/photo-1650383794301-44bbab9a3e63?w=800&q=80'
};

export const MARKALAR_LISTESI = MARKALAR;
export const MODELLER_LISTESI = MODELLER;

export const sahteKullanicilarUret = (): Kullanici[] => {
  return [
    {
      id: 'kullanici-1',
      ad: 'Ali',
      soyad: 'Yılmaz',
      telefon: '0555 123 4567',
      eposta: 'ali@ornek.com',
      sifre: 'sifre123',
      adres: 'Atatürk Cad. No:1, İstanbul',
      puan: 4.8,
      degerlendirmeSayisi: 15,
      kayitTarihi: '2023-05-10'
    },
    {
      id: 'kullanici-2',
      ad: 'Ayşe',
      soyad: 'Demir',
      telefon: '0532 987 6543',
      eposta: 'ayse@ornek.com',
      sifre: 'sifre123',
      adres: 'Cumhuriyet Sok. No:5, Ankara',
      puan: 4.5,
      degerlendirmeSayisi: 8,
      kayitTarihi: '2023-06-15'
    },
    {
      id: 'kullanici-3',
      ad: 'Can',
      soyad: 'Kaya',
      telefon: '0505 456 7890',
      eposta: 'can@ornek.com',
      sifre: 'sifre123',
      adres: 'İnönü Mah. No:10, İzmir',
      puan: 4.9,
      degerlendirmeSayisi: 42,
      kayitTarihi: '2023-08-01'
    },
    {
      id: 'admin-1',
      ad: 'Admin',
      soyad: 'Kullanıcı',
      telefon: '0500 000 0000',
      eposta: 'admin@aracapp.com',
      sifre: 'admin123',
      adres: 'Merkez Ofis',
      puan: 5.0,
      degerlendirmeSayisi: 0,
      isAdmin: true,
      kayitTarihi: '2023-01-01'
    },
    {
      id: 'admin-2',
      ad: 'Eco',
      soyad: 'S',
      telefon: '0555 555 55 55',
      eposta: 'eco@ornek.com',
      sifre: '1234',
      adres: 'Atatürk Cad. No:1, İstanbul',
      puan: 4.8,
      degerlendirmeSayisi: 15,
      isAdmin: true,
      kayitTarihi: '2026-06-15'
    },
  ];
};

export const sahteArabalarUret = (kullanicilar: Kullanici[]): Araba[] => {
  const arabalar: Araba[] = [];
  const kullaniciIdleri = kullanicilar.map((k: Kullanici) => k.id);

  let i = 1;
  for (const marka of MARKALAR) {
    if (!MODELLER[marka]) continue;
    for (const model of MODELLER[marka]) {
      const yil = 2010 + Math.floor(Math.random() * 16);
      const fiyat = 300000 + Math.floor(Math.random() * 2500000);
      const kilometre = Math.floor(Math.random() * 200000);
      const yakitTuru = marka === 'Tesla' ? 'Elektrik' : YAKIT_TURLERI[Math.floor(Math.random() * YAKIT_TURLERI.length)];
      const vites = VITES_TURLERI[Math.floor(Math.random() * VITES_TURLERI.length)];
      const saticiId = kullaniciIdleri[Math.floor(Math.random() * kullaniciIdleri.length)];
      const aciklama = `${marka} ${model}. ` + ACIKLAMALAR[Math.floor(Math.random() * ACIKLAMALAR.length)];

      const ilanTarihi = new Date();
      ilanTarihi.setDate(ilanTarihi.getDate() - Math.floor(Math.random() * 30));

      const numFeatures = 3 + Math.floor(Math.random() * 5);
      const shuffledFeatures = [...OZELLIKLER_LISTESI].sort(() => 0.5 - Math.random());
      const ozellikler = shuffledFeatures.slice(0, numFeatures);

      const modelKey = `${marka}_${model}`;
      const modelResimleri = MODEL_RESIMLERI[modelKey];

      const resimIndex1 = i % GERCEK_RESIMLER.length;
      const resimIndex2 = (i + 7) % GERCEK_RESIMLER.length;
      const resimIndex3 = (i + 13) % GERCEK_RESIMLER.length;

      const anaResim = modelResimleri ? modelResimleri[0] : (MARKA_RESIMLERI[marka] || GERCEK_RESIMLER[resimIndex1]);
      const digerResim1 = modelResimleri && modelResimleri[1] ? modelResimleri[1] : GERCEK_RESIMLER[resimIndex2];
      const digerResim2 = modelResimleri && modelResimleri[2] ? modelResimleri[2] : GERCEK_RESIMLER[resimIndex3];

      arabalar.push({
        id: `araba-${i}`,
        saticiId,
        marka,
        model,
        yil,
        fiyat,
        kilometre,
        vites,
        yakitTuru,
        resimler: [anaResim, digerResim1, digerResim2],
        aciklama,
        ozellikler,
        ilanTarihi: ilanTarihi.toISOString(),
      } as Araba);
      i++;
    }
  }

  return arabalar;
};

// Aksesuar adına göre akıllı görsel eşleştirme - her ürün tipine uygun görseller
const AKSESUAR_VERILERI: { ad: string; kategori: string; resim: string; aciklama: string }[] = [
  {
    ad: 'Michelin Kış Lastiği Seti',
    kategori: 'Lastik & Jant',
    resim: 'https://images.unsplash.com/photo-1598440590456-5ea5040eebfb?w=800&q=80',
    aciklama: 'Michelin Alpin 6 kış lastiği seti, 4 adet. 205/55R16 boyutunda. Üstün yol tutuşu ve kısa fren mesafesi.'
  },
  {
    ad: 'Sport Alüminyum Jant Seti',
    kategori: 'Lastik & Jant',
    resim: 'https://images.unsplash.com/photo-1590422749874-9a4f47cc0855?w=800&q=80',
    aciklama: '17 inç alüminyum alaşım jant seti. 4 adet. Hafif ve dayanıklı, araç performansını artırır.'
  },
  {
    ad: 'Pioneer Multimedya Ekranı',
    kategori: 'Elektronik',
    resim: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&q=80',
    aciklama: 'Pioneer AVH-Z9200DAB 7 inç dokunmatik ekran. Apple CarPlay ve Android Auto uyumlu.'
  },
  {
    ad: '3D Havuzlu Paspas Seti',
    kategori: 'İç Aksesuar',
    resim: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80',
    aciklama: '3D havuzlu araç paspas seti. Su ve kir tutma özellikli. Araç modeline özel üretim.'
  },
  {
    ad: 'Deri Koltuk Kılıfı Seti',
    kategori: 'İç Aksesuar',
    resim: 'https://images.unsplash.com/photo-1563717208170-40e8b159f935?w=800&q=80',
    aciklama: 'Premium suni deri koltuk kılıfı seti. 5 koltuk tam set. Su geçirmez ve kolay temizlenir.'
  },
  {
    ad: 'Araç İçi Kameralı Ayna',
    kategori: 'Elektronik',
    resim: 'https://images.unsplash.com/photo-1534969248232-a56d982ec844?w=800&q=80',
    aciklama: 'Çift kameralı araç içi ayna. Full HD kayıt, gece görüş özellikli. 32GB hafıza kartı dahil.'
  },
  {
    ad: 'Bose Araç Hoparlör Seti',
    kategori: 'Ses Sistemi',
    resim: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    aciklama: 'Bose 6.5 inç araç hoparlör seti. 2 adet. Kristal netliğinde ses kalitesi.'
  },
  {
    ad: 'Bagaj Düzenleyici Organizatör',
    kategori: 'İç Aksesuar',
    resim: 'https://images.unsplash.com/photo-1490237722416-042858cb28db?w=800&q=80',
    aciklama: 'Katlanabilir bagaj düzenleyici. Çok bölmeli, su geçirmez taban. Her araca uyumlu.'
  },
  {
    ad: 'LED Far Ampulü H7 Seti',
    kategori: 'Aydınlatma',
    resim: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
    aciklama: 'H7 LED far ampulü seti, 2 adet. 6000K beyaz ışık, %300 daha parlak. Kolay montaj.'
  },
  {
    ad: 'Portbagaj 400 Lt',
    kategori: 'Dış Aksesuar',
    resim: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    aciklama: '400 litre kapasiteli çatı portbagajı. Aerodinamik tasarım, çift taraflı açılır.'
  },
  {
    ad: 'Seramik Kaplama Seti',
    kategori: 'Bakım',
    resim: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80',
    aciklama: 'Profesyonel seramik kaplama kiti. 9H sertlik, 2 yıl koruma. Uygulama aparatları dahil.'
  },
  {
    ad: 'Oto Kokusu Premium Set',
    kategori: 'İç Aksesuar',
    resim: 'https://images.unsplash.com/photo-1595425959434-fc25c5ed5003?w=800&q=80',
    aciklama: 'Premium araç koku seti, 3 farklı aroma. Havalandırma klips tipi, uzun ömürlü.'
  },
  {
    ad: 'Araç Şarj Cihazı USB-C',
    kategori: 'Elektronik',
    resim: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    aciklama: '65W hızlı şarj araç şarj cihazı. USB-C ve USB-A çift port. Tüm cihazlarla uyumlu.'
  },
  {
    ad: 'Xenon Far Seti D1S',
    kategori: 'Aydınlatma',
    resim: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
    aciklama: 'D1S Xenon far ampulü seti, 2 adet. 4300K doğal beyaz. OEM kalitesinde.'
  },
  {
    ad: 'Direksiyon Kılıfı Deri',
    kategori: 'İç Aksesuar',
    resim: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    aciklama: 'Hakiki deri direksiyon kılıfı. Anti-slip özellikli, 37-38 cm çap. Ergonomik tasarım.'
  },
  {
    ad: 'Çamurluk Seti Universal',
    kategori: 'Dış Aksesuar',
    resim: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    aciklama: 'Universal araç çamurluk seti, 4 adet. Esnek malzeme, kolay montaj. Boyaya zarar vermez.'
  },
  {
    ad: 'Torpido Üstü Telefon Tutucu',
    kategori: 'Elektronik',
    resim: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    aciklama: 'Manyetik telefon tutucu. 360° dönebilen başlık, güçlü yapışma. Tüm telefonlara uyumlu.'
  },
  {
    ad: 'Cam Filmi Seti %35',
    kategori: 'Dış Aksesuar',
    resim: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
    aciklama: '%35 koyuluk cam filmi seti. UV koruma, ısı yalıtım. Profesyonel uygulama önerilir.'
  },
  {
    ad: 'Araç Buzdolabı 12V',
    kategori: 'İç Aksesuar',
    resim: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80',
    aciklama: '12V araç buzdolabı, 8 litre kapasite. Soğutma ve ısıtma özellikli. Çakmak girişi ile çalışır.'
  },
  {
    ad: 'Arka Tampon Koruma Plastiği',
    kategori: 'Dış Aksesuar',
    resim: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    aciklama: 'Universal arka tampon koruma plastiği. Bagaj yükleme sırasında çizilmeyi önler.'
  }
];

export const sahteAksesuarlarUret = (kullanicilar: Kullanici[]): Aksesuar[] => {
  const aksesuarlar: Aksesuar[] = [];
  const kullaniciIdleri = kullanicilar.map((k: Kullanici) => k.id);

  for (let i = 0; i < AKSESUAR_VERILERI.length; i++) {
    const veri = AKSESUAR_VERILERI[i];
    const saticiId = kullaniciIdleri[i % kullaniciIdleri.length];
    const fiyat = 500 + Math.floor(Math.random() * 9500);
    const durum: Aksesuar['durum'] = Math.random() > 0.5 ? 'Sıfır' : 'İkinci El';

    const stok = 5 + Math.floor(Math.random() * 46);

    aksesuarlar.push({
      id: `aksesuar-${i + 1}`,
      saticiId,
      ad: veri.ad,
      fiyat,
      durum,
      aciklama: veri.aciklama,
      resimler: [veri.resim],
      kategori: veri.kategori,
      stok
    });
  }

  return aksesuarlar;
};
