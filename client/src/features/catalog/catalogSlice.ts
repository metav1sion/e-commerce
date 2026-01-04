import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import type {IProduct} from "../../model/IProduct.ts";
import requests from "../../api/requests.ts";
import type {RootState} from "../../store/store.tsx";

export const fetchproducts = createAsyncThunk<IProduct[]>(
    "catalog/fetchProducts",
    async () => {
        return await requests.Catalog.list();
    })

export const fetchproductById = createAsyncThunk<IProduct[], number>(
    "catalog/fetchproductById",
    async (productId) => {
        return await requests.Catalog.details(productId);
    })
const productsAdapter= createEntityAdapter<IProduct>();

const initialState = productsAdapter.getInitialState({
    status: "idle",
    isFetched: false,
});

export const catalogSlice = createSlice({
    name: "catalog",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchproducts.pending, (state) => {
            state.status = "pendingFetchProducts";
        });
        builder.addCase(fetchproducts.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = "idle";
            state.isFetched = true;
        });
        builder.addCase(fetchproducts.rejected , (state) => {
            state.status = "idle";
        })
        builder.addCase(fetchproductById.pending, (state) => {
            state.status = "pendingFetchProductById";
        });
        builder.addCase(fetchproductById.fulfilled, (state, action) => {
            productsAdapter.upsertMany(state, action.payload); // yoksa ekler varsa günceller
            state.status = "idle";
        });
        builder.addCase(fetchproductById.rejected , (state) => {
            state.status = "idle";
        });
    }
});

export const {
    selectById: selectProductById,
    selectIds: selectProductIds,
    selectEntities: selectProductEntities,
    selectTotal: selectTotalProducts,
    selectAll: selectAllProducts,
} = productsAdapter.getSelectors((state: RootState) => state.catalog);