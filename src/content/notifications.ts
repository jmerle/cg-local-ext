function createDiv(...classes: string[]): HTMLElement {
  const div = document.createElement('div');
  div.classList.add(...classes);
  return div;
}

function fadeOut(parent: HTMLElement, child: HTMLElement): void {
  const interval = setInterval(() => {
    if (!child.style.opacity) {
      child.style.opacity = '1';
    }

    const opacity = parseFloat(child.style.opacity || '1.0');

    if (opacity < 0.1) {
      clearInterval(interval);
      parent.removeChild(child);
    } else {
      child.style.opacity = (opacity - 0.1).toString();
    }
  }, 40);
}

function notify(message: string, type: string, isPersistent: boolean): void {
  /*
    <div class="instant-message ${type}">
      <div class="instant-message-inner">
        <div class="instant-message-image">
          <div class="placeholder"></div>
        </div>

        <div class="instant-message-content">
          <div class="title">CG Local</div>
          <div class="subtitle">${message}</div>
        </div>

        <button type="button" class="close-button"></button>
      </div>
    </div>
  */

  const notification = createDiv('instant-message', type);

  const notificationInner = createDiv('instant-message-inner');

  const notificationImage = createDiv('instant-message-image');
  notificationImage.appendChild(createDiv('placeholder'));

  const notificationContent = createDiv('instant-message-content');

  const notificationTitle = createDiv('title');
  notificationTitle.textContent = 'CG Local';

  const notificationMessage = createDiv('subtitle');
  notificationMessage.textContent = message;

  notificationContent.appendChild(notificationTitle);
  notificationContent.appendChild(notificationMessage);

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');

  notificationInner.appendChild(notificationImage);
  notificationInner.appendChild(notificationContent);
  notificationInner.appendChild(closeButton);

  notification.appendChild(notificationInner);

  const notificationsPanel = document.getElementById('instant-messages');

  let visible = true;

  const hide = (): void => {
    if (visible) {
      visible = false;

      fadeOut(notificationsPanel, notification);
    }
  };

  closeButton.addEventListener('click', hide);
  notificationsPanel.appendChild(notification);

  if (!isPersistent) {
    setTimeout(hide, 5000);
  }
}

export function info(message: string, isPersistent: boolean = false): void {
  notify(message, '', isPersistent);
}

export function error(message: string, isPersistent: boolean = false): void {
  notify(message, 'error', isPersistent);
}
