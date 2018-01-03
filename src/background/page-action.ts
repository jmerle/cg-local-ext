import { isChrome } from "../utils/browsers";

declare global {
  const chrome: any;
}

export function showPageAction(tabId: number) {
  (isChrome() ? chrome : browser).pageAction.show(tabId);
}

export function hidePageAction(tabId: number) {
  (isChrome() ? chrome : browser).pageAction.hide(tabId);
}
