export declare function readProjectConfigs(): Promise<{
    project: string;
    projectConfig: string;
    sharedConfig: string;
    team: string;
}>;
export declare function writeProjectConfig({ project, projectConfig, }: {
    project: string;
    projectConfig: string;
}): Promise<void>;
export declare function writeSharedConfig(sharedConfig: string): void;
