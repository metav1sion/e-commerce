# Redux Toolkit Kullanım Rehberi

Bu döküman, e-commerce projesinde kullanılan Redux Toolkit yapısını ve temel kavramları açıklamaktadır.

## İçindekiler
1. [Redux Toolkit Nedir?](#redux-toolkit-nedir)
2. [Store Yapısı](#store-yapısı)
3. [Slice Mantığı](#slice-mantığı)
4. [Thunk Metodları](#thunk-metodları)
5. [Entity Adapter](#entity-adapter)
6. [Typed Hooks](#typed-hooks)
7. [Projede Kullanım Örnekleri](#projede-kullanım-örnekleri)

---

## Redux Toolkit Nedir?

Redux Toolkit (RTK), Redux kullanımını kolaylaştıran ve best practice'leri varsayılan olarak uygulayan resmi Redux pakedidir. Klasik Redux'a göre şu avantajları sağlar:

- **Daha az boilerplate kod**: createSlice gibi yardımcı fonksiyonlar ile daha az kod yazarsınız
- **Immutability otomatik**: Immer kütüphanesi sayesinde state'i doğrudan değiştirir gibi yazabilirsiniz
- **Redux DevTools entegre**: Otomatik olarak devtools desteği gelir
- **TypeScript desteği**: Tam tip güvenliği sağlar

---

## Store Yapısı

Store, uygulamanın tüm state'ini tutan merkezi deposudur. Projemizde `store.tsx` dosyasında tanımlanmıştır:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { counterSlice } from '../features/counter/counterSlice';
import { cartSlice } from '../features/cart/cartSlice';
import { catalogSlice } from "../features/catalog/catalogSlice.ts";

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        cart: cartSlice.reducer,
        catalog: catalogSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Açıklama:

- **`configureStore`**: Redux store'u oluşturur, middleware'leri ve DevTools'u otomatik yapılandırır
- **`reducer`**: Her slice'ın reducer'ını birleştirir. Her key bir state parçasını temsil eder
- **`RootState`**: Tüm state'in TypeScript tipidir. Component'lerde state'e erişirken kullanılır
- **`AppDispatch`**: Dispatch fonksiyonunun tipidir. Action'ları tetiklerken kullanılır

### Store State Yapısı:
```typescript
{
  counter: { value: number },
  cart: { cart: Cart | null, status: string },
  catalog: { ids: [], entities: {}, status: string, isFetched: boolean }
}
```

---

## Slice Mantığı

Slice, Redux state'inin bir bölümünü ve o bölümü değiştiren reducer'ları içeren bir yapıdır. Her slice bir özelliği (feature) temsil eder.

### Basit Slice Örneği: Counter

```typescript
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
    value: number;
}

const initialState : CounterState = {
    value: 0,
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state: CounterState) => {
            state.value += 1;
        },
        decrement: (state: CounterState) => {
            state.value -= 1;
        },
        incrementByAmount: (state: CounterState, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
    },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
```

### Slice Anatomisi:

1. **`name`**: Slice'ın benzersiz adı. Action type'larında prefix olarak kullanılır
   - Örnek: `increment` action'ı → `counter/increment` şeklinde oluşturulur

2. **`initialState`**: Slice'ın başlangıç state'i
   - Component ilk mount olduğunda bu değerler kullanılır

3. **`reducers`**: Senkron action'ları tanımlar
   - **`state`**: Mevcut state (Immer sayesinde doğrudan değiştirebilirsiniz)
   - **`action`**: Dispatch edilen action objesi
   - **`action.payload`**: Action ile gönderilen veri

4. **`extraReducers`**: Asenkron action'ları (thunk'ları) ve diğer slice'ların action'larını dinler

### Slice Action'ları Kullanımı:

```typescript
// Component içinde
import { increment, incrementByAmount } from './counterSlice';
import { useAppDispatch } from '../../hooks/hooks';

const dispatch = useAppDispatch();

// Basit action
dispatch(increment()); // state.value += 1

// Payload ile action
dispatch(incrementByAmount(5)); // state.value += 5
```

---

## Thunk Metodları

Thunk, asenkron işlemler (API çağrıları) yapmak için kullanılan bir Redux pattern'idir. Redux Toolkit'te `createAsyncThunk` ile kolayca oluşturulur.

### Thunk Nedir ve Neden Kullanılır?

**Sorun**: Redux reducer'ları pure fonksiyonlar olmalıdır. Yani side effect (API çağrısı, setTimeout, vb.) içeremezler.

**Çözüm**: Thunk, asenkron işlemleri reducer dışında yapar ve tamamlandığında action dispatch eder.

### Thunk Yaşam Döngüsü:

Her thunk 3 otomatik action oluşturur:
- **`pending`**: İşlem başladığında
- **`fulfilled`**: İşlem başarılı olduğunda
- **`rejected`**: İşlem hata verdiğinde

### Cart Slice'da Thunk Örneği:

```typescript
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

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: null,
        status: 'idle'
    },
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addItemToCart.pending, (state, action) => {
                state.status = 'pendingAddItem' + action.meta.arg.productId;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.status = 'idle';
            })
            .addCase(addItemToCart.rejected, (state) => {
                state.status = 'failed';
            });
    }
});
```

### Thunk Parametreleri:

```typescript
createAsyncThunk<ReturnType, ArgType>(
    "prefix/actionName",
    async (arg: ArgType) => {
        // API çağrısı
        return data; // fulfilled action'a gider
    }
)
```

- **`ReturnType`**: API'den dönen veri tipi
- **`ArgType`**: Thunk'a gönderilen parametre tipi

### Component'te Thunk Kullanımı:

```typescript
import { addItemToCart } from './cartSlice';

// Thunk dispatch etme
dispatch(addItemToCart({ productId: 5, quantity: 2 }));

// Status kontrolü
const { status } = useAppSelector((state) => state.cart);
const isLoading = status.includes('pendingAddItem');
```

### Catalog Slice'da Thunk Örneği:

```typescript
export const fetchproducts = createAsyncThunk<IProduct[]>(
    "catalog/fetchProducts",
    async () => {
        return await requests.Catalog.list();
    }
)

export const fetchproductById = createAsyncThunk<IProduct[], number>(
    "catalog/fetchproductById",
    async (productId) => {
        return await requests.Catalog.details(productId);
    }
)
```

**Fark**: `fetchproducts` parametre almaz, `fetchproductById` ise `number` tipinde productId alır.

---

## Entity Adapter

Entity Adapter, normalize edilmiş state yapısını yönetmek için Redux Toolkit'in sağladığı bir yardımcı araçtır. Özellikle liste şeklindeki verileri yönetmek için kullanılır.

### Neden Entity Adapter?

**Klasik Dizi Yöntemi:**
```typescript
state.products = [
  { id: 1, name: 'Product 1' },
  { id: 2, name: 'Product 2' },
  { id: 3, name: 'Product 3' }
]

// ID'ye göre ürün bulmak O(n) zaman karmaşıklığı
const product = state.products.find(p => p.id === 2);
```

**Entity Adapter Yöntemi:**
```typescript
state.products = {
  ids: [1, 2, 3],
  entities: {
    1: { id: 1, name: 'Product 1' },
    2: { id: 2, name: 'Product 2' },
    3: { id: 3, name: 'Product 3' }
  }
}

// ID'ye göre ürün bulmak O(1) zaman karmaşıklığı
const product = state.products.entities[2];
```

### Avantajları:

1. **Performans**: ID'ye göre erişim çok hızlıdır (O(1))
2. **Güncelleme kolaylığı**: Tek bir ürünü güncellemek kolaydır
3. **Hazır metodlar**: `setAll`, `upsertMany`, `removeOne` gibi yardımcı metodlar
4. **Selector'lar**: Otomatik selector'lar oluşturur

### Catalog Slice'da Entity Adapter:

```typescript
import { createEntityAdapter } from "@reduxjs/toolkit";
import type { IProduct } from "../../model/IProduct.ts";

const productsAdapter = createEntityAdapter<IProduct>();

const initialState = productsAdapter.getInitialState({
    status: "idle",
    isFetched: false,
});

// extraReducers içinde
builder.addCase(fetchproducts.fulfilled, (state, action) => {
    productsAdapter.setAll(state, action.payload); // Tüm ürünleri set eder
    state.status = "idle";
    state.isFetched = true;
});

builder.addCase(fetchproductById.fulfilled, (state, action) => {
    productsAdapter.upsertMany(state, action.payload); // Yoksa ekler, varsa günceller
    state.status = "idle";
});
```

### Entity Adapter Metodları:

- **`setAll(state, entities)`**: Tüm state'i verilen entity'lerle değiştirir
- **`addOne(state, entity)`**: Tek bir entity ekler
- **`addMany(state, entities)`**: Birden fazla entity ekler
- **`upsertOne(state, entity)`**: Varsa günceller, yoksa ekler
- **`upsertMany(state, entities)`**: Birden fazla entity için upsert
- **`removeOne(state, id)`**: ID'ye göre entity siler
- **`updateOne(state, { id, changes })`**: Belirli alanları günceller

### Otomatik Selector'lar:

```typescript
export const {
    selectById: selectProductById,
    selectIds: selectProductIds,
    selectEntities: selectProductEntities,
    selectTotal: selectTotalProducts,
    selectAll: selectAllProducts,
} = productsAdapter.getSelectors((state: RootState) => state.catalog);
```

Bu selector'lar component'lerde kullanılır:

```typescript
// Tüm ürünleri al
const products = useAppSelector(selectAllProducts);

// Belirli ID'deki ürünü al
const product = useAppSelector(state => selectProductById(state, 5));

// Sadece ID'leri al
const productIds = useAppSelector(selectProductIds);

// Toplam ürün sayısı
const totalProducts = useAppSelector(selectTotalProducts);
```

---

## Typed Hooks

Redux'un `useDispatch` ve `useSelector` hook'larının TypeScript ile tip güvenli versiyonlarıdır.

```typescript
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### Neden Özel Hook'lar?

**Sorun**: Vanilla `useDispatch` ve `useSelector` tipleri generic'tir ve projenizin state yapısını bilmez.

**Çözüm**: `withTypes` ile tip bilgisini enjekte ederiz.

### Kullanım:

```typescript
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

// Dispatch - autocomplete ile action'ları görürsünüz
const dispatch = useAppDispatch();
dispatch(fetchproducts()); // ✓ Tip güvenli

// Selector - state yapısı autocomplete ile gelir
const products = useAppSelector(state => state.catalog); // ✓ Tip güvenli
const cartStatus = useAppSelector(state => state.cart.status); // ✓ Tip güvenli
```

---

## Projede Kullanım Örnekleri

### 1. Catalog Page: Ürünleri Listele

```typescript
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks.ts";
import { fetchproducts, selectAllProducts } from "./catalogSlice.ts";
import { CircularProgress } from "@mui/material";

function CatalogPage() {
    // Selector ile state'ten veri çek
    const products = useAppSelector(selectAllProducts);
    const { isFetched, status } = useAppSelector((state) => state.catalog);
    
    // Dispatch için hook
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Daha önce çekilmediyse API çağrısı yap
        if (!isFetched) {
            dispatch(fetchproducts());
        }
    }, [isFetched, dispatch]);

    // Loading state kontrolü
    if (status === "pendingFetchProducts") return <CircularProgress />;

    return (
        <div>
            <h1>Catalog Page</h1>
            <ProductList products={products} />
        </div>
    );
}
```

**Akış:**
1. Component mount olur
2. `isFetched` false ise `fetchproducts()` thunk'ı dispatch edilir
3. Thunk pending olur → `status = "pendingFetchProducts"` → Loading gösterilir
4. API çağrısı tamamlanır → Thunk fulfilled olur → Ürünler state'e kaydedilir
5. Component re-render olur → Ürünler gösterilir

### 2. Cart: Sepete Ürün Ekle

```typescript
const dispatch = useAppDispatch();
const { status } = useAppSelector((state) => state.cart);

const handleAddToCart = (productId: number) => {
    dispatch(addItemToCart({ productId, quantity: 1 }));
};

// Belirli ürün için loading kontrolü
const isLoading = status === `pendingAddItem${productId}`;
```

**Akış:**
1. Kullanıcı butona tıklar
2. `addItemToCart` thunk'ı dispatch edilir
3. `status = "pendingAddItem5"` olur (productId: 5 için)
4. API çağrısı yapılır
5. Başarılı olursa → Cart state güncellenir → `status = "idle"`

### 3. Counter: Basit State Yönetimi

```typescript
const dispatch = useAppDispatch();
const count = useAppSelector((state) => state.counter.value);

<button onClick={() => dispatch(increment())}>+</button>
<span>{count}</span>
<button onClick={() => dispatch(decrement())}>-</button>
<button onClick={() => dispatch(incrementByAmount(10))}>+10</button>
```

**Not**: Counter asenkron işlem içermediği için thunk kullanmaz, sadece reducer'lar yeterlidir.

---

## Redux Toolkit Flow Özeti

```
Component
    ↓
useAppDispatch() → Action/Thunk dispatch eder
    ↓
Thunk (Asenkron) → API çağrısı yapar
    ↓
Reducer → State'i günceller
    ↓
useAppSelector() → Güncel state'i okur
    ↓
Component re-render olur
```

---

## Best Practices

1. **Her feature için ayrı slice**: `cart`, `catalog`, `counter` gibi
2. **State'i normalize edin**: Listeler için Entity Adapter kullanın
3. **Status field'ı**: Loading, error durumlarını yönetin
4. **Memoized selector'lar**: Performans için `createSelector` kullanabilirsiniz
5. **Typed hooks kullanın**: `useAppDispatch` ve `useAppSelector`
6. **Fetch flag'i**: Gereksiz API çağrılarını önleyin (`isFetched`)
7. **Action isimlendirme**: Açıklayıcı ve tutarlı isimler kullanın

---

## Sık Karşılaşılan Hatalar

### 1. State'i doğrudan değiştirmek (Redux Toolkit dışında)
```typescript
// ❌ Klasik Redux'ta hata
state.products.push(newProduct);

// ✓ Redux Toolkit'te geçerli (Immer sayesinde)
state.products.push(newProduct);
```

### 2. Asenkron işlemi reducer'da yapmak
```typescript
// ❌ Yanlış
reducers: {
    fetchProducts: (state) => {
        axios.get('/api/products'); // Reducer'da async işlem yapılmaz!
    }
}

// ✓ Doğru
createAsyncThunk('fetchProducts', async () => {
    return await axios.get('/api/products');
});
```

### 3. Selector'da karmaşık hesaplama
```typescript
// ❌ Her render'da hesaplama yapılır
const expensiveValue = useAppSelector(state => {
    return state.products.map(p => p.price * 1.18); // Her seferinde yeniden hesaplanır
});

// ✓ Memoized selector kullanın (createSelector)
```

---

## Sonuç

Redux Toolkit, modern React uygulamalarında state yönetimi için güçlü ve kullanımı kolay bir çözümdür. Bu projede:

- **Store**: Merkezi state deposu (`counter`, `cart`, `catalog`)
- **Slice**: Her feature için ayrı state ve reducer'lar
- **Thunk**: API çağrıları için asenkron action'lar
- **Entity Adapter**: Ürünleri normalize edilmiş şekilde yönetme
- **Typed Hooks**: TypeScript tip güvenliği

Bu yapı sayesinde ölçeklenebilir, bakımı kolay ve performanslı bir state yönetim sistemi kurulmuştur.

---

## Faydalı Kaynaklar

- [Redux Toolkit Resmi Dokümantasyonu](https://redux-toolkit.js.org/)
- [Redux Style Guide](https://redux.js.org/style-guide/)
- [Entity Adapter API](https://redux-toolkit.js.org/api/createEntityAdapter)
- [TypeScript Quick Start](https://redux-toolkit.js.org/tutorials/typescript)

