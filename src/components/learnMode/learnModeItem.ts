import Control, { ControlNodeOptionsInterface } from '../control/control';
import { CardInterface } from '../../assistFunctions/fetchData';

export interface LearnModeItemInterface {
  wordData: CardInterface;
  isCardRotated: boolean;
  cardFront: Control;
  cardFrontImage: Control | null;
  cardFrontText: Control | null;
  cardBack: Control;
  cardBackImage: Control | null;
  cardBackText: Control | null;
  rotateWordButton?: Control;
  buildCardFront(): void;
  buildCardBack(): void;
  addEvents(): void;
  rotateCard(e: Event): void;
  updateWordData(wordData: CardInterface): void;
  onWordClick?: (wordId: string, word: string) => void;
}

export default class LearnModeItem extends Control implements LearnModeItemInterface {
  wordData: CardInterface;

  isCardRotated: boolean;

  cardFront: Control;

  cardFrontImage: Control | null;

  cardFrontText: Control | null;

  cardBack: Control;

  cardBackImage: Control | null;

  cardBackText: Control | null;

  rotateWordButton?: Control;

  onWordClick?: (wordId: string, word: string) => void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface, wordData: CardInterface) {
    super(parent, options);
    this.wordData = wordData;
    this.isCardRotated = false;
    this.cardFront = new Control(this.node, { type: 'div', className: 'card__front' });
    this.cardFrontImage = null;
    this.cardFrontText = null;
    this.cardBack = new Control(this.node, { type: 'div', className: 'card__back' });
    this.cardBackImage = null;
    this.cardBackText = null;
    this.rotateWordButton = undefined;
    this.buildCardFront();
    this.buildCardBack();
    this.addEvents();
  }

  buildCardFront(): void {
    const { cardWordInEnglish } = this.wordData;

    const cardImageWrapper = new Control(this.cardFront.node, { type: 'div', className: 'card__image-wrapper' });
    this.cardFrontImage = new Control(cardImageWrapper.node, {
      type: 'img',
      className: 'card__image',
      attributes: [{ src: `./assets/images/${cardWordInEnglish.toLowerCase()}.png` }, { alt: cardWordInEnglish }],
    });
    const textWrapper = new Control(this.cardFront.node, { type: 'div', className: 'card__text-wrapper' });
    this.cardFrontText = new Control(textWrapper.node, {
      type: 'h2',
      className: 'card__title',
      innerText: cardWordInEnglish,
    });
    this.rotateWordButton = new Control(textWrapper.node, {
      type: 'img',
      className: 'card__rotate',
      attributes: [{ src: './assets/images/icon_rotate.svg' }, { alt: 'rotate' }],
    });
  }

  buildCardBack(): void {
    const { cardWordInEnglish, cardWordInPolish } = this.wordData;
    const cardBackImageWrapper = new Control(this.cardBack.node, { type: 'div', className: 'card__image-wrapper' });
    this.cardBackImage = new Control(cardBackImageWrapper.node, {
      type: 'img',
      className: 'card__image-back',
      attributes: [{ src: `./assets/images/${cardWordInEnglish.toLowerCase()}.png` }, { alt: cardWordInEnglish }],
    });
    const textWrapperBack = new Control(this.cardBack.node, { type: 'div', className: 'card__text-wrapper' });
    this.cardBackText = new Control(textWrapperBack.node, {
      type: 'h2',
      className: 'card__title',
      innerText: cardWordInPolish,
    });
  }

  addEvents() {
    if (this.rotateWordButton) {
      this.rotateWordButton.node.onclick = (e) => this.rotateCard(e);
    }
    this.node.onmouseleave = (e) => this.rotateCard(e);
    this.cardFront.node.onclick = (e: Event) => {
      const eventTarget: HTMLElement = e.target as HTMLElement;
      if (eventTarget.className !== 'card__rotate') {
        this.onWordClick?.(this.wordData.cardId, this.wordData.cardWordInEnglish);
      }
    };
  }

  rotateCard(e: Event): void {
    const eventType: string = e.type;

    if (eventType === 'mouseleave' && this.cardFront?.node.className === 'card__front') {
      return;
    }

    if (!this.isCardRotated) {
      this.cardFront?.changeClass('card__front rotated');
      this.cardBack?.changeClass('card__back rotated');
    } else {
      this.cardFront?.changeClass('card__front');
      this.cardBack?.changeClass('card__back');
    }

    this.isCardRotated = !this.isCardRotated;
  }

  updateWordData(wordData: CardInterface): void {
    this.wordData = wordData;
  }
}
