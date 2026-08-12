#!/usr/bin/env node
import { chmod, copyFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const gitHooksPath = execFileSync('git', ['rev-parse', '--git-path', 'hooks'], { encoding: 'utf8' }).trim();
const hookPath = `${gitHooksPath}/pre-commit`;

await copyFile('.githooks/pre-commit', hookPath);
if (process.platform !== 'win32') await chmod(hookPath, 0o755);
console.log(`Installed Git hook at ${hookPath}`);
