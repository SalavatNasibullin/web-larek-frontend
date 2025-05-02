import { Card } from "../View/Card";
import { Goods } from "../../types";
import { IEvents } from "../base/events";
import { BasketModel } from "../BasketModel";

export interface ICard {
  text: HTMLElement;
  button: HTMLButtonElement;
  render(data: Goods): HTMLElement;
}

export class CardPreview extends Card implements ICard {
  text: HTMLElement;
  button: HTMLButtonElement;
  private _data: Goods | null = null;

  constructor(
    template: HTMLTemplateElement,
    protected events: IEvents,
    protected basketModel: BasketModel
  ) {
    super(template, events);

    this.text = this._cardElement.querySelector('.card__text')!;
    this.button = this._cardElement.querySelector('.card__button')!;

    this.button.addEventListener('click', () => {
      if (!this._data) return;

      const isInBasket = this.basketModel.isInBasket(this._data);

      if (isInBasket) {
        this.events.emit('basket:basketItemRemove', this._data);
        this.button.textContent = 'Купить';
      } else if (this._data.price !== null) {
        this.events.emit('card:addBasket');
        this.button.textContent = 'Удалить из корзины';
      }
    });
  }

  render(data: Goods): HTMLElement {
    this._data = data;

    this.setCategory(data.category);
    this.setText(this._cardTitle, data.title);
    this._cardImage.src = data.image;
    this._cardImage.alt = data.title;
    this.setText(this._cardPrice, this.setPrice(data.price));
    this.text.textContent = data.description;

    const isInBasket = this.basketModel.isInBasket(data);

    if (data.price === null) {
      this.button.disabled = true;
      this.button.textContent = 'Не продается';
    } else if (isInBasket) {
      this.button.disabled = false;
      this.button.textContent = 'Удалить из корзины';
    } else {
      this.button.disabled = false;
      this.button.textContent = 'Купить';
    }

    return this._cardElement;
  }
}
