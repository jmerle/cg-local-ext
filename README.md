# CG Local Extension

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/ihakjfajoihlncbnggmcmmeabclpfdgo.svg)](https://chrome.google.com/webstore/detail/cg-local/ihakjfajoihlncbnggmcmmeabclpfdgo)
[![Mozilla Add-on](https://img.shields.io/amo/v/cg-local.svg)](https://addons.mozilla.org/en-US/firefox/addon/cg-local/)

A WebExtension which helps to synchronize the CodinGame IDE with a local file. Has to be used in combination with [cg-local-app](https://github.com/jmerle/cg-local-app), which takes care of the file watching.

## Packaging
This section is meant for anyone who wants to package the extension manually, but is especially written for the Mozilla volunteers who need to re-package the extension to be able to diff-check it with what I submit to AMO.

Versions used:  
Node.js: 9.0.0  
Yarn: 1.3.2  
Windows: 10 Pro

```bash
# Clone the repository (if you are not a Mozilla reviewer)
git clone https://github.com/jmerle/cg-local-ext.git

# cd into the extension folder
cd cg-local-ext

# Install the dependencies
yarn

# Package the extension
yarn package
```

The packaged extension can be found in the `dist` directory.

## Contributing
Contributions are welcome, just make sure you send your pull requests towards the development branch.
