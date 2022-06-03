#!/usr/bin/env -S node
import { ProjectsClient } from '@google-cloud/resource-manager';
import cliSelect from 'cli-select';
import { writeFileSync, existsSync } from 'fs';
import { loadConfigJson } from './implementations/loadConfigJson.js';
import readline from 'readline';
import pkg from 'replace-in-file';
const { replaceInFile } = pkg;
const client = new ProjectsClient();
const projectsWithTeams = await client
    .searchProjects({
    query: `labels.svv_team:*`,
})
    .then((r) => r[0]);
const teams = [
    ...new Set(projectsWithTeams.map((project) => project.labels?.svv_team)),
];
console.log('Select your team:');
const team = (await cliSelect({
    values: teams,
})).value;
const teamProjects = await client
    .searchProjects({
    query: `labels.svv_team=${team} labels.svv_team_project:*`,
})
    .then((r) => r[0]);
const projects = [
    ...new Set(teamProjects.map((project) => project.labels?.svv_team_project)),
];
console.log('Select which project to use:');
const project = (await cliSelect({
    values: projects,
})).value;
const sharedConfig = await loadConfigJson(`${team}-shared`);
const projectConfig = await loadConfigJson(project);
if (!existsSync(project)) {
    const input = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const path = await new Promise((resolve) => input.question(`No folder found for ${project}, please enter the path to the folder: `, resolve));
    writeFileSync(`${path}/projects.config.json`, projectConfig);
}
else {
    writeFileSync(`${project}/projects.config.json`, projectConfig);
}
console.log('Project config saved!');
writeFileSync('projects.config.json', sharedConfig);
console.log('Shared project config saved!');
const replaceTeamUppercaseResults = await replaceInFile({
    files: './**/*.yml',
    from: /<INSERT_TEAM_UPPERCASE>/g,
    to: team.toUpperCase(),
});
console.log('Team replacement uppercase results:', replaceTeamUppercaseResults);
const replaceTeamLowercaseResults = await replaceInFile({
    files: './**/*.tf',
    from: /<INSERT_TEAM_LOWERCASE>/g,
    to: team.toLowerCase(),
});
console.log('Team replacement lowercase results:', replaceTeamLowercaseResults);
const replaceProjectResults = await replaceInFile({
    files: './**/*.json',
    from: /<INSERT_PROJECT>/g,
    to: project.toUpperCase(),
});
console.log('Project replacement results:', replaceProjectResults);
process.exit(0);
