module.exports = require('./lib/index').lintStagedConfig({
  extras: {
    '**/*.ts': () => 'npm run build',
  },
})
