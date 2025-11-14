const fs = require('fs');
const { Client } = require('pg');

// Connection string directo (más confiable que leer del .env)
const connectionString = 'postgresql://postgres:Su2tExNuRaY9AlRH@db.vrusokequxdingvujzvc.supabase.co:5432/postgres';

console.log('🔗 Conectando a Supabase...\n');

// Crear cliente
const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function runScript() {
  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos\n');

    // Leer el script SQL
    const sql = fs.readFileSync('./database/FIX_FRIENDS_RLS.sql', 'utf8');
    
    console.log('📝 Ejecutando script FIX_FRIENDS_RLS.sql...\n');
    
    // Ejecutar el script
    await client.query(sql);
    
    console.log('✅ Script ejecutado exitosamente!\n');
    
    // Verificar que funcionó
    console.log('🔍 Verificando resultados...\n');
    
    // Ver códigos generados
    const { rows: profiles } = await client.query(
      'SELECT id, name, friend_code FROM public.profiles ORDER BY created_at DESC LIMIT 5'
    );
    
    console.log('📋 Códigos de amigo generados:');
    profiles.forEach(p => {
      console.log(`   - ${p.name || 'Usuario'}: ${p.friend_code || 'SIN CÓDIGO'}`);
    });
    
    console.log('');
    
    // Ver políticas de friends
    const { rows: policies } = await client.query(
      `SELECT policyname, cmd, with_check 
       FROM pg_policies 
       WHERE tablename = 'friends' 
       ORDER BY policyname`
    );
    
    console.log('🔐 Políticas RLS de friends:');
    policies.forEach(p => {
      console.log(`   - ${p.policyname} (${p.cmd})`);
    });
    
    console.log('\n✨ ¡Todo listo! El sistema de amigos debería funcionar ahora.\n');
    
  } catch (error) {
    console.error('❌ Error ejecutando script:', error.message);
    if (error.position) {
      console.error('   Posición del error:', error.position);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

runScript();
