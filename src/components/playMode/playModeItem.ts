import Control, { ControlNodeOptionsInterface } from '../control/control';
import { CardInterface } from '../../assistFunctions/fetchData';

export interface PlayModeItemInterface {
  wordData: CardInterface;
  card: Control;
  cardImage?: Control;
  buildCard(): void;
  addEvents(): void;
  updateWordData(wordData: CardInterface): void;
  onWordClick?: (wordId: string, word: string) => void;
  makeInactive(): void;
  makeActive(): void;
  showWrongAnswer(): void;
  attachNodeToDom(): void;
  removeNodeFromDom(): void;
}

export default class PlayModeItem extends Control implements PlayModeItemInterface {
  wordData: CardInterface;

  card: Control;

  cardImage?: Control;

  onWordClick?: (wordId: string, word: string) => void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface, wordData: CardInterface) {
    super(parent, options);
    this.wordData = wordData;
    this.card = new Control(this.node, { type: 'div', className: 'play-card__front' });
    this.buildCard();
    this.addEvents();
  }

  buildCard(): void {
    const { cardWordInEnglish } = this.wordData;
    const cardImageWrapper = new Control(this.card.node, { type: 'div', className: 'play-card__image-wrapper' });
    this.cardImage = new Control(cardImageWrapper.node, {
      type: 'img',
      className: 'play-card__image',
      attributes: [{ src: `./assets/images/${cardWordInEnglish.toLowerCase()}.png` }, { alt: cardWordInEnglish }],
    });
  }

  makeInactive() {
    this.card.changeClass('play-card__front inactive');
  }

  makeActive() {
    this.card.changeClass('play-card__front');
  }

  showWrongAnswer() {
    this.card.changeClass('play-card__front wrong');
    setTimeout(() => {
      this.card.changeClass('play-card__front');
    }, 1000);
  }

  addEvents() {
    if (this.cardImage) {
      this.cardImage.node.onclick = () => this.onWordClick?.(this.wordData.cardId, this.wordData.cardWordInEnglish);
    }
  }

  updateWordData(wordData: CardInterface): void {
    this.wordData = wordData;
  }
}
