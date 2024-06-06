import type { Runtime, Tabs } from 'webextension-polyfill';
import { browser } from '../browser';
import { ExtensionMessage, ExtensionMessageAction, sendToContent } from '../extension-messaging';
import { initApplication } from './application';

function checkTab(tabId: number, changeInfo: any, tab: Tabs.Tab): void {
  const isIDE = tab.url.includes('https://www.codingame.com/ide/');
  const isFileServlet = tab.url.includes('https://www.codingame.com/ide/fileservlet?id');

  if (isIDE && !isFileServlet) {
    if (changeInfo.status === 'complete') {
      sendToContent(tab.id, ExtensionMessageAction.InitContent);
    }
  } else {
    browser.action.disable(tab.id);
    sendToContent(tab.id, ExtensionMessageAction.DisposeContent);
  }
}

function onAction(tab: Tabs.Tab): void {
  sendToContent(tab.id, ExtensionMessageAction.PageActionClicked);
}

function handleMessage(message: ExtensionMessage, sender: Runtime.MessageSender): void {
  if (!sender.tab) return;

  switch (message.action) {
    case ExtensionMessageAction.ShowPageAction:
      browser.action.enable(sender.tab.id);
      break;
    case ExtensionMessageAction.HidePageAction:
      browser.action.disable(sender.tab.id);
      break;
  }
}

browser.tabs.onUpdated.addListener(checkTab);
browser.action.onClicked.addListener(onAction);
browser.runtime.onMessage.addListener(handleMessage);

initApplication();
