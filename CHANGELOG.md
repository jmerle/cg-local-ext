# Changelog

## [1.2.0](https://github.com/jmerle/cg-local-ext/releases/tag/1.2.0) (2024-09-28)
- Updated to Manifest V3. As a result, there are now separate distributions for Chrome and Firefox. The code of both is the same, but the extension manifest differs. If you're installing via the Chrome Web Store or Mozilla's AMO this will not affect you. If you install the extension manually you'll need to make sure you download the correct distribution, the Chrome version is not compatible with Firefox and vice-versa.

## 1.1.1 (2020-05-07)
- Reverted the disconnect bug fix from 1.1.0, it causes the extension to disconnect from the application when any browser tab other than the connected tab gets updated

## [1.1.0](https://github.com/jmerle/cg-local-ext/releases/tag/1.1.0) (2020-05-05)
- Removed the usage of innerHTML
- Fixed a bug where the extension would not disconnect from the CG Local application when moving away from CodinGame while being connected to the application

## 1.0.1 (2018-01-03)
- Fix Chrome Web Store compatibility

## 1.0.0 (2018-01-03)
- Initial release
