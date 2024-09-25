
# **_Tarım Kredi Projesi_**

Bu proje, Spring Boot ve React kullanılarak geliştirilmiş bir web uygulamasıdır. Proje, tarım ve bitki yetiştiriciliği süreçlerini yönetmek ve izlemek amacıyla geliştirilmiştir. Kullanıcılar, ekim alanlarını, hasat bilgilerini ve ürünlerin değerlendirmelerini kolayca takip edebilirler.

### **_Özellikler_**

* Arazi Yönetimi: Arazilerin listelenmesi, ekim ve hasat bilgileri.
* Ürün Değerlendirme: Ürünlerin kalite ve miktar değerlendirmelerinin yapılması.
* Analiz ve Raporlama: Ürünlerin performans analizi ve görselleştirme.
* Sayfalama ve Filtreleme: Araziler, ekimler ve hasatlar üzerinde gelişmiş filtreleme ve sayfalama özellikleri.
  
### **_Kullanılan Teknolojiler_**


* Backend: Spring Boot
* Frontend: React
* Veritabanı: PostgreSQL
* Diğer Araçlar: JWT, Axios, React-Router, Chart.js

  
### **_Gereksinimler:_**

Bu projeyi çalıştırabilmek için aşağıdaki yazılımların sisteminizde kurulu olması gerekmektedir:

* Java 11 veya üstü
* Maven
* Node.js ve npm
* Veritabanı (MySQL, PostgreSQL vb.)  


## Kurulum ve Çalıştırma

### Backend (Spring Boot)

**1- Proje Dizini:**
```bash
cd backend

```
**2- Bağımlılıkları Yükleyin:**
```bash
mvn clean install

```
**3-Veritabanı Ayarlarını Yapın: application.properties dosyasını açarak veritabanı bilgilerinizi girin:**
```bash
spring.application.name=TarimKrediProjem

# JPA ve Hibernate Yap?land?rmalar?
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Veri Kayna?? (DataSource) Yap?land?rmas?
spring.datasource.url=jdbc:postgresql://localhost:5432/ttk
spring.datasource.username=postgres
spring.datasource.password=123456

# JPA Do?rulama Modu
spring.jpa.properties.javax.persistence.validation.mode=none

# Maksimum Dosya Yükleme Boyutu
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB

# Dosya Yükleme Dizini
file.upload-dir=C:/Users/ercan kara/IdeaProjects/TarimKrediProjem/frontend/src/assets/LandList

```
**4-Uygulamayı Başlatın**

### **_React_**

 **1-Frontend Dizini:**

```bash
cd frontend

```
**2-Bağımlılıkları Yükleyin:**

```bash
npm install
```
**3-Uygulamayı Başlatın:**

```bash
npm run dev
```
## Veri Tabanına eklenmesi gerekenler
**Kategoriler için**
```bash
INSERT INTO categories (id, category_name) VALUES
(1, 'Tahıllar'),
(2, 'Meyveler'),
(3, 'Sebzeler'),
(4, 'Baklagiller'),
(5, 'Yağlı Tohumlar'),
(6, 'Şifalı Bitkiler'),
(7, 'Yem Bitkileri'),
(8, 'Baharatlar'),
(9, 'Çiçekler'),
(10, 'Endüstriyel Bitkiler');
```
**Bitkiler için**
```bash
INSERT INTO plants (id, name, category_id) VALUES
(1, 'Buğday', 1),
(2, 'Arpa', 1),
(3, 'Mısır', 1),
(4, 'Yulaf', 1),
(5, 'Çavdar', 1),
(6, 'Elma', 2),
(7, 'Armut', 2),
(8, 'Kiraz', 2),
(9, 'Vişne', 2),
(10, 'Şeftali', 2),
(11, 'Domates', 3),
(12, 'Salatalık', 3),
(13, 'Biber', 3),
(14, 'Patlıcan', 3),
(15, 'Havuç', 3),
(16, 'Nohut', 4),
(17, 'Mercimek', 4),
(18, 'Fasulye', 4),
(19, 'Bakla', 4),
(20, 'Bezelye', 4),
(21, 'Ayçiçeği', 5),
(22, 'Soya Fasulyesi', 5),
(23, 'Kanola', 5),
(24, 'Pamuk', 5),
(25, 'Susam', 5),
(26, 'Nane', 6),
(27, 'Adaçayı', 6),
(28, 'Melisa', 6),
(29, 'Kekik', 6),
(30, 'Civanperçemi', 6),
(31, 'Yonca', 7),
(32, 'Korunga', 7),
(33, 'Fiğ', 7),
(34, 'Yemlik', 7),
(35, 'Çayır Üçgülü', 7),
(36, 'Kimyon', 8),
(37, 'Anason', 8),
(38, 'Rezene', 8),
(39, 'Kişniş', 8),
(40, 'Çörekotu', 8),
(41, 'Gül', 9),
(42, 'Lale', 9),
(43, 'Sümbül', 9),
(44, 'Menekşe', 9),
(45, 'Papatya', 9),
(46, 'Pamuk', 10),
(47, 'Tütün', 10),
(48, 'Şeker Pancarı', 10),
(49, 'Keten', 10),
(50, 'Kenevir', 10);
```
## Katkıda Bulunma
**Katkıda bulunmak isterseniz, lütfen bir issue açarak önerilerinizi paylaşın. Pull request'ler memnuniyetle karşılanır!**

## Lisans

**Bu proje MIT lisansı ile lisanslanmıştır. Daha fazla bilgi için LICENSE dosyasına göz atabilirsiniz.**

## İletişim

**Proje hakkında sorularınız veya önerileriniz varsa, benimle [karae0618@gmail.com] üzerinden iletişime geçebilirsiniz.**

## **Projeye Ait Bazı Görseller**



