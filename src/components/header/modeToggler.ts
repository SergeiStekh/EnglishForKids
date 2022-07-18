import Control, { ControlNodeOptionsInterface } from '../control/control';

export interface TogglerInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  modeName: Control;
  modeNameTitle: 'Learn' | 'Play';
  checkbox: Control;
  renderToggler(): void;
  onToggle?(): void;
}

export default class ModeToggler extends Control implements TogglerInterface {
  checkbox: Control;

  modeName: Control;

  modeNameTitle: 'Learn' | 'Play';
  
  onToggle?(): void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface, modeNameTitle: 'Learn' | 'Play') {
    super(parent, options);
    this.modeNameTitle = modeNameTitle;
    this.checkbox = new Control(this.node, {
      type: 'input',
      className: 'mode-toggler__checkbox',
      attributes: [{ type: 'checkbox' }],
    });
    this.modeName = new Control(this.node, {
      type: 'p',
      className: 'mode-toggler__mode',
      innerText: this.modeNameTitle,
    });
    this.renderToggler();
    this.node.onclick = (e: Event) => {
      e.preventDefault();
      this.onToggle?.();
    };
  }

  enableToggler() {
    this.checkbox?.node.setAttribute('checked', 'true');
  }

  disableToggler() {
    this.checkbox?.node.removeAttribute('checked');
  }

  renderToggler(): void {
    new Control(this.node, { type: 'div', className: 'mode-toggler__background' });
    new Control(this.node, { type: 'span', className: 'mode-toggler__slider' });
  }

  hideModeToggler() {
    this.node.style.opacity = '0';
    this.node.onclick = () => null;
  }

  showModeToggler() {
    this.node.style.opacity = '1';
    this.node.onclick = (e: Event) => {
      e.preventDefault();
      this.onToggle?.();
    };
  }
}
