import { IEvents } from '../components/base/events';
import { FormErrors, Goods } from '../types/index';
import { BasketModel } from '../components/BasketModel';

export interface IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  setOrderAddress(field: string, value: string): void;
  validateOrder(): boolean;
  setOrderData(field: string, value: string): void;
  validateContacts(): boolean;
  getOrderLot(): object;
}

export class FormModel implements IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  formErrors: FormErrors = {};

  constructor(
    protected events: IEvents,
    private basketModel: BasketModel
  ) {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.total = 0;
    this.items = [];
  }

  setOrderAddress(field: string, value: string) {
    if (field === 'address') {
      this.address = value;
    }

    this.validateOrder();
  }

  validateOrder() {
    const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
    const errors: typeof this.formErrors = {};

    this.total = this.basketModel.getSumAllProducts();

    if (!this.address) {
      errors.address = 'Необходимо указать адрес';
    } else if (!regexp.test(this.address)) {
      errors.address = 'Укажите настоящий адрес';
    }

    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    if (this.total === 0) {
      errors.total = 'Корзина пуста или содержит только бесценные товары';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:address', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  setOrderData(field: string, value: string) {
    if (field === 'email') {
      this.email = value;
    } else if (field === 'phone') {
      this.phone = value;
    }

    this.validateContacts();
  }

  validateContacts() {
    const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
    const errors: typeof this.formErrors = {};

    if (!this.email) {
      errors.email = 'Необходимо указать email';
    } else if (!regexpEmail.test(this.email)) {
      errors.email = 'Некорректный адрес электронной почты';
    }

    if (this.phone.startsWith('8')) {
      this.phone = '+7' + this.phone.slice(1);
    }

    if (!this.phone) {
      errors.phone = 'Необходимо указать телефон';
    } else if (!regexpPhone.test(this.phone)) {
      errors.phone = 'Некорректный формат номера телефона';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  getOrderLot() {
    const products = this.basketModel.basketProducts;

    this.items = products
      .filter((item: Goods) => item.price !== null)
      .map((item: Goods) => item.id);

    this.total = this.basketModel.getSumAllProducts();

    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
    };
  }
}
