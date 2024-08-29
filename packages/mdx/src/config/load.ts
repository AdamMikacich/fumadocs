import * as path from 'node:path';
import { build } from 'esbuild';
import { validateConfig } from '@/config/validate';
import { type Collections } from '@/config/define';
import { type GlobalConfig } from '@/config/types';

export function findConfigFile(): string {
  return path.resolve('source.config.ts');
}

export interface LoadedConfig {
  collections: Map<string, Collections>;
  global?: GlobalConfig;

  _runtime: {
    /**
     * Absolute file path and their associated collections
     */
    files: Map<string, string>;
  };
}

export async function loadConfig(configPath: string): Promise<LoadedConfig> {
  const outputPath = path.resolve('.source/source.config.mjs');

  const transformed = await build({
    entryPoints: [configPath],
    bundle: true,
    outdir: '.source',
    target: 'node18',
    write: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    outExtension: {
      '.js': '.mjs',
    },
    splitting: true,
  });

  if (transformed.errors.length > 0) {
    throw new Error('failed to compile configuration file');
  }

  const [err, config] = validateConfig(
    (await import(outputPath)) as Record<string, unknown>,
  );

  if (err !== null) throw new Error(err);
  return config;
}
