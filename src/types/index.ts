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


//Действия с данными пользователя
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

//Интерфейс заказа
export interface Order extends UserForm {
  items: string[];
  total: number;
}

//Интерфейс возврата заказа
export interface GoodsResult {
  id: string;
  total: number;
}

export interface ApiResponse {
  total: number;
  items: Goods[];
}

//Типы данных
export type UsForm = Pick<UserForm, 'payment' | 'address' | 'phone' | 'email'>;

//Информация данных пользователя
export type UserInfo = 'paymentMethod' | 'address' | 'phone' | 'email';

//Тип оплаты
export type UserPayment = 'cash' | 'card';

//Ошибки
export type FormErrors = Partial<Record<keyof UserForm, string>>;

export interface IActions {
  onClick: (event: MouseEvent) => void;
}
