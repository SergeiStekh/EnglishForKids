import Control, { ControlNodeOptionsInterface } from '../control/control';
import { CategoryDataType } from '../../assistFunctions/fetchData';
import MenuItem, { MenuItemInterface } from './menuItem';

export interface MenuInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  menuItems: MenuItemInterface[];
  burger: Control;
  overlay: Control;
  isMenuOpen: boolean;
  categoriesData: { categoryId: string; categoryName: string }[];
  currentCategoryId: string;
  updateCategoriesData(categoriesData: CategoryDataType[], currentCategoryId: string): void;
  updateActiveCategory(currentCategoryId: string): void;
  onToggleMenu(): void;
  onCategoryChange?(categoryId: string): void;
}

export default class Menu extends Control implements MenuInterface {
  menuItems: MenuItemInterface[];

  burger: Control;

  overlay: Control;

  isMenuOpen: boolean;

  categoriesData: { categoryId: string; categoryName: string }[];

  currentCategoryId: string;
  
  onCategoryChange?(categoryId: string): void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface) {
    super(parent, options);
    this.menuItems = [];
    this.isMenuOpen = false;
    this.categoriesData = [];
    this.currentCategoryId = '';
    this.burger = new Control(this.node, {
      type: 'img',
      className: 'burger',
      attributes: [{ src: './assets/images/burger.svg' }],
    });
    this.overlay = new Control(this.node, { type: 'div', className: 'nav__overlay' });
    this.overlay.node.onclick = () => this.onToggleMenu();
    this.burger.node.onclick = () => this.onToggleMenu();
  }

  updateCategoriesData(categoriesData: CategoryDataType[], currentCategoryId: string) {
    this.categoriesData = [...categoriesData].map((el) => {
      return { categoryId: el.categoryId, categoryName: el.categoryName };
    });
    this.currentCategoryId = currentCategoryId;
    if (this.menuItems.length === 0) {
      this.renderMenu();
    } else {
      this.updateActiveCategory(currentCategoryId);
    }
  }

  renderMenu() {
    const menuItemsList = new Control(this.node, { type: 'ul', className: 'nav__list' });
    this.menuItems = this.categoriesData.map((el) => {
      const isMenuItemActive: boolean = el.categoryId === this.currentCategoryId;
      const menuItemClassName: string = isMenuItemActive ? 'nav__item active' : 'nav__item';
      const menuItem = new MenuItem(menuItemsList.node, { type: 'li', className: menuItemClassName, innerText: el.categoryName }, el.categoryId);
      menuItem.onCategoryChange = (categoryId: string): void => {
        this.onCategoryChange?.(categoryId);
      };
      return menuItem;
    });

    const statisticsMenuitem = new MenuItem(menuItemsList.node, { type: 'li', className: 'nav__item', innerText: 'Statistics' }, 'statistics');
    statisticsMenuitem.node.onclick = () => {
      this.updateActiveCategory('statistics');
      this.onCategoryChange?.('statistics');
    };
    this.menuItems.push(statisticsMenuitem);
  }

  updateActiveCategory(currentCategoryId: string): void {
    if (currentCategoryId === 'statistics') {
      this.menuItems.forEach((el) => {
        if (el.categoryId !== 'statistics') {
          el.changeClass('nav__item');
        } else {
          el.changeClass('nav__item active');
        }
      });
    } else {
      this.currentCategoryId = currentCategoryId;
      this.menuItems.forEach((el) => {
        if (el.categoryId !== this.currentCategoryId) {
          el.changeClass('nav__item');
        } else {
          el.changeClass('nav__item active');
        }
      });
    }

    if (this.isMenuOpen) {
      this.onToggleMenu();
    }
  }

  onToggleMenu(): void {
    if (!this.isMenuOpen) {
      this.burger.changeClass('burger open');
      this.overlay.changeClass('nav__overlay visible');
      document.body.style.overflow = 'hidden';
    } else {
      this.burger.changeClass('burger');
      this.overlay.changeClass('nav__overlay');
      document.body.style.overflow = 'visible';
    }

    this.isMenuOpen = !this.isMenuOpen;
  }
}
