import type { Runtime } from 'webextension-polyfill';
import { browser } from '../browser';
import { ExtensionMessage, ExtensionMessageAction, sendToBackground } from '../extension-messaging';
import { Editor, EditorEventType } from './Editor';
import { error } from './notifications';

declare global {
  const packageData: any;
}

let canConnect = true;
let editor: Editor = null;
let questionDetails: any = null;

function connect(): void {
  if (canConnect) {
    canConnect = false;
    sendToBackground(ExtensionMessageAction.ConnectApp);
  }
}

function disconnect(): void {
  sendToBackground(ExtensionMessageAction.DisconnectApp);
}

function onConnected(): void {
  editor.setReadOnly(true);
  editor.setSynchronized(true);
}

function onDisconnected(): void {
  editor.setReadOnly(false);
  editor.setSynchronized(false);

  canConnect = true;
}

function init(): void {
  editor = new Editor();

  editor.on(EditorEventType.QuestionDetails, data => {
    questionDetails = data;
    editor.registerExternal('CG Local', packageData.version);
  });

  editor.on(EditorEventType.ConnectExternal, connect);
  editor.on(EditorEventType.DisconnectExternal, disconnect);

  editor.on(EditorEventType.CodeUpdated, data => {
    sendToBackground(ExtensionMessageAction.Code, data);
  });

  canConnect = true;
}

function dispose(): void {
  if (editor !== null) {
    disconnect();
    editor.dispose();
    editor = null;
  }
}

function handleMessage(message: ExtensionMessage, sender: Runtime.MessageSender): void {
  if (sender.tab) return;

  switch (message.action) {
    case ExtensionMessageAction.InitContent:
      init();
      break;
    case ExtensionMessageAction.DisposeContent:
      dispose();
      break;
    case ExtensionMessageAction.ActionClicked:
      connect();
      break;
    case ExtensionMessageAction.AppConnected:
      onConnected();
      break;
    case ExtensionMessageAction.AppDisconnected:
      onDisconnected();
      break;
    case ExtensionMessageAction.SendDetails:
      sendToBackground(ExtensionMessageAction.Details, questionDetails);
      break;
    case ExtensionMessageAction.UpdateCode:
      editor.setCode(message.payload.code);
      setTimeout(() => {
        if (message.payload.play) {
          editor.play();
        }
      }, 50);
      break;
    case ExtensionMessageAction.SendCode:
      editor.getCode();
      break;
    case ExtensionMessageAction.SetReadOnly:
      editor.setReadOnly(message.payload.state);
      break;
    case ExtensionMessageAction.Error:
      error(message.payload.message);
      break;
  }
}

browser.runtime.onMessage.addListener(handleMessage);
