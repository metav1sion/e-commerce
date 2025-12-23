import { createBrowserRouter, Navigate } from "react-router";
import App from "../components/App";
import HomePage from "../features/HomePage";
import AboutPage from "../features/AboutPage";
import ContactPage from "../features/ContactPage";
import CatalogPage from "../features/catalog/CatalogPage";
import ProductDetailsPage from "../features/catalog/ProductDetailsPage";
import ServerError from "../errors/ServerError";
import ErrorPage from "../features/ErrorPage";
import NotFound from "../errors/NotFound";
import ShoppingCartPage from "../features/cart/ShoppingCartPage";
import Counter from "../features/counter/Counter";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {path: "/", element: <HomePage />},
            {path: "/about", element: <AboutPage />},
            {path: "/contact", element: <ContactPage />},
            {path: "/catalog", element: <CatalogPage />},
            {path: "/catalog/:id", element: <ProductDetailsPage />},
            {path:"/server-error", element:<ServerError />},
            {path: "/not-found", element: <NotFound />},
            {path: "/error", element: <ErrorPage /> },
            {path: "/mycart", element: <ShoppingCartPage/>},
            {path: "*", element:  <Navigate to="/not-found" />},
            {path: "/counter", element:  <Counter />}
        ]
    },
]);

export default router;