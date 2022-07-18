import Control, { ControlInterface, ControlNodeOptionsInterface } from '../control/control';

interface TitleInterface extends ControlInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  initialText: string;
}

export default class Title extends Control implements TitleInterface {
  initialText: string;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface) {
    super(parent, options);
    this.initialText = 'Choose category!';
  }
}
