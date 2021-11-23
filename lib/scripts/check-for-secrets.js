#!/usr/bin/env -S node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
console.log('Checking for secrets...');
for (const file of process.argv.slice(2)) {
    const contents = fs_1.default.readFileSync(file, 'utf8');
    if ((contents.includes('-----BEGIN PRIVATE') ||
        contents.includes('-----BEGIN RSA PRIVATE') ||
        contents.includes('-----BEGIN CERTIFICATE')) &&
        !file.endsWith('check-for-secrets.ts') &&
        !file.endsWith('check-for-secrets.js')) {
        console.error(`Private key detected in ${file}! To override, commit with "--no-verify".`);
        process.exit(1);
    }
}
