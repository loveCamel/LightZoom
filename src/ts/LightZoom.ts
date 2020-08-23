export interface ILightZoomOptions {
  selector?: string;
  isFix?: boolean;
  isCursorPointer?: boolean;
  isOutsideClose?: boolean;
}

export interface ILightZoom {
  closeModal: () => void;
  removeEvents: () => void;
}

interface IModalElements {
  modal: HTMLElement;
  close: HTMLElement;
  wrap: HTMLElement;
  imgModal: HTMLImageElement;
}

enum Key {
  Esc = 27,
  Enter = 13,
}

/**
 * LightZoom - модуль для зума изображений в модальном окне.
 * @param {Object} props - Необязательные параметры.
 * @param {string} props.selector - Селектор, по которому будет идти поиск.
 * @param {boolean} props.isFix - Запрещать ли скролл при открытии модального окна.
 * @param {boolean} props.isCursorPointer - Будет ли иконка зума при наведении на картинки.
 * @param {boolean} props.isOutsideClose - Будет ли модальное окно закрываться при клике вне картинки.
 */
class LightZoom implements ILightZoom {
  private _selector: string;
  private _imgs: NodeListOf<Element>;
  private _isFix: boolean;
  private _isCursorPointer: boolean;
  private _isOutsideClose: boolean;
  private _activeClass: string = 'LightZoom__active';
  private _bodyFixClass: string = 'LightZoom__overflow';
  private _modal: HTMLElement;
  private _close: HTMLElement;
  private _modalLayout: HTMLElement;
  private _imgModal: HTMLImageElement;

  constructor(props: ILightZoomOptions = {}) {
    this._selector = props.selector || 'img';
    this._imgs = document.querySelectorAll(`${this._selector}`);
    this._isFix = props.isFix;
    this._isCursorPointer = props.isCursorPointer;
    this._isOutsideClose = props.isOutsideClose;
    const { modal, close, wrap, imgModal } = this._initHtml();
    this._modal = modal;
    this._close = close;
    this._modalLayout = wrap;
    this._imgModal = imgModal;
    this._startZoom();
  }

  /**
   * Метод закрывает модальное окно.
   */
  public closeModal = (): void => {
    this._modal.classList.remove(this._activeClass);
    document.body.removeEventListener('keydown', this._onKeyClose);
    this._isFix && document.body.classList.remove(this._bodyFixClass);
  }

  /**
   * Метод удаляет все обработчики событий со всех элементов.
   */
  public removeEvents = (): void => {
    this._imgs.forEach((item) =>
      item.removeEventListener('click', this._onImgClick)
    );
    this._close.removeEventListener('click', this._onCloseClick);
    if (this._isOutsideClose) {
      this._modalLayout.removeEventListener('click', this._onCloseClick);
    }
    document.body.removeEventListener('keydown', this._onKeyClose);
  }

  /**
   * Метод проверяет валидность изображений.
   * @private
   */
  private _isValideImgs = (): boolean => {
    return Array.from(this._imgs).every((item) => {
      const src = item.getAttribute('src').trim(),
        _hasAttr = src !== null,
        _hasSrc = src !== '';
      return _hasAttr && _hasSrc;
    });
  }

  /**
   * Метод создаёт разметку и помещает её внутрь body.
   * @returns {Object} Объект из DOM элементов
   * @private
   */
  private _initHtml = (): IModalElements => {
    const modal = document.createElement('div'),
      wrap = document.createElement('div'),
      imgModal = document.createElement('img'),
      close = document.createElement('div');

    modal.classList.add('LightZoom');
    wrap.classList.add('LightZoom__wrap');
    imgModal.classList.add('LightZoom__img');
    close.classList.add('LightZoom__close');

    wrap.appendChild(imgModal);
    modal.appendChild(close);
    modal.appendChild(wrap);
    document.body.appendChild(modal);

    return { modal, close, wrap, imgModal };
  }

  /**
   * Метод для старта работы LightZoom.
   * Вешает обработчики событий и нужные классы.
   * Если изображения не валидны, кидает ошибку и прекращает работу
   * @private
   */
  private _startZoom = (): void => {
    if (this._isValideImgs()) {
      this._imgs.forEach((item) => {
        this._isCursorPointer && item.classList.add('LightZoom__cursor');
        item.addEventListener('click', this._onImgClick);
      });

      this._close.addEventListener('click', this._onCloseClick);
      if (this._isOutsideClose) {
        this._modalLayout.addEventListener('click', this._onCloseClick);
      }
    } else {
      console.error(`LightZoom: No src in "${this._selector}" selector`);
    }
  }

  /**
   * Метод определяет, является ли текущий елемент изображением в модальном окне.
   * @private
   */
  private _isClickOnImg = (target: HTMLElement): boolean => {
    return target === this._imgModal;
  }

  /**
   * Обработчик события по клику на картинку.
   * @private
   */
  private _onImgClick = (e: MouseEvent): void => {
    const target = e.target as HTMLImageElement;
    this._openModal(target);
  }

  /**
   * Обработчик события по клику на кнопку "закрыть".
   * @private
   */
  private _onCloseClick = (e: MouseEvent): void => {
    const isImg = this._isClickOnImg(e.target as any);
    if (!isImg) {
      this.closeModal();
    }
  }

  /**
   * Обработчик события по клику на Escape или Enter.
   * @private
   */
  private _onKeyClose = (e: KeyboardEvent): void => {
    if (e.keyCode === Key.Esc || e.keyCode === Key.Enter) {
      this.closeModal();
    }
  }

  /**
   * Метод открывает модальное окно и устанавливает src для изображения
   * @private
   */
  private _openModal = (element: HTMLImageElement): void => {
    const src = element.getAttribute('src');
    this._imgModal.setAttribute('src', src);
    this._modal.classList.add(this._activeClass);
    this._isFix && document.body.classList.add(this._bodyFixClass);
    document.body.addEventListener('keydown', this._onKeyClose);
  }
}

export default LightZoom;
