type LintStagedConfig = {
  [glob: string]: (
    filenames: string[]
  ) => string | string[] | Promise<string | string[]>
}

export type LintStagedOptions = {
  ignoreSecretsInFilesRegex?: RegExp | RegExp[]
  ignoreLargeFilesRegex?: RegExp | RegExp[]
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
})
