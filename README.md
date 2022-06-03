# node-modules-public

Public repo for lint-staged checks and scripts

## Usage

First, Make sure Node 16+ is installed.

From the repo where you want to add husky and lint-staged:

```bash
npm i -D svvsaga/node-modules-public#v1.2.1
./node_modules/node-modules-public/setup.sh
echo "import { lintStagedConfig } from 'node-modules-public'

export default lintStagedConfig()" > lint-staged.config.mjs
```

### Parameters

You can add more tasks with the `extras`-parameter:

```javascript
import { lintStagedConfig } from 'node-modules-public'

export default lintStagedConfig({
  extras: {
    '**/*.ts': () => ['npm run build', 'git add .'],
  },
})
```

Some common tasks are included:

```javascript
import { lintStagedConfig } from 'node-modules-public'

export default lintStagedConfig({
  ktlint: true, // will run "ktlint" for all kotlin files
  terraformFmt: true, // will run "terraform fmt" for all terraform files
  terragruntHclFmt: true, // will run "terragrunt hclfmt" for all hcl files
})
```

You can ignore specific secret or large files with `ignoreSecretsInFilesRegex` and `ignoreLargeFilesRegex`. `package-lock.json` is automatically ignored.

```javascript
import { lintStagedConfig } from 'node-modules-public'

export default lintStagedConfig({
  ignoreSecretsInFilesRegex: /my-secret\.json$/,
  ignoreLargeFilesRegex: /\.png$/,
})
```

## Other utils

- `set-tf-modules-version`: Used to set the version of our `terraform-modules` module, e.g. `npx set-tf-modules-version v1.1.1` will find and replace the version of all references to the `terraform-modules` repo in our `.tf`-files.
- `generate-gcp-project-config`: Used to generate a `projects.config.json` for a given saga project. E.g. `npx generate-gcp-project-config nvdb` will find all GCP projects for the logged in user with `svv_team_project: nvdb` and add the project ID and number per environment to a `projects.config.json` file.

## Development

Run `./setup-dev.sh` to install this package globally, so `check-for-secrets` etc. are available in the Node `bin/`-folder.
