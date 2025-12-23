import { useEffect, useState } from "react";
import ProductList from "./ProductList";
import type { IProduct } from "../../model/IProduct";
import requests from "../../api/requests";

function CatalogPage() {

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requests.Catalog.list()
    .then(data => setProducts(data))
    .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Catalog Page</h1>
      <ProductList products={products} />
    </div>
  );
}

export default CatalogPage;