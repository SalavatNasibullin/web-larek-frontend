import { Goods } from "../types";
import { IEvents } from "../components/base/events";

// Абстрактный базовый компонент
export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {
    // Конструктор родителя, вызывается первым в дочерних классах
  }

  // Переключение класса
  toggleClass(element: HTMLElement, className: string, force?: boolean) {
    element.classList.toggle(className, force);
  }

  // Установка текстового значения
  protected setText(element: HTMLElement, value: unknown) {
    if (element) {
      element.textContent = String(value);
    }
  }

  // Управление блокировкой элемента
  setDisabled(element: HTMLElement, state: boolean) {
    if (element) {
      if (state) {
        element.setAttribute('disabled', 'disabled');
      } else {
        element.removeAttribute('disabled');
      }
    }
  }

  // Скрыть элемент
  protected setHidden(element: HTMLElement) {
    element.style.display = 'none';
  }

  // Показать элемент
  protected setVisible(element: HTMLElement) {
    element.style.removeProperty('display');
  }

  // Установка изображения
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    if (element) {
      element.src = src;
      if (alt) {
        element.alt = alt;
      }
    }
  }

  // Вернуть контейнер после применения данных
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
}

// Базовый компонент товара
export class BaseProductView extends Component<Goods> {
  protected events: IEvents;
  protected id: string = "";

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
  }

  // Переопределяем методы для доступности в потомках
  protected setText(el: HTMLElement, value: unknown): void {
    if (el) el.textContent = String(value);
  }

  protected setImage(el: HTMLImageElement, src: string, alt?: string): void {
    if (el) {
      el.src = src;
      if (alt) el.alt = alt;
    }
  }
}


