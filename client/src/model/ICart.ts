export interface CartItem {
    imgUrl: string;
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

export interface Cart {
    id: number;
    customerId: string;
    items: CartItem[];
}
