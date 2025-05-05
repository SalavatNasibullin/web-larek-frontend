import { IEvents } from '../components/base/events';
import { BasketModel } from '../components/BasketModel';
import { FormModel } from '../components/FormModel';
import { Goods } from '../types/index';

export class OrderPresenter {
  constructor(
    private events: IEvents,
    private basketModel: BasketModel,
    private formModel: FormModel
  ) {
    this.events.on('form:submit', this.handleFormSubmit.bind(this));
    console.log('Нажата кнопка "Купить"');
  }

  private handleFormSubmit() {
    const validItems = this.basketModel.basketProducts
      .filter((item: Goods) => item.price !== null)
      .map((item: Goods) => item.id);

    const totalSum = this.basketModel.getSumAllProducts();

    // Если корзина пустая
    if (validItems.length === 0) {
      this.events.emit('formErrors:address', {
        total: 'Корзина пуста или содержит только бесценные товары',
      });
      return;
    }

    this.formModel.setItems(validItems);
    this.formModel.setTotal(totalSum);

    const isOrderValid =
      this.formModel.validateContacts() && this.formModel.validateOrder();

    if (isOrderValid) {
      const orderData = this.formModel.getOrderLot();
      this.events.emit('order:ready', orderData);
    }
  }
}
