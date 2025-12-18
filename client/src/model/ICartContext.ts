import type { Dispatch, SetStateAction } from "react";
import type { Cart } from "./ICart";

export interface CartContextValue{
    cart: Cart | null;
    setCart: Dispatch<SetStateAction<Cart | null>>;
    deleteItem: (productId:number,quantity:number) => void;
}
