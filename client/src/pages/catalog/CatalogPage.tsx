import { useEffect, useState } from "react";
import ProductList from "./ProductList";
import type { IProduct } from "../../model/IProduct";

function CatalogPage() {

  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    fetch("http://localhost:5220/api/products")
    .then(response => response.json())
    .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <h1>Catalog Page</h1>
      <ProductList products={products} />
    </div>
  );
}

export default CatalogPage;