npm set-script prepare "npx husky install"
npm run prepare
npx husky set .husky/pre-commit "npx lint-staged"

echo "import { lintStagedConfig } from 'node-modules-public'

export default lintStagedConfig()" > lint-staged.config.mjs
