export interface ControlNodeOptionsInterface {
  type: string;
  className?: string[] | string;
  innerText?: string;
  id?: string | null;
  appendType?: 'append' | 'prepend';
  attributes?: { [key: string]: string }[] | undefined;
}

export interface ControlInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  node: HTMLElement;
  isVisible: boolean;
  addClassToNode(): this;
  addTextToNode(): this;
  addIdToNode(): this;
  addAttributesToNode(): this;
  attachNodeToDom(): this;
  changeClass(className: string): this;
  changeInnerText(innerText: string): this;
  hide(): void;
  show(): void;
  removeNodeFromDom(): void;
}

class Control implements ControlInterface {
  public parent: HTMLElement;

  public options: ControlNodeOptionsInterface;

  public node: HTMLElement;

  isVisible: boolean;

  constructor(
    parent: HTMLElement,
    { type = 'div', className = undefined, innerText = '', id = null, appendType = 'append', attributes = undefined }: ControlNodeOptionsInterface,
  ) {
    this.options = { type, className, innerText, id, appendType, attributes };
    this.node = document.createElement(this.options.type);
    this.parent = parent;
    this.isVisible = false;
    this.addClassToNode().addAttributesToNode().addIdToNode().addTextToNode().attachNodeToDom();
  }

  addClassToNode(): this {
    let classString: string | undefined;
    if (typeof this.options.className === 'string') {
      classString = this.options.className;
    } else {
      classString = this.options.className?.join(' ');
    }

    if (this.node && classString) {
      this.node.className = classString;
    }
    return this;
  }

  addAttributesToNode(): this {
    if (!this.node || !this.options.attributes) {
      return this;
    }

    this.options.attributes.forEach((attribute) => {
      const attributeName = Object.keys(attribute).join();
      const attributeValue = Object.values(attribute).join();

      this.node?.setAttribute(attributeName, attributeValue);
    });
    return this;
  }

  addTextToNode(): this {
    if (this.node && this.options.innerText) {
      this.node.innerText = this.options.innerText;
    }
    return this;
  }

  addIdToNode(): this {
    if (this.node && this.options.id) {
      this.node.id = this.options.id.toString();
    }
    return this;
  }

  attachNodeToDom(): this {
    if (!this.node) {
      return this;
    }
    this.isVisible = true;
    if (this.options.appendType === 'append') {
      this.parent.append(this.node);
    } else if (this.options.appendType === 'prepend') {
      this.parent.prepend(this.node);
    }
    return this;
  }

  changeClass(className: string): this {
    this.node.className = className;

    return this;
  }

  changeInnerText(innerText: string): this {
    this.node.innerText = innerText;
    return this;
  }

  hide(): void {
    this.node.style.display = 'none';
  }

  show(): void {
    this.node.style.display = 'block';
  }

  removeNodeFromDom(): this {
    if (!this.node || !this.isVisible) {
      return this;
    }
    this.parent.removeChild(this.node);
    this.isVisible = false;
    return this;
  }

}

export default Control;
