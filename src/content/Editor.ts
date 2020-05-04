import { EventEmitter } from 'eventemitter3';

declare global {
  function cloneInto(obj: any, target: any, options?: any): void;
}

export enum EditorEventType {
  ConnectExternal = 'connect',
  DisconnectExternal = 'disconnect',
  QuestionDetails = 'questionDetails',
  CodeUpdated = 'updateCode',
  Submitted = 'submitted',
}

export class Editor extends EventEmitter {
  public constructor() {
    super();

    this.handleEvent = this.handleEvent.bind(this);
    window.document.addEventListener('IDEToExternalEditor', this.handleEvent);
  }

  private handleEvent(ev: Event): void {
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

  public dispose(): void {
    window.document.removeEventListener('IDEToExternalEditor', this.handleEvent);
  }

  public registerExternal(name: string, version: string): void {
    this.emitToEditor('status', { name, version });
  }

  public setReadOnly(state: boolean): void {
    this.emitToEditor('setReadOnly', { value: state });
  }

  public setSynchronized(state: boolean): void {
    this.emitToEditor('synchronized', { value: state });
  }

  public setCode(code: string): void {
    this.emitToEditor('updateCode', {
      code: code.replace(/\r\n|\r/g, '\n'),
    });
  }

  public getCode(): void {
    this.emitToEditor('getCode');
  }

  public play(): void {
    this.emitToEditor('play');
  }

  private emitToEditor(event: string, data: any = {}): void {
    data.status = event;

    if (window.navigator.userAgent.toLowerCase().includes('firefox')) {
      data = cloneInto(data, window);
    }

    const ev = new CustomEvent('ExternalEditorToIDE', { detail: data });
    window.document.dispatchEvent(ev);
  }
}
