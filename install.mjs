import { spawnSync } from 'child_process';
const r = spawnSync('npm.cmd', ['install'], { stdio: 'inherit', shell: false });
process.exit(r.status ?? 0);
