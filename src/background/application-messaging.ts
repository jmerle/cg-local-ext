export interface ApplicationMessage {
  action: ApplicationMessageAction;
  payload: any;
}

export enum ApplicationMessageAction {
  SendDetails = 'send-details',
  Details = 'details',
  AppReady = 'app-ready',
  AlreadyConnected = 'already-connected',
  UpdateCode = 'update-code',
  SendCode = 'send-code',
  Code = 'code',
  SetReadOnly = 'set-read-only',
  Error = 'error',
}
