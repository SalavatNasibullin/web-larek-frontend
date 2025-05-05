export class Page {
  private gallery: HTMLElement;
  private basketCounter: HTMLElement;
  private totalSum: HTMLElement;

  constructor() {
    this.gallery = document.querySelector('.gallery')!;
    this.basketCounter = document.querySelector('.header__basket-counter')!;
    this.totalSum = document.querySelector('.basket__price-value')!;
  }

  // Очищение галерии перед повторным рендером
  clearGallery(): void {
    this.gallery.innerHTML = '';
  }

  // Добавление карточки в галерею
  addCard(cardElement: HTMLElement): void {
    this.gallery.append(cardElement);
  }

  // Обновление счётчика корзины в шапке
  updateBasketCounter(count: number): void {
    this.basketCounter.textContent = String(count);
  }

  // Обновление суммы всех товаров
  updateTotalSum(total: number): void {
    this.totalSum.textContent = `${total} синапсов`;
  }
}
