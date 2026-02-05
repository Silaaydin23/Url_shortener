import { Elysia } from 'elysia';
import postgres from 'postgres';

const sql = postgres({
    host: 'localhost',      
    port: 5432,             
    database: 'postgres',   
    username: 'postgres',   
    password: process.env.DB_PASSWORD,     
});

const app= new Elysia();


app.get('/', async () => {
    
    const sonuc = await sql`SELECT NOW()`;
    console.log("Veritabani zamani:", sonuc);
    
    return "Sunucu calisiyor. Veritabani baglantisi tamam.";
});

app.listen(3000);

console.log("Sunucu basladi: http://localhost:3000");