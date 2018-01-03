import { WebSocketPort } from "../constants";
import { ExtensionMessage, ExtensionMessageAction, sendToContent } from "../utils/extension-messaging";
import { ApplicationMessage, ApplicationMessageAction } from "./application-messaging";
import MessageSender = browser.runtime.MessageSender;

let ws: WebSocket = null;
let connectedTabId: number = null;

function connect(tabId: number) {
  if (ws === null) {
    ws = new WebSocket(`ws://localhost:${WebSocketPort}/`);

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

function disconnect() {
  if (ws !== null) {
    ws.close(1000);
    ws = null;
  }
}

function onMessage(event: MessageEvent) {
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

function onClose(event: CloseEvent) {
  sendToContent(connectedTabId, ExtensionMessageAction.AppDisconnected);

  if (event.code !== 1000) {
    sendToContent(connectedTabId, ExtensionMessageAction.Error, {
      message: 'An error occurred. Make sure the CG Local app is running and try again.',
    });
  }

  ws = null;
}

function send(action: ApplicationMessageAction, payload: any = {}) {
  ws.send(JSON.stringify({ action, payload }));
}

function handleMessage(message: ExtensionMessage, sender: MessageSender) {
  if (!sender.tab) return;

  switch (message.action) {
    case ExtensionMessageAction.ConnectApp:
      connect(sender.tab.id);
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

function handleTabClosed(tabId: number, removeInfo: any) {
  if (connectedTabId === tabId) {
    disconnect();
  }
}

export default function initApplication() {
  browser.runtime.onMessage.addListener(handleMessage);
  browser.tabs.onRemoved.addListener(handleTabClosed);
}
