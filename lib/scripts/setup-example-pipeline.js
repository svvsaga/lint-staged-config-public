#!/usr/bin/env -S node
import { ProjectsClient } from '@google-cloud/resource-manager';
import cliSelect from 'cli-select';
import { writeFileSync, existsSync, renameSync } from 'fs';
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
].filter((project) => !project.endsWith('-shared'));
console.log('Select which project to use:');
const project = (await cliSelect({
    values: projects,
})).value;
function readInput(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
const displayName = (await readInput('Enter the display name of your project, or leave it blank to use the project name: ')) || project;
const sharedConfig = await loadConfigJson(`${team}-shared`);
const projectConfig = await loadConfigJson(project);
renameSync('my-project', project);
if (!existsSync(project)) {
    const path = await readInput(`No folder found for ${project}, please enter the path to the folder: `);
    writeFileSync(`${path}/projects.config.json`, projectConfig);
}
else {
    writeFileSync(`${project}/projects.config.json`, projectConfig);
}
console.log('Project config saved!');
writeFileSync('projects.config.json', sharedConfig);
console.log('Shared project config saved!');
const replaceTeamUppercaseResults = await replaceInFile({
    files: './.github/workflows/*.yml',
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
    files: './**/tf-pr-action.config.json',
    from: /<INSERT_PROJECT>/g,
    to: project.toUpperCase(),
});
console.log('Project replacement results:', replaceProjectResults);
renameSync('.github/workflows/my-project.create-tf-release.yml', `.github/workflows/${project}.create-tf-release.yml`);
renameSync('.github/workflows/my-project.deploy-tf.yml', `.github/workflows/${project}.deploy-tf.yml`);
await replaceInFile({
    files: './.github/workflows/*.yml',
    from: /My Project/g,
    to: displayName,
});
await replaceInFile({
    files: ['./.github/workflows/*.yml', './**/*.tf', './**/*.kts'],
    from: /my-project/g,
    to: project,
});
await replaceInFile({
    files: ['./**/*.tf', './**/*.kts', './**/*.kt'],
    from: /myproject/g,
    to: project.replace(/-/g, ''),
});
process.exit(0);
