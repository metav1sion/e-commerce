import { useEffect, useState } from "react";
import type { IProduct } from "../model/IProduct";
import Header from "./Header";
import ProductList from "./ProductList";
import { Container, CssBaseline } from "@mui/material";

function App() {

  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    fetch("http://localhost:5220/api/products")
    .then(response => response.json())
    .then(data => setProducts(data));
  }, []);
  
  return (
    <>
      <CssBaseline />
        <Header products={products} />
      <Container>
        <ProductList products={products} />
      </Container>
    </>
  );
}

export default App;
