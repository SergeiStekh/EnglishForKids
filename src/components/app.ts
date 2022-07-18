import Control, { ControlNodeOptionsInterface } from './control/control';
import fetchData, { CategoryDataType } from '../assistFunctions/fetchData';
import Header from './header/header';
import Categories from './categories/categories';
import LearnMode from './learnMode/learnMode';
import PlayMode from './playMode/playMode';
import Statistics, { StatisticsDataType } from './statistics/statistics';
import convertCategoriesDataToStatisticsData from '../assistFunctions/convertCategoriesDataToStatisticsData';
import getPercentOfSuccess from '../assistFunctions/getPercentOfSuccess';
import updateStatistics from '../assistFunctions/updateStatistics';
import PlayWord from '../assistFunctions/playWord';
import Modal from './modal/modal';

type PageType = 'Categories' | 'Learn' | 'Play' | 'Repeat' | 'Statistics';
type ModeType = 'Learn' | 'Play';

class App extends Control {
  page: PageType;

  mode: ModeType;

  categoriesData: CategoryDataType[];

  currentCategoryId: string;

  currentCategoryName: string;

  currentCategoryData: CategoryDataType | undefined;

  statisticsData: StatisticsDataType[];

  hardWordsDataToRepeat: CategoryDataType | undefined;

  header: Header;

  mainWrapper: Control;

  categories: Categories;

  learnMode: LearnMode;

  playMode: PlayMode;

  statistics: Statistics;

  repeatHardWords: LearnMode;

  wordPlayer: PlayWord;

  constructor(
    parent: HTMLElement,
    options: ControlNodeOptionsInterface,
    page: PageType = 'Categories',
    mode: ModeType = 'Learn',
    categoriesData: CategoryDataType[] = [],
    statisticsData: StatisticsDataType[] = [],
    currentCategoryId = '',
    currentCategoryName = '',
    currentCategoryData: CategoryDataType | undefined = undefined,
  ) {
    super(parent, options);
    this.page = page;
    this.mode = mode;
    this.categoriesData = categoriesData;
    this.statisticsData = statisticsData;
    this.currentCategoryId = currentCategoryId;
    this.currentCategoryName = currentCategoryName;
    this.currentCategoryData = currentCategoryData;
    this.header = new Header(document.body, { type: 'header', appendType: 'prepend', id: 'header' }, 'Learn');
    this.mainWrapper = new Control(this.node, { type: 'div', className: 'main__wrapper', appendType: 'prepend' });
    this.categories = new Categories(this.mainWrapper.node, { type: 'ul', className: 'categories__list' });
    this.learnMode = new LearnMode(this.mainWrapper.node, { type: 'ul', className: 'cards__list' });
    this.playMode = new PlayMode(this.mainWrapper.node, { type: 'div', className: 'cards__list' });
    this.statistics = new Statistics(
      this.mainWrapper.node,
      { type: 'div', className: 'statistics' },
      this.statisticsData,
    );
    this.repeatHardWords = new LearnMode(this.mainWrapper.node, { type: 'ul', className: 'cards__list' });
    this.wordPlayer = new PlayWord('US');
  }

  init(): this {
    this.addListeners();
    this.setCategoriesData()
      .then(() => this.setStatisticsData())
      .then(() => this.updateView());
    return this;
  }

  addListeners(): void {
    this.header.onModeChange = () => {
      this.onModeChangeHandler();
    };

    this.header.onCategoryChange = (categoryId: string) => {
      this.onCategoryChangeHandler(categoryId);
    };

    this.categories.onChooseCategory = (categoryId: string) => {
      this.onCategoryChangeHandler(categoryId);
    };

    this.learnMode.onWordClick = (wordId: string, word: string) => {
      this.onWordClickHandler(wordId, word);
    };

    this.playMode.onWordClick = (wordId: string, word: string, isRight?: boolean) => {
      this.onWordClickHandler(wordId, word, isRight);
    };

    this.playMode.onBackToMainPage = () => {
      this.onCategoryChangeHandler('');
    };

    this.statistics.onClearStatisticsBtnClick = () => this.clearStatisticsData();

    this.statistics.onRepeatDifficultWordsButtonClick = () => this.repeatDifficultWordsButtonClick();

    this.repeatHardWords.onWordClick = (wordId: string, word: string) => {
      this.onWordClickHandler(wordId, word);
    };
  }

  async setCategoriesData() {
    this.categoriesData = await fetchData('https://536815.selcdn.ru/json/data.json');
  }

