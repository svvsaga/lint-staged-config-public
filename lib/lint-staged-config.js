function filterIgnoredFiles(filenames, ignoredFilesRegex) {
    return filenames.filter((filename) => ignoredFilesRegex instanceof RegExp
        ? ignoredFilesRegex.test(filename) === false
        : Array.isArray(ignoredFilesRegex)
            ? ignoredFilesRegex.some((regex) => regex.test(filename)) === false
            : true);
}
const defaultIgnoreLargeFiles = ["package-lock.json"];
export const lintStagedConfig = ({ onlyStagedFiles = false, ignoreLargeFilesRegex = undefined, ignoreSecretsInFilesRegex = undefined, extras = {}, ktlint = false, terraformFmt = false, terragruntHclFmt = false, python = false, } = {}) => ({
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
            "**/*.kt?(s)": (filenames) => [`ktlint -F ${onlyStagedFiles ? filenames.join(" ") : ""}`],
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
    ...(python
        ? {
            "**/*.py": ["black", "flake8"],
        }
        : {}),
    ...extras,
});
