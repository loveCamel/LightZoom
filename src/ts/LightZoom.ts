export interface ILightZoomOptions {
  dataName?: string;
  isFix?: boolean;
  isCursorPointer?: boolean;
}

export interface ILightZoom {
  closeModal: () => void;
  removeEvents: () => void;
}

interface IModalElements {
  modal: HTMLElement;
  close: HTMLElement;
  imgModal: HTMLImageElement;
}

enum Key {
  Esc = 27,
  Enter = 13,
}

/**
 * LightZoom - модуль для зума изображений в модальном окне.
 * @param {Object} props - Необязательные параметры.
 * @param {string} props.dataName - Имя data атрибута, по которому будет идти поиск.
 * @param {boolean} props.isFix - Запрещать ли скролл при открытии модального окна.
 * @param {boolean} props.isCursorPointer - Будет ли иконка зума при наведении на картинки.
 */
class LightZoom implements ILightZoom {
  private _dataName: string;
  private _imgs: NodeListOf<Element>;
  private _isFix: boolean;
  private _isCursorPointer: boolean;
  private _activeClass: string = 'LightZoom__active';
  private _bodyFixClass: string = 'LightZoom__overflow';
  private _modal: HTMLElement;
  private _close: HTMLElement;
  private _imgModal: HTMLImageElement;

  constructor(props: ILightZoomOptions = {}) {
    this._dataName = props.dataName || 'zoom';
    this._imgs = document.querySelectorAll(`img[data-${this._dataName}]`);
    this._isFix = props.isFix;
    this._isCursorPointer = props.isCursorPointer;
    const { modal, close, imgModal } = this._initHtml();
    this._modal = modal;
    this._close = close;
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
    document.body.removeEventListener('keydown', this._onKeyClose);
  }

  /**
   * Метод проверяет валидность изображений.
   * @privat
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
   * @privat
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

    return { modal, close, imgModal };
  }

  /**
   * Метод для старта работы LightZoom.
   * Вешает обработчики событий и нужные классы.
   * Если изображения не валидны, кидает ошибку и прекращает работу
   * @privat
   */
  private _startZoom = (): void => {
    if (this._isValideImgs()) {
      this._imgs.forEach((item) => {
        this._isCursorPointer && item.classList.add('LightZoom__cursor');
        item.addEventListener('click', this._onImgClick);
      });

      this._close.addEventListener('click', this._onCloseClick);
    } else {
      console.error(`LightZoom: No src in data-${this._dataName} elements`);
    }
  }

  /**
   * Обработчик события по клику на картинку.
   * @privat
   */
  private _onImgClick = (e: MouseEvent): void => {
    const target = e.target as HTMLImageElement;
    this._openModal(target);
  }

  /**
   * Обработчик события по клику на кнопку "закрыть".
   * @privat
   */
  private _onCloseClick = (e: MouseEvent): void => {
    this.closeModal();
  }

  /**
   * Обработчик события по клику на Escape или Enter.
   * @privat
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
