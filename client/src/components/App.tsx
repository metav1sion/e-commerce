import { use, useEffect, useState } from "react";
import Header from "./Header";
import { CircularProgress, Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import requests from "../api/requests";
import { useAppDispatch } from "../hooks/hooks";
import { setCart } from "../features/cart/cartSlice";

function App() {
  const [loading, setLoading] = useState(false);
  const dispatchCart = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    requests.Cart.getCart()
    .then(cart => dispatchCart(setCart(cart)))
    .catch(error => console.log(error))
    .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <CircularProgress size={60} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
    );
  }
  
  return (
    <>
    <ToastContainer position="bottom-right" hideProgressBar theme="colored"/>
      <CssBaseline />
        <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

export default App;
