import type { Cart } from "./ICart";

export interface CartContextValue{
    cart: Cart | null;
    setCart: (cart:Cart) => void;
    deleteItem: (productId:number,quantity:number) => void;
}