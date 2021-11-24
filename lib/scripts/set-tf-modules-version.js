#!/usr/bin/env -S node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replace_in_file_1 = require("replace-in-file");
const version = process.argv.slice(2)[0];
if (!version) {
    console.error('No version specified');
    process.exit(1);
}
(0, replace_in_file_1.replaceInFile)({
    files: './**/*.tf',
    from: /terraform-modules\?ref=(.+?)\//g,
    to: `terraform-modules?ref=${version}/`,
}).then((results) => {
    console.log('Replacement results:', results);
});
