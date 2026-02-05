import { Elysia } from 'elysia';
import postgres from 'postgres';

const sql = postgres({
    host: 'localhost',      
    port: 5432,             
    database: 'postgres',   
    username: 'postgres',   
    password: process.env.DB_PASSWORD,     
});


function kodUret(uzunluk: number) {
    const harfler = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let sonuc = '';
    for ( let i = 0; i < uzunluk; i++ ) {
        const rastgeleSayi = Math.floor(Math.random() * harfler.length);
        sonuc += harfler.charAt(rastgeleSayi);
    }
    return sonuc;
}

const app= new Elysia();

app.get('/kurulum', async () => {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS linkler (
                id SERIAL PRIMARY KEY,
                uzun_link TEXT NOT NULL,
                kisa_kod VARCHAR(10) UNIQUE NOT NULL,
                tiklanma_sayisi INTEGER DEFAULT 0,
                eklenme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                guncellenme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        return "Tablo basariyla olusturuldu";
    } catch (hata) {
        return "Tablo olusturulurken hata: " + hata;
    }
});

app.get('/', async () => {
    
    const sonuc = await sql`SELECT NOW()`;
    console.log("Veritabani zamani:", sonuc);
    
    return "Sunucu calisiyor. Veritabani baglantisi tamam.";
});

app.post('/api/kisalt', async ({ body, set }) => {
    
    const veri = body as any;
    const gelenUrl = veri.url;

    
    try {
        new URL(gelenUrl); 
    } catch (error) {
        set.status = 400; 
        return { hata: "Lutfen 'http://' veya 'https://' ile başlayan geçerli bir link girin." };
    }

    
    const kisaKod = kodUret(6);

    try {
        
        await sql`
            INSERT INTO linkler (uzun_link, kisa_kod)
            VALUES (${gelenUrl}, ${kisaKod})
        `;

        
        return {
            mesaj: "link başarıyla kısaltıldı",
            kisa_link: `http://localhost:3000/${kisaKod}`,
            orijinal_link: gelenUrl,
            kod: kisaKod
        };
    } catch (hata) {
        set.status = 500;
        return { hata: "veritabanı hatasi: " + hata };
    }
});


app.get('/:kod', async ({ params, set }) => {
    const kod = params.kod;

    
    const sonuc: any = await sql`SELECT * FROM linkler WHERE kisa_kod = ${kod}`;

    
    if (sonuc.length === 0) {
        set.status = 404;
        return "aradığınız link bulunamadı.";
    }

    
    await sql`UPDATE linkler SET tiklanma_sayisi = tiklanma_sayisi + 1 WHERE kisa_kod = ${kod}`;

    
    return Response.redirect(sonuc[0].uzun_link);
});



app.get('/api/link/:kod', async ({ params, set }) => {
    const kod = params.kod;

    
    const sonuc: any = await sql`SELECT * FROM linkler WHERE kisa_kod = ${kod}`;

    if (sonuc.length === 0) {
        set.status = 404;
        return { hata: "boyle bir link bulunamadı." };
    }

    
    return {
        kisa_kod: sonuc[0].kisa_kod,
        orijinal_link: sonuc[0].uzun_link,
        tiklanma_sayisi: sonuc[0].tiklanma_sayisi,
        olusturulma_tarihi: sonuc[0].eklenme_tarihi,
        son_guncelleme: sonuc[0].guncellenme_tarihi
    };
});


app.put('/api/link/:kod', async ({ params, body, set }) => {
    const kod = params.kod;
    const veri = body as any;
    const yeniLink = veri.yeni_link;

    
    try {
        new URL(yeniLink);
    } catch (hata) {
        set.status = 400;
        return { hata: "Lutfen geçerli bir link girin." };
    }

    try {
        
        await sql`
            UPDATE linkler 
            SET uzun_link = ${yeniLink}, guncellenme_tarihi = CURRENT_TIMESTAMP 
            WHERE kisa_kod = ${kod}
        `;
        return { mesaj: "link başarıyla güncellendi!", yeni_hedef: yeniLink };
    } catch (hata) {
        set.status = 500;
        return { hata: "guncelleme hatası: " + hata };
    }
});


app.delete('/api/link/:kod', async ({ params, set }) => {
    const kod = params.kod;

    try {
        await sql`DELETE FROM linkler WHERE kisa_kod = ${kod}`;
        return { mesaj: "Link sistemden tamamen silindi." };
    } catch (hata) {
        set.status = 500;
        return { hata: "Silme hatası: " + hata };
    }
});


app.listen(3000);

console.log("Sunucu basladi: http://localhost:3000");