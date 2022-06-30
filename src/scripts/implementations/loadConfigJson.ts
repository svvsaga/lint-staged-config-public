import { ProjectsClient } from '@google-cloud/resource-manager'

type ProjectsConfig = Omit<Record<string, string>, 'project_numbers'> & {
  project_numbers: Record<string, string>
}

export async function loadConfigJson(projectName: string) {
  const projectConfig = await loadProjectsConfig(projectName)

  return JSON.stringify(projectConfig, null, 2)
}

export async function loadProjectsConfig(projectName: string) {
  const client = new ProjectsClient()

  const projects = await client
    .searchProjects({
      query: `labels.svv_team_project=${projectName}`,
    })
    .then((r) => r[0])

  const projectConfig = projects.reduce(
    (config, project) => {
      const environment = project.labels?.svv_env
      if (!environment) {
        return config
      }
      const env = environment.toUpperCase()
      config[env] = project.projectId!!
      config.project_numbers[env] = project.name?.split('/')[1]!!
      return config
    },
    {
      project_numbers: {},
    } as ProjectsConfig
  )
  return projectConfig
}
