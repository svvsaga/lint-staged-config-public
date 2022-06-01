#!/usr/bin/env -S node

import { ProjectsClient } from '@google-cloud/resource-manager'
import { writeFileSync } from 'fs'

const name = process.argv.slice(2)[0]

if (!name) {
  console.error(`Usage: ${process.argv[1]} <project-name, e.g. 'nvdb'>`)
  process.exit(1)
}

const client = new ProjectsClient()

const projects = await client
  .searchProjects({
    query: `labels.svv_team_project=${name}`,
  })
  .then((r) => r[0])

const projectConfig = projects.reduce(
  (config, project) => {
    const environment = project.labels?.svv_env
    if (!environment) {
      return config
    }
    const env = environment.toUpperCase()
    config[env] = project.projectId
    config.project_numbers[env] = project.name?.split('/')[1]
    return config
  },
  {
    project_numbers: {},
  } as any
)

writeFileSync('projects.config.json', JSON.stringify(projectConfig, null, 2))
