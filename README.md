# AraçApp - Mobil Araba ve Aksesuar Piyasası 🚗✨

AraçApp, ikinci el ve sıfır araçların, araç içi/dışı aksesuarların, yedek parçaların alınıp satıldığı, gelişmiş arama ve karşılaştırma özelliklerine sahip olan tam teşekküllü bir mobil pazar yeri uygulamasıdır.

Bu proje **React Native (Expo)** kullanılarak, modern mobil tasarım standartlarına (Glassmorphism, karanlık mod desteği, yumuşak animasyonlar) uygun şekilde geliştirilmiştir.

## 🌟 Öne Çıkan Özellikler

*   **Zengin ve Akıcı UI/UX:** Karanlık ve açık mod desteği, sayfa geçiş animasyonları ve platform bağımsız mükemmel uyumluluk.
*   **Gerçek Zamanlı Karşılaştırma:** Hem araçları hem de aksesuarları aynı anda detaylı teknik tablo üzerinde yan yana karşılaştırma ekranı.
*   **AraçApp Asistan (Chatbot):** Yapay zeka destekli görünüm sunan (kullanıcı dostu arayüzlü) interaktif chatbot asistanı. 
*   **Tam Teşekküllü Yönetim Paneli (Admin Dashboard):** Yöneticiler için satış istatistikleri, stok uyarıları, sipariş yönetimi (bekleyen, iptal, teslim) ve detaylı stok kontrol modülleri.
*   **Dinamik Sepet ve Sipariş Süreci:** Modern animasyonlarla zenginleştirilmiş sepet sistemi, sipariş onayı ve kargo takibi görselleştirmeleri.
*   **Durum Yönetimi:** `Zustand` ile hızlı ve kalıcı (persisted) lokal veri tabanı yönetimi.
*   **Eksiksiz Mobil Uyumluluk:** `SafeArea` kurallarına uyan çentikli ekran (notch) ve Android alt navigasyon (Klavye) için %100 düzeltilmiş form yönetimi.

## 📱 Ekran Görüntüleri ve Görseller

AraçApp, piyasadaki gerçek araba ve ürün görsellerini barındırır (BMW, Tesla, Audi, Mercedes, vb.) 
- *Gerçek zamanlı resim entegrasyonu sayesinde her araç kendi modeliyle eşleşir.*

## 🚀 Kurulum ve Çalıştırma

Projeyi lokal bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edin:

### Ön Gereksinimler
- Node.js (v18+)
- Git
- Expo Go uygulaması (Telefonunuzda)

### Adımlar

1. **Projeyi Klonlayın:**
   ```bash
   git clone https://github.com/solmazgulecren-ux/AracApp.git
   cd AracAppMobil
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   # veya
   npx expo install --fix
   ```

3. **Uygulamayı Başlatın:**
   ```bash
   npx expo start
   ```

4. **Kullanım:** Terminalde açılan QR kodu telefonunuzdaki **Expo Go** uygulamasıyla okutarak uygulamayı anında test edebilirsiniz. 

## 🛠️ Kullanılan Teknolojiler

*   **React Native / Expo:** Ana framework ve geliştirme ortamı.
*   **Expo Router:** Dosya tabanlı (file-based) modern sayfa yönlendirme (navigation).
*   **Zustand:** Kalıcı ve performanslı durum yönetimi (State Management).
*   **Reanimated & Moti:** Yüksek performanslı 60fps animasyonlar ve bileşen geçişleri.
*   **Lucide Icons / Expo Vector Icons:** Vektörel ve yüksek çözünürlüklü ikon kütüphaneleri.

## 👤 Geliştirici & Lisans
Tasarım ve Geliştirme: **Ecren Solmazgül**

Bu proje portfolyo amacı ile açık kaynaklı olarak geliştirilmiştir.
