import { Card } from "../components/View/Card";
import { ensureElement } from "../utils/utils";
import { BaseProductView } from "../components/Goods";
import { IEvents } from "../components/base/events";
import { Goods } from "../types";

export { BaseProductView } from '../components/Goods';
export class GoodsCatalog extends BaseProductView {
  categoryElement: HTMLElement; // Элемент DOM для категории товара
  imageElement: HTMLImageElement; // Элемент DOM для изображения товара

  constructor(containerElement: HTMLElement, eventEmitter: IEvents) {
    super(containerElement, eventEmitter); // Вызов конструктора родительского класса BaseProductView

    // Получение элементов 
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    // Добавляем обработчик клика на всю карточку товара
    this.container.addEventListener('click', () => {
      if (this.id) {
        this.events.emit('Catalog:click', { cardID: this.id });
      }
    });
  }

  // Метод для установки категории товара
  set category(newValue: string) {
    this.setText(this.categoryElement, newValue);   // Обновление текста элемента категории
    const categoryKey = newValue.toLowerCase();  // Приведение ключа категории к нижнему регистру
    const categoryClassSuffix = Card[categoryKey as keyof typeof Card] || 'default';
    this.categoryElement.className = 'card__category';
    this.categoryElement.classList.add(`card__category_${categoryClassSuffix}`);
  }

  // Установка изображения
  set image(src: string) {
    this.setImage(this.imageElement, src, 'Изображение товара');
  }

  // Обновление карточки данными товара
  override render(data?: Partial<Goods>): HTMLElement {
    if (data?.id) {
      this.id = data.id;
    }
    if (data?.category) {
      this.category = data.category;
    }
    if (data?.image) {
      this.image = data.image;
    }
    return super.render(data);
  }
}
