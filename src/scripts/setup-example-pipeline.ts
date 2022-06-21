#!/usr/bin/env -S node

import { renameSync } from 'fs'
import pkg from 'replace-in-file'
import { readInput } from './implementations/readInput.js'
import {
  readProjectConfigs,
  writeProjectConfig,
  writeSharedConfig,
} from './implementations/readProjectConfigs.js'
const { replaceInFile } = pkg

const { project, projectConfig, sharedConfig, team } =
  await readProjectConfigs()

renameSync('my-project', project)

await writeProjectConfig({ project, projectConfig })

writeSharedConfig(sharedConfig)

const displayName =
  (await readInput(
    'Enter the display name of your project, or leave it blank to use the project name: '
  )) || project

const replaceTeamUppercaseResults = await replaceInFile({
  files: './.github/workflows/*.yml',
  from: /<INSERT_TEAM_UPPERCASE>/g,
  to: team.toUpperCase(),
})
console.log('Team replacement uppercase results:', replaceTeamUppercaseResults)

const replaceTeamLowercaseResults = await replaceInFile({
  files: './**/*.tf',
  from: /<INSERT_TEAM_LOWERCASE>/g,
  to: team.toLowerCase(),
})
console.log('Team replacement lowercase results:', replaceTeamLowercaseResults)

const replaceProjectResults = await replaceInFile({
  files: './**/tf-pr-action.config.json',
  from: /<INSERT_PROJECT>/g,
  to: project.toUpperCase(),
})
console.log('Project replacement results:', replaceProjectResults)

renameSync(
  '.github/workflows/my-project.create-tf-release.yml',
  `.github/workflows/${project}.create-tf-release.yml`
)
renameSync(
  '.github/workflows/my-project.deploy-tf.yml',
  `.github/workflows/${project}.deploy-tf.yml`
)

await replaceInFile({
  files: './.github/workflows/*.yml',
  from: /My Project/g,
  to: displayName,
})

await replaceInFile({
  files: ['./.github/workflows/*.yml', './**/*.tf', './**/*.kts'],
  from: /my-project/g,
  to: project,
})

await replaceInFile({
  files: ['./**/*.tf', './**/*.kts', './**/*.kt'],
  from: /myproject/g,
  to: project.replace(/-/g, ''),
})

process.exit(0)
