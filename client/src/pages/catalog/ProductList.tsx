import {useEffect, useState } from "react";
import type { IProduct } from "../../model/IProduct";
import Product from "./Product";
import { Grid } from "@mui/material";

interface Props {
  products: IProduct[];
}

function ProductList(props: Props) {

  const[filteredProducts, setFilteredProducts] = useState<IProduct[]>(props.products);
  console.log("render...");

  useEffect(() => {
      setFilteredProducts(props.products.filter(p => p.isActive === true));
    }, [props.products]);

  return (
    <div>
      <Grid container spacing={2}>
        {filteredProducts.map(p => (
          <Grid key={p.id} size={{xs:12,md:4,lg:3}}>
            <Product key={p.id} product={p} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default ProductList;

