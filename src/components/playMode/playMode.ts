import Control, { ControlNodeOptionsInterface } from '../control/control';
import PlayModeItem, { PlayModeItemInterface } from './playModeItem';
import PlayWord from '../../assistFunctions/playWord';
import PlayModeControls from './playModeControls';
import Modal from '../modal/modal';
import TimerTillStartGame from './timer';

export interface CardInterface {
  cardId: string;
  cardImageLink: string;
  cardWordInEnglish: string;
  cardWordInPolish: string;
}

export interface PlayModeInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  isPlaying: boolean;
  currentWordData?: CardInterface;
  currentWordNumber: number;
  playModeControls: PlayModeControls;
  wordsData: CardInterface[];
  isVisible: boolean;
  wordsQuantity: number;
  roundWords: CardInterface[];
  itemViews: PlayModeItemInterface[];
  inactiveViews: PlayModeItemInterface[];
  currentView?: PlayModeItemInterface;
  wordPlayer: PlayWord;
  wrongAnswerAudio: HTMLAudioElement;
  rightAnswerAudio: HTMLAudioElement;
  result: boolean;
  updateCards(wordsData: CardInterface[] | undefined): void;
  onWordClick?: (wordId: string, word: string, isRight?: boolean) => void;
  onButtonClick(): void;
  removeNodeFromDom(): this;
  attachNodeToDom(): this;
  endGame(): void;
  interruptGame(): void;
  onBackToMainPage?(): void;
}

export default class PlayMode extends Control implements PlayModeInterface {
  playModeControls: PlayModeControls;

  wordsData: CardInterface[];

  wordsQuantity: number;

  roundWords: CardInterface[];

  itemViews: PlayModeItemInterface[];

  inactiveViews: PlayModeItemInterface[];

  currentView?: PlayModeItemInterface;

  isPlaying: boolean;

  currentWordData?: CardInterface;

  currentWordNumber: number;

  wordPlayer: PlayWord;

  timer?: TimerTillStartGame;

  wrongAnswerAudio: HTMLAudioElement;

  rightAnswerAudio: HTMLAudioElement;

  winGame: HTMLAudioElement;

  looseGame: HTMLAudioElement;

  result: boolean;

  onWordClick?: (wordId: string, word: string, isRight?: boolean) => void;

