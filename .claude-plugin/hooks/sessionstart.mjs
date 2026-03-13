#!/usr/bin/env node
/**
 * SessionStart hook for prompt-caching plugin.
 * Outputs a status reminder so Claude knows caching is active this session.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const settingsPath = join(homedir(), '.claude', 'settings.json');

let cachingEnabled = false;
try {
  const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
  const mcpServers =
    settings?.mcpServers ?? settings?.['mcpServers'] ?? {};
  cachingEnabled = Object.keys(mcpServers).some((k) =>
    k.includes('prompt-caching')
  );
} catch {
  // settings unreadable — assume enabled since hook is running
  cachingEnabled = true;
}

if (cachingEnabled) {
  process.stdout.write(
    [
      'prompt-caching is active.',
      'Cache read tokens cost 0.1× normal rate (up to 90% savings).',
      'Tools: optimize_messages · get_cache_stats · analyze_cacheability · reset_cache_stats',
    ].join('\n') + '\n'
  );
}
