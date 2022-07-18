import Control, { ControlNodeOptionsInterface } from '../control/control';
import LearnModeItem, { LearnModeItemInterface } from './learnModeItem';
import { CardInterface } from '../../assistFunctions/fetchData';

export interface SingleCategoryDataInterface {
  categoryId: string;
  categoryImageLink: string;
  categoryName: string;
  cards: CardInterface[];
}

export interface LearnModeInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  isVisible: boolean;
  itemViews: LearnModeItemInterface[];
  updateCards(wordsData: CardInterface[] | undefined): void;
  onWordClick?: (wordId: string, word: string) => void;
  removeNodeFromDom(): this;
  attachNodeToDom(): this;
}

export default class LearnMode extends Control implements LearnModeInterface {
  itemViews: LearnModeItemInterface[];

  onWordClick?: (wordId: string, word: string) => void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface) {
    super(parent, options);
    this.itemViews = [];
  }

  updateCards(wordsData: CardInterface[] | undefined): void {
    if (!wordsData) {
      return;
    }

    this.isVisible = true;
    if (this.itemViews?.length === 0) {
      this.itemViews = wordsData.map((wordData) => {
        const trainWord = new LearnModeItem(this.node, { type: 'li', className: 'card__item' }, wordData);
        trainWord.onWordClick = (wordId: string, word: string) => {
          this.onWordClick?.(wordId, word);
        };
        return trainWord;
      });
    } else {
      this.itemViews.forEach((view, idx) => {
        view.updateWordData(wordsData[idx]);

        view.cardFrontImage?.node.setAttribute('src', `./assets/images/${wordsData[idx].cardWordInEnglish.toLocaleLowerCase()}.png`);
        view.cardFrontImage?.node.setAttribute('alt', wordsData[idx].cardWordInEnglish);
        view.cardFrontText?.changeInnerText(wordsData[idx].cardWordInEnglish);
        view.cardBackImage?.node.setAttribute('src', `./assets/images/${wordsData[idx].cardWordInEnglish.toLocaleLowerCase()}.png`);
        view.cardBackImage?.node.setAttribute('alt', wordsData[idx].cardWordInEnglish);
        view.cardBackText?.changeInnerText(wordsData[idx].cardWordInPolish);
      });
    }
  }
}
