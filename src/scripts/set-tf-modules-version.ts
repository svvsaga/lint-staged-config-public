#!/usr/bin/env -S node

import pkg from 'replace-in-file'
const { replaceInFile } = pkg

const version = process.argv.slice(2)[0]

if (!version) {
  console.error('No version specified')
  process.exit(1)
}

replaceInFile({
  files: './**/*.tf',
  from: [
    /terraform-modules\?ref=(.+?)\//g,
    /terraform-modules\/(.+)\?ref=(.+?)"/g,
  ],
  to: [
    `terraform-modules?ref=${version}/`,
    `terraform-modules/$1?ref=${version}"`,
  ],
}).then((results) => {
  console.log('Replacement results:', results)
})
