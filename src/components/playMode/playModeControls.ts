import Control, { ControlNodeOptionsInterface } from '../control/control';

export interface PlayModeControlsInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  button: Control;
  stars: Control[];
  onButtonClick?(): void;
}

export default class PlayModeControls extends Control implements PlayModeControlsInterface {
  button: Control;

  stars: Control[];
  onButtonClick?(): void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface) {
    super(parent, options);
    this.button = new Control(this.node, { type: 'button', className: 'play-mode-button', innerText: 'Start' });
    this.button.node.onclick = () => {
      this.onButtonClick?.();
    };
    this.stars = [];
  }

  addStar(type: 'green' | 'red', wrapperWidth: number): void {
    let starsQuantity = this.stars.length;
    let leftOffset = starsQuantity * 30;
    const maxQuantity = Math.floor(wrapperWidth / 30) - 1;

    if (starsQuantity < maxQuantity && type === 'green') {
      const newStar = new Control(this.node, {
        type: 'img',
        className: 'play-mode__star',
        attributes: [{ src: './assets/images/win.png' }, { style: `left: ${leftOffset}px` }],
      });
      this.stars.push(newStar);
    } else if (starsQuantity < maxQuantity && type === 'red') {
      const newStar = new Control(this.node, {
        type: 'img',
        className: 'play-mode__star',
        attributes: [{ src: './assets/images/lose.png' }, { style: `left: ${leftOffset}px` }],
      });
      this.stars.push(newStar);
    } else if (starsQuantity >= maxQuantity && type === 'green') {
      this.removeStars();
      starsQuantity = 0;
      leftOffset = starsQuantity * 30;
      const newStar = new Control(this.node, {
        type: 'img',
        className: 'play-mode__star',
        attributes: [{ src: './assets/images/win.png' }, { style: `left: ${leftOffset}px` }],
      });
      this.stars.push(newStar);
    } else if (starsQuantity >= maxQuantity && type === 'red') {
      this.removeStars();
      starsQuantity = 0;
      leftOffset = starsQuantity * 30;
      const newStar = new Control(this.node, {
        type: 'img',
        className: 'play-mode__star',
        attributes: [{ src: './assets/images/lose.png' }, { style: `left: ${leftOffset}px` }],
      });
      this.stars.push(newStar);
    }
  }

  removeStars(): void {
    this.stars.forEach((star) => {
      star.removeNodeFromDom();
    });
    this.stars = [];
  }

  changeButtonText(newText: string) {
    this.button.changeInnerText(newText);
  }
}
