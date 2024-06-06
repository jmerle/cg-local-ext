import * as fs from 'node:fs';
import * as path from 'node:path';
// @ts-expect-error There are no types for this import
import * as webExt from 'web-ext';
import { projectRoot, waitForBuild } from './utils';

await waitForBuild('firefox');

const extensionDir = path.join(projectRoot, 'build-firefox');
const tmpDir = path.join(projectRoot, 'firefox-tmp');

if (fs.existsSync(tmpDir)) {
  await fs.promises.rm(tmpDir, { recursive: true, force: true });
}

await fs.promises.mkdir(tmpDir);
process.env.TMPDIR = tmpDir;

await webExt.cmd.run(
  {
    sourceDir: extensionDir,
    startUrl: 'https://www.codingame.com/ide/puzzle/onboarding',
    pref: {
      'devtools.browserconsole.filter.jswarn': 'false',
      'devtools.webconsole.filter.warn': 'false',
    },
  },
  {
    shouldExitProgram: false,
  },
);
