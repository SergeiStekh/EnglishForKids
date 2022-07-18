import Control, { ControlNodeOptionsInterface } from '../control/control';
import Title from './title';
import Menu, { MenuInterface } from './menu';
import ModeToggler from './modeToggler';
import Button from './button';
import { CategoryDataType } from '../../assistFunctions/fetchData';

export interface HeaderInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  wrapper: Control;
  menu: MenuInterface;
  modeToggler: ModeToggler;
  titleWrapper: Control;
  backButton: Control;
  title: Control;
  checkbox?: Control;
  modeNameTitle: 'Learn' | 'Play';
  addListeners(): void;
  onModeChange?: () => void;
  onCategoryChange?(categoryId: string): void;
  updateHeader(headerTitle: string, isShowingBackButton: boolean, isShowingModeToggler: boolean, categoriesData: CategoryDataType[], currentCategoryId: string): void
}

export default class Header extends Control implements HeaderInterface {
  wrapper: Control;

  menu: MenuInterface;

  modeToggler: ModeToggler;

  titleWrapper: Control;

  backButton: Button;

  title: Control;

  checkbox?: Control;

  modeNameTitle: 'Learn' | 'Play';

  onModeChange?: () => void;

  onCategoryChange?(categoryId: string): void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface, modeNameTitle: 'Learn' | 'Play') {
    super(parent, options);
    this.modeNameTitle = modeNameTitle;
    this.wrapper = new Control(this.node, { type: 'div', className: 'header__wrapper' });
    this.menu = new Menu(this.wrapper.node, { type: 'nav', className: 'nav', id: 'menu' });
    this.modeToggler = new ModeToggler(this.wrapper.node, { type: 'label', className: 'mode-toggler', id: 'toggler' }, this.modeNameTitle);
    this.titleWrapper = new Control(this.wrapper.node, { type: 'div', className: 'header__title-wrapper' });
    this.backButton = new Button(this.titleWrapper.node, { type: 'div', className: 'back-button' });
    this.title = new Title(this.titleWrapper.node, {
      type: 'div',
      className: 'header__title',
      innerText: 'Choose category!',
    });
    this.addListeners();
    this.backButton.hide();
  }

  addListeners(): void {
    this.menu.onCategoryChange = (categoryId: string): void => {
      this.onCategoryChange?.(categoryId);
    };

    this.backButton.onClick = (categoryId: string): void => {
      this.onCategoryChange?.(categoryId);
    };

    this.modeToggler.onToggle = () => {
      this.onModeChange?.();
    };
  }

  updateHeader(headerTitle: string, isShowingBackButton: boolean, isShowingModeToggler: boolean, categoriesData: CategoryDataType[], currentCategoryId: string) {
    this.title.changeInnerText(headerTitle);
    this.menu.updateCategoriesData(categoriesData, currentCategoryId);

    if (isShowingBackButton) {
      this.backButton.show();
    } else {
      this.backButton.hide();
    }

    if (isShowingModeToggler) {
      this.modeToggler.showModeToggler();
    } else {
      this.modeToggler.hideModeToggler();
    }

    if (headerTitle === 'Play' || headerTitle === 'Learn') {
      this.modeToggler.modeName.changeInnerText(headerTitle);
    }
  }
}
