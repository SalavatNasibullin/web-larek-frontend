import { IActions, Goods } from "../../types";
import { IEvents } from "../base/events";

// Интерфейс для элементов корзины
export interface IBasketItem {
	basketItem: HTMLElement;
	index: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;
	render(data: Goods, item: number): HTMLElement;
}

// Класс для отображения элементов корзины
export class BasketItem implements IBasketItem {
	basketItem: HTMLElement;
	index: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
		// Получение элементов из шаблона
		this.basketItem = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
		this.index = this.basketItem.querySelector('.basket__item-index');
		this.title = this.basketItem.querySelector('.card__title');
		this.price = this.basketItem.querySelector('.card__price');
		this.buttonDelete = this.basketItem.querySelector('.basket__item-delete');

		// Добавление обработчика для кнопки удаления
		if (actions?.onClick) {
			this.buttonDelete.addEventListener('click', actions.onClick);
		}
	}
	//  Установка цены товара
	protected setPrice(value: number | null) {
		if (value === null) {
			return 'Бесценно'
		}
		return String(value) + ' синапсов'
	}

	// Рендериг товара в корзину
	render(data: Goods, item: number) {
		this.index.textContent = String(item);
		this.title.textContent = data.title;
		this.price.textContent = this.setPrice(data.price);
		return this.basketItem;
	}
}
