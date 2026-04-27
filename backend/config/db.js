const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: path.join(__dirname, '..', 'database', 'resolvit.db'),
      driver: sqlite3.Database
    });
    await dbInstance.exec('PRAGMA foreign_keys = ON'); // Enable Foreign Keys
  }
  return dbInstance;
}

// Wrapper to mimic mysql2/promise so we don't have to rewrite any routes
const pool = {
  query: async (sql, params = []) => {
    const db = await getDb();
    
    // Identify query type to return the mock structure
    const normalized = sql.trim().toUpperCase();
    if (normalized.startsWith('SELECT') || normalized.startsWith('SHOW') || normalized.startsWith('COUNT')) {
      const rows = await db.all(sql, params);
      return [rows, null];
    } else {
      // It's INSERT, UPDATE, or DELETE
      // In typical parameter arrays, sqlite replaces ? properly as well.
      const result = await db.run(sql, params);
      return [{ insertId: result.lastID, affectedRows: result.changes }, null];
    }
  },
  execute: async (sql, params = []) => {
      return pool.query(sql, params);
  },
  end: async () => {
    if (dbInstance) {
        await dbInstance.close();
        dbInstance = null;
    }
  }
};

module.exports = pool;
