# CG Local Extension

[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/ihakjfajoihlncbnggmcmmeabclpfdgo.svg)](https://chrome.google.com/webstore/detail/cg-local/ihakjfajoihlncbnggmcmmeabclpfdgo)
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/ihakjfajoihlncbnggmcmmeabclpfdgo.svg)](https://chrome.google.com/webstore/detail/cg-local/ihakjfajoihlncbnggmcmmeabclpfdgo)  
[![Mozilla Add-on Version](https://img.shields.io/amo/v/cg-local.svg)](https://addons.mozilla.org/en-US/firefox/addon/cg-local/)
[![Mozilla Add-on Users](https://img.shields.io/amo/users/cg-local.svg)](https://addons.mozilla.org/en-US/firefox/addon/cg-local/)

A browser extension which helps in synchronizing the CodinGame IDE with a local file. Has to be used in combination with [cg-local-app](https://github.com/jmerle/cg-local-app) which takes care of the file watching. See the [CodinGame topic](https://www.codingame.com/forum/t/cg-local/10359/1) for more information.

## Mozilla Reviewers
The information provided below is meant for Mozilla volunteers.

Software versions used:  
Node.js: 12.16.1  
Yarn: 1.22.4

Third-party libraries that can be found in the extension:  
- [webextension-polyfill-ts 0.15.0](https://github.com/Lusito/webextension-polyfill-ts/blob/0.15.0/src/generated/index.ts)

Package the extension by `cd`'ing into the source code submission directory, installing the dependencies with `yarn` and packaging with `yarn package`. The result can be found in the dist/ directory.
