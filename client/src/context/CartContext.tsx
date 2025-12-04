import { createContext, useState, type PropsWithChildren } from "react";
import type { CartContextValue } from "../model/ICartContext";
import type { Cart } from "../model/ICart";

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartContextProvider({children}:PropsWithChildren){
    const [cart,setCart] = useState<Cart | null>(null)

    const deleteItem = (productId : number, quantity : number) => {

    }

    return (<CartContext.Provider value={{cart, setCart, deleteItem}}>
                {children}
            </CartContext.Provider>)
}