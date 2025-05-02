import { Goods, GoodsResult, Order } from "../types";
import { Api, ApiListResponse } from "./base/api";

// Интерфейс для работы с сервером для получения товаров 
export interface AuctionAPI {
    getProductsList: () => Promise<Goods[]>; // Получение списка товаров
    getOneProduct: (id: string) => Promise<Goods>; // Функция  для получения товара по id
    orderProducts: (order: Order) => Promise<GoodsResult>; // Отправка данных о заказе
}

// Класс АПИ для работы с товарами на сайте 
export class WebLarekApi extends Api implements AuctionAPI {
    cdn: string;  // Базовая ссылка для изображения

    constructor(cdnUrl: string, baseUrl: string, options?: RequestInit) { // Конструктор для принятия URL и ссылки на CDN
        super(baseUrl, options);
        this.cdn = cdnUrl;
    }

    // Получить список всех товаров
    getProductsList(): Promise<Goods[]> {
        return this.get('/product/')
            .then((response: ApiListResponse<Goods>) => {
                return response.items.map((product) => {  // Добавление пути к изображению для каждого товара
                    return {
                        ...product,
                        image: this.cdn + product.image.replace(".svg", ".png"), // Получение картинок в соответствие с макетом
                    };
                });
            });
    }


    // Получить одного товара по ID
    getOneProduct(productId: string): Promise<Goods> {
        return this.get(`/product/${productId}`) // Запрос к серверу для получения товара
            .then((product: Goods) => {
                return {
                    ...product,
                    image: this.cdn + product.image
                };
            });
    }

    // Отправить заказ на сервер
    orderProducts(orderData: Order): Promise<GoodsResult> {
        return this.post('/order', orderData)
            .then((result: GoodsResult) => {
                return result;
            });
    }
}



