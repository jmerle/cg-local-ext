const chromeLaunch = require('chrome-launch');

chromeLaunch('https://www.codingame.com/', {
  args: ['--start-maximized', '--load-extension=./build'],
});
