function notify(message: string, type: string, isPersistent: boolean) {
  const notification = createElement(`
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
  `);

  const notificationsPanel = document.getElementById('instant-messages');

  let visible = true;

  const hide = () => {
    if (visible) {
      visible = false;

      fadeOut(notificationsPanel, notification);
    }
  };

  const closeButton = notification.getElementsByClassName('close-button')[0];
  closeButton.addEventListener('click', hide);

  notificationsPanel.appendChild(notification);

  if (!isPersistent) {
    setTimeout(hide, 5000);
  }
}

function createElement(html: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstElementChild as HTMLElement;
}

function fadeOut(parent: HTMLElement, child: HTMLElement) {
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

export function info(message: string, isPersistent: boolean = false) {
  notify(message, '', isPersistent);
}

export function error(message: string, isPersistent: boolean = false){
  notify(message, 'error', isPersistent);
}
