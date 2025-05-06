import { Goods } from "../types";

// Интерфейс для работы с корзиной
export interface IMyBasket {
  basketProducts: Goods[];                    // Товары в корзине
  getCounter(): number;                       // Количество товаров
  getSumAllProducts(): number;                // Общая сумма товаров
  setSelectedCard(data: Goods): void;         // Добавление товара в корзину
  removeFromBasket(item: Goods): void;      // Удаление товара из корзины
  cemptyBasket(): void;                // Очистить корзину
  isInBasket(item: Goods): boolean;           // Проверка, в корзине ли товар
}

// Класс модели корзины
export class BasketModel implements IMyBasket {
  private _basketProducts: Goods[] = [];

  get basketProducts(): Goods[] {
    return this._basketProducts;
  }

  set basketProducts(data: Goods[]) {
    this._basketProducts = data;
  }

  // Количество товаров в корзине
  getCounter(): number {
    return this._basketProducts.length;
  }

  // Общая сумма товаров (только с ценой)
  getSumAllProducts(): number {
    return this._basketProducts.reduce((sum, item) => {
      return sum + (item.price ?? 0);
    }, 0);
  }

  // Добавление товара в корзину (без дубликатов)
  setSelectedCard(data: Goods): void {
    if (!this.isInBasket(data)) {
      this._basketProducts.push(data);
      console.log(`[Basket] Added item: ${data.id}`);
    } else {
      console.log(`[Basket] Item ${data.id} is already in basket.`);
    }
  }

  // Удаление товара из корзины по id
  removeFromBasket(item: Goods): void {
    this._basketProducts = this._basketProducts.filter(product => product.id !== item.id
    );
  }

  // Очистка корзины
  cemptyBasket(): void {
    this._basketProducts = [];
  }

  // Проверка, находится ли товар в корзине
  isInBasket(item: Goods): boolean {
    return this._basketProducts.some(product => product.id === item.id);
  }

  getIds(): string[] {
    return this.basketProducts.map(item => item.id);
  }
}