  setStatisticsData() {
    const isStatisticsDataInLocalStorage = Boolean(localStorage.getItem('statisticsData'));

    if (!isStatisticsDataInLocalStorage) {
      this.statisticsData = convertCategoriesDataToStatisticsData(this.categoriesData);
    }

    if (isStatisticsDataInLocalStorage) {
      const localStorageStatisticsData: StatisticsDataType[] = JSON.parse(localStorage.getItem('statisticsData') || '');
      const updatedStatisticsData = convertCategoriesDataToStatisticsData(this.categoriesData);

      const isNewItemsAdded: boolean = localStorageStatisticsData.length !== updatedStatisticsData.length;

      if (isNewItemsAdded) {
        this.statisticsData = updateStatistics(localStorageStatisticsData, updatedStatisticsData);
      } else {
        this.statisticsData = localStorageStatisticsData;
      }
    }

    this.statistics.updateStatisticsData(this.statisticsData);
  }

  updateView(): this {
    const views = [
      { 
        view: this.categories,
        viewName: 'Categories',
        showViewFunction: this.showCategories,
      },
      {
        view: this.statistics,
        viewName: 'Statistics',
        showViewFunction: this.showStatistics,
      },
      {
        view: this.playMode,
        viewName: 'Play',
        showViewFunction: this.showPlayMode,
      },
      {
        view: this.learnMode,
        viewName: 'Learn',
        showViewFunction: this.showLearnMode,
      },
      {
        view: this.repeatHardWords,
        viewName: 'Repeat',
        showViewFunction: this.showRepeatHardWords,
      },
    ];
    this.clearView(views);
    views.forEach(item => this.page === item.viewName ? item.showViewFunction.call(this) : null, this);
    return this;
  }

  clearView(views: { view: Control, viewName: string }[]) {
    views.forEach(item => (this.page !== item.viewName && item.view.isVisible) ? item.view.removeNodeFromDom() : null);
  }
  
  showCategories(): void {
    this.categories.attachNodeToDom();
    this.categories.renderCategories(this.categoriesData);
    this.header.updateHeader('Choose category!', false, true, this.categoriesData, this.currentCategoryId);
    this.wordPlayer.playText('Choose category!');
  }

  showLearnMode(): void {
    if (this.currentCategoryData) {
      this.learnMode.updateCards(this.currentCategoryData.cards);
    }
    this.learnMode.attachNodeToDom();
    this.header.updateHeader(this.currentCategoryName, true, true, this.categoriesData, this.currentCategoryId);
  }

  showPlayMode(): void {
    if (this.currentCategoryData) {
      this.playMode.updateCards(this.currentCategoryData.cards);
      this.playMode.attachNodeToDom();
    }
    this.header.updateHeader(this.currentCategoryName, true, true, this.categoriesData, this.currentCategoryId);
  }

  showStatistics(): void {
    this.statistics.attachNodeToDom();
    this.wordPlayer.playText('Statistics page!');
    this.header.updateHeader('Statistics', false, false, this.categoriesData, this.currentCategoryId);
  }

  showRepeatHardWords(): void {
    if (this.currentCategoryData) {
      this.repeatHardWords.updateCards(this.currentCategoryData.cards);
    }
    this.repeatHardWords.attachNodeToDom();
    this.header.updateHeader(this.currentCategoryName, true, false, this.categoriesData, this.currentCategoryId);
    this.wordPlayer.playText('Repeating hard words!');
  }

  onModeChangeHandler(): void {
    this.mode = this.mode === 'Learn' ? 'Play' : 'Learn';
    this.wordPlayer.playText(`${this.mode} mode!`);

    if (this.page === 'Play' && this.playMode.isPlaying) {
      this.playMode.interruptGame();
    }

    if (this.mode === 'Play') {
      this.header.modeToggler.enableToggler();
    } else if (this.mode === 'Learn') {
      this.header.modeToggler.disableToggler();
    }

    if (this.page === 'Categories') {
      this.categories.updateCategoriesStyle(this.mode);
      this.header.modeToggler.modeName.changeInnerText(this.mode);
    } else {
      this.header.updateHeader(this.mode, true, true, this.categoriesData, this.currentCategoryId);
    }

    if (this.page !== 'Categories' && (this.mode === 'Learn' || this.mode === 'Play')) {
      this.page = this.mode;
      this.updateView();
    }
  }

