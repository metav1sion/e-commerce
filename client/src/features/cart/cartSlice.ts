import { createSlice } from "@reduxjs/toolkit";
import type { Cart } from "../../model/ICart";

interface CartState {
    cart : Cart | null;
}

const initialState: CartState = {
    cart: null,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart : (state, action) =>{
            state.cart = action.payload;
        },
        deleteCartItem(state, action) {
            if (state.cart) {
                state.cart.items = state.cart.items.filter(item => item.productId !== action.payload);
            }
        }
}
});

export const { setCart, deleteCartItem } = cartSlice.actions;