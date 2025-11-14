const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan credenciales de Supabase en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndFixProfiles() {
  console.log('\n🔍 Verificando sistema de perfiles y amigos...\n');

  try {
    // 1. Ver estructura de la tabla profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (profilesError) {
      console.error('❌ Error accediendo a profiles:', profilesError.message);
      console.log('   Detalles:', profilesError);
      return;
    }

    console.log('✅ Tabla profiles accesible');
    console.log('📊 Perfiles encontrados:', profiles?.length || 0);
    
    if (profiles && profiles.length > 0) {
      console.log('');
      console.log('📋 Perfiles existentes:');
      profiles.forEach(p => {
        console.log(`  - ID: ${p.id.substring(0, 8)}...`);
        console.log(`    Nombre: ${p.name || 'Sin nombre'}`);
        console.log(`    Friend Code: ${p.friend_code || 'SIN CÓDIGO'}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No hay perfiles en la base de datos');
      console.log('   Esto sugiere que el trigger de auto-creación no está funcionando');
    }

    // 2. Ver tabla friends
    const { data: friends, error: friendsError } = await supabase
      .from('friends')
      .select('*')
      .limit(10);

    if (friendsError) {
      console.error('❌ Error accediendo a friends:', friendsError.message);
    } else {
      console.log('✅ Tabla friends accesible');
      console.log('📊 Relaciones de amistad:', friends?.length || 0);
      
      if (friends && friends.length > 0) {
        console.log('');
        console.log('👥 Amistades existentes:');
        friends.forEach(f => {
          console.log(`  - User: ${f.user_id.substring(0, 8)}... → Friend: ${f.friend_id.substring(0, 8)}...`);
          console.log(`    Estado: ${f.status}`);
        });
      }
    }

    // 3. Obtener usuario actual (el primero que encuentre)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('');
      console.log('⚠️  No hay sesión activa');
      console.log('   Inicia sesión en la app para probar');
    } else if (user) {
      console.log('');
      console.log('✅ Sesión activa encontrada:');
      console.log(`   User ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      
      // Ver si tiene perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        console.log('   Profile: ✅');
        console.log(`   Nombre: ${profile.name || 'Sin nombre'}`);
        console.log(`   Friend Code: ${profile.friend_code || 'SIN CÓDIGO'}`);
      } else {
        console.log('   Profile: ❌ No existe');
      }
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('📝 PRÓXIMOS PASOS:');
    console.log('');
    console.log('1. Ejecuta el script SQL en Supabase Dashboard:');
    console.log('   database/GENERAR_CODIGOS_AMIGO.sql');
    console.log('');
    console.log('2. O ejecuta el script completo:');
    console.log('   database/FIX_FRIENDS_RLS.sql');
    console.log('');
    console.log('3. Esto creará:');
    console.log('   - Columna friend_code en profiles');
    console.log('   - Función para generar códigos');
    console.log('   - Trigger para auto-generar códigos');
    console.log('   - Políticas RLS correctas');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('   Stack:', error.stack);
  }
}

checkAndFixProfiles();
