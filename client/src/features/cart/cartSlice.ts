import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Cart } from "../../model/ICart";
import requests from "../../api/requests";

interface CartState {
    cart : Cart | null;
    status : string;
}

const initialState: CartState = {
    cart: null,
    status: 'idle'
};

export const addItemToCart = createAsyncThunk<Cart, { productId: number; quantity?: number }>(
    "cart/addItemToCart",
    async ({ productId, quantity = 1 }) => {
        try {
            return await requests.Cart.addItem(productId, quantity);
        } catch (error) {
            console.log("Error adding item to cart:", error);
        }
    }
);

export const deleteItemFromCart = createAsyncThunk<Cart, { productId: number; quantity?: number }>(
    "cart/deleteItemFromCart",
    async ({ productId, quantity = 1 }) => {
        try {
            return await requests.Cart.deleteItem(productId, quantity);
        } catch (error) {
            console.log("Error deleting item from cart:", error);
        }
    }
);

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart : (state, action) =>{
            state.cart = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addItemToCart.pending, (state,action) => {
                state.status = 'pendingAddItem' + action.meta.arg.productId;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.status = 'idle';
            })
            .addCase(addItemToCart.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(deleteItemFromCart.pending, (state, action) => {
                state.status = 'pendingDeleteItem' + action.meta.arg.productId;
            })
            .addCase(deleteItemFromCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.status = 'idle';
            })
            .addCase(deleteItemFromCart.rejected, (state) => {
                state.status = 'failed';
            }); 
    }
});

export const { setCart } = cartSlice.actions;
