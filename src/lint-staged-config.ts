type LintStagedConfig = {
  [glob: string]:
    | string
    | string[]
    | ((filenames: string[]) => string | string[] | Promise<string | string[]>)
}

export type LintStagedOptions = {
  ignoreSecretsInFilesRegex?: RegExp | RegExp[]
  ignoreLargeFilesRegex?: RegExp | RegExp[]
  terraformFmt?: boolean
  terragruntHclFmt?: boolean
  ktlint?: boolean
  extras?: LintStagedConfig
}

function filterIgnoredFiles(
  filenames: string[],
  ignoredFilesRegex: undefined | RegExp | RegExp[]
): string[] {
  return filenames.filter((filename) =>
    ignoredFilesRegex instanceof RegExp
      ? ignoredFilesRegex.test(filename) === false
      : Array.isArray(ignoredFilesRegex)
      ? ignoredFilesRegex.some((regex) => regex.test(filename)) === false
      : true
  )
}

const defaultIgnoreLargeFiles = ['package-lock.json']

export const lintStagedConfig = ({
  ignoreLargeFilesRegex = undefined,
  ignoreSecretsInFilesRegex = undefined,
  extras = {},
  ktlint = false,
  terraformFmt = false,
  terragruntHclFmt = false,
}: LintStagedOptions = {}): LintStagedConfig => ({
  '**': (filenames) => [
    'check-for-secrets ' +
      filterIgnoredFiles(filenames, ignoreSecretsInFilesRegex)
        .map((filename) => `"${filename}"`)
        .join(' '),
    'block-large-files ' +
      filterIgnoredFiles(filenames, ignoreLargeFilesRegex)
        .filter(
          (filename) =>
            !defaultIgnoreLargeFiles.some((f) => filename.includes(f))
        )
        .map((filename) => `"${filename}"`)
        .join(' '),
  ],
  ...(ktlint
    ? {
        '**/*.kt?(s)': () => ['ktlint -F'],
      }
    : {}),
  ...(terraformFmt
    ? {
        '**/*.tf?(vars)': () => ['terraform fmt -recursive .'],
      }
    : {}),
  ...(terragruntHclFmt
    ? {
        '**/*.hcl': () => ['terragrunt hclfmt'],
      }
    : {}),
  ...extras,
})
