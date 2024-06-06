import fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const projectRoot = path.dirname(__dirname);

export async function waitForBuild(target: string): Promise<void> {
  const backgroundFile = path.resolve(projectRoot, `build-${target}/js/background/index.js`);
  while (!fs.existsSync(backgroundFile)) {
    await new Promise(resolve => setTimeout(resolve, 250));
  }
}
