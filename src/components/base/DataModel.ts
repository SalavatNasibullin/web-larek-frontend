import { IEvents } from "../base/events";
import { Goods } from '../../types';

// Интерфейс для данных модели
export interface IDataModel {
  productCards: Goods[];
  currentItem: Goods;
  showItemDetails(item: Goods): void;
}

// Класс для обработки данных о товарах
export class DataModel implements IDataModel {
  protected _productCards: Goods[];
  currentItem: Goods;

  // Конструктор с событиями
  constructor(protected events: IEvents) {
    this._productCards = [];
  }

  // Метод для возврата всех списоков товаров.
  set productCards(data: Goods[]) {
    this._productCards = data;
    this.events.emit('productCards:receive');
  }

  // Для получения списка товаров
  get productCards() {
    return this._productCards;
  }

  // Метод для выбора товара
  showItemDetails(item: Goods) {
    this.currentItem = item;
    this.events.emit('modalCard:open', item);
  }
}
