import fs from 'fs';
import os from 'os';
import path from 'path';
import { WzToolsConfig } from './types.js';

const CONFIG_DIR = path.join(os.homedir(), '.wztools');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { mode: 0o700 });
  }
}

export function saveConfig(config: WzToolsConfig): void {
  ensureConfigDir();
  
  const configJson = JSON.stringify(config, null, 2);
  fs.writeFileSync(CONFIG_FILE, configJson, { mode: 0o600 });
}

export function loadConfig(): WzToolsConfig {
  if (!fs.existsSync(CONFIG_FILE)) {
    throw new Error('Configuration file not found. Please run "wztools init" first.');
  }
  
  try {
    const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
    return JSON.parse(configData) as WzToolsConfig;
  } catch (error) {
    throw new Error(`Failed to load configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function configExists(): boolean {
  return fs.existsSync(CONFIG_FILE);
}

export function getConfigPath(): string {
  return CONFIG_FILE;
} 