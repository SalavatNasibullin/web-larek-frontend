import './scss/styles.scss';
import { Goods, UserForm } from './types';
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
const basket = new Basket(basketTemplate, events);
const formModel = new FormModel(events, basketModel);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);

// Получение карточки товара по клику
events.on('card:select', (item: Goods) => {
  dataModel.showItemDetails(item);
});

// Рендер карточек товара
events.on('productCards:receive', () => {
  dataModel.productCards.forEach(item => {
    const card = new Card(cardCatalogTemplate, events, {
      onClick: () => events.emit('card:select', item)
    });
    document.querySelector('.gallery')?.append(card.render(item));
  });
});

// Получение списка товаров с АПИ
api.getProductsList()
  .then((data: Goods[]) => {
    dataModel.productCards = data;
  })
  .catch((error) => console.log(error));

// Добавление товара в корзину
events.on('card:addBasket', () => {
  basketModel.setSelectedCard(dataModel.currentItem);
  basket.renderHeaderBasketCounter(basketModel.getCounter());
  modal.close();
});

// Открытие модального окна карточки товара
events.on('modalCard:open', (item: Goods) => {
  const cardPreview = new CardPreview(cardPreviewTemplate, events, basketModel);
  modal.content = cardPreview.render(item);
  modal.render();
});

// Открытие окна с оплатой
events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
  formModel.items = basketModel.basketProducts.map(item => item.id);
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

// Открытие окна корзины
events.on('basket:open', () => {
  basket.renderSumAllProducts(basketModel.getSumAllProducts());
  let i = 0;
  basket.items = basketModel.basketProducts.map((item) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, {
      onClick: () => events.emit('basket:basketItemRemove', item)
    });
    i++;
    return basketItem.render(item, i);
  });
  modal.content = basket.render();
  modal.render();
});

// Удаление товара из корзины
events.on('basket:basketItemRemove', (item: Goods) => {
  basketModel.removeFromBasket(item);
  basket.renderHeaderBasketCounter(basketModel.getCounter());
  basket.renderSumAllProducts(basketModel.getSumAllProducts());
  let i = 0;
  basket.items = basketModel.basketProducts.map((item) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, {
      onClick: () => events.emit('basket:basketItemRemove', item)
    });
    i++;
    return basketItem.render(item, i);
  });
});

// Изменение адреса
events.on('order:changeAddress', (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.field, data.value);
});

// Открытие формы контактов
events.on('contacts:open', () => {
  formModel.total = basketModel.getSumAllProducts();
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
events.on('success:open', () => {
  api.orderProducts(formModel.getOrderLot())
    .then(() => {
      const success = new Success(successTemplate, events);
      modal.content = success.render(basketModel.getSumAllProducts());
      basketModel.cemptyBasket();
      basket.renderHeaderBasketCounter(basketModel.getCounter());
      modal.render();
    })
    .catch((error) => console.log(error));
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
