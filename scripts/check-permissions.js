import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const manifestPath = resolve(__dirname, '../src/manifest.json');
const ALLOWED_PERMISSIONS = ['contextMenus', 'activeTab'];

try {
  const manifestData = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  const permissions = manifestData.permissions || [];

  console.info('Checking manifest permissions...');
  console.info(`Found permissions: ${JSON.stringify(permissions)}`);

  const forbiddenPermissions = permissions.filter((perm) => !ALLOWED_PERMISSIONS.includes(perm));

  if (forbiddenPermissions.length > 0) {
    console.error('CRITICAL SECURITY ERROR: Unapproved permissions found in manifest.json!');
    console.error(`Forbidden permissions: ${JSON.stringify(forbiddenPermissions)}`);
    console.error(`Approved permissions: ${JSON.stringify(ALLOWED_PERMISSIONS)}`);
    process.exit(1);
  }

  console.info('Security check passed: No unauthorized permissions found.');
  process.exit(0);
} catch (err) {
  console.error('Error reading or parsing manifest.json:', err);
  process.exit(1);
}
