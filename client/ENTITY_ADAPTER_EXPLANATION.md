# 📚 Redux Toolkit EntityAdapter Açıklaması

## 🎯 `ids`, `entities` ve `status` Nereden Geliyor?

### 1️⃣ **createEntityAdapter** - Otomatik State Yapısı

```typescript
const productsAdapter = createEntityAdapter<IProduct>();
```

Bu satır, Redux Toolkit'e şunu söyler:
> "IProduct tipinde veriler için optimize edilmiş bir state yöneticisi oluştur"

**Otomatik olarak oluşturduğu yapı:**

```typescript
{
  ids: [],       // Veri sıralaması için ID array'i
  entities: {}   // Hızlı erişim için ID-indexed obje
}
```

### 2️⃣ **getInitialState** - Ekstra Alanlar Ekleme

```typescript
const initialState = productsAdapter.getInitialState({
    status: "idle",  // ← Ekstra alan ekliyoruz
});

// Sonuç:
{
  ids: [],
  entities: {},
  status: "idle"  // ← Manuel eklenen
}
```

### 3️⃣ **Store'da Mapping** - Redux State Ağacı

```typescript
// store.tsx
export const store = configureStore({
    reducer: {
        catalog: catalogSlice.reducer,  // ← "catalog" ismiyle mapping
        cart: cartSlice.reducer,        // ← "cart" ismiyle mapping
        counter: counterSlice.reducer,  // ← "counter" ismiyle mapping
    },
});
```

**Oluşan State Yapısı:**

```javascript
RootState = {
  catalog: {           // ← store.tsx'de tanımlanan key
    ids: [1, 2, 3],    // ← EntityAdapter otomatik
    entities: {        // ← EntityAdapter otomatik
      1: {...},
      2: {...},
      3: {...}
    },
    status: "idle"     // ← Manuel eklenen
  },
  cart: {
    basket: {...},
    status: "idle"
  },
  counter: {
    value: 0
  }
}
```

## 🔄 Veri Akışı

### API'den Gelen Veri:
```javascript
[
  { id: 1, name: "Apple Watch 10", price: 12999.99, ... },
  { id: 2, name: "Apple Watch 10", price: 14999.99, ... },
  { id: 3, name: "Apple Watch SE 2", price: 8999.99, ... }
]
```

### `setAll()` Sonrası State:
```javascript
{
  ids: [1, 2, 3],
  entities: {
    1: { id: 1, name: "Apple Watch 10", price: 12999.99, ... },
    2: { id: 2, name: "Apple Watch 10", price: 14999.99, ... },
    3: { id: 3, name: "Apple Watch SE 2", price: 8999.99, ... }
  },
  status: "idle"
}
```

## 🎁 EntityAdapter'ın Avantajları

### 1. **Performans**
```typescript
// ❌ Array ile yavaş arama (O(n))
const product = products.find(p => p.id === 5);

// ✅ Entity ile hızlı arama (O(1))
const product = entities[5];
```

### 2. **Kolay Güncelleme**
```typescript
// Adapter fonksiyonları:
productsAdapter.setAll(state, products);     // Tümünü değiştir
productsAdapter.addOne(state, product);      // Bir tane ekle
productsAdapter.upsertOne(state, product);   // Varsa güncelle, yoksa ekle
productsAdapter.removeOne(state, id);        // Sil
productsAdapter.updateOne(state, {           // Güncelle
  id: 1, 
  changes: { price: 13999.99 }
});
```

### 3. **Otomatik Selectors**
```typescript
export const {
    selectAll: selectAllProducts,           // Array döner
    selectById: selectProductById,          // ID ile tek ürün
    selectIds: selectProductIds,            // Sadece ID'ler
    selectEntities: selectProductEntities,  // Entities objesi
    selectTotal: selectTotalProducts,       // Toplam sayı
} = productsAdapter.getSelectors((state: RootState) => state.catalog);
```

## 🔍 Kullanım Örnekleri

### Component'te Kullanım:
```typescript
// Tüm ürünleri al
const products = useAppSelector(selectAllProducts);
// Sonuç: [{ id: 1, ... }, { id: 2, ... }, { id: 3, ... }]

// Tek ürün al
const product = useAppSelector(state => selectProductById(state, 1));
// Sonuç: { id: 1, name: "Apple Watch 10", ... }

// Sadece ID'leri al
const ids = useAppSelector(selectProductIds);
// Sonuç: [1, 2, 3]
```

## 📊 Redux DevTools'da Görüntü

```
State
└── catalog
    ├── ids: [1, 2, 3, 4, 5, 6, 7]
    ├── entities
    │   ├── 1: { id: 1, name: "Apple Watch 10", ... }
    │   ├── 2: { id: 2, name: "Apple Watch 10", ... }
    │   ├── 3: { id: 3, name: "Apple Watch SE 2", ... }
    │   └── ...
    └── status: "idle"
```

## 🎓 Özet

1. **`ids` ve `entities`** → `createEntityAdapter()` tarafından otomatik oluşturulur
2. **`status`** → `getInitialState({ status: "idle" })` ile manuel eklenir
3. **`catalog`** → `store.tsx`'de `reducer: { catalog: ... }` ile maplenir
4. **EntityAdapter** → Normalize edilmiş veri yapısı sağlar (hız + kolaylık)

## 🚀 Neden EntityAdapter Kullanıyoruz?

- ✅ Performans (O(1) arama)
- ✅ Kolay CRUD işlemleri
- ✅ Otomatik selectors
- ✅ Normalize edilmiş veri yapısı
- ✅ TypeScript desteği
- ✅ Daha az kod yazma

---

**💡 İpucu:** Tarayıcı console'unda yukarıdaki console.log'ları görebilirsiniz!

