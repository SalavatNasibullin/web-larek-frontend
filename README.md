# Проектная работа "Веб-ларек"

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Описание проекта

Проект представляет собой интернет-магазин с корзиной товаров, реализованный на TypeScript с использованием паттерна MVP (Model-View-Presenter). В проекте имеется разделение обязанностей между классами: Model отвечает за работу с данными, View — за отображение интерфейса, а EventEmitter выступает в роли посредника, связывающего Model и View через события.

Стек технологий:
HTML, SCSS — для разметки и стилей.

TypeScript — для реализации логики.

Webpack — для сборки проекта.


## Описание базовых классов

`Класс Api`
Отвечает за взаимодействие с сервером. Основные методы:

get(uri: string) — получает данные с сервера.

post(uri: string, data: object) — отправляет данные на сервер.

handleResponse(response: Response) — обрабатывает ответ сервера.

`Класс EventEmitter`
Реализует паттерн 'Наблюдатель' для управления событиями. Позволяет:

Подписываться на события (on).

Отписываться от событий (off).

Генерировать события (emit).

Обрабатывать все события сразу (onAll, offAll).

## Описание классов Model

`Класс BasketModel`
Управляет корзиной товаров:

getCounter() — возвращает количество товаров.

getSumAllProducts() — считает общую стоимость.

setSelectedCard(item: Goods) — добавляет товар.

removeFromBasket(item: Goods) — удаляет товар.

cemptyBasket() — очищает корзину.

`Класс DataModel`
Хранит данные о товарах:

productCards — массив товаров.

showItemDetails(item: Goods) — открывает детали товара.

`Класс FormModel`
Работает с данными пользователя:

setOrderAddress(field: string, value: string) — сохраняет адрес.

validateOrder() — проверяет корректность адреса и оплаты.

setOrderData(field: string, value: string) — сохраняет контакты.

validateContacts() — проверяет корректность email и телефона.

getOrderLot() — возвращает данные заказа.

## Описание классов View

`Класс Basket`
Отображает корзину:

renderHeaderBasketCounter(value: number) — обновляет счетчик товаров.

renderSumAllProducts(sumAll: number) — показывает общую сумму.

`Класс Card`
Отображает карточку товара:

setText(element: HTMLElement, value: string) — устанавливает текст.

setCategory(value: string) — задает категорию товара.

setPrice(value: number | null) — форматирует цену.

`Класс Modal`
Управляет модальными окнами:

open() — открывает окно.

close() — закрывает окно.

locked — блокирует прокрутку страницы.

`Класс Success`
Показывает сообщение об успешном заказе:

render(total: number) — отображает итоговую сумму.

## Ключевые типы данных

// Интерфейс товаров
export interface Goods {
  title: string;
  description: string;
  id: string;
  category: string;
  image: string;
  price: number | null;
}

// Каталог товаров
export interface GoodsCatalog {
  getProduct(productId: string): Goods;
  setProducts(products: Goods[]): void;
  setView(product: Goods): void;
  products: Goods[];
  preview: string | null;
} 

//Данные пользователя
export interface UserForm {
  address?: string;
  payment?: string;
  email?: string;
  phone?: string;
  total?: number;
}

/Действия с данными пользователя
export interface UserFormsData {
  getUserInfo(field: keyof UserForm): void;
  setField(field: keyof UserForm, value: string): void;
  confirmOrder(): Partial<Record<keyof UserForm, string>>;
  clearOrderData(): void;
}

//Корзина
export interface RecycleBin {
  setProducts(products: Goods[]): void;
  getViewProducts(): Goods[];
  getOneProduct(id: string): Goods;
  getProductsRecycleBin(): number;
  getTotalPrice(): number;
  addToRecycleBin(product: Goods): void;
  removeFromRecycle(product: Goods): void;
  clearRecycleBin(): void;
}


## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```