import { spawnSync } from 'child_process';
import { writeFileSync } from 'fs';

const result = spawnSync(
  'node',
  ['node_modules/typescript/bin/tsc', '--noEmit', '--project', 'tsconfig.app.json'],
  { encoding: 'utf8', cwd: process.cwd() }
);

const out = (result.stdout || '') + (result.stderr || '');
writeFileSync('tsc-out.txt', out);
console.log('EXIT:', result.status);
if (out.trim()) {
  console.log(out.slice(0, 4000));
}
