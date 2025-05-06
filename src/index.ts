import './scss/styles.scss';
import { Goods, UserForm, Order as OrderType } from './types';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { DataModel } from './components/base/DataModel';
import { Card } from './components/View/Card';
import { Order } from './components/View/FormOrder';
import { Basket } from './components/View/RecycleBin';
import { BasketModel } from './components/BasketModel';
import { Modal } from './components/View/ModalWindow';
import { CardPreview } from './components/View/CardPreview';
import { FormModel } from './components/FormModel';
import { BasketItem } from './components/View/BasketItem';
import { Success } from './components/View/Success';
import { Contacts } from './components/View/Contacts';

// Создание события и модели корзины
const events = new EventEmitter();
const basketModel = new BasketModel();

// Шаблоны
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;

// Создание АПИ, модель данных и другие элементы
const api = new WebLarekApi(CDN_URL, API_URL);
const dataModel = new DataModel(events);
const formModel = new FormModel(events);
const basket = new Basket(basketTemplate, events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);

// Получение списка товаров с АПИ
api.getProductsList()
  .then((data: Goods[]) => {
    dataModel.productCards = data;
  })
  .catch((error) => console.log(error));

// Рендер карточек товара
events.on('productCards:receive', () => {
  dataModel.productCards.forEach(item => {
    const card = new Card(cardCatalogTemplate, events, {
      onClick: () => events.emit('card:select', item),
    });
    document.querySelector('.gallery')?.append(card.render(item));
  });
});

// Получение карточки товара по клику
events.on('card:select', (item: Goods) => {
  dataModel.showItemDetails(item);
});

// Открытие модального окна карточки товара
events.on('modalCard:open', (item: Goods) => {
  const cardPreview = new CardPreview(cardPreviewTemplate, events, basketModel);
  modal.content = cardPreview.render(item);
  modal.render();
});

// Добавление товара в корзину
events.on('card:addBasket', () => {
  basketModel.setSelectedCard(dataModel.currentItem);
  modal.close();
});

// Открытие окна корзины 
events.on('basket:open', () => {
  events.emit('basket:change');
  modal.content = basket.render();
  modal.render();
});

// Обновление содержимого корзины
events.on('basket:change', () => {
  basket.renderHeaderBasketCounter(basketModel.getCounter());
  basket.renderSumAllProducts(basketModel.getSumAllProducts());
  let i = 0;
  basket.items = basketModel.basketProducts.map(item => {
    const basketItem = new BasketItem(cardBasketTemplate, events, {
      onClick: () => events.emit('basket:basketItemRemove', item),
    });
    return basketItem.render(item, ++i);
  });
});

// Удаление товара из корзины
events.on('basket:basketItemRemove', (item: Goods) => {
  basketModel.removeFromBasket(item);
  events.emit('basket:change');
});

// Открытие окна с оплатой
events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
});

// Изменение адреса
events.on('order:changeAddress', (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.field, data.value);
});

// Выбор способа оплаты
events.on('order:paymentSelection', (button: HTMLButtonElement) => {
  formModel.payment = button.name;
  button.classList.add('selected');
});

// Валидация адреса и способа оплаты
events.on('formErrors:address', (errors: Partial<UserForm>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;
  order.formErrors.textContent = Object.values({ address, payment }).filter(i => !!i).join('; ');
});

// Открытие формы контактов
events.on('contacts:open', () => {
  modal.content = contacts.render();
  modal.render();
});

// Изменение поля электронной почты и телефона
events.on('contacts:changeInput', (data: { field: string, value: string }) => {
  formModel.setOrderData(data.field, data.value);
});

// Валидация электронной почты и телефона
events.on('formErrors:change', (errors: Partial<UserForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.formErrors.textContent = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

// Отправка заказа
events.on('order:ready', (orderData: OrderType) => {
  api.orderProducts(orderData)
    .then(() => {
      const success = new Success(successTemplate, events);
      modal.content = success.render(orderData.total);
      basketModel.cemptyBasket();
      basket.renderHeaderBasketCounter(basketModel.getCounter());
      modal.render();
    })
    .catch((error) => {
      console.error('Order failed:', error);
    });
});

// Переход от контактов к заказу
events.on('order:nextStep', () => {
  if (order.valid) {
    events.emit('contacts:open');
  }
});

// Закрытие окна 
events.on('success:close', () => modal.close());

// Блокировка и разблокировка прокрутки
events.on('modal:open', () => {
  modal.locked = true;
});
events.on('modal:close', () => {
  modal.locked = false;
});

// Сборка объекта заказа и отправка
events.on('order:submit', () => {
  const payload: OrderType = {
    ...formModel.getOrderData(),
    total: basketModel.getSumAllProducts(),
    items: basketModel.getIds(),
  };

  events.emit('order:ready', payload);
});

events.on('form:submit', () => {
  events.emit('order:submit');
});

