export interface CartItem   {
    imageUrl: string;
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

export interface Cart {
    cartId: number;
    customerId: string;
    items: CartItem[];
}