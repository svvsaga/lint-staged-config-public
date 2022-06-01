import { lintStagedConfig } from './lib/index.js'

export default lintStagedConfig({
  extras: {
    '**/*.ts': () => ['npm run build', 'git add .'],
  },
})
