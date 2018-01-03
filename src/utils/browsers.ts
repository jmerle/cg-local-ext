function userAgentIncludes(value: string) {
  return window.navigator.userAgent.toLowerCase().includes(value);
}

export function isChrome() {
  return userAgentIncludes('chrome');
}

export function isFirefox() {
  return userAgentIncludes('firefox');
}
