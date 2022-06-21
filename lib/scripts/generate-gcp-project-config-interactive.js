#!/usr/bin/env -S node
import { readProjectConfigs, writeProjectConfig, writeSharedConfig, } from './implementations/readProjectConfigs';
const { project, projectConfig, sharedConfig } = await readProjectConfigs();
await writeProjectConfig({ project, projectConfig });
writeSharedConfig(sharedConfig);
