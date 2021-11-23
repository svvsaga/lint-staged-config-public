declare type LintStagedConfig = {
    [glob: string]: string | string[] | ((filenames: string[]) => string | string[] | Promise<string | string[]>);
};
export declare type LintStagedOptions = {
    ignoreSecretsInFilesRegex?: RegExp | RegExp[];
    ignoreLargeFilesRegex?: RegExp | RegExp[];
    extras?: LintStagedConfig;
};
export declare const lintStagedConfig: ({ ignoreLargeFilesRegex, ignoreSecretsInFilesRegex, extras, }?: LintStagedOptions) => LintStagedConfig;
export {};
