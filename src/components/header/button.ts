import Control, { ControlNodeOptionsInterface } from '../control/control';

export interface ButtonInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  onClick?(categoryId: string): void;
}

export default class Button extends Control implements ButtonInterface {
  onClick?(categoryId: string): void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface) {
    super(parent, options);
    this.node.onclick = () => this.onClick?.('');
  }
}
