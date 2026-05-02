# 🎟️ BiletBul Platformu (Sunum Versiyonu)

Merhaba arkadaşlar! Projemizin sunumda efsanevi görünmesi için kullanıcı arayüzünü (UI) ve kullanıcı deneyimini (UX) baştan aşağı yeniledik. Sistem sadece bir "ilan panosu" olmaktan çıkıp, interaktif ve tam teşekküllü bir biletleme platformuna dönüştü. 

Aşağıda projeyi bilgisayarınızda nasıl çalıştıracağınız ve eklenen yeni özellikler yer alıyor.

---

## 🚀 Projeyi Nasıl Çalıştıracaksınız?

Projeyi bilgisayarınızda sorunsuz çalıştırmak için aşağıdaki iki adımı terminalde sırasıyla uygulayın:

**1. Gerekli Paketleri Yükleyin:**
Projeye yeni ikonlar ve eklentiler (lucide-react, react-router-dom vb.) dahil edildiği için önce bunları kurmamız gerekiyor. Terminali açıp şunu yazın:
```bash
npm install
```

**2. Projeyi Başlatın:**
Yükleme bittikten sonra projeyi ayağa kaldırmak için klasik başlatma komutumuzu giriyoruz:
```bash
npm start
```
Bu kadar! Tarayıcınızda `http://localhost:3000` adresinde proje açılacaktır.

---

## ✨ Projeye Neler Eklendi? (Sunumda Gösterilecekler)

Jüriye ve sınıfa sunum yaparken sırasıyla şu özellikleri sergileyebilirsiniz:

### 1. 🎠 Öne Çıkanlar (Hero Slider)
Ana sayfada, o haftanın en popüler 4 etkinliğini gösteren ve 5 saniyede bir otomatik dönen Netflix tarzı devasa bir "Öne Çıkanlar" alanı var.

### 2. 🔍 Akıllı Arama
Üst menüdeki arama çubuğu artık siz harf girdikçe sonuçları dinamik olarak alt tarafta açılır bir listede (dropdown) listeliyor. Sadece etkinlik adına değil, mekana ve sanatçıya göre de arama yapıyor.

### 3. 👤 Üye Girişi ve Biletlerim Sayfası
*   Sağ üstten **Giriş Yap**'a basarak rastgele bir e-posta yazdığınızda sisteme anında o isimle giriş yapmış oluyorsunuz (Sunum rahatlığı için şifre doğrulama devre dışı).
*   Giriş yaptıktan sonra isminize tıklayarak Profilinize gidebilirsiniz.
*   **En Havalı Kısım:** Satın alınan biletler profil sayfasında gerçek bir **Uçak Bileti / Etkinlik Bileti (Boarding Pass)** tasarımıyla, QR kod ve barkod görselleriyle beraber listeleniyor!

### 4. 💺 İnteraktif Koltuk Seçimi
Bir etkinliğin içine girip **Koltuk Seç** dediğinizde ekran kararıyor ve ortada devasa bir **Sinema/Tiyatro Salonu Haritası** açılıyor. Boş koltuklara tıkladıkça yeşil oluyor ve fiyat sağ panelde anlık hesaplanıyor. (Dolu koltuklar her etkinlik için sabittir, sunumda hata çıkmaz).

### 5. 💳 Gerçekçi Ödeme Ekranı (Checkout)
Koltukları seçip "Güvenli Ödeme Yap" butonuna basınca şık bir **Sanal Kredi Kartı** açılıyor. Siz forma isim ve numara yazdıkça, Apple Pay akıcılığında üstteki kart grafiği anlık güncelleniyor. Ödeme bitince başarılı animasyonu çıkıp biletleri hesabınıza ekliyor.

### 6. ⚙️ Yönetim Paneli (Admin Dashboard)
Sağ üstteki "Giriş Yap" butonunun hemen solundaki **Ayarlar İkonuna (⚙️)** tıklarsanız gizli Admin paneline girersiniz. Buradan etkinlik silebilir veya internetten yeni bir resim linki kopyalayarak yepyeni bir etkinlik ekleyebilirsiniz (Eklerken anında önizlemesi çıkar). Veriler `LocalStorage`'da tutulduğu için sayfayı yenileseniz de kaybolmaz.

---
*Başarılar, sunumu parçalayacağınıza eminim! 😎*
