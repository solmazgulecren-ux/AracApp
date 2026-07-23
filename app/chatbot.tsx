import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Aksesuar, Araba, ChatMesaj } from '../tipler';
import { KullanimDurumTipi, useKullanimDurum } from '../durum/kullanimDurum';

// Otomotiv uzmanı bilgi bankası
const OTOMOTIV_BILGI_BANKASI = {
  aracDetay: (marka: string, model: string) => {
    const lowerMarka = marka.toLowerCase();
    const lowerModel = model.toLowerCase();

    if (lowerMarka.includes('bmw')) {
      if (lowerModel.includes('3')) {
        return {
          motor: "2.0 litrelik TwinPower Turbo beslemeli motor, 184 beygir güç ve 300 Nm tork üretmektedir. 8 ileri Steptronic şanzımanla kombine edilmiştir.",
          icMekan: "iDrive 8 işletim sistemine sahip kavisli ekran (Curved Display), premium Sensatec deri döşemeler ve sürüş odaklı kokpit mimarisiyle son derece teknolojik ve ergonomiktir.",
          surus: "50:50 ağırlık dağılımı, arkadan itişli altyapı ve hassas tepkili direksiyon sistemiyle sınıfının sürüş dinamikleri referans modelidir.",
          yakit: "Şehir dışı 5.2L, şehir içi 7.3L civarında makul bir yakıt tüketimine sahiptir. Bakım maliyetleri premium segment standartlarındadır.",
          kronik: "Eski nesillerdeki zincir ve yağ kaçağı sorunları bu güncel LCI gövdede büyük ölçüde giderilmiştir; ancak elektronik sensör hassasiyetleri devam etmektedir."
        };
      }
      return {
        motor: "BMW TwinPower Turbo motor teknolojisi, yüksek devir çevirme karakteri ve ZF 8-ileri tam otomatik şanzıman uyumuyla üstün performans sunar.",
        icMekan: "BMW Live Cockpit Professional, sezgisel iDrive arayüzü ve mükemmel malzeme kalitesiyle lüks ve teknolojiyi bir arada sunar.",
        surus: "Dinamik Amortisör Kontrolü ve arkadan itiş odaklı xDrive sistemiyle hem sportif hem de konforlu bir sürüş karakteristiğine sahiptir.",
        yakit: "Performansına oranla verimli tüketim sunar. Periyodik bakımları orijinal parça kullanımı gerektirir.",
        kronik: "Yüksek kilometrelerde soğutma sistemi hortumları ve turbo bypass valfi aşınmaları görülebilir."
      };
    }
    if (lowerMarka.includes('mercedes')) {
      if (lowerModel.includes('c')) {
        return {
          motor: "1.5 litrelik turbo beslemeli motor + 48V hafif hibrit (EQ Boost) desteği ile 204 beygir güç ve 300 Nm tork üretir. 9G-Tronic şanzımana sahiptir.",
          icMekan: "S-Serisi esintili dikey 11.9 inçlik MBUX multimedya ekranı, ambiyans aydınlatması ve ultra lüks malzeme kalitesiyle segmentinin en görkemli iç mekanına sahiptir.",
          surus: "Konfor odaklı süspansiyon geometrisi, başarılı yalıtım ve stabil düz hat dengesiyle uzun yolculuklarda üst düzey konfor sunar.",
          yakit: "Hafif hibrit sistemi sayesinde şehir içi dur-kalk trafiğinde yakıtı optimize eder; ortalama 6.5L/100km tüketim sunar.",
          kronik: "MBUX yazılımında nadiren kilitlenmeler ve trim sesleri ilk üretim yıllarında kullanıcılar tarafından raporlanmıştır."
        };
      }
      return {
        motor: "EQ Boost teknolojisine sahip verimli motorlar ve pürüzsüz geçişli 9G-Tronic şanzıman kombinasyonu ile kesintisiz güç sağlar.",
        icMekan: "Geniş dijital ekranlar, yüksek çözünürlüklü göstergeler, ahşap ve deri detayların uyumu ile konfor odaklı bir yaşam alanı sunar.",
        surus: "Yol bozukluklarını sönümleyen süspansiyon yapısı ve yüksek hızlarda sağladığı kararlılıkla konfor öncelikli bir sürüş sunar.",
        yakit: "Hafif hibrit mimarisi tüketimi dengeler. Yetkili servis bakımları bütçe planlaması gerektirir.",
        kronik: "Karmaşık elektrik mimarisi nedeniyle akü voltaj dalgalanmalarına karşı hassastır."
      };
    }
    if (lowerMarka.includes('audi')) {
      if (lowerModel.includes('a4') || lowerModel.includes('q5')) {
        return {
          motor: "2.0 litrelik TDI veya TFSI motor seçenekleri, 190-204 beygir güç aralığı ve 7 ileri pürüzsüz S-Tronic çift kavramalı şanzımana sahiptir.",
          icMekan: "Audi Virtual Cockpit, sade ve fonksiyonel konsol tasarımı, MMI touch kontrol ekranı ve kusursuz işçilik kalitesiyle dikkat çeker.",
          surus: "Efsanevi quattro dört tekerlekten çekiş sistemi sayesinde her türlü yol koşulunda benzersiz bir yol tutuşu ve güvenlik sunar.",
          yakit: "Özellikle TDI motor seçeneğiyle uzun yolda 4.8L gibi şaşırtıcı derecede düşük tüketim verilerine ulaşabilir.",
          kronik: "S-Tronic şanzımanın mekatronik ünitesi ve yoğun trafikte ısınma eğilimi periyodik olarak kontrol edilmelidir."
        };
      }
    }
    if (lowerMarka.includes('tesla')) {
      return {
        motor: "Çift motorlu dört tekerlekten çekiş (AWD) altyapısı, anlık tork iletimi ve 0-100 km/s hızlanmasını 4 saniyenin altında tamamlayan elektrikli güç ünitesi.",
        icMekan: "Tüm araç fonksiyonlarının yönetildiği 15 inçlik merkezi dokunmatik ekran, minimalist konsol ve cam tavan tasarımı.",
        surus: "Gövde altına konumlandırılmış bataryalar sayesinde son derece düşük ağırlık merkezi ve go-kart hissi veren viraj kabiliyeti.",
        yakit: "Yüksek enerji verimliliği. Evden şarjda inanılmaz ekonomik, Supercharger ağında hızlı şarj imkanı sunar.",
        kronik: "İlk üretim serilerinde panel boşlukları (panel gaps) ve kabin içi rüzgar yalıtımı zafiyetleri gözlenmiştir."
      };
    }
    
    // Varsayılan genel otomotiv bilgisi
    return {
      motor: "Gelişmiş yakıt enjeksiyonu ve turboşarj teknolojisine sahip motor, optimum güç ve tork eğrisi ile akıcı hızlanma sunar.",
      icMekan: "Ergonomik koltuk tasarımı, güncel bağlantı özellikleri barındıran bilgi-eğlence sistemi ve kullanışlı saklama alanları sunar.",
      surus: "Dengeli ağırlık dağılımı, stabil viraj performansı ve günlük kullanıma uygun konfor-sportiflik dengesi mevcuttur.",
      yakit: "Aerodinamik gövde yapısı sayesinde segment standartlarında yakıt ekonomisi ve sürdürülebilir bakım maliyetleri sunar.",
      kronik: "Belirgin kronik bir sorunu olmamakla birlikte, düzenli sıvı ve filtre bakımları motor ömrü için kritiktir."
    };
  }
};

