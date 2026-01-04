// import React, { createContext, useEffect, useState, type PropsWithChildren } from "react";
// import requests from "../api/requests";
// import type { CartContextValue } from "../model/ICartContext";
// import type { Cart } from "../model/ICart";
//
// export const CartContext = createContext<CartContextValue | undefined>(undefined);
//
// export function useCartContext(){
//
//     const context =  React.useContext(CartContext);
//     if(!context){
//         throw new Error("useCartContext must be used within a CartContextProvider");
//     }
//     return context;
// }
//
// export function CartContextProvider({children}: PropsWithChildren<unknown>){
//     const [cart,setCart] = useState<Cart | null>(null);
//
//     // useEffect(() => {
//     //     requests.Cart.getCart()
//     //         .then((cartResponse: Cart) => setCart(cartResponse))
//     //         .catch((error) => console.error("Cart could not be loaded", error));
//     // }, []);
//
//     const deleteItem = (productId : number, quantity : number) => {
//         requests.Cart.deleteItem(productId, quantity)
//             .then(() => requests.Cart.getCart())
//             .then((cartResponse: Cart) => setCart(cartResponse))
//             .catch((error) => console.error("The product could not be deleted", error));
//     };
//
//     return (<CartContext.Provider value={{cart, setCart, deleteItem}}>
//                 {children}
//             </CartContext.Provider>)
// }
