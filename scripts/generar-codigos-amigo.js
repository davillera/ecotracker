const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan credenciales de Supabase en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateFriendCodes() {
  console.log('\n🔧 Generando códigos de amigo...\n');

  try {
    // 1. Ver usuarios actuales
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, name, friend_code');

    if (usersError) {
      console.error('❌ Error obteniendo usuarios:', usersError.message);
      return;
    }

    console.log('📋 Usuarios encontrados:', users.length);
    console.log('');

    const usersWithoutCode = users.filter(u => !u.friend_code);
    const usersWithCode = users.filter(u => u.friend_code);

    console.log('✅ Con código:', usersWithCode.length);
    console.log('⚠️  Sin código:', usersWithoutCode.length);
    console.log('');

    if (usersWithoutCode.length === 0) {
      console.log('✨ ¡Todos los usuarios ya tienen código!');
      console.log('');
      users.forEach(u => {
        console.log(`  ${u.name || 'Sin nombre'}: ${u.friend_code}`);
      });
      return;
    }

    // 2. Generar códigos para usuarios sin código
    console.log('🔄 Generando códigos para usuarios sin código...\n');

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const generateCode = () => {
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
      return code;
    };

    for (const user of usersWithoutCode) {
      let code = generateCode();
      
      // Verificar que el código sea único
      let isUnique = false;
      let attempts = 0;
      
      while (!isUnique && attempts < 10) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('friend_code', code)
          .single();
        
        if (!existing) {
          isUnique = true;
        } else {
          code = generateCode();
          attempts++;
        }
      }

      // Actualizar el usuario con el código
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ friend_code: code })
        .eq('id', user.id);

      if (updateError) {
        console.error(`  ❌ Error actualizando ${user.name}:`, updateError.message);
      } else {
        console.log(`  ✅ ${user.name || 'Usuario sin nombre'}: ${code}`);
      }
    }

    console.log('');
    console.log('✨ ¡Códigos generados exitosamente!');
    console.log('');

    // 3. Mostrar todos los códigos
    const { data: allUsers } = await supabase
      .from('profiles')
      .select('id, name, friend_code')
      .order('created_at', { ascending: false });

    console.log('📋 Lista completa de códigos:');
    console.log('');
    allUsers?.forEach(u => {
      console.log(`  ${(u.name || 'Sin nombre').padEnd(20)} → ${u.friend_code || 'SIN CÓDIGO'}`);
    });
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateFriendCodes();