  onCategoryChangeHandler(categoryId: string): this {
    if (categoryId === this.currentCategoryId) {
      return this;
    }

    if (!categoryId) {
      this.page = 'Categories';
      this.currentCategoryId = '';
      this.currentCategoryData = undefined;
      this.currentCategoryName = '';
      this.categories.updateCategoriesStyle(this.mode);
    }

    if (categoryId === 'statistics') {
      this.page = 'Statistics';
      this.currentCategoryId = '';
      this.currentCategoryData = undefined;
      this.currentCategoryName = '';
    }

    if (categoryId === 'repeat') {
      this.page = 'Repeat';
      this.currentCategoryId = categoryId;
      this.currentCategoryName = 'Repeating hard words';
      this.currentCategoryData = this.hardWordsDataToRepeat;
    }

    if (categoryId && categoryId !== 'statistics' && categoryId !== 'repeat') {
      this.page = this.mode === 'Learn' ? 'Learn' : 'Play';
      this.currentCategoryId = categoryId;
      this.currentCategoryData = this.categoriesData.filter(
        (categoryData) => categoryData?.categoryId === this.currentCategoryId,
      )[0];
      this.currentCategoryName = this.currentCategoryData.categoryName;
      this.wordPlayer.playText(`You have chosen ${this.currentCategoryName}`);
    }

    if (this.page === 'Play' && this.playMode.isPlaying) {
      this.playMode.interruptGame();
    }

    this.updateView();
    return this;
  }

  onWordClickHandler(wordId: string, word: string, isRight?: boolean): void {
    if (this.mode === 'Learn' || this.page === 'Repeat') {
      this.wordPlayer.playText(word);
      this.updateStatisticsData(word);
    }

    if (this.mode === 'Play') {
      this.updateStatisticsData(word, isRight);
    }
  }

  repeatDifficultWordsButtonClick(): void {
    const hardWords: StatisticsDataType[] = [...this.statisticsData]
      .filter((word) => {
        return word.mistakesInPlayMode !== 0 && word.percentOfCorrectAnswers <= 50;
      })
      .sort((a, b) => a.percentOfCorrectAnswers - b.percentOfCorrectAnswers)
      .slice(0, 8);

    this.hardWordsDataToRepeat = {
      categoryId: 'Hard words',
      categoryImageLink: 'No data',
      categoryName: 'Hard words',
      cards: [
        ...hardWords.map((word, idx) => {
          return {
            cardId: String(idx),
            cardImageLink: word.cardWordInEnglish,
            cardWordInEnglish: word.cardWordInEnglish,
            cardWordInPolish: word.cardWordInPolish,
          };
        }),
      ],
    };

    if (hardWords.length === 0) {
      new Modal(
        document.body,
        { type: 'div', className: 'modal__overlay' },
        './assets/images/oops.png',
        'information',
        'There is no words to repeat. First, you need to play game. Choose category and switch mode to play, to repeat hard words!',
      );
    } else {
      this.onCategoryChangeHandler('repeat');
    }
  }

  updateStatisticsData(word: string, isRight?: boolean): void {
    const currentStatisticsData = [...this.statisticsData];
    const changingWordId = currentStatisticsData.findIndex(
      (el) => el.cardWordInEnglish.toLowerCase() === word.toLowerCase(),
    );

    const changingWordData = currentStatisticsData[changingWordId];

    const isLearnMode = changingWordId !== -1 && this.mode === 'Learn';
    const rightAnswer = changingWordId !== -1 && this.mode === 'Play' && isRight;
    const wrongAnswer = changingWordId !== -1 && this.mode === 'Play' && !isRight;

    if (isLearnMode) {
      changingWordData.clicksInLearnMode += 1;
    } else if (rightAnswer) {
      changingWordData.guessedInPlayMode += 1;
      changingWordData.percentOfCorrectAnswers = getPercentOfSuccess(
        changingWordData.guessedInPlayMode,
        changingWordData.mistakesInPlayMode,
      );
    } else if (wrongAnswer) {
      changingWordData.mistakesInPlayMode += 1;
      changingWordData.percentOfCorrectAnswers = getPercentOfSuccess(
        changingWordData.guessedInPlayMode,
        changingWordData.mistakesInPlayMode,
      );
    }
    this.statisticsData = currentStatisticsData;
    this.statistics.updateStatisticsData(currentStatisticsData);

    localStorage.setItem('statisticsData', JSON.stringify(this.statisticsData));
  }
  
  clearStatisticsData() {
    this.statisticsData = this.statisticsData.map((el) => {
      return {
        ...el,
        clicksInLearnMode: 0,
        guessedInPlayMode: 0,
        mistakesInPlayMode: 0,
        percentOfCorrectAnswers: 0,
      };
    });

    this.statistics.updateStatisticsData(this.statisticsData);
    localStorage.setItem('statisticsData', JSON.stringify(this.statisticsData));
  }
}

export default App;
