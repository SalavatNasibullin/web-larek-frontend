import { IEvents } from '../components/base/events';
import { FormErrors, Order } from '../types/index';

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
  getOrderLot(): Order;
  setTotal(total: number): void;
  setItems(items: string[]): void;
  getOrderData(): Pick<Order, 'email' | 'phone' | 'address'>;
}

export class FormModel implements IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  formErrors: FormErrors = {};

  constructor(protected events: IEvents) {
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

  validateOrder(): boolean {
    const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
    const errors: typeof this.formErrors = {};

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

  validateContacts(): boolean {
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

  setTotal(total: number) {
    this.total = total;
  }

  setItems(items: string[]) {
    this.items = items;
  }

  getOrderLot(): Order {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
    };
  }

getOrderData(): Order {
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
