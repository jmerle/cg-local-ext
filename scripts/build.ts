import * as fs from 'node:fs';
import * as path from 'node:path';
import * as esbuild from 'esbuild';
import { projectRoot } from './utils';

const target = process.argv[2];
const isProduction = process.argv[3] === 'true';
const watch = process.argv[4] === 'true';

export async function getBuildDirectory(target: string): Promise<string> {
  const directory = path.resolve(projectRoot, `build-${target}`);

  if (fs.existsSync(directory)) {
    await fs.promises.rm(directory, { recursive: true });
  }

  await fs.promises.mkdir(directory, { recursive: true });
  return directory;
}

const buildDirectory = await getBuildDirectory(target);

await Promise.all(
  [
    {
      from: async () => {
        const packageJsonFile = path.join(projectRoot, 'package.json');
        const packageJsonContent = await fs.promises.readFile(packageJsonFile, { encoding: 'utf-8' });
        const packageJson = JSON.parse(packageJsonContent);

        const manifest: Record<string, any> = {
          manifest_version: 3,

          name: packageJson.productName,
          description: packageJson.description,
          version: packageJson.version,

          author: packageJson.author,
          homepage_url: packageJson.repository,

          permissions: ['tabs', 'storage'],

          icons: {
            '16': 'icons/icon-16.png',
            '19': 'icons/icon-19.png',
            '20': 'icons/icon-20.png',
            '24': 'icons/icon-24.png',
            '32': 'icons/icon-32.png',
            '38': 'icons/icon-38.png',
            '48': 'icons/icon-48.png',
            '64': 'icons/icon-64.png',
            '96': 'icons/icon-96.png',
            '128': 'icons/icon-128.png',
          },

          action: {
            default_title: 'Enable CG Local',
            default_icon: {
              '16': 'icons/icon-16.png',
              '19': 'icons/icon-19.png',
              '20': 'icons/icon-20.png',
              '24': 'icons/icon-24.png',
              '32': 'icons/icon-32.png',
              '38': 'icons/icon-38.png',
              '48': 'icons/icon-48.png',
              '64': 'icons/icon-64.png',
              '96': 'icons/icon-96.png',
            },
          },

          content_scripts: [
            {
              matches: ['https://www.codingame.com/*'],
              js: ['js/content/index.js'],
            },
          ],
        };

        if (target === 'chrome') {
          manifest.background = {
            service_worker: 'js/background/index.js',
            type: 'module',
          };
        } else {
          manifest.background = {
            scripts: ['js/background/index.js'],
            type: 'module',
          };

          manifest.content_security_policy = {
            extension_pages: "default-src 'self'; connect-src ws://localhost:53135",
          };

          manifest.browser_specific_settings = {
            gecko: {
              id: '{5aa8ef53-de72-474a-8ef1-03960a8e19f7}',
            },
          };
        }

        return JSON.stringify(manifest, null, 2);
      },
      to: path.resolve(buildDirectory, 'manifest.json'),
    },
    {
      from: path.resolve(projectRoot, 'icons'),
      to: path.resolve(buildDirectory, 'icons'),
    },
    {
      from: path.resolve(projectRoot, 'LICENSE'),
      to: path.resolve(buildDirectory, 'LICENSE'),
    },
  ].map(async ({ from, to }) => {
    if (typeof from === 'function') {
      await fs.promises.writeFile(to, await from());
    } else {
      await fs.promises.cp(from, to, { recursive: true });
    }

    console.log(`Created ${path.relative(projectRoot, to)}`);
  }),
);

const options: esbuild.BuildOptions = {
  entryPoints: [
    path.resolve(projectRoot, 'src/background/index.ts'),
    path.resolve(projectRoot, 'src/content/index.ts'),
  ],
  outdir: path.resolve(buildDirectory, 'js'),
  bundle: true,
  format: 'esm',
  minifyWhitespace: isProduction,
  minifySyntax: isProduction,
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
