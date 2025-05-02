import { Goods, IActions } from "../../types";
import { IEvents } from "../base/events";

// Интерфейс для карточки
export interface ICard {
  render(data: Goods): HTMLElement;
}

// Реализация карточки
export class Card implements ICard {
  protected _cardElement: HTMLElement;  // Элемент карточки
  protected _cardCategory: HTMLElement;  // Категория карточки
  protected _cardTitle: HTMLElement;     // Заголовок карточки
  protected _cardImage: HTMLImageElement; // Изображение карточки
  protected _cardPrice: HTMLElement;     // Цена карточки
  protected _colors: Record<string, string> = {
    "дополнительное": "additional",
    "софт-скил": "soft",
    "кнопка": "button",
    "хард-скил": "hard",
    "другое": "other",
  };
  protected events: IEvents;

  constructor(template: HTMLTemplateElement, events: IEvents, actions?: IActions) {
    this.events = events;
    // Клонирование шаблона и получение элементов карточки
    this._cardElement = template.content.querySelector('.card')?.cloneNode(true) as HTMLElement;
    this._cardCategory = this._cardElement.querySelector('.card__category')!;
    this._cardTitle = this._cardElement.querySelector('.card__title')!;
    this._cardImage = this._cardElement.querySelector('.card__image')!;
    this._cardPrice = this._cardElement.querySelector('.card__price')!;

    // Если передан обработчик событий, ТО добавляем его на карточку
    if (actions?.onClick) {
      this._cardElement.addEventListener('click', actions.onClick);
    }
  }

  // Установка текста в элементт
  protected setText(element: HTMLElement, value: string): void {
    element.textContent = value;
  }

  // получение строки с ценой товара
  protected setPrice(value: number | null): string {
    return value === null ? "Бесценно" : `${value} синапсов`;
  }

  // Установка категории товара и применения соответствующего класса
  protected setCategory(value: string): void {
    this.setText(this._cardCategory, value);
    const colorClass = this._colors[value] || 'other'; // Цвет по умолчанию если категория не найдена
    this._cardCategory.className = `card__category card__category_${colorClass}`;
  }

  // Метод для рендеринга карточки товара с данными
  render(data: Goods): HTMLElement {
    this.setCategory(data.category);
    this.setText(this._cardTitle, data.title);
    this._cardImage.src = data.image;
    this._cardImage.alt = data.title;
    this.setText(this._cardPrice, this.setPrice(data.price));

    return this._cardElement;
  }
}
