#!/usr/bin/env -S node
import fs from 'fs';
const maxFileSize = 1024 * 100;
console.log('Blocking large files...');
for (const file of process.argv.slice(2)) {
    const stats = fs.statSync(file);
    if (stats.size > maxFileSize) {
        console.error(`${file} is larger than ${maxFileSize} bytes. To override, commit with "--no-verify".`);
        process.exit(1);
    }
}
