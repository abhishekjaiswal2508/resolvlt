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
    await dbInstance.exec('PRAGMA foreign_keys = ON'); 
  }
  return dbInstance;
}


const pool = {
  query: async (sql, params = []) => {
    const db = await getDb();
    
    
    const normalized = sql.trim().toUpperCase();
    if (normalized.startsWith('SELECT') || normalized.startsWith('SHOW') || normalized.startsWith('COUNT')) {
      const rows = await db.all(sql, params);
      return [rows, null];
    } else {
      
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
