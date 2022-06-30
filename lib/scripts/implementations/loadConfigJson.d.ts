declare type ProjectsConfig = Omit<Record<string, string>, 'project_numbers'> & {
    project_numbers: Record<string, string>;
};
export declare function loadConfigJson(projectName: string): Promise<string>;
export declare function loadProjectsConfig(projectName: string): Promise<ProjectsConfig>;
export {};
