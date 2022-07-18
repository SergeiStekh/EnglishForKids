import Control, { ControlNodeOptionsInterface } from '../control/control';
import CategoryItem, { CategoryItemInterface, SingleCategoryDataInterface } from './categoryItem';

export interface CategoriesInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  itemViews: CategoryItemInterface[] | null;
  isCategoriesVisible: boolean;
  renderCategories(categoriesData: SingleCategoryDataInterface[]): void;
  updateCategories(): void;
  updateCategoriesStyle(mode: 'Play' | 'Learn'): void;
  onChooseCategory?: (categoryId: string) => void;
  removeNodeFromDom(): this;
  attachNodeToDom(): this;
}

export default class Categories extends Control implements CategoriesInterface {
  itemViews: CategoryItemInterface[] | null;

  isCategoriesVisible: boolean;

  onChooseCategory?: (categoryId: string) => void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface) {
    super(parent, options);
    this.isCategoriesVisible = false;
    this.itemViews = null;
  }

  renderCategories(categoriesData: SingleCategoryDataInterface[]): void {
    if (!this.itemViews) {
      this.itemViews = categoriesData.map((category) => {
        const view = new CategoryItem(this.node, { type: 'li', className: 'category__item' }, category);
        view.onChooseCategory = (categoryId: string) => {
          this.onChooseCategory?.(categoryId);
        };
        return view;
      });
      this.isCategoriesVisible = true;
    } else {
      this.updateCategories();
    }
  }

  updateCategories(): void {
    this.attachNodeToDom();
    this.isCategoriesVisible = true;
    
  }

  updateCategoriesStyle(mode: 'Play' | 'Learn' = 'Learn') {
    this.itemViews?.forEach((view) => {
      view.categoryBackground?.changeClass(`category__background background-${mode.toLowerCase()}`);
    });
  }
}
