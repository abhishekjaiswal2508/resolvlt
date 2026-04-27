const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
    try {
        console.log('Initializing SQLite database...');

        console.log('Reading schema.sql...');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schemaQuery = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema...');
        const sqlite3 = require('sqlite3').verbose();
        const { open } = require('sqlite');
        const db = await open({
           filename: path.join(__dirname, 'database', 'resolvit.db'),
           driver: sqlite3.Database
        });
        
        await db.exec(schemaQuery);

        console.log('Checking for existing users...');
        const row = await db.get('SELECT count(*) as count FROM users');
        if (row.count === 0) {
            console.log('Inserting demo users...');
            const passwordHash = await bcrypt.hash('password123', 10);
            const insertUsersQuery = `
                INSERT INTO users (username, email, password_hash, role) VALUES 
                ('student1', 'student1@college.edu', ?, 'Student'),
                ('student2', 'student2@college.edu', ?, 'Student'),
                ('admin1', 'admin1@college.edu', ?, 'Admin'),
                ('staff1', 'staff1@college.edu', ?, 'Maintenance'),
                ('staff2', 'staff2@college.edu', ?, 'Maintenance')
            `;
            await db.run(insertUsersQuery, [passwordHash, passwordHash, passwordHash, passwordHash, passwordHash]);
            console.log('Demo users inserted. Accounts: [student1, admin1, staff1...], Password: password123');
        } else {
            console.log('Users already exist, skipping demo data insertion.');
        }

        console.log('Database setup complete!');
        await db.close();
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase();
