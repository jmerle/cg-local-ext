# CG Local Extension

[link-cws]: https://chromewebstore.google.com/detail/cg-local/ihakjfajoihlncbnggmcmmeabclpfdgo
[link-amo]: https://addons.mozilla.org/en-US/firefox/addon/cg-local/

[![Build Status](https://github.com/jmerle/cg-local-ext/workflows/Build/badge.svg)](https://github.com/jmerle/cg-local-ext/actions/workflows/build.yml)  
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/ihakjfajoihlncbnggmcmmeabclpfdgo.svg)][link-cws]
[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/ihakjfajoihlncbnggmcmmeabclpfdgo.svg)][link-cws]
[![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/rating/ihakjfajoihlncbnggmcmmeabclpfdgo.svg)][link-cws]  
[![Mozilla Add-on Version](https://img.shields.io/amo/v/cg-local.svg)][link-amo]
[![Mozilla Add-on Users](https://img.shields.io/amo/users/cg-local.svg)][link-amo]
[![Mozilla Add-on Rating](https://img.shields.io/amo/rating/cg-local.svg)][link-amo]

A browser extension which helps in synchronizing the CodinGame IDE with a local file. Has to be used in combination with [cg-local-app](https://github.com/jmerle/cg-local-app) which takes care of the local filesystem and makes configuration easy through a GUI. See the [CodinGame topic](https://www.codingame.com/forum/t/cg-local/10359/1) for more information.

## Install
- [**Chrome** extension][link-cws] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/ihakjfajoihlncbnggmcmmeabclpfdgo.svg?label=%20">][link-cws]
- [**Firefox** add-on][link-amo] [<img valign="middle" src="https://img.shields.io/amo/v/cg-local.svg?label=%20">][link-amo]

## Mozilla Reviewers
The information provided below is meant for Mozilla volunteers.

Software versions used:  
Node.js: 20.14.0  
PNPM: 9.2.0

Third-party libraries that can be found in the extension:
- [eventemitter3 5.0.1](https://github.com/primus/eventemitter3/blob/5.0.1/index.js)

Package the extension by `cd`'ing into the source code submission directory, installing the dependencies with `pnpm install` and packaging with `pnpm package:firefox`. The result can be found in the `dist/` directory.
