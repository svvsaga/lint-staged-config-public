import { ProjectsClient } from '@google-cloud/resource-manager'
import cliSelect from 'cli-select'
import { existsSync, writeFileSync } from 'fs'
import { loadConfigJson } from './loadConfigJson.js'
import { readInput } from './readInput.js'

export async function readProjectConfigs(): Promise<{
  project: string
  projectConfig: string
  sharedConfig: string
  team: string
}> {
  const client = new ProjectsClient()

  const projectsWithTeams = await client
    .searchProjects({
      query: `labels.svv_team:*`,
    })
    .then((r) => r[0])

  const teams = [
    ...new Set(projectsWithTeams.map((project) => project.labels?.svv_team!!)),
  ]

  console.log('Select your team:')

  const team = (
    await cliSelect({
      values: teams,
    })
  ).value

  const teamProjects = await client
    .searchProjects({
      query: `labels.svv_team=${team} labels.svv_team_project:*`,
    })
    .then((r) => r[0])

  const projects = [
    ...new Set(
      teamProjects.map((project) => project.labels?.svv_team_project!!)
    ),
  ].filter((project) => !project.endsWith('-shared'))

  console.log('Select which project to use:')

  const project = (
    await cliSelect({
      values: projects,
    })
  ).value

  const sharedConfig = await loadConfigJson(`${team}-shared`)
  const projectConfig = await loadConfigJson(project)
  return { project, projectConfig, sharedConfig, team }
}

export async function writeProjectConfig({
  project,
  projectConfig,
}: {
  project: string
  projectConfig: string
}): Promise<void> {
  if (!existsSync(project)) {
    const path = await readInput(
      `No folder found for ${project}, please enter the path to the folder: `
    )
    writeFileSync(`${path}/projects.config.json`, projectConfig)
  } else {
    writeFileSync(`${project}/projects.config.json`, projectConfig)
  }
  console.log('Project config saved!')
}

export function writeSharedConfig(sharedConfig: string): void {
  writeFileSync('projects.config.json', sharedConfig)
  console.log('Shared project config saved!')
}
