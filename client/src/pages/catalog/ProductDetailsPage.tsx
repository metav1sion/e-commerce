import { CircularProgress, Divider, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { IProduct } from "../../model/IProduct";

function ProductDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const productId = id ? Number(id) : null;
    const [product, setProduct] = useState<IProduct | null>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (productId) {
            fetch(`http://localhost:5220/api/products/${productId}`)
            .then(async (response) => {
                if (response.status === 404) {
                    return null;
                }
                const data = await response.json();
                setProduct(data);
            }).catch(error => {
                console.error("Error fetching product:", error);
            }).finally(() => {
                setLoading(false);
            });
        }
        console.log("product", product);
    }, [productId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    if (!product) {
        return <Typography>Product not found.</Typography>;
    }

    return (
        <Grid container spacing={6}>
            <Grid size={{lg: 4, md: 5,sm:6, xs: 12}}>
                <img src={`http://localhost:5220/images/${product.imageUrl}`} alt={product.name} style={{ maxWidth: "100%", height: "auto" }}/>
            </Grid>
            <Grid size={{lg: 8, md: 7, sm: 6, xs: 12}}>
                <Typography variant="h3">{product.name}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.primary">
                    {product.price} TL
                </Typography>
                <TableContainer>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>{product.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>{product.description}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Stok</TableCell>
                        <TableCell>
                            <Typography variant="body2" color={product.stock > 0 ? "green" : "red"}>
                                {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableContainer>
            </Grid>
        </Grid>
    );
}

export default ProductDetailsPage;