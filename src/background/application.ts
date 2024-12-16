import type { Runtime } from 'webextension-polyfill';
import { browser } from '../browser';
import { ExtensionMessage, ExtensionMessageAction, sendToContent } from '../extension-messaging';
import { ApplicationMessage, ApplicationMessageAction } from './application-messaging';

let ws: WebSocket = null;
let connectedTabId: number = null;

function disconnect(): void {
  if (ws !== null) {
    ws.close(1000);
    ws = null;
  }
}

function onMessage(event: MessageEvent): void {
  const msg: ApplicationMessage = JSON.parse(event.data);

  switch (msg.action) {
    case ApplicationMessageAction.SendDetails:
      sendToContent(connectedTabId, ExtensionMessageAction.SendDetails);
      break;
    case ApplicationMessageAction.AppReady:
      sendToContent(connectedTabId, ExtensionMessageAction.AppConnected);
      break;
    case ApplicationMessageAction.AlreadyConnected:
      sendToContent(connectedTabId, ExtensionMessageAction.Error, {
        message: 'CG Local is already in use by another browser tab.',
      });

      ws.close(1000);
      break;
    case ApplicationMessageAction.UpdateCode:
      sendToContent(connectedTabId, ExtensionMessageAction.UpdateCode, msg.payload);
      break;
    case ApplicationMessageAction.SendCode:
      sendToContent(connectedTabId, ExtensionMessageAction.SendCode);
      break;
    case ApplicationMessageAction.SetReadOnly:
      sendToContent(connectedTabId, ExtensionMessageAction.SetReadOnly, msg.payload);
      break;
    case ApplicationMessageAction.Error:
      disconnect();
      sendToContent(connectedTabId, ExtensionMessageAction.Error, msg.payload);
      break;
  }
}

function onClose(event: CloseEvent): void {
  sendToContent(connectedTabId, ExtensionMessageAction.AppDisconnected);

  if (event.code !== 1000) {
    sendToContent(connectedTabId, ExtensionMessageAction.Error, {
      message: 'An error occurred. Make sure the CG Local app is running and try again.',
    });
  }

  ws = null;
}

function connect(tabId: number): void {
  if (ws === null) {
    ws = new WebSocket(`ws://localhost:53135/`);

    ws.onmessage = onMessage;
    ws.onclose = onClose;

    connectedTabId = tabId;
  } else {
    sendToContent(tabId, ExtensionMessageAction.Error, {
      message: 'CG Local is already in use by another browser tab.',
    });

    sendToContent(tabId, ExtensionMessageAction.AppDisconnected);
  }
}

function keepAlive(): void {
  const keepAliveIntervalId = setInterval(
    () => {
      if (ws) {
        browser.storage.session.set({ keepAlive: new Date().getTime() });
      } else {
        clearInterval(keepAliveIntervalId);
      }
    },
    // Set the interval to 20 seconds to prevent the service worker from becoming inactive.
    20 * 1000,
  );
}

function send(action: ApplicationMessageAction, payload: any = {}): void {
  ws.send(JSON.stringify({ action, payload }));
}

async function handleMessage(message: ExtensionMessage | any, sender: Runtime.MessageSender): Promise<void> {
  if (!sender.tab) return;

  switch (message.action) {
    case ExtensionMessageAction.ConnectApp:
      connect(sender.tab.id);
      keepAlive();
      break;
    case ExtensionMessageAction.DisconnectApp:
      if (connectedTabId === sender.tab.id) {
        disconnect();
      }
      break;
    case ExtensionMessageAction.Details:
      send(ApplicationMessageAction.Details, message.payload);
      break;
    case ExtensionMessageAction.Code:
      send(ApplicationMessageAction.Code, message.payload);
      break;
  }
}

function handleTabClosed(tabId: number): void {
  if (connectedTabId === tabId) {
    disconnect();
  }
}

export function initApplication(): void {
  browser.runtime.onMessage.addListener(handleMessage);
  browser.tabs.onRemoved.addListener(handleTabClosed);
}
