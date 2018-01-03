import { EventEmitter } from "eventemitter3";
import { isFirefox } from "../utils/browsers";

declare global {
  function cloneInto(obj: any, target: any, options?: any): void;
}

export default class Editor extends EventEmitter {
  constructor() {
    super();

    this.handleEvent = this.handleEvent.bind(this);
    window.document.addEventListener('IDEToExternalEditor', this.handleEvent);
  }

  handleEvent(ev: Event) {
    const detail = (ev as CustomEvent).detail;

    switch (detail.status) {
      case EditorEventType.ConnectExternal:
        this.emit(EditorEventType.ConnectExternal);
        break;
      case EditorEventType.DisconnectExternal:
        this.emit(EditorEventType.DisconnectExternal);
        break;
      case EditorEventType.QuestionDetails:
        this.emit(EditorEventType.QuestionDetails, {
          title: detail.title,
          questionId: detail.questionId,
        });
        break;
      case EditorEventType.CodeUpdated:
        this.emit(EditorEventType.CodeUpdated, {
          code: detail.code,
        });
        break;
      case EditorEventType.Submitted:
        this.emit(EditorEventType.Submitted);
        break;
    }
  }

  dispose() {
    window.document.removeEventListener('IDEToExternalEditor', this.handleEvent);
  }

  registerExternal(name: string, version: string) {
    this.emitToEditor('status', { name, version });
  }

  setReadOnly(state: boolean) {
    this.emitToEditor('setReadOnly', { value: state });
  }

  setSynchronized(state: boolean) {
    this.emitToEditor('synchronized', { value: state });
  }

  setCode(code: string) {
    this.emitToEditor('updateCode', {
      code: code.replace(/\r\n|\r/g, '\n'),
    });
  }

  getCode() {
    this.emitToEditor('getCode');
  }

  play() {
    this.emitToEditor('play');
  }

  emitToEditor(event: string, data: any = {}) {
    data.status = event;

    if (isFirefox()) {
      data = cloneInto(data, window);
    }

    const ev = new CustomEvent('ExternalEditorToIDE', { detail: data });
    window.document.dispatchEvent(ev);
  }
}

export enum EditorEventType {
  ConnectExternal = 'connect',
  DisconnectExternal = 'disconnect',
  QuestionDetails = 'questionDetails',
  CodeUpdated = 'updateCode',
  Submitted = 'submitted',
}
