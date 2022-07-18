import Control, { ControlNodeOptionsInterface } from '../control/control';

export interface SingleCategoryDataInterface {
  categoryId: string;
  categoryName: string;
  categoryImageLink: string;
}

export interface CategoryItemInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  categoryBackground?: Control;
  buildCategoryItem(): void;
  onChooseCategory?: (categoryId: string) => void;
}

export default class CategoryItem extends Control implements CategoryItemInterface {
  categoryData: SingleCategoryDataInterface;

  onChooseCategory?: (categoryId: string) => void;

  categoryBackground?: Control;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface, categoryData: SingleCategoryDataInterface) {
    super(parent, options);
    this.categoryData = categoryData;
    this.buildCategoryItem();
    this.node.onclick = () => this.onChooseCategory?.(this.categoryData.categoryId);
  }

  buildCategoryItem(): void {
    const categoryImageWrapper = new Control(this.node, { type: 'div', className: 'category__image-wrapper' });
    this.categoryBackground = new Control(this.node, { type: 'div', className: 'category__background' });
    new Control(categoryImageWrapper.node, {
      type: 'img',
      className: 'category__image',
      attributes: [{ src: `./assets/images/${this.categoryData.categoryName.toLocaleLowerCase()}.svg` }],
    });
    new Control(this.node, { type: 'h2', className: 'category__title', innerText: this.categoryData.categoryName });
  }
}
