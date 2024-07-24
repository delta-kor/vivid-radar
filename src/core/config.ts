import fs from 'fs';
import yaml from 'js-yaml';
import { z, ZodError } from 'zod';

export interface ConfigData {
  bstage: BstageConfigData;
}

export interface BstageConfigData {
  host: string;
}

const BstageConfigSchema = z.object({
  host: z.string().min(1),
});

const ConfigSchema = z.object({
  bstage: BstageConfigSchema,
});

export default class Config {
  private config!: ConfigData;

  constructor(configPath?: string) {
    this.loadConfigFile(configPath);
  }

  private loadConfigFile(configPath?: string) {
    const path = configPath || 'config.yaml';
    const file = fs.readFileSync(path, 'utf8');
    const data = yaml.load(file);

    try {
      this.config = ConfigSchema.parse(data);
    } catch (e) {
      if (e instanceof ZodError) {
        const message = e.errors[0].message;
        throw new Error(`Error parsing config file: ${message}`);
      }

      throw e;
    }
  }
}
