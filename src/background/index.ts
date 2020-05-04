import { browser, Runtime, Tabs } from 'webextension-polyfill-ts';
import { ExtensionMessage, ExtensionMessageAction, sendToContent } from '../extension-messaging';
import { disconnect, initApplication } from './application';

function checkTab(tabId: number, changeInfo: any, tab: Tabs.Tab): void {
  const isIDE = tab.url.includes('https://www.codingame.com/ide/');
  const isFileServlet = tab.url.includes('https://www.codingame.com/ide/fileservlet?id');

  if (isIDE && !isFileServlet) {
    if (changeInfo.status === 'complete') {
      sendToContent(tab.id, ExtensionMessageAction.InitContent);
    }
  } else {
    browser.pageAction.hide(tab.id);
    sendToContent(tab.id, ExtensionMessageAction.DisposeContent);
    disconnect();
  }
}

function handlePageActionClick(tab: Tabs.Tab): void {
  sendToContent(tab.id, ExtensionMessageAction.PageActionClicked);
}

function handleMessage(message: ExtensionMessage, sender: Runtime.MessageSender): void {
  if (!sender.tab) return;

  switch (message.action) {
    case ExtensionMessageAction.ShowPageAction:
      browser.pageAction.show(sender.tab.id);
      break;
    case ExtensionMessageAction.HidePageAction:
      browser.pageAction.hide(sender.tab.id);
      break;
  }
}

browser.tabs.onUpdated.addListener(checkTab);
browser.pageAction.onClicked.addListener(handlePageActionClick);
browser.runtime.onMessage.addListener(handleMessage);

initApplication();
