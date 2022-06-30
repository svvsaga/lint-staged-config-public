import { ProjectsClient } from '@google-cloud/resource-manager';
export async function loadConfigJson(projectName) {
    const projectConfig = await loadProjectsConfig(projectName);
    return JSON.stringify(projectConfig, null, 2);
}
export async function loadProjectsConfig(projectName) {
    const client = new ProjectsClient();
    const projects = await client
        .searchProjects({
        query: `labels.svv_team_project=${projectName}`,
    })
        .then((r) => r[0]);
    const projectConfig = projects.reduce((config, project) => {
        const environment = project.labels?.svv_env;
        if (!environment) {
            return config;
        }
        const env = environment.toUpperCase();
        config[env] = project.projectId;
        config.project_numbers[env] = project.name?.split('/')[1];
        return config;
    }, {
        project_numbers: {},
    });
    return projectConfig;
}
