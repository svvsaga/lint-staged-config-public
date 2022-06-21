#!/usr/bin/env -S node

import {
  readProjectConfigs,
  writeProjectConfig,
  writeSharedConfig,
} from './implementations/readProjectConfigs.js'

const { project, projectConfig, sharedConfig } = await readProjectConfigs()

await writeProjectConfig({ project, projectConfig })

writeSharedConfig(sharedConfig)
