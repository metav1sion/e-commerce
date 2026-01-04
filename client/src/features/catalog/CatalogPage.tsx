import { useEffect } from "react";
import ProductList from "./ProductList";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks.ts";
import {fetchproducts, selectAllProducts} from "./catalogSlice.ts";
import {CircularProgress} from "@mui/material";
function CatalogPage() {

    const products = useAppSelector(selectAllProducts);
    const { isFetched, status } = useAppSelector((state) => state.catalog);
    const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isFetched){
        dispatch(fetchproducts());
    }
  }, [isFetched, dispatch]);

  if(status === "pendingFetchProducts") return <CircularProgress />;

  return (
    <div>
      <h1>Catalog Page</h1>
      <ProductList products={products} />
    </div>
  );
}

export default CatalogPage;