import Tab = browser.tabs.Tab;
import MessageSender = browser.runtime.MessageSender;
import { ExtensionMessage, ExtensionMessageAction, sendToContent } from "../utils/extension-messaging";
import { hidePageAction, showPageAction } from "./page-action";
import initApplication from "./application";

function checkTab(tabId: number, changeInfo: any, tab: Tab) {
  const isIDE = tab.url.includes('https://www.codingame.com/ide/');
  const isFileServlet = tab.url.includes('https://www.codingame.com/ide/fileservlet?id');

  if (isIDE && !isFileServlet) {
    if (changeInfo.status === 'complete') {
      sendToContent(tab.id, ExtensionMessageAction.InitContent);
    }
  } else {
    hidePageAction(tab.id);
    sendToContent(tab.id, ExtensionMessageAction.DisposeContent);
  }
}

function handlePageActionClick(tab: Tab) {
  sendToContent(tab.id, ExtensionMessageAction.PageActionClicked);
}

function handleMessage(message: ExtensionMessage, sender: MessageSender) {
  if (!sender.tab) return;

  switch (message.action) {
    case ExtensionMessageAction.ShowPageAction:
      showPageAction(sender.tab.id);
      break;
    case ExtensionMessageAction.HidePageAction:
      hidePageAction(sender.tab.id);
      break;
  }
}

browser.tabs.onUpdated.addListener(checkTab);
browser.pageAction.onClicked.addListener(handlePageActionClick);
browser.runtime.onMessage.addListener(handleMessage);

initApplication();
