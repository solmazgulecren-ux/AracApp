# AraçApp - Proje Dokümantasyonu (WIKI)

AraçApp projesinin altyapısı, sistem mimarisi, ve veri yönetimi ile ilgili temel bilgilere bu sayfadan ulaşabilirsiniz.

## 1. Mimari Genel Bakış
AraçApp, **React Native (Expo)** ve modern hook yapısını kullanmaktadır. Projenin dosya yapısı Expo Router mimarisi temeline göre `app/` klasörü altında şekillenmiştir.

*   `app/(sekmeler)/` - Uygulamanın ana sayfasındaki alt navigasyonları barındırır (İlanlar, Karşılaştırma, Sepet vb.).
*   `bilesenler/` - Tüm sayfalarda tekrar tekrar kullanılan UI bileşenleri (ArabaKart, UstMenu vb.) buradadır.
*   `durum/` - Zustand kullanılarak oluşturulan yerel veri yönetim katmanı.

## 2. Durum Yönetimi (Zustand)
Uygulama, lokal verileri ve kullanıcı oturumlarını saklamak için `zustand` ve `zustand/middleware` `persist` yapısını kullanır.
Tüm arabalar, ürünler, stok, sepet, ve sipariş durumları `kullanimDurum.ts` içerisinde tek bir evrensel store üzerinden yürütülür. 
`AsyncStorage` üzerinden de uygulama kapatılsa bile verilerin hafızada tutulması sağlanır.

## 3. Sahte Veri Entegrasyonu (Mock Data)
Gerçek zamanlı bir veritabanı / sunucu bulunmadığı için uygulama içi tüm ilanlar ve ürünler ilk açılışta `araclar/sahteVeriUret.ts` dosyası üzerinden otomatik (fakat dinamik resimlerle gerçekçi) olarak türetilir.
Dışarıdan (Vikipedi, Unsplash, vb.) toplanan yüksek çözünürlüklü arabalar ve aksesuar linkleri cihazın ekranında proxy (wsrv.nl) aracılığı ile gösterilir (Android kısıtlamalarını aşmak için).

## 4. UI ve Tasarım Prensipleri (Tema)
Uygulamada dinamik olarak **Açık Tema** ve **Koyu Tema** (Dark/Light mode) geçişleri desteklenmektedir. Tasarım kuralları `sabitler/Tema.ts` içinde tanımlanmıştır. 
`SafeAreaView` kullanılarak iPhone çentikli ekranlar (Notch) ve Android alttan kaydırmalı klavye sistemleri ile %100 uyumludur.

## 5. Yönetici (Admin) Paneli
`/admin` rotası ile erişilebilen bu alanda:
* Toplam Ciro, Bekleyen Siparişler ve Kullanıcı sayısı gibi metrikler kart şeklinde sunulur.
* Ürün stoklarının anlık olarak azaltılıp artırılabilmesi sağlanır.
* Onay bekleyen siparişlerin durumu, tek tuşla Teslim Edildi veya İptal Edildi olarak değiştirilir.

Herhangi bir modül üzerinde geliştirmeye başlamadan önce bu yapıların `kullanimDurum.ts` ile olan bağlantılarını incelemeniz tavsiye edilir.
