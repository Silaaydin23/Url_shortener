# URL Kısaltma Projesi (URL Shortener API)

Bu projede uzun web adreslerini kısaltan ve yöneten bir RESTful API sistemi geliştirdim. Bitly veya TinyURL benzeri bir yapı kurmaya çalıştım. 
Projenin altyapısında Bun.js ve Elysia framework'ü kullandım. Verileri sağlamak için PostgreSQL veritabanını tercih ettim. 

Projede Kullandığım Teknolojiler : 
-- Bun.js : Projeyi çalıştırmak için kullandım.
-- Elysia.js : Sunucu tarafını yazmak için kullandığım framework.
-- PostgreSQL : Linkleri ve istatistikleri tuttuğum veritabanı.
-- Thunder Client : API isteklerini test etmek için kullandığım VS Code eklentisi.

Projeyi geliştirdikten sonra çalıştırmak için izlediğim adımlar : 

1. Önce gerekli kütüphanelerin yüklenmesi için terminale şu komutu yazdım:
2. ```bash
3. bun install
4. ```

2. Veritabanı bağlantısı için `.env` dosyası oluşturdum ve şifremi buraya ekledim.

3. Sunucuyu aktif etmek içinşu komutu kullandım:
4. ```bash
   bun run index.ts
   ```

4. Tabloları elle açmak yerine yazdığım `/kurulum` rotasını kullandım. tarayıcıdan `http://localhost:3000/kurulum` adresine gidildiğinde `linkler` tablosu otomatik olarak oluşturuluyor.

Test Süreci :
Test sürecinde VS Code içindeki "Thunder Client" eklentisini kullandım.

" POST " isteklerini link kısaltmak için,
" PUT " isteklerini güncellemek için,
" DELETE " isteklerini silmek için bu araç üzerinden gönderdim.

Tüm kodları `ìndex.ts` dosyasında topladım. Sistemin işleyişi kısaca şöyle : 
1. Bağlantı : Kod çalışınca önce `postgres`kütüphanesi ile veritabanina bağlaniyor.
2. Kısaltma işlemi : Kullanıcı POST isteği attığında gelen verinin geçerli bir url olup olmadığına bakılıyor.
   Eğer geçerliyse rastgele 6 haneli bir kod üretilip veritabanına kaydediliyor.
3. Yonlendirme : Kullanıcı oluşturulan kısa linke tıkladığında sistem veritabanından bu kodu buluyor.
   Tıklanma sayısını 1 arttırıp kullanıcıyı orijinal siteye yönlendiriyor.
4. İstatistikler : Linkin ne zaman oluşturulduğu ve kaç kere tıklandığı gibi bilgiler veritabında tutuluyor.

  Projede aktif olarak çalışan adresler : 
* `GET /kurulum` -> Veritabanı tablolarını oluşturuyor.
* `POST /api/kisalt` -> Link kısaltma işlemi yapıyor.
* `GET /:kod` -> Kısa kod girilince asıl siteye yönlendiriyor.
* `GET /api/link/:kod` -> Link bilgilerini ve tıklanma sayısını gösteriyor.
* `PUT /api/link/:kod` -> Linkin gideceği adresi güncelliyor.
* `DELETE /api/link/:kod` -> Linki siliyor.
