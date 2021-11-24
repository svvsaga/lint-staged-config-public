# node-modules-public

Public repo for lint-staged checks and scripts

## Usage

From the repo where you want to add husky and lint-staged:

```bash
npm i -D svvsaga/node-modules-public#v0.3.0
./node_modules/node-modules-public/setup.sh
echo "module.exports = require('node-modules-public').lintStagedConfig()" > lint-staged.config.cjs
```

### Parameters

You can add more tasks with the `extras`-parameter:

```javascript
module.exports = require('node-modules-public').lintStagedConfig({
  extras: {
    '**/*.ts': () => ['npm run all', 'git add .'],
  },
})
```

Some common tasks are included:

```javascript
module.exports = require('node-modules-public').lintStagedConfig({
  ktlint: true, // will run "ktlint" for all kotlin files
  terraformFmt: true, // will run "terraform fmt" for all terraform files
  terragruntHclFmt: true, // will run "terragrunt hclfmt" for all hcl files
})
```

You can ignore specific secret or large files with `ignoreSecretsInFilesRegex` and `ignoreLargeFilesRegex`. `package-lock.json` is automatically ignored.

```javascript
module.exports = require('node-modules-public').lintStagedConfig({
  ignoreSecretsInFilesRegex: /my-secret\.json$/,
  ignoreLargeFilesRegex: /\.png$/,
})
```

## Other utils

- `set-tf-modules-version`: Used to set the version of our `terraform-modules` module, e.g. `npx set-tf-modules-version v1.1.1` will find and replace the version of all references to the `terraform-modules` repo in our `.tf`-files.

## Development

Run `./setup-dev.sh` to install this package globally, so `check-for-secrets` etc. are available in the Node `bin/`-folder.
