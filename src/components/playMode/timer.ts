import Control, { ControlNodeOptionsInterface } from '../control/control';

export interface TimerTillStartGameInterface {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  seconds: number;
  timerElements: Control[];
  startedTimer: ReturnType<typeof setInterval> | undefined;
  onTimerOver?(): void;
}

export default class TimerTillStartGame extends Control implements TimerTillStartGameInterface {
  seconds: number;

  timerElements: Control[];

  startedTimer: ReturnType<typeof setInterval> | undefined;
  onTimerOver?(): void;

  constructor(parent: HTMLElement, options: ControlNodeOptionsInterface, seconds: number) {
    super(parent, options);
    this.seconds = seconds;
    this.timerElements = [];
    this.startedTimer = undefined;
    this.createTimer();
  }

  createTimer() {
    this.timerElements = Array(this.seconds)
      .fill('')
      .map((el, idx, arr) => {
        const timerElement: Control = new Control(this.node, {
          type: 'p',
          className: 'timer__element',
          innerText: String(arr.length - idx),
        });
        timerElement.hide();
        return timerElement;
      });
  }

  async showTimer() {
    let start = 0;

    this.startedTimer = setInterval(() => {
      if (start < this.seconds) {
        this.timerElements[start].show();
        if (this.timerElements[start - 1]) {
          this.timerElements[start - 1].hide();
        }
        start++;
      } else {
        this.node.remove();
        this.onTimerOver?.();
        clearInterval(this.startedTimer);
        this.startedTimer = undefined;
        return;
      }
    }, 1000);
    return this.startedTimer;
  }

  clearTimer() {
    if (this.startedTimer) {
      clearInterval(this.startedTimer);
    }
    this.startedTimer = undefined;
    this.timerElements.forEach((el) => el.removeNodeFromDom());
    this.node.remove();
    this.timerElements = [];
  }
}