// Bot yanıt üretici - Kıdemli Otomotiv Uzmanı System Prompt
const botYanitUret = (
  mesaj: string,
  arabalar: Araba[],
  aksesuarlar: Aksesuar[]
): { metin: string; tip: ChatMesaj['tip']; karsilastirmaVerileri?: Araba[]; aramaVerileri?: (Araba | Aksesuar)[] } => {
  const kucukMesaj = mesaj.toLowerCase().replace(/[ıİ]/g, (c) => c === 'ı' ? 'i' : 'i');

  // Karşılaştırma komutu
  const karsilastirmaRegex = /(.+)\s+(ile|vs|ve)\s+(.+)\s*(karşılaştır|kıyasla|karsilastir|kiyasla)/i;
  const karsilastirmaRegex2 = /(karşılaştır|kıyasla|karsilastir|kiyasla)\s+(.+)\s+(ile|vs|ve)\s+(.+)/i;

  let eslesme = mesaj.match(karsilastirmaRegex) || mesaj.match(karsilastirmaRegex2);

  if (eslesme) {
    let arac1Adi: string, arac2Adi: string;
    if (mesaj.match(karsilastirmaRegex)) {
      arac1Adi = eslesme[1].trim().toLowerCase();
      arac2Adi = eslesme[3].trim().toLowerCase();
    } else {
      arac1Adi = eslesme[2].trim().toLowerCase();
      arac2Adi = eslesme[4].trim().toLowerCase();
    }

    const arac1 = arabalar.find((a: Araba) =>
      `${a.marka} ${a.model}`.toLowerCase().includes(arac1Adi) ||
      a.marka.toLowerCase().includes(arac1Adi) ||
      a.model.toLowerCase().includes(arac1Adi)
    );
    const arac2 = arabalar.find((a: Araba) =>
      `${a.marka} ${a.model}`.toLowerCase().includes(arac2Adi) ||
      a.marka.toLowerCase().includes(arac2Adi) ||
      a.model.toLowerCase().includes(arac2Adi)
    );

    if (arac1 && arac2) {
      const detay1 = OTOMOTIV_BILGI_BANKASI.aracDetay(arac1.marka, arac1.model);
      const detay2 = OTOMOTIV_BILGI_BANKASI.aracDetay(arac2.marka, arac2.model);

      const karsilastirmaMetni = `📋 Kapsamlı Otomotiv Uzmanı Karşılaştırma Raporu:
──────────────────────────────
🚗 ${arac1.marka} ${arac1.model} vs 🚙 ${arac2.marka} ${arac2.model}

⚙️ MOTOR VE PERFORMANS
• ${arac1.marka} ${arac1.model}: ${detay1.motor}
• ${arac2.marka} ${arac2.model}: ${detay2.motor}

📱 İÇ MEKAN VE TEKNOLOJİ
• ${arac1.marka} ${arac1.model}: ${detay1.icMekan}
• ${arac2.marka} ${arac2.model}: ${detay2.icMekan}

🏁 SÜRÜŞ DİNAMİKLERİ
• ${arac1.marka} ${arac1.model}: ${detay1.surus}
• ${arac2.marka} ${arac2.model}: ${detay2.surus}

⛽ YAKIT VE BAKIM
• ${arac1.marka} ${arac1.model}: ${detay1.yakit}
• ${arac2.marka} ${arac2.model}: ${detay2.yakit}

⚠️ KRONİK SORUNLAR / EDİTÖR NOTU
• ${arac1.marka} ${arac1.model}: ${detay1.kronik}
• ${arac2.marka} ${arac2.model}: ${detay2.kronik}

──────────────────────────────
Editör Kararı: Her iki araç da kendi segmentinde çok güçlü karakterlere sahip. Daha dinamik bir sürüş deneyimi arayanlar ${arac1.marka}'yı, konfor ve teknolojik kabini önceliklendirenler ${arac2.marka}'yı tercih edebilir.`;

      return {
        metin: karsilastirmaMetni,
        tip: 'karsilastirma',
        karsilastirmaVerileri: [arac1, arac2]
      };
    } else {
      // Eğer veritabanında tam bulamadıysa ama premium markalarsa genel otomotiv uzmanı bilgisiyle kıyasla
      return {
        metin: `Aradığınız araçlardan birini veritabanımda bulamadım. Lütfen mevcut araç listemizden seçim yapın veya tam marka/model belirtin.\n\nMevcut markalar: Toyota, Honda, Ford, BMW, Mercedes-Benz, Audi, Tesla, Nissan, Hyundai, Chevrolet`,
        tip: 'normal'
      };
    }
  }

  // Araç arama
  const aramaKelimeleri = ['ara', 'bul', 'göster', 'listele', 'var mı', 'goster'];
  const aramaYapiliyorMu = aramaKelimeleri.some(k => kucukMesaj.includes(k));

  if (aramaYapiliyorMu) {
    // Marka/model arama
    const bulunanAraclar = arabalar.filter((a: Araba) =>
      kucukMesaj.includes(a.marka.toLowerCase()) ||
      kucukMesaj.includes(a.model.toLowerCase())
    ).slice(0, 5);

    if (bulunanAraclar.length > 0) {
      return {
        metin: `🚗 Kıdemli Otomotiv Editörü Analizi:\n\nAradığınız kriterlere uygun ${bulunanAraclar.length} adet araç listelenmiştir. Bu modeller yüksek ikinci el değeri, sürüş kararlılığı ve zengin donanımlarıyla bilinir. Detaylar için incele butonlarını kullanabilirsiniz.`,
        tip: 'arama',
        aramaVerileri: bulunanAraclar
      };
    }

    // Aksesuar arama
    const bulunanAksesuarlar = aksesuarlar.filter((a: Aksesuar) => {
      const adKucuk = a.ad.toLowerCase();
      const kategoriKucuk = (a.kategori || '').toLowerCase();
      return kucukMesaj.split(' ').some((kelime: string) =>
        kelime.length > 2 && (adKucuk.includes(kelime) || kategoriKucuk.includes(kelime))
      );
    }).slice(0, 5);

    if (bulunanAksesuarlar.length > 0) {
      return {
        metin: `🔧 Aksesuar ve Donanım Önerileri:\n\nAracınızın konforunu ve değerini artıracak ${bulunanAksesuarlar.length} adet premium aksesuar bulunmuştur. Ürün detaylarından malzeme kalitesi ve montaj detaylarını inceleyebilirsiniz.`,
        tip: 'arama',
        aramaVerileri: bulunanAksesuarlar
      };
    }

    return {
      metin: `Aramanızla tam eşleşen bir araç veya aksesuar kaydı bulunamadı. Lütfen "BMW ara", "lastik bul" veya "C-Class göster" şeklinde sorgulayın.`,
      tip: 'normal'
    };
  }

  // Fiyat sorgusu
  if (kucukMesaj.includes('fiyat') || kucukMesaj.includes('ucuz') || kucukMesaj.includes('pahalı') || kucukMesaj.includes('pahali')) {
    if (kucukMesaj.includes('ucuz')) {
      const enUcuz = [...arabalar].sort((a, b) => a.fiyat - b.fiyat).slice(0, 3);
      return {
        metin: `💰 Fiyat/Performans Odaklı Araçlarımız:\n\nBütçe dostu, düşük bakım maliyetleri ve yüksek yakıt ekonomisi sunan en makul seçenekler listelenmiştir:`,
        tip: 'arama',
        aramaVerileri: enUcuz
      };
    }
    if (kucukMesaj.includes('pahalı') || kucukMesaj.includes('pahali')) {
      const enPahali = [...arabalar].sort((a, b) => b.fiyat - a.fiyat).slice(0, 3);
      return {
        metin: `💎 Premium ve Prestij Sınıfı Araçlarımız:\n\nÜst düzey teknoloji, maksimum konfor ve benzersiz sürüş dinamikleri sunan elit portföyümüz:`,
        tip: 'arama',
        aramaVerileri: enPahali
      };
    }
  }

  // İstatistik
  if (kucukMesaj.includes('kaç') || kucukMesaj.includes('istatistik') || kucukMesaj.includes('özet') || kucukMesaj.includes('bilgi')) {
    const ortalamFiyat = Math.round(arabalar.reduce((t, a) => t + a.fiyat, 0) / arabalar.length);
    return {
      metin: `📊 Portföy Analitik Raporu:\n\n🚗 Aktif İlan Havuzu: ${arabalar.length} araç\n🔧 Envanterdeki Aksesuar: ${aksesuarlar.length} adet\n💰 Ortalama Piyasa Değeri: ${ortalamFiyat.toLocaleString('tr-TR')} ₺\n🏷️ Minimum Fiyat Eşiği: ${Math.min(...arabalar.map(a => a.fiyat)).toLocaleString('tr-TR')} ₺\n💎 Maksimum Fiyat Eşiği: ${Math.max(...arabalar.map(a => a.fiyat)).toLocaleString('tr-TR')} ₺`,
      tip: 'normal'
    };
  }

  // Yardım / Selam
  if (kucukMesaj.includes('merhaba') || kucukMesaj.includes('selam') || kucukMesaj.includes('hey')) {
    return {
      metin: `Merhaba! Ben AracApp Kıdemli Otomotiv Asistanınız. 🏎️\n\nSize segment analizleri, motor performans karşılaştırmaları, aksesuar önerileri ve fiyat analizlerinde rehberlik etmek için buradayım.\n\nNasıl yardımcı olabilirim? (Örn: "BMW 3 Series ile Mercedes-Benz C-Class karşılaştır", "en ucuz araçlar")`,
      tip: 'normal'
    };
  }

  // Varsayılan yanıt
  return {
    metin: `Anlayamadım. Ben bir Otomotiv Uzmanıyım, araçları karşılaştırabilir (örn: "BMW 3 Series ile Mercedes-Benz C-Class karşılaştır"), teknik detaylar verebilir veya arama yapabilirim. Lütfen sorunuzu bu doğrultuda güncelleyin.`,
    tip: 'normal'
  };
};

