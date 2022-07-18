import Control, { ControlNodeOptionsInterface } from '../control/control';

export interface MenuItemInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  categoryId: string;
  onCategoryChange?(categoryId: string): void;
  changeClass(className: string): this;
}

export default class MenuItem extends Control implements MenuItemInterface {
  categoryId: string;
  onCategoryChange?(categoryId: string): void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface, categoryId: string) {
    super(parent, options);
    this.categoryId = categoryId;
    this.node.onclick = () => this.onCategoryChange?.(this.categoryId);
  }
}
