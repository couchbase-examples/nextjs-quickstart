import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

async function findFile(dir, targetName) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = await findFile(fullPath, targetName);
      if (found) {
        return found;
      }
    } else if (entry.isFile() && entry.name === targetName) {
      return fullPath;
    }
  }

  return null;
}

const sdkRoot = path.resolve('node_modules/couchbase');
const target = await findFile(sdkRoot, 'couchbase_impl.node');

if (!target) {
  console.log('No couchbase_impl.node found; skipping strip');
  process.exit(0);
}

const result = spawnSync('strip', ['--strip-debug', target], {
  stdio: 'inherit',
});

if (result.error) {
  if (result.error.code === 'ENOENT') {
    console.log('strip command not available; skipping strip');
    process.exit(0);
  }

  throw result.error;
}

process.exit(result.status ?? 0);
