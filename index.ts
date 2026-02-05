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

app.listen(3000);

console.log("Sunucu basladi: http://localhost:3000");