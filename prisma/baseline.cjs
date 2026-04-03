const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const migrationsDir = path.join(__dirname, 'migrations');
const dirs = fs.readdirSync(migrationsDir)
  .filter(d => d !== 'migration_lock.toml' && fs.statSync(path.join(migrationsDir, d)).isDirectory())
  .sort();

const createTable = `CREATE TABLE IF NOT EXISTS _prisma_migrations (
  id VARCHAR(36) PRIMARY KEY NOT NULL,
  checksum VARCHAR(64) NOT NULL,
  finished_at TIMESTAMPTZ,
  migration_name VARCHAR(255) NOT NULL,
  logs TEXT,
  rolled_back_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  applied_steps_count INTEGER NOT NULL DEFAULT 0
);`;

execSync(`psql -d mpprofit -c "${createTable}"`, { stdio: 'inherit' });

for (const dir of dirs) {
  const sqlPath = path.join(migrationsDir, dir, 'migration.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const checksum = crypto.createHash('sha256').update(sql).digest('hex');
  const id = crypto.randomUUID();
  const insert = `INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('${id}', '${checksum}', NOW(), '${dir}', NULL, NULL, NOW(), 1);`;
  try {
    execSync(`psql -d mpprofit -c "${insert}"`, { stdio: 'inherit' });
    console.log(`✓ Baselined: ${dir}`);
  } catch (e) {
    console.error(`✗ Failed: ${dir}`);
  }
}

console.log('Done!');
