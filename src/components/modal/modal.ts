import Control, { ControlNodeOptionsInterface } from '../control/control';

type ModalType = {
  parent: HTMLElement;
  options: ControlNodeOptionsInterface;
  initialText: string;
  imageSrc: string;
  type: 'information' | 'question';
  isClickable: boolean;
  modal: Control;
  modalText: Control;
  modalClose: Control;
  modalImageWrapper: Control;
  modalImage: Control;
  modalAnswersWrapper: Control;
  yesAnswer: Control;
  noAnswer: Control;
};

export default class Modal extends Control implements ModalType {
  initialText: string;

  isClickable: boolean;

  imageSrc: string;

  type: 'information' | 'question';

  modal: Control;

  modalText: Control;

  modalClose: Control;

  modalImageWrapper: Control;

  modalImage: Control;

  modalAnswersWrapper: Control;

  yesAnswer: Control;

  noAnswer: Control;

  constructor(
    parent: HTMLElement,
    options: ControlNodeOptionsInterface,
    imageSrc: string,
    type: 'information' | 'question' = 'information',
    initialText = '',
    isClickable = true,
  ) {
    super(parent, options);
    this.imageSrc = imageSrc;
    this.type = type;
    this.initialText = initialText;
    this.isClickable = isClickable;
    this.modal = new Control(this.node, { type: 'div', className: 'modal' });
    this.modalClose = new Control(this.modal.node, {
      type: 'img',
      className: 'modal__close',
      attributes: [{ src: './assets/images/close.png' }],
    });
    if (this.isClickable) {
      this.modalClose.node.onclick = () => this.closeModal();
      this.node.onclick = (e) => this.onOverlayClick(e);
    }
    this.modalImageWrapper = new Control(this.modal.node, { type: 'div', className: 'modal__image-wrapper' });
    this.modalImage = new Control(this.modalImageWrapper.node, {
      type: 'img',
      className: 'modal__image',
      attributes: [{ src: imageSrc }],
    });
    this.modalText = new Control(this.modal.node, { type: 'p', className: 'modal__text', innerText: this.initialText });
    document.body.style.overflow = 'hidden';
    this.modalAnswersWrapper = new Control(this.modal.node, { type: 'div', className: 'modal__answers-wrapper' });
    this.yesAnswer = new Control(this.modalAnswersWrapper.node, {
      type: 'img',
      className: 'modal__yes',
      attributes: [{ src: './assets/images/yes.png' }],
    });
    this.noAnswer = new Control(this.modalAnswersWrapper.node, {
      type: 'img',
      className: 'modal__no',
      attributes: [{ src: './assets/images/no.png' }],
    });
    if (this.type === 'information') {
      this.modalAnswersWrapper.removeNodeFromDom();
      this.yesAnswer.removeNodeFromDom();
      this.noAnswer.removeNodeFromDom();
    } else {
      this.modalClose.removeNodeFromDom();
    }
  }

  closeModal() {
    this.removeNodeFromDom();
    document.body.style.overflow = 'initial';
  }

  changeModalText(text: string) {
    this.modalText.changeInnerText(text);
  }

  onOverlayClick(e: Event) {
    const closingCondition =
      e.target !== this.modal.node &&
      e.target !== this.modalText.node &&
      e.target !== this.modalImageWrapper.node &&
      e.target !== this.modalImage.node &&
      e.target !== this.modalAnswersWrapper.node &&
      e.target !== this.yesAnswer.node &&
      e.target !== this.noAnswer.node;

    if (closingCondition && this.type === 'information') {
      this.closeModal();
    }
  }
}