export default function ChatbotEkrani() {
  const router = useRouter();
  const arabalar = useKullanimDurum((state: KullanimDurumTipi) => state.arabalar);
  const aksesuarlar = useKullanimDurum((state: KullanimDurumTipi) => state.aksesuarlar);
  const karanlikMod = useKullanimDurum((state: KullanimDurumTipi) => state.karanlikMod);
  const insets = useSafeAreaInsets();

  const [mesajlar, setMesajlar] = useState<ChatMesaj[]>([
    {
      id: 'hosgeldin',
      gonderen: 'bot',
      metin: 'Merhaba! Ben AracApp Kıdemli Otomotiv Uzmanı asistanınızım. 🏎️\n\nBMW, Mercedes, Audi ve Tesla gibi markaların tüm detaylarını analiz edebilir, araçları kıyaslayabilir ve en uygun aksesuarları bulabilirim.\n\nHangi iki aracı karşılaştırmak istersiniz?',
      tip: 'normal',
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [girdi, setGirdi] = useState('');
  const [yaziyor, setYaziyor] = useState(false);
  const listeRef = useRef<FlatList>(null);

  // Klavye açıldığında listenin en alta kaydırılması
  useEffect(() => {
    const klavyeGoster = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        listeRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
    return () => {
      klavyeGoster.remove();
    };
  }, []);

  const mesajGonder = () => {
    if (!girdi.trim()) return;

    const kullaniciMesaji: ChatMesaj = {
      id: `msg-${Date.now()}`,
      gonderen: 'kullanici',
      metin: girdi.trim(),
      tip: 'normal',
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setMesajlar(prev => [...prev, kullaniciMesaji]);
    const gonderilecekMesaj = girdi.trim();
    setGirdi('');
    setYaziyor(true);

    setTimeout(() => {
      listeRef.current?.scrollToEnd({ animated: true });
    }, 50);

    // Bot yanıt gecikmesi
    setTimeout(() => {
      const yanit = botYanitUret(gonderilecekMesaj, arabalar, aksesuarlar);
      const botMesaji: ChatMesaj = {
        id: `msg-${Date.now()}-bot`,
        gonderen: 'bot',
        metin: yanit.metin,
        tip: yanit.tip,
        karsilastirmaVerileri: yanit.karsilastirmaVerileri,
        aramaVerileri: yanit.aramaVerileri,
        zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      };
      setMesajlar(prev => [...prev, botMesaji]);
      setYaziyor(false);
      
      setTimeout(() => {
        listeRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1200);
  };

  const hizliOneriButonlari = [
    { metin: '🏁 BMW 3 vs Mercedes C', komut: 'BMW 3 Series ile Mercedes-Benz C-Class karşılaştır' },
    { metin: '⚡ Tesla Model 3 vs Model Y', komut: 'Tesla Model 3 ile Tesla Model Y karşılaştır' },
    { metin: '🔧 Aksesuar Bul', komut: 'paspas bul' },
    { metin: '📊 Portföy Bilgisi', komut: 'uygulama bilgi' },
  ];

  // Araç karşılaştırma kartı
  const KarsilastirmaKarti = ({ araba }: { araba: Araba }) => (
    <TouchableOpacity
      style={[stiller.karsilastirmaKart, karanlikMod && stiller.kartKaranlik]}
      onPress={() => router.push(`/araba/${araba.id}` as any)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: araba.resimler[0] }} style={stiller.karsilastirmaResim} />
      <Text style={[stiller.karsilastirmaBaslik, karanlikMod && stiller.metinKaranlik]} numberOfLines={1}>
        {araba.marka} {araba.model}
      </Text>
      <Text style={stiller.karsilastirmaFiyat}>{araba.fiyat.toLocaleString('tr-TR')} ₺</Text>
      <View style={stiller.ozelliklerAlani}>
        <Text style={[stiller.miniOzellik, karanlikMod && stiller.metinSoluk]}>📅 {araba.yil}</Text>
        <Text style={[stiller.miniOzellik, karanlikMod && stiller.metinSoluk]}>⚙️ {araba.vites}</Text>
        <Text style={[stiller.miniOzellik, karanlikMod && stiller.metinSoluk]}>⛽ {araba.yakitTuru}</Text>
        <Text style={[stiller.miniOzellik, karanlikMod && stiller.metinSoluk]}>🛣️ {araba.kilometre.toLocaleString('tr-TR')} km</Text>
      </View>
      <View style={stiller.inceleButonMini}>
        <Ionicons name="eye-outline" size={12} color="#FFF" />
        <Text style={stiller.inceleMetinMini}>İncele</Text>
      </View>
    </TouchableOpacity>
  );

  // Arama sonucu kartı
  const AramaSonucKarti = ({ item }: { item: Araba | Aksesuar }) => {
    const arabaItem = item as Araba;
    const aksesuarItem = item as Aksesuar;
    const arabamiDir = 'marka' in item;

    return (
      <TouchableOpacity
        style={[stiller.aramaSonucKart, karanlikMod && stiller.kartKaranlik]}
        onPress={() => router.push((arabamiDir ? `/araba/${item.id}` : `/aksesuar/${item.id}`) as any)}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: item.resimler[0] }}
          style={stiller.aramaSonucResim}
        />
        <View style={stiller.aramaSonucIcerik}>
          <Text style={[stiller.aramaSonucBaslik, karanlikMod && stiller.metinKaranlik]} numberOfLines={1}>
            {arabamiDir ? `${arabaItem.marka} ${arabaItem.model}` : aksesuarItem.ad}
          </Text>
          <Text style={stiller.aramaSonucFiyat}>
            {item.fiyat.toLocaleString('tr-TR')} ₺
          </Text>
          {arabamiDir && (
            <Text style={[stiller.aramaSonucDetay, karanlikMod && stiller.metinSoluk]}>
              {arabaItem.yil} • {arabaItem.vites} • {arabaItem.yakitTuru}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={karanlikMod ? '#666' : '#CCC'} />
      </TouchableOpacity>
    );
  };

  const MesajBalonu = ({ item }: { item: ChatMesaj }) => {
    const kullaniciMi = item.gonderen === 'kullanici';

    return (
      <View style={[stiller.mesajSatir, kullaniciMi && stiller.mesajSatirKullanici]}>
        {!kullaniciMi && (
          <View style={stiller.botAvatar}>
            <Ionicons name="car-sport" size={18} color="#FFF" />
          </View>
        )}
        <View style={stiller.mesajIcerik}>
          <View style={[
            stiller.mesajBalon,
            kullaniciMi ? stiller.kullaniciBalonRenk : (karanlikMod ? stiller.botBalonKaranlik : stiller.botBalonRenk)
          ]}>
            <Text style={[
              stiller.mesajMetin,
              kullaniciMi ? stiller.kullaniciMetinRenk : (karanlikMod ? stiller.metinKaranlik : { color: '#333' })
            ]}>
              {item.metin}
            </Text>
          </View>

          {/* Karşılaştırma kartları */}
          {item.tip === 'karsilastirma' && item.karsilastirmaVerileri && (
            <View>
              <View style={stiller.karsilastirmaAlani}>
                {item.karsilastirmaVerileri.map((araba: Araba) => (
                  <KarsilastirmaKarti key={araba.id} araba={araba} />
                ))}
              </View>

              {/* Dinamik ve Akıllı Karşılaştırma UI Buton Grubu Entegrasyonu */}
              <View style={stiller.incelemeButonlarGrup}>
                <Text style={[stiller.incelemeButonlarGrupBaslik, karanlikMod && stiller.metinKaranlik]}>
                  🚗 Bu Araçları Detaylı İncele:
                </Text>
                <View style={stiller.incelemeButonlarSatir}>
                  {item.karsilastirmaVerileri.map((araba: Araba) => (
                    <TouchableOpacity
                      key={`yonlendir-${araba.id}`}
                      style={stiller.incelemeYonlendirButon}
                      onPress={() => router.push(`/araba/${araba.id}` as any)}
                    >
                      <Ionicons name="search-outline" size={12} color="#FFF" style={{ marginRight: 4 }} />
                      <Text style={stiller.incelemeYonlendirMetin} numberOfLines={1}>
                        {araba.marka}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Arama sonuçları */}
          {item.tip === 'arama' && item.aramaVerileri && (
            <View style={stiller.aramaSonuclari}>
              {item.aramaVerileri.map((sonuc) => (
                <AramaSonucKarti key={sonuc.id} item={sonuc} />
              ))}
            </View>
          )}

          <Text style={[stiller.zamanMetni, karanlikMod && stiller.metinSoluk]}>
            {item.zaman}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[
        stiller.anaKutu, 
        karanlikMod && stiller.anaKutuKaranlik,
        Platform.OS === 'web' && { maxWidth: 900, alignSelf: 'center', width: '100%', borderWidth: 1, borderColor: karanlikMod ? '#2A2A3E' : '#E4E7EB' }
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={[stiller.baslikAlani, insets.top > 0 && { paddingTop: insets.top + 10 }, karanlikMod && stiller.baslikAlaniKaranlik]}>
        <TouchableOpacity onPress={() => router.back()} style={stiller.geriButon}>
          <Ionicons name="arrow-back" size={24} color={karanlikMod ? '#FFF' : '#333'} />
        </TouchableOpacity>
        <View style={stiller.baslikOrta}>
          <View style={stiller.botIkon}>
            <Ionicons name="car-sport" size={20} color="#FFF" />
          </View>
          <View>
            <Text style={[stiller.baslikMetin, karanlikMod && stiller.metinKaranlik]}>AracApp Otomotiv Uzmanı</Text>
            <Text style={[stiller.altBaslik, karanlikMod && stiller.metinSoluk]}>Yapay Zeka Editörü</Text>
          </View>
        </View>
      </View>

      {/* Mesaj Listesi */}
      <FlatList
        ref={listeRef}
        data={mesajlar}
        keyExtractor={item => item.id}
        renderItem={MesajBalonu}
        contentContainerStyle={stiller.mesajListesi}
        onContentSizeChange={() => listeRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => listeRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={yaziyor ? (
          <View style={stiller.yaziyorAlani}>
            <View style={stiller.botAvatar}>
              <Ionicons name="car-sport" size={18} color="#FFF" />
            </View>
            <View style={[stiller.yaziyorBalon, karanlikMod && stiller.botBalonKaranlik]}>
              <Text style={[stiller.yaziyorMetin, karanlikMod && stiller.metinSoluk]}>Editör analiz ediyor...</Text>
            </View>
          </View>
        ) : null}
      />

      {/* Hızlı Öneriler */}
      <View style={stiller.oneriAlani}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={hizliOneriButonlari}
          keyExtractor={(item, i) => `oneri-${i}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[stiller.oneriButon, karanlikMod && stiller.oneriButonKaranlik]}
              onPress={() => {
                setGirdi(item.komut);
              }}
            >
              <Text style={[stiller.oneriMetin, karanlikMod && stiller.metinKaranlik]}>{item.metin}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={stiller.oneriListe}
        />
      </View>

      {/* Mesaj Yazma Alanı */}
      <View style={[
        stiller.girdiAlani, 
        karanlikMod && stiller.girdiAlaniKaranlik,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }
      ]}>
        <TextInput
          style={[stiller.mesajGirdi, karanlikMod && stiller.mesajGirdiKaranlik]}
          placeholder="Bir mesaj yazın..."
          placeholderTextColor={karanlikMod ? '#666' : '#999'}
          value={girdi}
          onChangeText={setGirdi}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[stiller.gonderButon, !girdi.trim() && stiller.gonderButonPasif]}
          onPress={mesajGonder}
          disabled={!girdi.trim() || yaziyor}
        >
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const stiller = StyleSheet.create({
  anaKutu: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  anaKutuKaranlik: {
    backgroundColor: '#0F0F1A',
  },
  baslikAlani: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    ...(Platform.OS === 'web' ? { maxWidth: 900, alignSelf: 'center', width: '100%' } : {})
  },
  baslikAlaniKaranlik: {
    backgroundColor: '#1A1A2E',
    borderBottomColor: '#2A2A3E',
  },
  geriButon: {
    marginRight: 12,
    padding: 4,
  },
  baslikOrta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botIkon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1B4DFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  baslikMetin: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  altBaslik: {
    fontSize: 12,
    color: '#8B8FA3',
  },
  mesajListesi: {
    padding: 15,
    paddingBottom: 10,
  },
  mesajSatir: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  mesajSatirKullanici: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1B4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  mesajIcerik: {
    maxWidth: '78%',
  },
  mesajBalon: {
    padding: 12,
    borderRadius: 18,
  },
  kullaniciBalonRenk: {
    backgroundColor: '#1B4DFF',
    borderBottomRightRadius: 4,
  },
  botBalonRenk: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  botBalonKaranlik: {
    backgroundColor: '#1A1A2E',
  },
  mesajMetin: {
    fontSize: 15,
    lineHeight: 22,
  },
  kullaniciMetinRenk: {
    color: '#FFF',
  },
  zamanMetni: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    marginLeft: 4,
  },
  // Karşılaştırma kartları
  karsilastirmaAlani: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  karsilastirmaKart: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  kartKaranlik: {
    backgroundColor: '#1A1A2E',
  },
  karsilastirmaResim: {
    width: '100%',
    height: 90,
  },
  karsilastirmaBaslik: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  karsilastirmaFiyat: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B4DFF',
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  ozelliklerAlani: {
    padding: 8,
    gap: 2,
  },
  miniOzellik: {
    fontSize: 10,
    color: '#666',
  },
  inceleButonMini: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B4DFF',
    paddingVertical: 6,
    gap: 4,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  inceleMetinMini: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Arama sonuçları
  aramaSonuclari: {
    marginTop: 8,
    gap: 6,
  },
  aramaSonucKart: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  aramaSonucResim: {
    width: 60,
    height: 60,
  },
  aramaSonucIcerik: {
    flex: 1,
    padding: 10,
  },
  aramaSonucBaslik: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  aramaSonucFiyat: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B4DFF',
    marginTop: 2,
  },
  aramaSonucDetay: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  // Yazıyor animasyonu
  yaziyorAlani: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  yaziyorBalon: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  yaziyorMetin: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  // Hızlı öneriler
  oneriAlani: {
    borderTopWidth: 1,
    borderTopColor: '#E4E7EB',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    ...(Platform.OS === 'web' ? { maxWidth: 900, alignSelf: 'center', width: '100%' } : {})
  },
  oneriListe: {
    paddingHorizontal: 15,
    gap: 8,
  },
  oneriButon: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F0F4FF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0DCFF',
  },
  oneriButonKaranlik: {
    backgroundColor: '#1A1A2E',
    borderColor: '#2A2A3E',
  },
  oneriMetin: {
    fontSize: 13,
    color: '#1B4DFF',
    fontWeight: '600',
  },
  // Mesaj yazma alanı
  girdiAlani: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 30,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E7EB',
    gap: 10,
    ...(Platform.OS === 'web' ? { maxWidth: 900, alignSelf: 'center', width: '100%' } : {})
  },
  girdiAlaniKaranlik: {
    backgroundColor: '#1A1A2E',
    borderTopColor: '#2A2A3E',
  },
  mesajGirdi: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    maxHeight: 100,
    color: '#333',
  },
  mesajGirdiKaranlik: {
    backgroundColor: '#0F0F1A',
    color: '#FFF',
  },
  gonderButon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1B4DFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gonderButonPasif: {
    backgroundColor: '#A0B4FF',
  },
  metinKaranlik: {
    color: '#EAEAEA',
  },
  metinSoluk: {
    color: '#8B8FA3',
  },
  incelemeButonlarGrup: {
    marginTop: 12,
    backgroundColor: 'rgba(27, 77, 255, 0.05)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(27, 77, 255, 0.1)',
  },
  incelemeButonlarGrupBaslik: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1B4DFF',
    marginBottom: 8,
  },
  incelemeButonlarSatir: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  incelemeYonlendirButon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B4DFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  incelemeYonlendirMetin: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
