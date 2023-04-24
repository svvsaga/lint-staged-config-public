function filterIgnoredFiles(filenames, ignoredFilesRegex) {
    return filenames.filter((filename) => ignoredFilesRegex instanceof RegExp
        ? ignoredFilesRegex.test(filename) === false
        : Array.isArray(ignoredFilesRegex)
            ? ignoredFilesRegex.some((regex) => regex.test(filename)) === false
            : true);
}
const defaultIgnoreLargeFiles = ["package-lock.json"];
export const lintStagedConfig = ({ ignoreLargeFilesRegex = undefined, ignoreSecretsInFilesRegex = undefined, extras = {}, ktlint = false, terraformFmt = false, terragruntHclFmt = false, black = false, flake8 = false, } = {}) => ({
    "**": (filenames) => [
        "check-for-secrets " +
            filterIgnoredFiles(filenames, ignoreSecretsInFilesRegex)
                .map((filename) => `"${filename}"`)
                .join(" "),
        "block-large-files " +
            filterIgnoredFiles(filenames, ignoreLargeFilesRegex)
                .filter((filename) => !defaultIgnoreLargeFiles.some((f) => filename.includes(f)))
                .map((filename) => `"${filename}"`)
                .join(" "),
    ],
    ...(ktlint
        ? {
            "**/*.kt?(s)": () => ["ktlint -F"],
        }
        : {}),
    ...(terraformFmt
        ? {
            "**/*.tf?(vars)": () => ["terraform fmt -recursive ."],
        }
        : {}),
    ...(terragruntHclFmt
        ? {
            "**/*.hcl": () => ["terragrunt hclfmt"],
        }
        : {}),
    ...(black
        ? {
            "**/*.py": "black",
        }
        : {}),
    ...(flake8
        ? {
            "**/*.py": "flake8",
        }
        : {}),
    ...extras,
});
