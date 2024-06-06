import type { Tabs } from 'webextension-polyfill';
import { browser } from '../browser';
import { ExtensionMessageAction, sendToContent } from '../extension-messaging';
import { initApplication } from './application';

function checkTab(tabId: number, changeInfo: any, tab: Tabs.Tab): void {
  const isIDE = tab.url.includes('https://www.codingame.com/ide/');
  const isFileServlet = tab.url.includes('https://www.codingame.com/ide/fileservlet?id');

  if (isIDE && !isFileServlet) {
    if (changeInfo.status === 'complete') {
      sendToContent(tab.id, ExtensionMessageAction.InitContent);
    }
  } else {
    sendToContent(tab.id, ExtensionMessageAction.DisposeContent);
  }
}

function onAction(tab: Tabs.Tab): void {
  sendToContent(tab.id, ExtensionMessageAction.ActionClicked);
}

browser.tabs.onUpdated.addListener(checkTab);
browser.action.onClicked.addListener(onAction);

initApplication();