  onBackToMainPage?(): void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface) {
    super(parent, options);
    this.wordsData = [];
    this.wordsQuantity = 0;
    this.itemViews = [];
    this.inactiveViews = [];
    this.currentView = undefined;
    this.isPlaying = false;
    this.currentWordData = undefined;
    this.currentWordNumber = 0;
    this.roundWords = [];
    this.result = true;
    this.playModeControls = new PlayModeControls(this.node, { type: 'div', className: 'play-mode-button__wrapper' });
    this.addListeners();
    this.wrongAnswerAudio = new Audio('./assets/audio/wrongAnswer.mp3');
    this.rightAnswerAudio = new Audio('./assets/audio/rightAnswer.mp3');
    this.winGame = new Audio('./assets/audio/finish-game.mp3');
    this.looseGame = new Audio('./assets/audio/loose-game.mp3');
    this.playModeControls.removeNodeFromDom();
    this.wordPlayer = new PlayWord('US');
  }

  addListeners() {
    this.playModeControls.onButtonClick = () => {
      this.onButtonClick();
    };
  }

  onButtonClick(): void {
    if (!this.isPlaying) {
      this.startGame();
    } else {
      if (this.currentWordData) {
        this.wordPlayer.playText(this.currentWordData?.cardWordInEnglish);
      }
    }
  }

  startGame() {
    this.timer = new TimerTillStartGame(this.node, { type: 'div', className: 'timer' }, 3);
    this.isPlaying = true;
    this.timer.showTimer();
    this.wordPlayer.playText('Get ready!');
    this.timer.onTimerOver = () => {
      this.roundWords = [...this.wordsData].sort(() => Math.random() - 0.5);
      this.currentWordData = this.roundWords[0];
      this.roundWords.forEach((word) => {
        const { cardId } = word;

        if (cardId === this.currentWordData?.cardId) {
          this.askWord();
        }
      });
    };
  }

  askWord() {
    if (this.currentWordData) {
      this.wordPlayer.playText(this.currentWordData?.cardWordInEnglish);
      this.itemViews.forEach((view) => {
        view.onWordClick = (wordId: string, word: string) => this.chooseWord(wordId, word);
      });
    }

    this.playModeControls.changeButtonText('Repeat word 🔁');
  }

  chooseWord(wordId: string, word: string) {
    this.itemViews.forEach((view) => {
      view.onWordClick = () => null;
    });

    if (wordId === this.currentWordData?.cardId) {
      this.rightAnswer(wordId, word);
      if (this.currentWordNumber < this.wordsQuantity - 1) {
        this.currentWordNumber += 1;
        this.currentWordData = this.roundWords[this.currentWordNumber];
        this.continueGame();
      } else {
        this.endGame();
      }
    } else {
      this.wrongAnswer(wordId);
    }
  }

  rightAnswer(wordId: string, word: string) {
    this.rightAnswerAudio.pause();
    this.rightAnswerAudio.currentTime = 0;
    this.rightAnswerAudio.play();
    this.currentView = this.itemViews.filter((el) => el.wordData.cardId === this.currentWordData?.cardId)[0];
    this.currentView.makeInactive();
    this.playModeControls.addStar('green', this.playModeControls.node.offsetWidth);
    this.onWordClick?.(wordId, word, true);
    this.inactiveViews = [...this.inactiveViews, this.currentView];
  }

  wrongAnswer(wordId: string) {
    this.result = false;
    this.wrongAnswerAudio.pause();
    this.wrongAnswerAudio.currentTime = 0;
    this.wrongAnswerAudio.play();
    this.itemViews.filter((el) => el.wordData.cardId === wordId)[0].showWrongAnswer();
    this.playModeControls.addStar('red', this.playModeControls.node.offsetWidth);
    if (this.currentWordData) {
      this.onWordClick?.(this.currentWordData.cardId, this.currentWordData.cardWordInEnglish, false);
    }

    setTimeout(() => {
      this.itemViews.forEach((view) => {
        view.onWordClick = (wordIdx: string, word: string) => {
          this.chooseWord(wordIdx, word);
        };
      });
    }, 1000);
  }

  continueGame() {
    setTimeout(() => {
      this.roundWords.forEach((roundWord) => {
        const { cardId } = roundWord;
        if (cardId === this.currentWordData?.cardId) {
          this.askWord();
          this.itemViews.forEach((view) => {
            view.onWordClick = (wordId: string, word: string) => this.chooseWord(wordId, word);
          });
          this.inactiveViews.forEach((view) => {
            view.onWordClick = () => null;
          });
        }
      });
    }, 2000);
  }

  endGame() {
    if (this.timer?.startedTimer) {
      this.timer?.clearTimer();
    }

    setTimeout(() => {
      if (this.result) {
        this.itemViews.forEach(view => view.removeNodeFromDom());
        this.playModeControls.removeNodeFromDom();
        this.winGame.play();
        const modalText = 'You won! Nice game!!!';
        const modal = new Modal(document.body, { type: 'div', className: 'modal__overlay' }, './assets/images/win.png', 'information', modalText, false);
        modal.modalClose.removeNodeFromDom();
        setTimeout(() => {
          this.playModeControls.removeStars();
          modal.closeModal();
          this.itemViews.forEach(view => view.attachNodeToDom());
          this.playModeControls.attachNodeToDom();
          this.onBackToMainPage?.();
        }, 5000);
      } else {
        this.itemViews.forEach(view => view.removeNodeFromDom());
        this.playModeControls.removeNodeFromDom();
        this.looseGame.play();
        const modalText = 'Next time you will guess everything!';
        const modal = new Modal(document.body, { type: 'div', className: 'modal__overlay' }, './assets/images/lose.png', 'information', modalText, false);
        modal.modalClose.removeNodeFromDom();
        setTimeout(() => {
          this.playModeControls.removeStars();
          modal.closeModal();
          this.inactiveViews.forEach((view) => {
            view.onWordClick = () => null;
          });
          this.itemViews.forEach(view => view.attachNodeToDom());
          this.playModeControls.attachNodeToDom();
          this.onBackToMainPage?.();
        }, 5000);
      }

      this.result = true;
      this.isPlaying = false;
      this.inactiveViews = [];
      this.currentView = undefined;
      this.isPlaying = false;
      this.currentWordData = undefined;
      this.currentWordNumber = 0;
      this.roundWords = [];
      this.itemViews.forEach((view) => view.makeActive());
      this.playModeControls.changeButtonText('Start');
    }, 1000);
  }

  interruptGame() {
    if (this.timer?.startedTimer) {
      this.timer?.clearTimer();
    }
    this.playModeControls.removeStars();
    this.result = true;
    this.isPlaying = false;
    this.inactiveViews = [];
    this.currentView = undefined;
    this.isPlaying = false;
    this.currentWordData = undefined;
    this.currentWordNumber = 0;
    this.roundWords = [];
    this.itemViews.forEach((view) => view.makeActive());
    this.playModeControls.changeButtonText('Start');
    this.itemViews.forEach((view) => {
      view.onWordClick = () => null;
    });
  }

  updateCards(wordsData: CardInterface[] | undefined): void {
    if (!wordsData) {
      return;
    }

    this.wordsData = wordsData;
    this.wordsQuantity = wordsData.length;
    this.playModeControls?.attachNodeToDom();
    if (this.itemViews?.length === 0) {
      this.itemViews = wordsData.map((word) => {
        const playWord = new PlayModeItem(this.node, { type: 'li', className: 'play-card__item' }, word);
        return playWord;
      });
    } else {
      this.itemViews.forEach((view, idx) => {
        view.updateWordData(this.wordsData[idx]);
        view.cardImage?.node.setAttribute('src', `./assets/images/${wordsData[idx].cardWordInEnglish.toLocaleLowerCase()}.png`);
        view.cardImage?.node.setAttribute('alt', wordsData[idx].cardWordInEnglish);
      });
    }
  }
}
