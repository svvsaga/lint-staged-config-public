"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lintStagedConfig = void 0;
function filterIgnoredFiles(filenames, ignoredFilesRegex) {
    return filenames.filter((filename) => ignoredFilesRegex instanceof RegExp
        ? ignoredFilesRegex.test(filename) === false
        : Array.isArray(ignoredFilesRegex)
            ? ignoredFilesRegex.some((regex) => regex.test(filename)) === false
            : true);
}
const defaultIgnoreLargeFiles = ['package-lock.json'];
const lintStagedConfig = ({ ignoreLargeFilesRegex = undefined, ignoreSecretsInFilesRegex = undefined, extras = {}, } = {}) => ({
    '**': (filenames) => [
        'check-for-secrets ' +
            filterIgnoredFiles(filenames, ignoreSecretsInFilesRegex)
                .map((filename) => `"${filename}"`)
                .join(' '),
        'block-large-files ' +
            filterIgnoredFiles(filenames, ignoreLargeFilesRegex)
                .filter((filename) => !defaultIgnoreLargeFiles.some((f) => filename.includes(f)))
                .map((filename) => `"${filename}"`)
                .join(' '),
    ],
    ...extras,
});
exports.lintStagedConfig = lintStagedConfig;
