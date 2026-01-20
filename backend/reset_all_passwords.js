const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'prathyu8281',
    database: 'servicer'
};

async function resetPasswords() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('🔌 Connected to Database');

        const plainPassword = 'password';
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        console.log(`🔑 Generated Hash for "password": ${hashedPassword}`);

        const tables = ['users', 'admins', 'vendors', 'technicians'];

        for (const table of tables) {
            try {
                console.log(`\n🔄 Updating table: ${table}...`);
                const [result] = await conn.query(`UPDATE ${table} SET password = ?`, [hashedPassword]);
                console.log(`✅ Updated ${result.affectedRows} rows in ${table}`);
            } catch (tableError) {
                console.log(`⚠️ Could not update ${table}: ${tableError.message}`);
            }
        }

        console.log('\n✨ Password reset process finished.');

    } catch (e) {
        console.error('❌ Database connection failed:', e.message);
    } finally {
        if (conn) await conn.end();
    }
}

resetPasswords();
