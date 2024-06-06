import * as ChromeLauncher from 'chrome-launcher';
import { waitForBuild } from './utils';

await waitForBuild('chrome');

await ChromeLauncher.launch({
  startingUrl: 'https://www.codingame.com/ide/puzzle/onboarding',
  ignoreDefaultFlags: true,
  chromeFlags: ['--no-first-run', '--no-default-browser-check', '--start-maximized', '--load-extension=./build-chrome'],
});
