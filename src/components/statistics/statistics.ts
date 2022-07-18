import Control, { ControlNodeOptionsInterface } from '../control/control';
import Table, { TableInterface } from './table';
import { stringSort } from '../../assistFunctions/sortStatistics';
import { numberSort } from '../../assistFunctions/sortStatistics';
import Modal from '../modal/modal';

export type StatisticsDataType = {
  cardWordInEnglish: string;
  cardWordInPolish: string;
  category: string;
  clicksInLearnMode: number;
  guessedInPlayMode: number;
  mistakesInPlayMode: number;
  percentOfCorrectAnswers: number;
};

export default class Statistics extends Control {
  statisticsData: StatisticsDataType[];

  statisticsTable?: TableInterface;

  clearStatisticsButton: Control;

  repeatDifficultWordsButton: Control;
  onClearStatisticsBtnClick?(): void;
  onRepeatDifficultWordsButtonClick?(): void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface, statisticsData: StatisticsDataType[]) {
    super(parent, options);
    this.statisticsData = statisticsData;
    this.clearStatisticsButton = new Control(this.node, {
      type: 'button',
      className: 'statistics__clear-btn',
      innerText: 'Clear stats',
    });
    this.repeatDifficultWordsButton = new Control(this.node, {
      type: 'button',
      className: 'statistics__repeat-btn',
      innerText: 'Repeat hard words',
    });
    this.addListeners();
    this.removeNodeFromDom();
  }

  addListeners() {
    this.clearStatisticsButton.node.onclick = () => {
      const warningModal = new Modal(
        document.body,
        { type: 'div', className: 'modal__overlay' },
        './assets/images/warning.png',
        'question',
        'Ary you sure that you want to clear statistics?',
      );
      warningModal.yesAnswer.node.onclick = () => {
        this.onClearStatisticsBtnClick?.();
        warningModal.closeModal();
      };
      warningModal.noAnswer.node.onclick = () => {
        warningModal.closeModal();
      };
    };
    this.repeatDifficultWordsButton.node.onclick = () => this.onRepeatDifficultWordsButtonClick?.();
  }

  onSortTable(nameOfField: string, sortType: 'asc' | 'desc') {
    let sortedData = [...this.statisticsData];
    switch (nameOfField) {
      case 'Word':
        sortedData = stringSort(sortedData, sortType, 'cardWordInEnglish');
        break;
      case 'Translation':
        sortedData = stringSort(sortedData, sortType, 'cardWordInPolish');
        break;
      case 'Category':
        sortedData = stringSort(sortedData, sortType, 'category');
        break;
      case 'Clicks in learn mode':
        sortedData = numberSort(sortedData, sortType, 'clicksInLearnMode');
        break;
      case 'Correct':
        sortedData = numberSort(sortedData, sortType, 'guessedInPlayMode');
        break;
      case 'Wrong':
        sortedData = numberSort(sortedData, sortType, 'mistakesInPlayMode');
        break;
      case '% of correct answers':
        sortedData = numberSort(sortedData, sortType, 'percentOfCorrectAnswers');
        break;
      default:
        sortedData = [...this.statisticsData];
    }
    this.updateStatisticsData(sortedData);
    return sortedData;
  }

  updateStatisticsData(data: StatisticsDataType[]) {
    this.statisticsData = data;
    
    if (!this.statisticsTable) {
      this.statisticsTable = new Table(this.node, { type: 'div', className: 'table__wrapper' }, this.statisticsData, 'Your progress', [
        'Word',
        'Translation',
        'Category',
        'Clicks in learn mode',
        'Correct',
        'Wrong',
        '% of correct answers',
      ]);
      this.statisticsTable.sortTable = (nameOfField: string, sortType: 'asc' | 'desc') => {
        this.onSortTable(nameOfField, sortType);
      };
    } else {
      this.statisticsTable?.updateData(this.statisticsData);
    }
  }
}
