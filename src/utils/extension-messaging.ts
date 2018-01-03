export interface ExtensionMessage {
  action: ExtensionMessageAction;
  payload: any;
}

export enum ExtensionMessageAction {
  Error,
  InitContent,
  DisposeContent,
  PageActionClicked,
  ShowPageAction,
  HidePageAction,
  ConnectApp,
  DisconnectApp,
  AppConnected,
  AppDisconnected,
  SendDetails,
  Details,
  UpdateCode,
  SendCode,
  Code,
  SetReadOnly
}

export function sendToContent(tabId: number, action: ExtensionMessageAction, payload: any = {}) {
  browser.tabs.sendMessage(tabId, { action, payload });
}

export function sendToBackground(action: ExtensionMessageAction, payload: any = {}) {
  browser.runtime.sendMessage({ action, payload });
}
