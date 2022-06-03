#!/usr/bin/env -S node
import { writeFileSync } from 'fs';
import { loadConfigJson } from './implementations/loadConfigJson.js';
export const projectName = process.argv.slice(2)[0];
if (!projectName) {
    console.error(`Usage: ${process.argv[1]} <project-name, e.g. 'nvdb'>`);
    process.exit(1);
}
const configJson = await loadConfigJson(projectName);
writeFileSync('projects.config.json', configJson);
