#!/usr/bin/env -S node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const maxFileSize = 1024 * 100;
console.log('Blocking large files...');
for (const file of process.argv.slice(2)) {
    const stats = fs_1.default.statSync(file);
    if (stats.size > maxFileSize) {
        console.error(`${file} is larger than ${maxFileSize} bytes. To override, commit with "--no-verify".`);
        process.exit(1);
    }
}
